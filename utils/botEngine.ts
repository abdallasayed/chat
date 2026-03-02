import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, increment, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

const GEMINI_API_KEY = "AIzaSyDOxItFrEV_MChX7n4Z6YWmNBVrVppsg6s";

const AI_AGENTS = [
  { id: 'ai_1', name: 'عمر المبرمج', email: 'omar@ai.com', persona: 'مبرمج روش مصري بيحب التكنولوجيا والقهوة' },
  { id: 'ai_2', name: 'ندى ديزاين', email: 'nada@ai.com', persona: 'ديزاينر مصرية بتحب الألوان والتصميم والخروجات' },
  { id: 'ai_3', name: 'طارق العشوائي', email: 'tarek@ai.com', persona: 'شاب مصري بيحب الهزار والكورة وبيرد بسخرية' },
  { id: 'ai_4', name: 'ياسين فلوج', email: 'yassin@ai.com', persona: 'شاب مصري رياضي بيحب السفر والتصوير' }
];

const askGemini = async (prompt: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim().replace(/^"|"$/g, '');
  } catch (error) {
    return null; // لو فشل هيرجع null
  }
};

export const triggerAutoBotActivity = async () => {
  try {
    const randomBot = AI_AGENTS[Math.floor(Math.random() * AI_AGENTS.length)];
    const actionType = Math.random() > 0.5 ? 'COMMENT' : 'POST';

    if (actionType === 'POST') {
      const text = await askGemini(`اكتب بوست قصير جدا (سطر واحد) بالعامية المصرية لسوشيال ميديا كأنك: ${randomBot.persona}. بدون علامات تنصيص.`);
      
      // لو الـ API مردش، اقف ومتنزلش أي حاجة عشوائية!
      if (!text) return; 

      await addDoc(collection(db, 'posts'), {
        text: text, imageUrl: '', privacy: 'العامة',
        userId: randomBot.id, userEmail: randomBot.email, userName: randomBot.name,
        createdAt: serverTimestamp(), likes: Math.floor(Math.random() * 3), comments: 0
      });
    } else {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;
      
      const randomPostDoc = snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)];
      const randomPost = randomPostDoc.data();

      // لو البوست فاضي أو صور بس، متعملش كومنت
      if (!randomPost.text || randomPost.text.length < 3) return;

      const text = await askGemini(`صديقك كتب: "${randomPost.text}". اكتب تعليق قصير ترد عليه بالعامية المصرية كأنك: ${randomBot.persona}. الرد يجب أن يكون في صميم الموضوع. بدون علامات تنصيص.`);
      
      // لو الـ API مردش، اقف ومتعملش كومنت عشوائي!
      if (!text) return; 

      await addDoc(collection(db, `posts/${randomPostDoc.id}/comments`), {
        text: text, userName: randomBot.name, userEmail: randomBot.email, createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'posts', randomPostDoc.id), { comments: increment(1) });
    }
  } catch (error) {
    console.log("Bot Error:", error);
  }
};
