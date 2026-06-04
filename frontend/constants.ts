import { Type, FunctionDeclaration } from '@google/genai';
import { FinancialProfile } from './types';

export const getSystemInstruction = (tone: 'chill' | 'serious', score: number, phase: number) => `
You are GroundUp, a financial clarity agent built specifically for Gen Z users navigating real-world financial struggles.

## User Context
Current Financial Health Score: ${score}/100
Current Roadmap Phase: Phase ${phase}

## Tone & Style: ${tone.toUpperCase()} MODE
${tone === 'chill' 
  ? "- Speak like a knowledgeable friend. Use casual language, light emojis 🚀💸, and a friendly Gen Z tone.\n- Be direct, practical, and judgment-free." 
  : "- Speak with a professional, serious tone. Do NOT use emojis.\n- Use formal financial language but explain concepts clearly."}

## Special Features You Must Handle:
1. Affordability Checker: If user asks "Can I afford...", check their budget. Reply with ✅ COMFORTABLE, ⚠️ TIGHT, or ❌ NOT RIGHT NOW. Explain the impact on their goals.
2. Side Hustle Estimator: If user asks about making money/skills, estimate income (e.g., Graphic design $500-$2k, Driving $400-$1.2k) and show how it accelerates their debt/savings timeline.
3. Subscription Audit: If user asks to audit subscriptions, ask for a list, flag any >1% of income, and recommend cuts based on their Health Score urgency.
4. Roommate Split Calculator: If asked about splitting rent, calculate 3 scenarios: Equal, Income-weighted, and Room-size split. Show a comparison table.
5. Scenario Simulator: For "what if" questions, run hypothetical calculations. Show current vs projected plan.
6. Debt Payoff Planner: Explain avalanche vs snowball. Recommend one based on their profile.

## MANDATORY CONFIDENCE INDICATOR
You MUST end EVERY single response with exactly one of these confidence tags on its own line at the very end of your message:
[CONFIDENCE: HIGH] (Use this if your answer relies on their saved MongoDB profile data)
[CONFIDENCE: ESTIMATED] (Use this if you are using averages, rules of thumb, or incomplete data)
[CONFIDENCE: HYPOTHETICAL] (Use this if you are running a scenario, what-if, or affordability check)

## Your Capabilities (Tools)
Use tools to save profiles, update goals, log transactions. Always confirm before making destructive changes.
`;

export const DEMO_PROFILE: FinancialProfile = {
    firstName: 'Alex',
    age: '24',
    employmentSituation: 'Entry-level job',
    income: 3400,
    fixedExpenses: [
        { id: '1', name: 'Rent', amount: 1200, category: 'housing' },
        { id: '2', name: 'Car Insurance', amount: 120, category: 'transportation' },
        { id: '3', name: 'Subscriptions', amount: 45, category: 'subscription' }
    ],
    variableExpenses: [
        { id: '4', name: 'Groceries', amount: 300, category: 'food' },
        { id: '5', name: 'Gas', amount: 80, category: 'transportation' },
        { id: '6', name: 'Going Out', amount: 150, category: 'entertainment' }
    ],
    debts: [
        { id: '1', name: 'Student Loan', amount: 18000, interestRate: 5.5, minimumPayment: 280 },
        { id: '2', name: 'Credit Card', amount: 2200, interestRate: 22, minimumPayment: 60 }
    ],
    goals: [
        { id: '1', name: 'Emergency Fund', target: 5000, current: 800, type: 'savings' }
    ],
    transactions: [],
    tonePreference: 'chill',
    quickWin: 'Cancel one unused subscription this week to free up $15/month.',
    demoMode: true
};

export const TOOLS: FunctionDeclaration[] = [
    {
        name: 'save_user_profile',
        description: 'Save or update the user\'s core financial profile.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                firstName: { type: Type.STRING },
                income: { type: Type.NUMBER },
                fixedExpenses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING } } } },
                variableExpenses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, amount: { type: Type.NUMBER } } } },
                debts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, amount: { type: Type.NUMBER }, interestRate: { type: Type.NUMBER }, minimumPayment: { type: Type.NUMBER } } } },
                goals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, target: { type: Type.NUMBER }, current: { type: Type.NUMBER } } } }
            }
        }
    },
    {
        name: 'get_user_profile',
        description: 'Retrieve the user\'s current financial profile.',
        parameters: { type: Type.OBJECT, properties: {} }
    },
    {
        name: 'update_goal_progress',
        description: 'Update the current saved amount for a specific financial goal.',
        parameters: {
            type: Type.OBJECT,
            properties: { goalName: { type: Type.STRING }, amountToAdd: { type: Type.NUMBER } },
            required: ['goalName', 'amountToAdd']
        }
    },
    {
        name: 'log_transaction',
        description: 'Log a new single income or expense transaction.',
        parameters: {
            type: Type.OBJECT,
            properties: { type: { type: Type.STRING }, amount: { type: Type.NUMBER }, category: { type: Type.STRING }, description: { type: Type.STRING } },
            required: ['type', 'amount', 'category', 'description']
        }
    },
    {
        name: 'save_plan',
        description: 'Save a generated financial plan, including a quick win.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                quickWin: { type: Type.STRING, description: 'A short, actionable task the user can do today.' }
            },
            required: ['quickWin']
        }
    },
    {
        name: 'update_tone_preference',
        description: 'Update the user\'s tone preference (chill or serious).',
        parameters: {
            type: Type.OBJECT,
            properties: {
                tone: { type: Type.STRING, description: "'chill' or 'serious'" }
            },
            required: ['tone']
        }
    }
];
