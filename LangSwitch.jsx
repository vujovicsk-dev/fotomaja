import { useLang } from '../i18n/LanguageContext.jsx';

export default function LangSwitch({ tone = 'dark' }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className={`lang-switch lang-switch--${tone}`} role="group" aria-label={t.nav.lang}>
      {['hu', 'sr'].map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}
          lang={code} title={code === 'hu' ? 'Magyar' : 'Srpski'}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
