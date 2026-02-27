import { GoogleGenAI } from '@google/genai';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({ apiKey });
};

export const explainFinancialStatus = async (profileData: any, context: string = '') => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a friendly financial coach for a user with low financial literacy.
      User Profile: ${JSON.stringify(profileData)}
      ${context}
      Explain their current financial status in very simple terms.
      Use short sentences. Avoid jargon. Be encouraging.
      Do not perform complex math. Just explain what their numbers mean.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'I could not generate an explanation right now.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I am having trouble connecting to my brain right now. Please try again later.';
  }
};

export const suggestImprovementSteps = async (profileData: any, context: string = '') => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a friendly financial coach.
      User Profile: ${JSON.stringify(profileData)}
      ${context}
      Suggest 3 simple, actionable steps they can take to improve their financial health.
      Use very simple terms. Avoid jargon. Be encouraging.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'I could not generate suggestions right now.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I am having trouble right now. Please try again later.';
  }
};

export const explainConceptInSimpleLanguage = async (topic: string, context: string = '') => {
  try {
    const ai = getAiClient();
    const prompt = `
      Explain the financial concept "${topic}" in very simple terms.
      ${context}
      Use a real-life example that a daily wage earner or low-income worker would understand.
      Keep it short (under 100 words).
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'I could not explain this concept right now.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I am having trouble right now. Please try again later.';
  }
};

export const generatePersonalizedBudget = async (data: {
  profile: any,
  totalIncome: number,
  totalExpenses: number,
  expensesByCategory: Record<string, number>,
  loans: any[],
  savingsGoal: number,
  context: string
}) => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a friendly financial coach for a user with low financial literacy.
      ${data.context}
      
      User Profile: ${JSON.stringify(data.profile)}
      Monthly Income: ₹${data.totalIncome}
      Total Monthly Expenses: ₹${data.totalExpenses}
      Expenses Breakdown: ${JSON.stringify(data.expensesByCategory)}
      Existing Loans: ${JSON.stringify(data.loans)}
      Savings Goal: ₹${data.savingsGoal}
      
      Create a personalized budget plan. 
      1. Analyze their current spending.
      2. Suggest how much to allocate for Needs, Wants, Savings, and Loan Repayments.
      3. Give 2-3 specific tips to reach their savings goal of ₹${data.savingsGoal}.
      
      Keep it very simple. Use bullet points. Avoid complex jargon. 
      Be encouraging and realistic.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || 'I could not generate a budget plan right now.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I am having trouble right now. Please try again later.';
  }
};
