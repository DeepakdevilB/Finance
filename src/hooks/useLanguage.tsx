import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'app_name': 'FinEmpower',
    'home': 'Home',
    'learn': 'Learn',
    'ai_coach': 'AI Coach',
    'logout': 'Logout',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'back': 'Back',
    'next': 'Next',
    
    // Login
    'login_title': 'FinEmpower',
    'login_subtitle': 'Simple tools for a better financial future.',
    'email': 'Email',
    'password': 'Password',
    'login_btn': 'Log In',
    'signup_btn': 'Sign Up',
    'no_account': "Don't have an account? Sign up",
    'have_account': 'Already have an account? Log in',
    'check_email': 'Check your email for the login link!',
    'please_wait': 'Please wait...',
    
    // Onboarding
    'onboarding_title': "Welcome! Let's get to know you.",
    'onboarding_subtitle': 'This helps us give you better advice.',
    'name_q': 'What is your name?',
    'age_q': 'How old are you?',
    'edu_q': 'Education Level',
    'income_type_q': 'How do you earn money?',
    'monthly_income_q': 'What is your monthly income?',
    'start_journey': 'Start My Journey',
    'edu_below_10': 'Below 10th',
    'edu_10': '10th Pass',
    'edu_12': '12th Pass',
    'edu_grad': 'Graduate or higher',
    'income_daily': 'Daily Wage (Variable)',
    'income_monthly': 'Monthly Salary (Fixed)',
    
    // Dashboard
    'hello': 'Hello',
    'total_balance': 'Total Balance',
    'health_score': 'Health Score',
    'add_income': 'Add Income',
    'add_expense': 'Add Expense',
    'budget_title': 'Recommended Budget (50/30/20)',
    'needs': 'Needs (50%)',
    'wants': 'Wants (30%)',
    'savings': 'Savings (20%)',
    'emergency_fund_title': 'Emergency Fund Target',
    'emergency_fund_desc': 'You should aim to save 3 months of essential expenses for emergencies.',
    'spending_chart_title': 'Where your money goes',
    'new_expense': 'New Expense',
    'new_income': 'New Income',
    'amount': 'Amount (₹)',
    'category': 'Category',
    'date': 'Date',
    'savings_goal': 'Savings Goal',
    'savings_target_q': 'How much do you want to save?',
    'set_goal': 'Set Goal',
    'current_savings': 'Current Savings',
    'loans_title': 'Existing Loans',
    'has_loans_q': 'Do you have any existing loans?',
    'loan_amount': 'Total Loan Amount',
    'monthly_emi': 'Monthly EMI (Payment)',
    'add_loan': 'Add Loan Info',
    'ai_budget_title': 'AI Personalized Budget',
    'ai_budget_desc': 'Gemini will create a custom budget for your income, expenses, and loans.',
    'generate_budget': 'Generate AI Budget Plan',
    'budget_plan': 'Your AI Budget Plan',
    'close': 'Close',
    
    // Learning
    'learning_title': 'Your Learning Journey',
    'completed_of': 'completed',
    'mark_understood': 'Mark as Understood',
    
    // AI Coach
    'coach_title': 'AI Financial Coach',
    'coach_subtitle': 'Powered by Google Gemini',
    'coach_greeting': 'Hello! I am your AI Financial Coach. I can help you understand your money better.',
    'coach_prompt': 'Would you like me to explain your current financial status, or suggest some steps to improve?',
    'explain_status': 'Explain my status',
    'suggest_improvements': 'Suggest improvements',
    'ask_placeholder': 'Ask me to explain any financial word...',
    
    // Language Selection
    'select_language': 'Select Language / भाषा चुनें',
    'english': 'English',
    'hindi': 'हिंदी'
  },
  hi: {
    // General
    'app_name': 'FinEmpower',
    'home': 'मुख्य पृष्ठ',
    'learn': 'सीखें',
    'ai_coach': 'AI कोच',
    'logout': 'लॉगआउट',
    'loading': 'लोड हो रहा है...',
    'save': 'सहेजें',
    'cancel': 'रद्द करें',
    'back': 'पीछे',
    'next': 'आगे',
    
    // Login
    'login_title': 'FinEmpower',
    'login_subtitle': 'बेहतर वित्तीय भविष्य के लिए सरल उपकरण।',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'login_btn': 'लॉग इन करें',
    'signup_btn': 'साइन अप करें',
    'no_account': "खाता नहीं है? साइन अप करें",
    'have_account': 'पहले से ही खाता है? लॉग इन करें',
    'check_email': 'लॉगिन लिंक के लिए अपना ईमेल देखें!',
    'please_wait': 'कृपया प्रतीक्षा करें...',
    
    // Onboarding
    'onboarding_title': 'स्वागत है! आइए आपको जानते हैं।',
    'onboarding_subtitle': 'यह हमें आपको बेहतर सलाह देने में मदद करता है।',
    'name_q': 'आपका नाम क्या है?',
    'age_q': 'आपकी उम्र क्या है?',
    'edu_q': 'शिक्षा का स्तर',
    'income_type_q': 'आप पैसे कैसे कमाते हैं?',
    'monthly_income_q': 'आपकी मासिक आय क्या है?',
    'start_journey': 'मेरी यात्रा शुरू करें',
    'edu_below_10': '10वीं से कम',
    'edu_10': '10वीं पास',
    'edu_12': '12वीं पास',
    'edu_grad': 'स्नातक या उससे ऊपर',
    'income_daily': 'दैनिक मजदूरी (परिवर्तनीय)',
    'income_monthly': 'मासिक वेतन (निश्चित)',
    
    // Dashboard
    'hello': 'नमस्ते',
    'total_balance': 'कुल शेष',
    'health_score': 'स्वास्थ्य स्कोर',
    'add_income': 'आय जोड़ें',
    'add_expense': 'खर्च जोड़ें',
    'budget_title': 'अनुशंसित बजट (50/30/20)',
    'needs': 'जरूरतें (50%)',
    'wants': 'इच्छाएं (30%)',
    'savings': 'बचत (20%)',
    'emergency_fund_title': 'आपातकालीन निधि लक्ष्य',
    'emergency_fund_desc': 'आपको आपात स्थिति के लिए 3 महीने के आवश्यक खर्चों को बचाने का लक्ष्य रखना चाहिए।',
    'spending_chart_title': 'आपका पैसा कहाँ जाता है',
    'new_expense': 'नया खर्च',
    'new_income': 'नई आय',
    'amount': 'राशि (₹)',
    'category': 'श्रेणी',
    'date': 'तारीख',
    'savings_goal': 'बचत लक्ष्य',
    'savings_target_q': 'आप कितना बचाना चाहते हैं?',
    'set_goal': 'लक्ष्य निर्धारित करें',
    'current_savings': 'वर्तमान बचत',
    'loans_title': 'मौजूदा ऋण (Loans)',
    'has_loans_q': 'क्या आपके पास कोई मौजूदा ऋण है?',
    'loan_amount': 'कुल ऋण राशि',
    'monthly_emi': 'मासिक ईएमआई (किस्त)',
    'add_loan': 'ऋण जानकारी जोड़ें',
    'ai_budget_title': 'AI व्यक्तिगत बजट',
    'ai_budget_desc': 'Gemini आपकी आय, खर्च और ऋण के लिए एक कस्टम बजट बनाएगा।',
    'generate_budget': 'AI बजट योजना बनाएं',
    'budget_plan': 'आपकी AI बजट योजना',
    'close': 'बंद करें',
    
    // Learning
    'learning_title': 'आपकी सीखने की यात्रा',
    'completed_of': 'पूरा हुआ',
    'mark_understood': 'समझ लिया',
    
    // AI Coach
    'coach_title': 'AI वित्तीय कोच',
    'coach_subtitle': 'Google Gemini द्वारा संचालित',
    'coach_greeting': 'नमस्ते! मैं आपका AI वित्तीय कोच हूँ। मैं आपके पैसे को बेहतर ढंग से समझने में आपकी मदद कर सकता हूँ।',
    'coach_prompt': 'क्या आप चाहेंगे कि मैं आपकी वर्तमान वित्तीय स्थिति के बारे में बताऊं, या सुधार के लिए कुछ कदम सुझाऊं?',
    'explain_status': 'मेरी स्थिति समझाएं',
    'suggest_improvements': 'सुधार के सुझाव दें',
    'ask_placeholder': 'मुझसे किसी भी वित्तीय शब्द को समझाने के लिए कहें...',
    
    // Language Selection
    'select_language': 'Select Language / भाषा चुनें',
    'english': 'English',
    'hindi': 'हिंदी'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
