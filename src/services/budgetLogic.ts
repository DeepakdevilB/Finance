import { Expense, Income } from '../types';

export const calculateBudgetRecommendation = (totalIncome: number) => {
  return {
    needs: totalIncome * 0.6,
    savings: totalIncome * 0.2,
    flexible: totalIncome * 0.2,
  };
};

export const calculateFinancialHealthScore = (
  totalIncome: number,
  totalExpenses: number,
  totalSavings: number,
  totalDebtPayments: number
) => {
  if (totalIncome === 0) return 0;

  // 1. Savings Ratio (target: 20%)
  const savingsRatio = totalSavings / totalIncome;
  let savingsScore = (savingsRatio / 0.2) * 33.33;
  if (savingsScore > 33.33) savingsScore = 33.33;

  // 2. Expense Ratio (target: < 80%)
  const expenseRatio = totalExpenses / totalIncome;
  let expenseScore = 0;
  if (expenseRatio <= 0.8) {
    expenseScore = 33.33;
  } else if (expenseRatio < 1) {
    expenseScore = ((1 - expenseRatio) / 0.2) * 33.33;
  }

  // 3. Debt Ratio (target: < 30%)
  const debtRatio = totalDebtPayments / totalIncome;
  let debtScore = 0;
  if (debtRatio <= 0.3) {
    debtScore = 33.34;
  } else if (debtRatio < 0.6) {
    debtScore = ((0.6 - debtRatio) / 0.3) * 33.34;
  }

  return Math.round(savingsScore + expenseScore + debtScore);
};

export const calculateEmergencyFundTarget = (essentialMonthlyExpenses: number) => {
  return essentialMonthlyExpenses * 3;
};

export const calculateGoalFeasibility = (
  targetAmount: number,
  currentSaved: number,
  deadlineMonths: number,
  monthlySavingsCapacity: number
) => {
  if (deadlineMonths <= 0) return false;
  const requiredMonthly = (targetAmount - currentSaved) / deadlineMonths;
  return {
    requiredMonthly,
    isFeasible: requiredMonthly <= monthlySavingsCapacity,
  };
};
