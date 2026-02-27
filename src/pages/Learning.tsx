import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { CheckCircle2, Circle, BookOpen, ShieldCheck, TrendingUp, PiggyBank, ShieldAlert, CreditCard, Landmark, BarChart3, Coins, FileText, ThumbsUp, ThumbsDown, LayoutGrid, LineChart, Clock, Smile } from 'lucide-react';

const MODULES_DATA = {
  en: [
    {
      id: 'budgeting',
      title: 'What is Budgeting?',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      content: 'Budgeting is simply a plan for your money. It tells your money where to go instead of wondering where it went. Think of it like a map for your journey. A good budget tracks all your income and expenses, helping you identify wasteful spending and prioritize savings.',
      example: 'If you earn ₹20,000, you might plan: ₹10,000 for needs (rent, food), ₹6,000 for wants (movies, dining out), and ₹4,000 for savings. This is the 50/30/20 rule.',
      videoId: 'u63hEtlwdRY'
    },
    {
      id: 'needs_wants',
      title: 'Needs vs Wants',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      content: 'Needs are things you must have to survive (food, shelter, basic clothing, healthcare). Wants are things you would like to have but can live without (branded clothes, latest phone, eating out). Distinguishing between them is the first step to saving money.',
      example: 'Need: Rice, rent, medicine, electricity bill. Want: A new iPhone, eating at a fancy restaurant, Netflix subscription.',
      videoId: 'eMw6ZWN-ksk'
    },
    {
      id: 'emergency_fund',
      title: 'Emergency Fund',
      icon: ShieldCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      content: 'An emergency fund is money saved specifically for unexpected events like illness, job loss, or urgent home repairs. It acts as a financial safety net, preventing you from taking high-interest loans during tough times.',
      example: 'If your monthly expenses are ₹15,000, you should aim to save ₹45,000 to ₹90,000 (3-6 months of expenses) in a separate savings account.',
      videoId: 'C9-sO0_sXy4'
    },
    {
      id: 'banking_basics',
      title: 'Banking Basics',
      icon: PiggyBank,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      content: 'Understanding bank accounts is crucial. A Savings Account earns a small interest and is for daily use. A Fixed Deposit (FD) locks your money for a time but gives higher interest. A Recurring Deposit (RD) helps you save a fixed amount every month.',
      example: 'Savings Account: 3-4% interest, withdraw anytime. FD: 6-7% interest, withdraw after 1 year. RD: Save ₹1000/month for 1 year.',
      videoId: '3u7S9-x7-mA'
    },
    {
      id: 'interest',
      title: 'Power of Compound Interest',
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      content: 'Interest is the cost of borrowing money or the reward for saving it. Compound interest is "interest on interest", which helps your money grow faster over time. The earlier you start saving, the more you benefit from compounding.',
      example: 'If you save ₹1,000 at 10% interest: Year 1 you have ₹1,100. Year 2 you get interest on ₹1,100, not just ₹1,000. Over 20 years, this growth is massive.',
      videoId: 'Ip5A2jW_t_c'
    },
    {
      id: 'debt_trap',
      title: 'Avoiding Debt Traps',
      icon: PiggyBank,
      color: 'text-red-500',
      bg: 'bg-red-50',
      content: 'A debt trap happens when you take a new loan to pay off an old loan. The interest keeps growing until you cannot pay it back. Avoid high-interest loans from informal lenders and always pay credit card bills in full.',
      example: 'Borrowing ₹10,000 from a moneylender at 5% monthly interest means you pay 60% interest per year! Bank loans are usually 10-15% per year.',
      videoId: 'p7HKvqRI_Bo'
    },
    {
      id: 'insurance',
      title: 'Why Insurance?',
      icon: ShieldCheck,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      content: 'Insurance protects you from large financial losses. Health insurance pays for hospital bills. Life insurance provides for your family if something happens to you. Vehicle insurance pays for accident repairs.',
      example: 'Paying ₹5,000/year for health insurance can save you from a ₹2 Lakh hospital bill in case of an illness.',
      videoId: '7-7-7-7-7'
    },
    {
      id: 'fraud_prevention',
      title: 'Digital Fraud Prevention',
      icon: ShieldAlert,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      content: 'Never share your OTP, UPI PIN, or bank passwords with anyone. Banks never ask for these details on the phone. Be careful of fake links sent via SMS or WhatsApp promising free money or lottery wins.',
      example: 'If someone calls saying "Your KYC is expired, tell me the OTP sent to your phone", it is a scam. Disconnect immediately.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'credit_score',
      title: 'Credit Score (CIBIL)',
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      content: 'A credit score (like CIBIL) is a number that tells banks how good you are at repaying loans. A high score (750+) makes it easy to get loans at lower interest rates. Paying bills late lowers your score.',
      example: 'If you miss a credit card payment, your score might drop from 780 to 720, making your next loan more expensive.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'inflation',
      title: 'Understanding Inflation',
      icon: TrendingUp,
      color: 'text-red-500',
      bg: 'bg-red-50',
      content: 'Inflation is the rate at which prices rise over time. It means your money buys less tomorrow than it does today. To beat inflation, you must invest your money so it grows faster than prices rise.',
      example: 'If inflation is 6%, a ₹100 item will cost ₹106 next year. If your money is in a cupboard, it loses value.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'ppf_epf',
      title: 'PPF & EPF Basics',
      icon: Landmark,
      color: 'text-green-600',
      bg: 'bg-green-50',
      content: 'Public Provident Fund (PPF) and Employees Provident Fund (EPF) are government-backed savings schemes for long-term goals and retirement. They are very safe, offer good interest rates, and help save tax.',
      example: 'PPF locks your money for 15 years but gives tax-free interest. It is great for building a retirement corpus.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'mutual_funds',
      title: 'Mutual Funds',
      icon: LayoutGrid,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      content: 'A Mutual Fund pools money from many people to invest in stocks or bonds. It is managed by experts. It allows you to invest in the stock market with small amounts and less risk than buying individual shares.',
      example: 'Through a SIP (Systematic Investment Plan), you can invest just ₹500/month in a mutual fund to grow wealth over time.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'gold_investment',
      title: 'Investing in Gold',
      icon: Coins,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      content: 'Gold is a traditional safety net. Apart from jewelry, you can buy Digital Gold or Sovereign Gold Bonds (SGB). SGBs are safer than physical gold, pay extra interest, and have no making charges.',
      example: 'Buying an SGB earns you 2.5% interest per year plus the increase in gold price, unlike jewelry which has high making charges.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'taxes',
      title: 'Income Tax Basics',
      icon: FileText,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      content: 'Tax is money paid to the government for public services. You can legally save tax using sections like 80C (investments in PPF, ELSS, Insurance). Understanding tax helps you keep more of your hard-earned money.',
      example: 'Investing ₹1.5 Lakh in PPF or Life Insurance can reduce your taxable income, potentially saving you thousands in tax.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'good_bad_debt',
      title: 'Good Debt vs Bad Debt',
      icon: ThumbsUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      content: 'Not all loans are bad. "Good debt" helps you grow (education loan, home loan). "Bad debt" drains your money for things that lose value (credit card debt for luxury items, personal loan for a vacation).',
      example: 'A home loan builds an asset (house). A personal loan for a wedding is an expense that you pay interest on for years.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'credit_cards',
      title: 'Using Credit Cards Wisely',
      icon: CreditCard,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      content: 'A credit card is a short-term loan. If you pay the "Total Amount Due" by the due date, it is free money with rewards. If you only pay the "Minimum Due", you fall into a debt trap with 30-40% interest.',
      example: 'Always set auto-pay for the full amount. Never treat a credit limit as extra income.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'diversification',
      title: 'Diversification',
      icon: LayoutGrid,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      content: 'Diversification means spreading your money across different types of investments (Bank, Gold, Stocks, Real Estate) to reduce risk. "Don\'t put all your eggs in one basket."',
      example: 'If the stock market crashes, your Gold or Fixed Deposits keep your money safe. If you only had stocks, you would lose a lot.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'stock_market',
      title: 'Stock Market Basics',
      icon: LineChart,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      content: 'Buying a share means owning a tiny part of a company. It is risky in the short term but has historically given the highest returns over long periods (10+ years). Only invest money you don\'t need immediately.',
      example: 'If you bought shares of a good company 10 years ago, their value might have multiplied 5-10 times today.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning',
      icon: Clock,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      content: 'Retirement planning is saving now for when you stop working. The earlier you start, the less you need to save per month due to compound interest. Don\'t rely solely on your children or pension.',
      example: 'Starting a SIP of ₹5,000 at age 25 can create a much larger corpus than starting ₹15,000 at age 40.',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'financial_freedom',
      title: 'Financial Freedom',
      icon: Smile,
      color: 'text-green-500',
      bg: 'bg-green-50',
      content: 'Financial freedom means having enough savings and investments to pay for your lifestyle without working. It gives you the freedom to choose what you want to do with your time.',
      example: 'If your monthly expenses are ₹30,000, having a corpus of ₹1 Crore might allow you to retire early and live off the interest.',
      videoId: 'X-X-X-X-X'
    }
  ],
  hi: [
    {
      id: 'budgeting',
      title: 'बजटिंग क्या है?',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      content: 'बजटिंग बस आपके पैसे के लिए एक योजना है। यह आपके पैसे को बताता है कि कहाँ जाना है, बजाय इसके कि आप सोचें कि यह कहाँ गया। एक अच्छा बजट आपकी सभी आय और खर्चों को ट्रैक करता है, जिससे आपको फालतू खर्च पहचानने और बचत को प्राथमिकता देने में मदद मिलती है।',
      example: 'यदि आप ₹20,000 कमाते हैं, तो आप योजना बना सकते हैं: जरूरतों (किराया, भोजन) के लिए ₹10,000, इच्छाओं (फिल्में, बाहर खाना) के लिए ₹6,000, और बचत के लिए ₹4,000।',
      videoId: 'u63hEtlwdRY'
    },
    {
      id: 'needs_wants',
      title: 'जरूरतें बनाम इच्छाएं',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      content: 'जरूरतें वे चीजें हैं जो आपको जीवित रहने के लिए चाहिए (भोजन, आवास, बुनियादी कपड़े, स्वास्थ्य सेवा)। इच्छाएं वे चीजें हैं जो आप चाहते हैं लेकिन उनके बिना रह सकते हैं (ब्रांडेड कपड़े, नवीनतम फोन, बाहर खाना)। पैसे बचाने के लिए इनमें अंतर करना पहला कदम है।',
      example: 'जरूरत: चावल, किराया, दवा, बिजली का बिल। इच्छा: एक नया आईफोन, महंगे रेस्तरां में खाना, नेटफ्लिक्स सब्सक्रिप्शन।',
      videoId: 'eMw6ZWN-ksk'
    },
    {
      id: 'emergency_fund',
      title: 'आपातकालीन निधि',
      icon: ShieldCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      content: 'आपातकालीन निधि वह पैसा है जो बीमारी, नौकरी छूटने या घर की तत्काल मरम्मत जैसी अप्रत्याशित घटनाओं के लिए बचाया जाता है। यह एक वित्तीय सुरक्षा जाल के रूप में कार्य करता है, जो आपको कठिन समय के दौरान उच्च-ब्याज वाले ऋण लेने से रोकता है।',
      example: 'यदि आपके मासिक खर्च ₹15,000 हैं, तो आपको एक अलग बचत खाते में ₹45,000 से ₹90,000 (3-6 महीने के खर्च) बचाने का लक्ष्य रखना चाहिए।',
      videoId: 'C9-sO0_sXy4'
    },
    {
      id: 'banking_basics',
      title: 'बैंकिंग की मूल बातें',
      icon: PiggyBank,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      content: 'बैंक खातों को समझना महत्वपूर्ण है। बचत खाता (Savings Account) थोड़ा ब्याज देता है और दैनिक उपयोग के लिए है। फिक्स्ड डिपॉजिट (FD) आपके पैसे को एक समय के लिए लॉक करता है लेकिन उच्च ब्याज देता है। रेकरिंग डिपॉजिट (RD) आपको हर महीने एक निश्चित राशि बचाने में मदद करता है।',
      example: 'बचत खाता: 3-4% ब्याज, कभी भी निकालें। FD: 6-7% ब्याज, 1 साल बाद निकालें। RD: 1 साल के लिए ₹1000/माह बचाएं।',
      videoId: '3u7S9-x7-mA'
    },
    {
      id: 'interest',
      title: 'चक्रवृद्धि ब्याज की शक्ति',
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      content: 'ब्याज पैसे उधार लेने की लागत या इसे बचाने का इनाम है। चक्रवृद्धि ब्याज "ब्याज पर ब्याज" है, जो समय के साथ आपके पैसे को तेजी से बढ़ने में मदद करता है। आप जितनी जल्दी बचत करना शुरू करेंगे, आपको कंपाउंडिंग से उतना ही अधिक लाभ होगा।',
      example: 'यदि आप 10% ब्याज पर ₹1,000 बचाते हैं: वर्ष 1 में आपके पास ₹1,100 हैं। वर्ष 2 में आपको ₹1,100 पर ब्याज मिलता है, न कि केवल ₹1,000 पर। 20 वर्षों में, यह वृद्धि बहुत बड़ी होती है।',
      videoId: 'Ip5A2jW_t_c'
    },
    {
      id: 'debt_trap',
      title: 'ऋण जाल से बचना',
      icon: PiggyBank,
      color: 'text-red-500',
      bg: 'bg-red-50',
      content: 'ऋण जाल तब होता है जब आप पुराने ऋण का भुगतान करने के लिए नया ऋण लेते हैं। ब्याज बढ़ता रहता है जब तक कि आप इसे वापस नहीं कर सकते। अनौपचारिक उधारदाताओं से उच्च-ब्याज वाले ऋणों से बचें और हमेशा क्रेडिट कार्ड बिलों का पूरा भुगतान करें।',
      example: 'साहूकार से 5% मासिक ब्याज पर ₹10,000 उधार लेने का मतलब है कि आप प्रति वर्ष 60% ब्याज देते हैं! बैंक ऋण आमतौर पर प्रति वर्ष 10-15% होते हैं।',
      videoId: 'p7HKvqRI_Bo'
    },
    {
      id: 'insurance',
      title: 'बीमा क्यों जरूरी है?',
      icon: ShieldCheck,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      content: 'बीमा आपको बड़े वित्तीय नुकसान से बचाता है। स्वास्थ्य बीमा अस्पताल के बिलों का भुगतान करता है। जीवन बीमा आपके परिवार के लिए प्रावधान करता है यदि आपको कुछ हो जाता है। वाहन बीमा दुर्घटना की मरम्मत के लिए भुगतान करता है।',
      example: 'स्वास्थ्य बीमा के लिए ₹5,000/वर्ष का भुगतान आपको बीमारी के मामले में ₹2 लाख के अस्पताल के बिल से बचा सकता है।',
      videoId: '7-7-7-7-7'
    },
    {
      id: 'fraud_prevention',
      title: 'डिजिटल धोखाधड़ी से बचाव',
      icon: ShieldAlert,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      content: 'अपना OTP, UPI पिन या बैंक पासवर्ड कभी किसी के साथ साझा न करें। बैंक कभी भी फोन पर ये विवरण नहीं मांगते हैं। मुफ्त पैसे या लॉटरी जीतने का वादा करने वाले एसएमएस या व्हाट्सएप लिंक से सावधान रहें।',
      example: 'अगर कोई कॉल करके कहता है "आपका केवाईसी समाप्त हो गया है, मुझे अपने फोन पर भेजा गया ओटीपी बताएं", तो यह एक घोटाला है। तुरंत फोन काट दें।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'credit_score',
      title: 'क्रेडिट स्कोर (CIBIL)',
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      content: 'क्रेडिट स्कोर (जैसे CIBIL) एक संख्या है जो बैंकों को बताती है कि आप ऋण चुकाने में कितने अच्छे हैं। एक उच्च स्कोर (750+) कम ब्याज दरों पर ऋण प्राप्त करना आसान बनाता है। बिलों का देर से भुगतान करने से आपका स्कोर कम हो जाता है।',
      example: 'यदि आप क्रेडिट कार्ड भुगतान चूक जाते हैं, तो आपका स्कोर 780 से 720 तक गिर सकता है, जिससे आपका अगला ऋण अधिक महंगा हो जाएगा।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'inflation',
      title: 'महंगाई को समझना',
      icon: TrendingUp,
      color: 'text-red-500',
      bg: 'bg-red-50',
      content: 'महंगाई वह दर है जिस पर समय के साथ कीमतें बढ़ती हैं। इसका मतलब है कि आपका पैसा आज की तुलना में कल कम खरीदेगा। महंगाई को मात देने के लिए, आपको अपने पैसे का निवेश करना चाहिए ताकि यह कीमतों में वृद्धि से तेजी से बढ़े।',
      example: 'यदि महंगाई 6% है, तो ₹100 की वस्तु अगले साल ₹106 की होगी। यदि आपका पैसा अलमारी में है, तो उसका मूल्य कम हो जाता है।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'ppf_epf',
      title: 'PPF और EPF की मूल बातें',
      icon: Landmark,
      color: 'text-green-600',
      bg: 'bg-green-50',
      content: 'पब्लिक प्रोविडेंट फंड (PPF) और कर्मचारी भविष्य निधि (EPF) दीर्घकालिक लक्ष्यों और सेवानिवृत्ति के लिए सरकार द्वारा समर्थित बचत योजनाएं हैं। वे बहुत सुरक्षित हैं, अच्छी ब्याज दरें प्रदान करते हैं, और टैक्स बचाने में मदद करते हैं।',
      example: 'PPF आपके पैसे को 15 साल के लिए लॉक करता है लेकिन टैक्स-फ्री ब्याज देता है। यह सेवानिवृत्ति कोष बनाने के लिए बहुत अच्छा है।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'mutual_funds',
      title: 'म्यूचुअल फंड',
      icon: LayoutGrid,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      content: 'म्यूचुअल फंड शेयरों या बॉन्ड में निवेश करने के लिए कई लोगों से पैसा इकट्ठा करता है। इसे विशेषज्ञों द्वारा प्रबंधित किया जाता है। यह आपको व्यक्तिगत शेयर खरीदने की तुलना में छोटी राशि और कम जोखिम के साथ शेयर बाजार में निवेश करने की अनुमति देता है।',
      example: 'SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) के माध्यम से, आप समय के साथ धन बढ़ाने के लिए म्यूचुअल फंड में केवल ₹500/माह का निवेश कर सकते हैं।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'gold_investment',
      title: 'सोने में निवेश',
      icon: Coins,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      content: 'सोना एक पारंपरिक सुरक्षा जाल है। गहनों के अलावा, आप डिजिटल गोल्ड या सॉवरेन गोल्ड बॉन्ड (SGB) खरीद सकते हैं। SGB भौतिक सोने की तुलना में सुरक्षित हैं, अतिरिक्त ब्याज देते हैं, और कोई मेकिंग चार्ज नहीं है।',
      example: 'SGB खरीदने से आपको प्रति वर्ष 2.5% ब्याज मिलता है और सोने की कीमत में वृद्धि भी मिलती है, गहनों के विपरीत जिनमें उच्च मेकिंग चार्ज होते हैं।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'taxes',
      title: 'आयकर की मूल बातें',
      icon: FileText,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      content: 'टैक्स सार्वजनिक सेवाओं के लिए सरकार को दिया जाने वाला पैसा है। आप 80C (PPF, ELSS, बीमा में निवेश) जैसी धाराओं का उपयोग करके कानूनी रूप से टैक्स बचा सकते हैं। टैक्स को समझने से आपको अपनी मेहनत की कमाई का अधिक हिस्सा रखने में मदद मिलती है।',
      example: 'PPF या जीवन बीमा में ₹1.5 लाख का निवेश करने से आपकी कर योग्य आय कम हो सकती है, जिससे संभावित रूप से आपके हजारों रुपये टैक्स में बच सकते हैं।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'good_bad_debt',
      title: 'अच्छा कर्ज बनाम बुरा कर्ज',
      icon: ThumbsUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      content: 'सभी ऋण बुरे नहीं होते। "अच्छा कर्ज" आपको आगे बढ़ने में मदद करता है (शिक्षा ऋण, गृह ऋण)। "बुरा कर्ज" उन चीजों के लिए आपका पैसा खत्म करता है जो मूल्य खो देती हैं (विलासिता की वस्तुओं के लिए क्रेडिट कार्ड ऋण, छुट्टी के लिए व्यक्तिगत ऋण)।',
      example: 'होम लोन एक संपत्ति (घर) बनाता है। शादी के लिए पर्सनल लोन एक खर्च है जिस पर आप सालों तक ब्याज देते हैं।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'credit_cards',
      title: 'क्रेडिट कार्ड का सही उपयोग',
      icon: CreditCard,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      content: 'क्रेडिट कार्ड एक अल्पकालिक ऋण है। यदि आप देय तिथि तक "कुल देय राशि" का भुगतान करते हैं, तो यह पुरस्कारों के साथ मुफ्त पैसा है। यदि आप केवल "न्यूनतम देय" का भुगतान करते हैं, तो आप 30-40% ब्याज के साथ ऋण जाल में फंस जाते हैं।',
      example: 'हमेशा पूरी राशि के लिए ऑटो-पे सेट करें। क्रेडिट लिमिट को कभी भी अतिरिक्त आय न मानें।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'diversification',
      title: 'विविधीकरण (Diversification)',
      icon: LayoutGrid,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      content: 'विविधीकरण का अर्थ है जोखिम को कम करने के लिए अपने पैसे को विभिन्न प्रकार के निवेशों (बैंक, सोना, शेयर, रियल एस्टेट) में फैलाना। "अपने सभी अंडे एक टोकरी में न रखें।"',
      example: 'यदि शेयर बाजार गिरता है, तो आपका सोना या फिक्स्ड डिपॉजिट आपके पैसे को सुरक्षित रखते हैं। यदि आपके पास केवल शेयर होते, तो आपको बहुत नुकसान होता।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'stock_market',
      title: 'शेयर बाजार की मूल बातें',
      icon: LineChart,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      content: 'शेयर खरीदने का मतलब है कंपनी का एक छोटा हिस्सा रखना। यह अल्पावधि में जोखिम भरा है लेकिन ऐतिहासिक रूप से लंबी अवधि (10+ वर्ष) में सबसे अधिक रिटर्न दिया है। केवल वही पैसा निवेश करें जिसकी आपको तुरंत आवश्यकता नहीं है।',
      example: 'यदि आपने 10 साल पहले किसी अच्छी कंपनी के शेयर खरीदे होते, तो आज उनका मूल्य 5-10 गुना बढ़ गया होता।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'retirement',
      title: 'सेवानिवृत्ति योजना',
      icon: Clock,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      content: 'सेवानिवृत्ति योजना का मतलब है कि जब आप काम करना बंद कर दें, उसके लिए अभी से बचत करना। चक्रवृद्धि ब्याज के कारण आप जितनी जल्दी शुरुआत करेंगे, आपको प्रति माह उतना ही कम बचत करनी होगी। केवल अपने बच्चों या पेंशन पर निर्भर न रहें।',
      example: '25 साल की उम्र में ₹5,000 की SIP शुरू करने से 40 साल की उम्र में ₹15,000 शुरू करने की तुलना में बहुत बड़ा कोष बन सकता है।',
      videoId: 'X-X-X-X-X'
    },
    {
      id: 'financial_freedom',
      title: 'वित्तीय स्वतंत्रता',
      icon: Smile,
      color: 'text-green-500',
      bg: 'bg-green-50',
      content: 'वित्तीय स्वतंत्रता का मतलब है कि बिना काम किए अपनी जीवनशैली के लिए भुगतान करने के लिए पर्याप्त बचत और निवेश होना। यह आपको अपने समय के साथ जो आप करना चाहते हैं उसे चुनने की स्वतंत्रता देता है।',
      example: 'यदि आपके मासिक खर्च ₹30,000 हैं, तो ₹1 करोड़ का कोष होने पर आप जल्दी रिटायर हो सकते हैं और ब्याज पर जी सकते हैं।',
      videoId: 'X-X-X-X-X'
    }
  ]
};

export default function Learning() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const MODULES = MODULES_DATA[language] || MODULES_DATA['en'];

  useEffect(() => {
    if (user) fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('learning_progress')
      .select('module_name')
      .eq('user_id', user?.id)
      .eq('completed', true);
    
    if (data) {
      setProgress(data.map(p => p.module_name));
    }
    setLoading(false);
  };

  const markCompleted = async (moduleId: string) => {
    if (!user) return;
    
    // Optimistic update
    setProgress(prev => [...prev, moduleId]);
    setActiveModule(null);

    await supabase.from('learning_progress').upsert({
      user_id: user.id,
      module_name: moduleId,
      completed: true
    }, { onConflict: 'user_id, module_name' });
  };

  if (loading) return <div className="p-8 text-center text-slate-500">{t('loading')}</div>;

  const completedCount = progress.length;
  const totalCount = MODULES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{t('learning_title')}</h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">{completedCount} of {totalCount} {t('completed')}</span>
          <span className="text-sm font-bold text-emerald-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((mod) => {
          const isCompleted = progress.includes(mod.id);
          const isActive = activeModule === mod.id;
          const Icon = mod.icon;

          return (
            <div 
              key={mod.id} 
              className={`bg-white rounded-2xl shadow-sm border transition-all h-full flex flex-col ${
                isActive ? 'border-emerald-500 ring-2 ring-emerald-100 col-span-1 md:col-span-2 lg:col-span-3' : 'border-slate-100'
              }`}
            >
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setActiveModule(isActive ? null : mod.id)}
              >
                <div className={`p-3 rounded-full ${mod.bg} ${mod.color} shrink-0`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{mod.title}</h3>
                  {!isActive && <p className="text-sm text-slate-500 line-clamp-2">{mod.content}</p>}
                </div>
                <div>
                  {isCompleted ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <Circle size={24} className="text-slate-300" />
                  )}
                </div>
              </div>

              {isActive && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 flex-1 flex flex-col">
                  {mod.videoId && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-slate-100 aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${mod.videoId}`}
                        title={mod.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <p className="text-slate-700 mb-6 leading-relaxed text-lg">{mod.content}</p>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                    <p className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Example / उदाहरण:</p>
                    <p className="text-slate-700 italic">{mod.example}</p>
                  </div>
                  
                  <div className="mt-auto">
                    {!isCompleted ? (
                      <button 
                        onClick={() => markCompleted(mod.id)}
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                      >
                        {t('mark_understood')}
                      </button>
                    ) : (
                      <div className="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle2 size={20} />
                        {t('completed')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
