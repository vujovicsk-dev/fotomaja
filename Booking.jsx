import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { AppHeader, Stepper, StepTitle, Field, DoneScreen, isEmail, isPhone } from '../components/Flow.jsx';
import Icon from '../components/Icon.jsx';

const TYPES = ['wedding', 'couple', 'other'];
// Željeno vreme početka – samo želja korisnika, ne prikaz slobodnih termina.
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => a && b && a.getTime() === b.getTime();

function Calendar({ value, onChange }) {
  const { t, lang } = useLang();
  const b = t.booking;
  const today = startOfDay(new Date());
  const [view, setView] = useState(() => new Date((value || today).getFullYear(), (value || today).getMonth(), 1));
  const minView = new Date(today.getFullYear(), today.getMonth(), 1);

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // ponedeljak = 0
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= count; d += 1) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
    return cells;
  }, [view]);

  const shift = (n) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button type="button" className="icon-btn" onClick={() => shift(-1)} disabled={view <= minView} aria-label={b.prevMonth}><Icon name="chevL" /></button>
        <div className="calendar__month" aria-live="polite">{lang === 'hu' ? `${view.getFullYear()}. ${b.months[view.getMonth()]}` : `${b.months[view.getMonth()]} ${view.getFullYear()}.`}</div>
        <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label={b.nextMonth}><Icon name="chevR" /></button>
      </div>
      <div className="calendar__grid" role="grid" aria-label={b.date}>
        <div className="calendar__row" role="row">
          {b.weekdays.map((w) => <span key={w} role="columnheader" className="calendar__wd">{w}</span>)}
        </div>
        {Array.from({ length: Math.ceil(days.length / 7) }, (_, r) => (
          <div className="calendar__row" role="row" key={r}>
            {days.slice(r * 7, r * 7 + 7).map((d, i) => (d ? (
              <button key={i} type="button" role="gridcell" className={`calendar__day ${sameDay(d, value) ? 'is-selected' : ''} ${sameDay(d, today) ? 'is-today' : ''}`}
                disabled={d <= today} aria-pressed={sameDay(d, value)} onClick={() => onChange(d)}
                aria-label={lang === 'hu' ? `${d.getFullYear()}. ${b.months[d.getMonth()]} ${d.getDate()}.` : `${d.getDate()}. ${b.months[d.getMonth()]} ${d.getFullYear()}.`}>
                {d.getDate()}
              </button>
            ) : <span key={i} role="gridcell" />))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Booking() {
  const { t, lang } = useLang();
  const b = t.booking;
  const [step, setStep] = useState(0);
  const [type, setType] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', place: '', note: '' });
  const [blurred, setBlurred] = useState({});

  useEffect(() => { document.querySelector('.flow-title')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }, [step]);

  const errors = {
    name: form.name.trim().length < 2 ? b.errName : null,
    phone: !isPhone(form.phone) ? b.errPhone : null,
    email: !isEmail(form.email) ? b.errEmail : null,
  };
  const canNext = [!!type, !!date && !!time, !errors.name && !errors.phone && !errors.email, true][step];
  const next = () => { if (canNext) setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setStep(0); setType(null); setDate(null); setTime(null); setForm({ name: '', phone: '', email: '', place: '', note: '' }); setBlurred({}); };
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setBlurred((x) => ({ ...x, [k]: true }));
  const err = (k) => (blurred[k] ? errors[k] : null);

  const dateText = date
    ? (lang === 'hu'
      ? `${date.getFullYear()}. ${b.months[date.getMonth()]} ${date.getDate()}.`
      : `${date.getDate()}. ${b.months[date.getMonth()]} ${date.getFullYear()}.`)
    : '';
  const whenText = date ? `${dateText}${time ? ` · ${time}` : ''}` : b.pickDate;

  const btnTone = step === 3 ? 'btn-gold' : 'btn-dark';
  const typeTitle = type ? b.types[type].title : '—';

  return (
    <div className="app">
      <AppHeader onBack={step > 0 && step < 4 ? back : null} />
      {step < 4 && <div className="app__steps"><Stepper steps={b.steps} current={step} /></div>}

      <div className="app__body">
        <div className="app__main">
          <div className="app__wrap">
            {step < 4 && <p className="notice">{b.notice}</p>}

            {step === 0 && (
              <>
                <StepTitle step={0} total={4}>{b.typeTitle}</StepTitle>
                <div className="options" role="radiogroup" aria-label={b.typeTitle}>
                  {TYPES.map((k) => (
                    <button key={k} type="button" role="radio" aria-checked={type === k} className="option" onClick={() => setType(k)}>
                      <span className="option__radio" aria-hidden="true" />
                      <span className="option__body"><span className="option__title">{b.types[k].title}</span><span className="option__text">{b.types[k].text}</span></span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <StepTitle step={1} total={4}>{b.dateTitle}</StepTitle>
                <Calendar value={date} onChange={setDate} />
                <h2 className="flow-sub" id="time-label">{b.time}</h2>
                <div className="time-grid" role="radiogroup" aria-labelledby="time-label">
                  {TIMES.map((tm) => (
                    <button key={tm} type="button" role="radio" aria-checked={time === tm} className="time-chip" onClick={() => setTime(tm)}>{tm}</button>
                  ))}
                </div>
                <p className="flow-text small">{b.timeNote}</p>
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle step={2} total={4}>{b.dataTitle}</StepTitle>
                <form className="form" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                  <Field id="b-name" label={b.name} required error={err('name')}>
                    <input id="b-name" className="input" autoComplete="name" value={form.name} onChange={setF('name')} onBlur={blur('name')} aria-invalid={!!err('name')} aria-describedby={err('name') ? 'b-name-err' : undefined} />
                  </Field>
                  <Field id="b-phone" label={b.phone} required error={err('phone')}>
                    <input id="b-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={setF('phone')} onBlur={blur('phone')} aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'b-phone-err' : undefined} />
                  </Field>
                  <Field id="b-email" label={b.email} required error={err('email')}>
                    <input id="b-email" className="input" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={setF('email')} onBlur={blur('email')} aria-invalid={!!err('email')} aria-describedby={err('email') ? 'b-email-err' : undefined} />
                  </Field>
                  <Field id="b-place" label={b.place}>
                    <input id="b-place" className="input" value={form.place} onChange={setF('place')} />
                  </Field>
                  <Field id="b-note" label={b.note}>
                    <textarea id="b-note" className="input" rows="3" value={form.note} onChange={setF('note')} />
                  </Field>
                  <button type="submit" hidden>{b.next[2]}</button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle step={3} total={4}>{b.sumTitle}</StepTitle>
                <div className="panel">
                  <div className="panel__label">{b.type}</div>
                  <p className="summary-big">{typeTitle}</p>
                </div>
                <div className="panel">
                  <div className="panel__label">{b.when}</div>
                  <p className="summary-big">{whenText}</p>
                  <span className="badge">{b.requested}</span>
                </div>
                <div className="panel">
                  <div className="panel__label">{b.contact}</div>
                  <div className="customer">
                    <strong>{form.name}</strong>
                    <span>{form.phone}</span>
                    <span>{form.email}</span>
                    {form.place && <span>{form.place}</span>}
                    {form.note && <span className="muted pre">{form.note}</span>}
                  </div>
                </div>
                <p className="demo-note mono">{b.demoNote}</p>
              </>
            )}

            {step === 4 && (
              <DoneScreen title={b.doneTitle} text={b.doneText}>
                <div className="done__sum done__sum--stack">
                  <span className="badge">{b.requested}</span>
                  <span>{typeTitle}</span>
                  <strong>{whenText}</strong>
                </div>
                <button type="button" className="btn btn-dark btn-lg" onClick={restart}>{b.again}</button>
                <Link to="/" className="text-link done__home">{b.toHome}</Link>
              </DoneScreen>
            )}
          </div>
        </div>

        {step < 4 && (
          <aside className="app__aside" aria-label={b.title}>
            <h2 className="aside-title">{b.title}</h2>
            <div className="aside-body">
              <dl className="aside-dl">
                <div><dt>{b.type}</dt><dd>{typeTitle}</dd></div>
                <div><dt>{b.when}</dt><dd>{date ? whenText : '—'}</dd></div>
              </dl>
              <span className="badge">{b.requested}</span>
            </div>
            <button type="button" className={`btn btn-lg btn-block ${btnTone}`} onClick={next} disabled={!canNext}>{b.next[step]}</button>
            <p className="aside-note mono">{b.demoNote}</p>
          </aside>
        )}
      </div>

      {step < 4 && (
        <div className="app__bar">
          <div className="app__bar-sum">
            <span>{typeTitle}</span>
            <strong className="app__bar-when">{date ? whenText : '—'}</strong>
          </div>
          <button type="button" className={`btn btn-lg ${btnTone}`} onClick={next} disabled={!canNext}>{b.nextShort[step]}</button>
        </div>
      )}
    </div>
  );
}
