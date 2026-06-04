import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction, TOOLS } from '../constants';
import { Content, FinancialProfile, Part } from '../types';
import { calculateHealthScore, determineRoadmapPhase } from '../utils/finance';
import { MongoDbService } from './mongoDbService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export class AgentService {
    private history: Content[] = [];
    private profileState: FinancialProfile;
    private setProfileState: React.Dispatch<React.SetStateAction<FinancialProfile>>;
    private onToolCall: (toolName: string, args: any) => void;

    constructor(
        initialProfile: FinancialProfile,
        initialHistory: Content[],
        setProfile: React.Dispatch<React.SetStateAction<FinancialProfile>>,
        onToolCall: (toolName: string, args: any) => void
    ) {
        this.profileState = initialProfile;
        this.history = initialHistory || [];
        this.setProfileState = setProfile;
        this.onToolCall = onToolCall;
    }

    public updateProfileState(newProfile: FinancialProfile) {
        this.profileState = newProfile;
    }

    public getHistory(): Content[] {
        return this.history;
    }

    public async generateTagline(score: number, phase: number, progress: number, goalName: string): Promise<string> {
        try {
            const prompt = `Generate a single motivational sentence (max 12 words) for a Gen Z user with a financial health score of ${score} who is in Phase ${phase} and ${progress}% toward their goal of ${goalName}. Do not use quotes.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text?.replace(/["']/g, '').trim() || "Keep pushing forward. You've got this! 💪";
        } catch (e) {
            console.error("Error generating tagline:", e);
            return "Keep pushing forward. You've got this! 💪";
        }
    }

    public async sendMessage(message: string): Promise<{ text: string, confidence?: 'HIGH' | 'ESTIMATED' | 'HYPOTHETICAL' }> {
        this.history.push({
            role: 'user',
            parts: [{ text: message }]
        });
        return this.processTurn();
    }

    private async processTurn(): Promise<{ text: string, confidence?: 'HIGH' | 'ESTIMATED' | 'HYPOTHETICAL' }> {
        try {
            const { score } = calculateHealthScore(this.profileState);
            const phase = determineRoadmapPhase(this.profileState);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: this.history,
                config: {
                    systemInstruction: getSystemInstruction(this.profileState.tonePreference, score, phase),
                    tools: [{ functionDeclarations: TOOLS }],
                    temperature: 0.7,
                }
            });

            const responseContent = response.candidates?.[0]?.content;
            if (!responseContent) return { text: "I'm sorry, I couldn't process that request." };

            this.history.push(responseContent as Content);

            const parts = responseContent.parts || [];
            const functionCalls = parts.filter(p => p.functionCall).map(p => p.functionCall);

            if (functionCalls.length > 0) {
                const toolResponsesParts: Part[] = [];

                for (const call of functionCalls) {
                    if (call) {
                        this.onToolCall(call.name, call.args);
                        const result = await this.executeTool(call.name, call.args);
                        toolResponsesParts.push({
                            functionResponse: { name: call.name, response: result }
                        });
                    }
                }

                this.history.push({ role: 'user', parts: toolResponsesParts });
                return this.processTurn();
            }

            let rawText = parts.filter(p => p.text).map(p => p.text).join('\n');
            
            // Parse confidence tag
            let confidence: 'HIGH' | 'ESTIMATED' | 'HYPOTHETICAL' | undefined;
            const confidenceRegex = /\[CONFIDENCE:\s*(HIGH|ESTIMATED|HYPOTHETICAL)\]/i;
            const match = rawText.match(confidenceRegex);
            if (match) {
                confidence = match[1].toUpperCase() as any;
                rawText = rawText.replace(confidenceRegex, '').trim();
            }

            return { text: rawText, confidence };

        } catch (error) {
            console.error("Error calling Gemini:", error);
            return { text: "I encountered an error connecting to my brain. Please check your API key and try again." };
        }
    }

    private async executeTool(name: string, args: any): Promise<any> {
        console.log(`[Tool Execution] ${name}`, args);
        
        // Read-only tools should always execute, even in demo mode
        if (name === 'get_user_profile') {
            return { status: 'success', profile: this.profileState };
        }

        // Block write operations in demo mode
        if (this.profileState.demoMode) {
            return { status: 'success', message: 'Demo Mode: Write operation simulated but not saved.' };
        }

        let updatedProfile = { ...this.profileState };

        switch (name) {
            case 'save_user_profile':
                updatedProfile = {
                    ...this.profileState,
                    ...args,
                    fixedExpenses: args.fixedExpenses?.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) })) || this.profileState.fixedExpenses,
                    variableExpenses: args.variableExpenses?.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) })) || this.profileState.variableExpenses,
                    debts: args.debts?.map((d: any) => ({ ...d, id: Math.random().toString(36).substr(2, 9) })) || this.profileState.debts,
                    goals: args.goals?.map((g: any) => ({ ...g, id: Math.random().toString(36).substr(2, 9) })) || this.profileState.goals,
                };
                this.profileState = updatedProfile;
                this.setProfileState(updatedProfile);
                await MongoDbService.saveProfile(updatedProfile);
                return { status: 'success', message: 'Profile saved to MongoDB successfully.' };

            case 'update_goal_progress':
                const goals = [...this.profileState.goals];
                const goalIndex = goals.findIndex(g => g.name.toLowerCase() === args.goalName.toLowerCase());
                if (goalIndex >= 0) {
                    const oldProgress = goals[goalIndex].current / goals[goalIndex].target;
                    goals[goalIndex].current += args.amountToAdd;
                    const newProgress = goals[goalIndex].current / goals[goalIndex].target;
                    
                    let milestoneHit = null;
                    if (oldProgress < 0.25 && newProgress >= 0.25) milestoneHit = '25%';
                    if (oldProgress < 0.50 && newProgress >= 0.50) milestoneHit = '50%';
                    if (oldProgress < 0.75 && newProgress >= 0.75) milestoneHit = '75%';
                    if (oldProgress < 1.00 && newProgress >= 1.00) {
                        milestoneHit = '100%';
                        goals[goalIndex].achieved = true;
                        goals[goalIndex].achievedAt = new Date().toISOString();
                    }

                    updatedProfile = { ...this.profileState, goals };
                    this.profileState = updatedProfile;
                    this.setProfileState(updatedProfile);
                    await MongoDbService.saveProfile(updatedProfile);
                    
                    return { 
                        status: 'success', 
                        message: `Added $${args.amountToAdd} to ${args.goalName}.`, 
                        newTotal: goals[goalIndex].current,
                        milestoneHit: milestoneHit 
                    };
                }
                return { status: 'error', message: `Goal '${args.goalName}' not found.` };

            case 'log_transaction':
                const newTx = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: args.type,
                    amount: args.amount,
                    category: args.category,
                    description: args.description,
                    date: new Date().toISOString().split('T')[0]
                };
                updatedProfile = { ...this.profileState, transactions: [newTx, ...this.profileState.transactions] };
                this.profileState = updatedProfile;
                this.setProfileState(updatedProfile);
                await MongoDbService.saveProfile(updatedProfile);
                return { status: 'success', message: 'Transaction logged in MongoDB.', transactionId: newTx.id };

            case 'save_plan':
                updatedProfile = { ...this.profileState, quickWin: args.quickWin };
                this.profileState = updatedProfile;
                this.setProfileState(updatedProfile);
                await MongoDbService.saveProfile(updatedProfile);
                return { status: 'success', message: 'Plan saved.' };

            case 'update_tone_preference':
                updatedProfile = { ...this.profileState, tonePreference: args.tone };
                this.profileState = updatedProfile;
                this.setProfileState(updatedProfile);
                await MongoDbService.saveProfile(updatedProfile);
                return { status: 'success', message: `Tone updated to ${args.tone}.` };

            default:
                return { status: 'success', message: `Tool ${name} executed successfully (simulated).` };
        }
    }
}
