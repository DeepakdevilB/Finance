export type EducationLevel = 'Below 10th' | '10th' | '12th' | 'Graduate';
export type IncomeType = 'Daily' | 'Monthly';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  education_level: EducationLevel;
  english_proficiency: boolean;
  income_type: IncomeType;
  monthly_income: number | null;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  deadline: string;
  current_saved: number;
}

export interface Loan {
  id: string;
  user_id: string;
  total_amount: number;
  interest_rate: number;
  monthly_payment: number;
  remaining_balance: number;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  module_name: string;
  completed: boolean;
}
