import { FinancialProfile } from '../types';

export function calculateHealthScore(profile: FinancialProfile) {
    let score = 0;
    
    const totalFixed = profile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVar = profile.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalFixed + totalVar;
    const totalDebtPayments = profile.debts.reduce((sum, d) => sum + (d.minimumPayment || 0), 0);
    const remaining = profile.income - totalExpenses - totalDebtPayments;

    // 1. Debt-to-Income (30 pts)
    const dti = profile.income > 0 ? (totalDebtPayments / profile.income) * 100 : 100;
    if (dti < 20) score += 30;
    else if (dti <= 35) score += 20;
    else if (dti <= 50) score += 10;

    // 2. Savings Rate (30 pts)
    const savingsRate = profile.income > 0 ? (remaining / profile.income) * 100 : 0;
    if (savingsRate > 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;

    // 3. Expense Coverage / Remaining Budget (40 pts)
    if (savingsRate > 30) score += 40;
    else if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;

    let label = 'At Risk';
    let color = 'text-red-500';
    let hex = '#ff4444';
    
    if (score > 70) {
        label = 'Thriving';
        color = 'text-brand-500';
        hex = '#00e676';
    } else if (score > 40) {
        label = 'Building';
        color = 'text-yellow-400';
        hex = '#ffbb33';
    }

    return { score, label, color, hex };
}

export function determineRoadmapPhase(profile: FinancialProfile) {
    const totalFixed = profile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVar = profile.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDebtPayments = profile.debts.reduce((sum, d) => sum + (d.minimumPayment || 0), 0);
    const remaining = profile.income - totalFixed - totalVar - totalDebtPayments;

    // Phase 1: Survive (Remaining >= 0)
    if (remaining < 0) return 1;

    // Phase 2: Stabilize (Emergency Fund >= 1000)
    const emergencyFund = profile.goals.find(g => g.name.toLowerCase().includes('emergency'))?.current || 
                          profile.goals.reduce((sum, g) => sum + g.current, 0);
    if (emergencyFund < 1000) return 2;

    // Phase 3: Grow (No high interest debt > 15%)
    const hasHighInterestDebt = profile.debts.some(d => (d.interestRate || 0) > 15 && d.amount > 0);
    if (hasHighInterestDebt) return 3;

    // Phase 4: Thrive (Primary goal achieved)
    const primaryGoal = profile.goals[0];
    if (primaryGoal && !primaryGoal.achieved) return 4;

    return 4; // Max phase
}
