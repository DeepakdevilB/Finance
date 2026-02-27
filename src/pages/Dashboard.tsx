import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { calculateFinancialHealthScore, calculateEmergencyFundTarget } from '../services/budgetLogic';
import { generatePersonalizedBudget } from '../services/aiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { PlusCircle, TrendingUp, ShieldAlert, Target, IndianRupee, CreditCard, Sparkles, X, BarChart3, Settings } from 'lucide-react';
import Markdown from 'react-markdown';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [newIncome, setNewIncome] = useState({ amount: '', type: 'Salary', date: new Date().toISOString().split('T')[0] });

  const [showSetGoal, setShowSetGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ amount: '' });

  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState({ total: '', emi: '' });

  const [aiBudget, setAiBudget] = useState<string | null>(null);
  const [generatingBudget, setGeneratingBudget] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const [monthlyLimit, setMonthlyLimit] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyLimit');
    return saved ? parseFloat(saved) : 0;
  });
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState('');

  const saveLimit = () => {
    const val = parseFloat(tempLimit);
    if (!isNaN(val)) {
      setMonthlyLimit(val);
      localStorage.setItem('monthlyLimit', val.toString());
      setIsEditingLimit(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, incomesRes, expensesRes, goalsRes, loansRes] = await Promise.all([
      supabase.from('users').select('*').eq('id', user?.id).single(),
      supabase.from('incomes').select('*').eq('user_id', user?.id),
      supabase.from('expenses').select('*').eq('user_id', user?.id),
      supabase.from('goals').select('*').eq('user_id', user?.id),
      supabase.from('loans').select('*').eq('user_id', user?.id),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (incomesRes.data) setIncomes(incomesRes.data);
    if (expensesRes.data) setExpenses(expensesRes.data);
    if (goalsRes.data) setGoals(goalsRes.data);
    if (loansRes.data) setLoans(loansRes.data);
    setLoading(false);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('expenses').insert([
      { user_id: user.id, amount: parseFloat(newExpense.amount), category: newExpense.category, date: newExpense.date }
    ]);
    if (!error) {
      setShowAddExpense(false);
      setNewExpense({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      fetchData();
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('incomes').insert([
      { user_id: user.id, amount: parseFloat(newIncome.amount), type: newIncome.type, date: newIncome.date }
    ]);
    if (!error) {
      setShowAddIncome(false);
      setNewIncome({ amount: '', type: 'Salary', date: new Date().toISOString().split('T')[0] });
      fetchData();
    }
  };

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Calculate current savings again to ensure it's up to date
    const currentTotalSavings = Math.max(0, totalIncome - totalExpenses);

    const { error } = await supabase.from('goals').upsert({
      user_id: user.id,
      title: 'General Savings',
      target_amount: parseFloat(newGoal.amount),
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      current_saved: currentTotalSavings
    }, { onConflict: 'user_id, title' });
    
    if (!error) {
      setShowSetGoal(false);
      fetchData();
    }
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('loans').insert([
      { 
        user_id: user.id, 
        total_amount: parseFloat(newLoan.total), 
        monthly_payment: parseFloat(newLoan.emi),
        interest_rate: 0,
        remaining_balance: parseFloat(newLoan.total)
      }
    ]);
    if (!error) {
      setShowAddLoan(false);
      fetchData();
    }
  };

  const generateBudget = async () => {
    if (!profile) return;
    setGeneratingBudget(true);
    const context = `Current Language: ${language === 'hi' ? 'Hindi' : 'English'}. Please respond in ${language === 'hi' ? 'Hindi' : 'English'}.`;
    
    const plan = await generatePersonalizedBudget({
      profile,
      totalIncome,
      totalExpenses,
      expensesByCategory,
      loans,
      savingsGoal: goals[0]?.target_amount || 0,
      context
    });
    
    setAiBudget(plan);
    setGeneratingBudget(false);
    setShowBudgetModal(true);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">{t('loading')}</div>;
  if (!profile) return <div className="p-8 text-center text-slate-500">Profile not found. Please complete onboarding.</div>;

  // Calculations
  const totalIncome = profile.income_type === 'Monthly' && profile.monthly_income 
    ? profile.monthly_income 
    : incomes.reduce((sum, inc) => sum + inc.amount, 0);
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSavings = Math.max(0, totalIncome - totalExpenses);
  
  const totalLoanPayments = loans.reduce((sum, loan) => sum + loan.monthly_payment, 0);
  const healthScore = calculateFinancialHealthScore(totalIncome, totalExpenses, totalSavings, totalLoanPayments);
  const emergencyFundTarget = calculateEmergencyFundTarget(totalExpenses * 0.6);

  const savingsGoal = goals[0];
  const progressPercent = savingsGoal ? Math.min(100, Math.round((totalSavings / savingsGoal.target_amount) * 100)) : 0;

  // Chart Data
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const monthlyData = expenses.reduce((acc: any[], curr) => {
    const date = new Date(curr.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    const existing = acc.find((item: any) => item.name === monthYear);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: monthYear, amount: curr.amount, date: date }); // keep date for sorting
    }
    return acc;
  }, []).sort((a: any, b: any) => a.date - b.date);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold opacity-90">{t('hello')}, {profile.name}</h2>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-emerald-100 text-sm mb-1">{t('total_balance')}</p>
            <p className="text-4xl font-bold flex items-center">
              <IndianRupee size={28} className="mr-1" />
              {totalSavings.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-sm mb-1">{t('health_score')}</p>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-emerald-600 font-bold text-lg">
              {healthScore}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Overview Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Stability Score</h3>
        
        <div className="relative w-64 h-32 mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            {/* Background Arc */}
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
            {/* Colored Arc */}
            <path 
              d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="url(#gaugeGradient)" 
              strokeWidth="20" 
              strokeLinecap="round" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - (251.2 * healthScore / 100)}
              className="transition-all duration-1000 ease-out"
            />
            {/* Needle */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="30" 
              stroke="#1e293b" 
              strokeWidth="4" 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ 
                transformOrigin: '100px 100px',
                transform: `rotate(${(healthScore / 100) * 180 - 90}deg)` 
              }}
            />
            <circle cx="100" cy="100" r="6" fill="#1e293b" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-4xl font-bold text-slate-800">
            {healthScore}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-3xl font-bold text-slate-700">
            You can survive <span className="text-emerald-600">{
              totalExpenses > 0 
                ? Math.floor((totalSavings / (totalExpenses / 30))) 
                : '∞'
            } days</span> without income.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Goal Progression */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Target size={20} className="text-emerald-500" />
            {t('savings_goal')}
          </h3>
          {!savingsGoal && (
            <button onClick={() => setShowSetGoal(true)} className="text-emerald-600 text-sm font-bold">
              + {t('set_goal')}
            </button>
          )}
        </div>

        {savingsGoal ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('current_savings')}</span>
              <span className="font-bold text-slate-800">₹{totalSavings.toLocaleString()} / ₹{savingsGoal.target_amount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-slate-400">{progressPercent}% of your goal reached!</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm mb-4">{t('savings_target_q')}</p>
            {showSetGoal && (
              <form onSubmit={handleSetGoal} className="flex gap-2">
                <input 
                  type="number" 
                  required 
                  placeholder="₹ Amount" 
                  value={newGoal.amount} 
                  onChange={e => setNewGoal({amount: e.target.value})}
                  className="flex-1 p-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">
                  {t('save')}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

        {/* Loans Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <CreditCard size={20} className="text-red-500" />
            {t('loans_title')}
          </h3>
          <button onClick={() => setShowAddLoan(true)} className="text-red-600 text-sm font-bold">
            + {t('add_loan')}
          </button>
        </div>

        {loans.length > 0 ? (
          <div className="space-y-3">
            {loans.map((loan, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase">{t('loan_amount')}</p>
                  <p className="font-bold text-slate-800">₹{loan.total_amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-600 font-bold uppercase">{t('monthly_emi')}</p>
                  <p className="font-bold text-slate-800">₹{loan.monthly_payment.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm mb-2">{t('has_loans_q')}</p>
          </div>
        )}

        {showAddLoan && (
          <form onSubmit={handleAddLoan} className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input 
              type="number" 
              required 
              placeholder={t('loan_amount')} 
              value={newLoan.total} 
              onChange={e => setNewLoan({...newLoan, total: e.target.value})}
              className="w-full p-3 border rounded-xl"
            />
            <input 
              type="number" 
              required 
              placeholder={t('monthly_emi')} 
              value={newLoan.emi} 
              onChange={e => setNewLoan({...newLoan, emi: e.target.value})}
              className="w-full p-3 border rounded-xl"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddLoan(false)} className="flex-1 p-2 bg-white border rounded-xl">{t('cancel')}</button>
              <button type="submit" className="flex-1 p-2 bg-red-600 text-white rounded-xl font-bold">{t('save')}</button>
            </div>
          </form>
        )}
      </div>

        {/* AI Budget Plan */}
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-2xl border border-emerald-100 shadow-sm h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{t('ai_budget_title')}</h3>
            <p className="text-xs text-slate-500">{t('ai_budget_desc')}</p>
          </div>
        </div>

        <button 
          onClick={generateBudget}
          disabled={generatingBudget}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          {generatingBudget ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles size={20} />
          )}
          {t('generate_budget')}
        </button>
        </div>
      </div>

      {/* AI Budget Modal */}
      {showBudgetModal && aiBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-600" />
                <h3 className="font-bold text-slate-800">{t('budget_plan')}</h3>
              </div>
              <button 
                onClick={() => setShowBudgetModal(false)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="prose prose-sm max-w-none prose-slate">
                <Markdown>{aiBudget}</Markdown>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowBudgetModal(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowAddIncome(true)}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <span className="font-medium text-slate-700">{t('add_income')}</span>
        </button>
        <button 
          onClick={() => setShowAddExpense(true)}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <PlusCircle size={24} />
          </div>
          <span className="font-medium text-slate-700">{t('add_expense')}</span>
        </button>
      </div>

      {/* Modals */}
      {showAddExpense && (
        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">{t('new_expense')}</h3>
          <form onSubmit={handleAddExpense} className="space-y-3">
            <input type="number" required placeholder={t('amount')} value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full p-3 border rounded-xl" />
            <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full p-3 border rounded-xl bg-white">
              <option value="Food">Food & Groceries</option>
              <option value="Rent">Rent & Bills</option>
              <option value="Transport">Transport</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full p-3 border rounded-xl" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddExpense(false)} className="flex-1 p-3 bg-slate-100 rounded-xl font-medium">{t('cancel')}</button>
              <button type="submit" className="flex-1 p-3 bg-emerald-600 text-white rounded-xl font-medium">{t('save')}</button>
            </div>
          </form>
        </div>
      )}

      {showAddIncome && (
        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">{t('new_income')}</h3>
          <form onSubmit={handleAddIncome} className="space-y-3">
            <input type="number" required placeholder={t('amount')} value={newIncome.amount} onChange={e => setNewIncome({...newIncome, amount: e.target.value})} className="w-full p-3 border rounded-xl" />
            <select value={newIncome.type} onChange={e => setNewIncome({...newIncome, type: e.target.value})} className="w-full p-3 border rounded-xl bg-white">
              <option value="Salary">Salary / Wages</option>
              <option value="Bonus">Bonus</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>
            <input type="date" required value={newIncome.date} onChange={e => setNewIncome({...newIncome, date: e.target.value})} className="w-full p-3 border rounded-xl" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddIncome(false)} className="flex-1 p-3 bg-slate-100 rounded-xl font-medium">{t('cancel')}</button>
              <button type="submit" className="flex-1 p-3 bg-emerald-600 text-white rounded-xl font-medium">{t('save')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Emergency Fund */}
      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-4">
        <div className="bg-amber-100 p-3 rounded-full text-amber-600 shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 mb-1">{t('emergency_fund_title')}</h3>
          <p className="text-amber-700 text-sm mb-2">{t('emergency_fund_desc')}</p>
          <p className="text-xl font-bold text-amber-600">₹{emergencyFundTarget.toLocaleString()}</p>
          </div>
        </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Expenses Chart & Threshold */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-500" />
                Monthly Expenses
              </h3>
              <div className="flex items-center gap-2">
                {isEditingLimit ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      className="w-24 p-1 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Limit"
                    />
                    <button onClick={saveLimit} className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Save</button>
                    <button onClick={() => setIsEditingLimit(false)} className="text-slate-400 text-xs px-2 py-1">Cancel</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setTempLimit(monthlyLimit.toString()); setIsEditingLimit(true); }} 
                    className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors text-xs bg-slate-50 px-2 py-1 rounded-lg"
                  >
                    <Settings size={14} />
                    {monthlyLimit > 0 ? `Limit: ₹${monthlyLimit}` : 'Set Limit'}
                  </button>
                )}
              </div>
            </div>
            
            {monthlyLimit > 0 && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-slate-500">Monthly Budget</span>
                  <span className={totalExpenses > monthlyLimit ? "text-red-500" : "text-emerald-500"}>
                    {totalExpenses > monthlyLimit ? "Over Budget" : "Within Budget"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${totalExpenses > monthlyLimit ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, (totalExpenses / monthlyLimit) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-slate-400">
                  <span>₹0</span>
                  <span>₹{monthlyLimit.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="h-64 w-full">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `₹${val}`} />
                    <RechartsTooltip 
                      formatter={(value: number) => [`₹${value}`, 'Expense']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    {monthlyLimit > 0 && (
                      <ReferenceLine y={monthlyLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Limit', fill: '#ef4444', fontSize: 10 }} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No expense data available
                </div>
              )}
            </div>
          </div>

          {/* Existing Pie Chart */}
          {pieData.length > 0 ? (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full">
              <h3 className="font-bold text-lg mb-4 text-slate-800">{t('spending_chart_title')}</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-full flex items-center justify-center text-slate-400">
              No spending data to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
