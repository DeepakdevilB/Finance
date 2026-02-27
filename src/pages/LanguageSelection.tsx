import React from 'react';
import { useLanguage, Language } from '../hooks/useLanguage';

interface LanguageSelectionProps {
  onSelect: () => void;
}

export default function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  const { setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language_selected', 'true');
    onSelect();
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          Select Language / भाषा चुनें
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSelect('en')}
            className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl font-bold text-xl hover:bg-emerald-50 transition-colors"
          >
            English
          </button>
          
          <button
            onClick={() => handleSelect('hi')}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-colors"
          >
            हिंदी (Hindi)
          </button>
        </div>
        
        <p className="mt-8 text-slate-500 text-sm">
          You can change this later in the settings.
          <br />
          आप इसे बाद में सेटिंग्स में बदल सकते हैं।
        </p>
      </div>
    </div>
  );
}
