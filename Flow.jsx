// Zajednički okvir za aplikacije u koracima (porudžbina, zahtev za termin)
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { brand } from '../data/site.js';
import Icon from './Icon.jsx';
import LangSwitch from './LangSwitch.jsx';

export function Stepper({ steps, current }) {
  const { t } = useLang();
  return (
    <ol className="stepper" aria-label={`${t.common.step} ${current + 1} / ${steps.length}`}>
      {steps.map((s, i) => (
        <li key={s} className={i < current ? 'is-done' : i === current ? 'is-current' : ''} aria-current={i === current ? 'step' : undefined}>
          <span className="stepper__bar" />
          <span className="stepper__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function StepTitle({ step, total, children }) {
  const { t } = useLang();
  return (
    <>
      <p className="kicker">{t.common.step} {step + 1} / {total}</p>
      <h1 className="flow-title" tabIndex={-1}>{children}</h1>
    </>
  );
}

export function Field({ id, label, required, error, children }) {
  const { t } = useLang();
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} <span className="field__hint">· {required ? t.common.required : t.common.optional}</span>
      </label>
      {children}
      {error && <p className="field__error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function DoneScreen({ title, text, children }) {
  return (
    <div className="done">
      <span className="done__icon" aria-hidden="true"><Icon name="check" size={32} stroke={2} /></span>
      <h1 className="flow-title">{title}</h1>
      <p className="lead">{text}</p>
      {children}
    </div>
  );
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v) => v.replace(/[^\d]/g, '').length >= 6;

// Zaglavlje aplikacije – kao u maketi: (nazad) + logo levo, HU/SR desno
export function AppHeader({ onBack }) {
  const { t } = useLang();
  return (
    <header className="app-header">
      <div className="app-header__left">
        {onBack && (
          <button type="button" className="app-header__back" onClick={onBack} aria-label={t.common.back}>
            <Icon name="back" size={22} />
          </button>
        )}
        <Link to="/" aria-label={t.nav.homeLink} className="app-header__logo">
          <img src={brand('logo-black.png')} alt={t.common.logoAlt} />
        </Link>
      </div>
      <LangSwitch />
    </header>
  );
}
