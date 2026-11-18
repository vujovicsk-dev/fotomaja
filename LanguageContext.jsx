import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import hu from './hu.js';
import sr from './sr.js';

const DICTS = { hu, sr };
const STORAGE_KEY = 'fotomaja-lang';
const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && DICTS[saved]) return saved;
  } catch { /* localStorage nije dostupan */ }
  return 'hu'; // mađarski je primarni jezik
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].docTitle;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: DICTS[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang mora biti unutar LanguageProvider');
  return ctx;
}
