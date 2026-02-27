import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function Onboarding() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education_level: '10th',
    income_type: 'Monthly',
    monthly_income: '',
  });

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    };
    checkProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.from('users').insert([
      {
        id: user.id,
        name: formData.name,
        age: parseInt(formData.age),
        education_level: formData.education_level,
        english_proficiency: true, // Defaulting to true as we removed the question
        income_type: formData.income_type,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
      },
    ]);

    if (error) {
      console.error('Error saving profile:', error);
      setErrorMsg(error.message || 'Failed to save profile. Please check your database setup.');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 mt-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('onboarding_title')}</h1>
        <p className="text-slate-500 mb-6">{t('onboarding_subtitle')}</p>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100">
            <p className="font-bold mb-1">Could not save profile</p>
            <p>{errorMsg}</p>
            <p className="mt-2 text-xs opacity-80">
              Make sure you have created the "users" table in your Supabase project as per the instructions.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('name_q')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('age_q')}</label>
            <input
              type="number"
              required
              min="10"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. 25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('edu_q')}</label>
            <select
              value={formData.education_level}
              onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Below 10th">{t('edu_below_10')}</option>
              <option value="10th">{t('edu_10')}</option>
              <option value="12th">{t('edu_12')}</option>
              <option value="Graduate">{t('edu_grad')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('income_type_q')}</label>
            <select
              value={formData.income_type}
              onChange={(e) => setFormData({ ...formData, income_type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Daily">{t('income_daily')}</option>
              <option value="Monthly">{t('income_monthly')}</option>
            </select>
          </div>

          {formData.income_type === 'Monthly' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('monthly_income_q')}</label>
              <input
                type="number"
                required
                min="0"
                value={formData.monthly_income}
                onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 15000"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors mt-6"
          >
            {loading ? t('please_wait') : t('start_journey')}
          </button>
        </form>
      </div>
    </div>
  );
}
