// Aplikacija za naručivanje fotografija – prati odobrenu maketu (Order.dc.html).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { photo, DEMO_ORDER_PHOTOS } from '../data/site.js';
import {
  SMALL_SIZES, LARGE_SIZES, DEFAULT_SIZE, TIERS, MIN_FILE_BYTES, MAX_FILE_BYTES,
  calculateOrder, unitPrice, sizeLabel, formatDin,
} from '../data/pricing.js';
import { AppHeader, Stepper, StepTitle, Field, DoneScreen, isEmail, isPhone } from '../components/Flow.jsx';
import Icon from '../components/Icon.jsx';

let uid = 0;
const EMPTY_FORM = { name: '', phone: '', email: '', note: '' };

function SizeSelect({ id, value, onChange, label, withCm }) {
  const opt = (s) => <option key={s} value={s}>{sizeLabel(s)}{withCm ? ' cm' : ''}</option>;
  return (
    <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {SMALL_SIZES.map(opt)}
      {LARGE_SIZES.map(opt)}
    </select>
  );
}

function TierBox({ calc }) {
  const { t } = useLang();
  const o = t.order;
  return (
    <div className="tier">
      <div className="tier__head">
        <span className="mono">{o.tierNow}: {TIERS[calc.tier].label} {t.common.pcs}</span>
        <span>{calc.smallCount} {t.common.pcs}</span>
      </div>
      <div className="tier__strip" aria-hidden="true">
        {TIERS.map((tr, i) => (
          <span key={tr.label} className={calc.smallCount > 0 && i === calc.tier ? 'is-active' : ''}>{tr.label}</span>
        ))}
      </div>
      <p className="tier__hint" aria-live="polite">{tierHint(calc, o)}</p>
    </div>
  );
}

const tierHint = (calc, o) => (calc.smallCount === 0 ? o.noSmall
  : calc.tier === TIERS.length - 1 ? o.tierTop : o.tierNext(calc.toNextTier));

function Lines({ calc, compact }) {
  const { t } = useLang();
  return (
    <ul className={`lines ${compact ? 'lines--compact' : ''}`}>
      {calc.lines.map((l) => (
        <li key={l.size}>
          <div>
            <div className="lines__size">{sizeLabel(l.size)} cm</div>
            <div className="lines__meta">{compact ? `${l.qty} × ${l.unit} din` : `${l.qty} ${t.common.pcs} × ${l.unit} ${t.common.perPcs}`}</div>
          </div>
          <div className="lines__sum">{formatDin(l.subtotal)} din</div>
        </li>
      ))}
    </ul>
  );
}

export default function Order() {
  const { t } = useLang();
  const o = t.order;
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [rejected, setRejected] = useState(0);
  const [bulk, setBulk] = useState(DEFAULT_SIZE);
  const [form, setForm] = useState(EMPTY_FORM);
  const [blurred, setBlurred] = useState({});
  const urls = useRef([]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  useEffect(() => { window.scrollTo(0, 0); document.querySelector('.flow-title')?.focus({ preventScroll: true }); }, [step]);

  const calc = useMemo(() => calculateOrder(photos), [photos]);
  const errors = {
    name: form.name.trim().length < 2 ? o.errName : null,
    phone: !isPhone(form.phone) ? o.errPhone : null,
    email: !isEmail(form.email) ? o.errEmail : null,
  };
  const valid = [photos.length > 0, calc.prints > 0, !errors.name && !errors.phone && !errors.email, true];
  const nextDisabled = !valid[step];

  const addPhotos = (list) => setPhotos((p) => p.concat(list.map((x) => ({ id: ++uid, size: DEFAULT_SIZE, qty: 1, ...x }))));
  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const ok = files.filter((f) => f.size >= MIN_FILE_BYTES && f.size <= MAX_FILE_BYTES);
    setRejected(files.length - ok.length);
    addPhotos(ok.map((f) => {
      const src = URL.createObjectURL(f);
      urls.current.push(src);
      return { src, name: f.name };
    }));
    e.target.value = '';
  };
  const loadDemo = () => addPhotos(DEMO_ORDER_PHOTOS.map((f, i) => ({ src: photo(f), name: `foto-maja-demo-${String(i + 1).padStart(2, '0')}.jpg` })));
  const update = (id, fn) => setPhotos((p) => p.map((x) => (x.id === id ? { ...x, ...fn(x) } : x)));
  const remove = (id) => setPhotos((p) => p.filter((x) => x.id !== id));
  const next = () => { if (!nextDisabled) setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setStep(0); setPhotos([]); setRejected(0); setForm(EMPTY_FORM); setBlurred({}); };
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setBlurred((b) => ({ ...b, [k]: true }));
  const err = (k) => (blurred[k] ? errors[k] : null);
  const summaryText = o.photosPrints(photos.length, calc.prints);
  const btnTone = step === 3 ? 'btn-gold' : 'btn-dark';

  return (
    <div className="app">
      <AppHeader onBack={step > 0 && step < 4 ? back : null} />
      {step < 4 && <div className="app__steps"><Stepper steps={o.steps} current={step} /></div>}

      <div className="app__body">
        <div className="app__main">
          <div className="app__wrap">
            {step === 0 && (
              <>
                <StepTitle step={0} total={4}>{o.upTitle}</StepTitle>
                <p className="flow-text">{o.upText}</p>
                <label className="dropzone">
                  <input type="file" accept="image/jpeg,image/png" multiple onChange={onFiles} className="file-input" />
                  <span className="dropzone__icon" aria-hidden="true"><Icon name="upload" size={24} /></span>
                  <span className="dropzone__title">{o.upBtn}</span>
                  <span className="mono dropzone__hint">{o.upHint}</span>
                </label>
                <button type="button" className="btn-demo" onClick={loadDemo}>{o.demo}</button>
                {rejected > 0 && <p className="alert" role="alert">{o.rejected(rejected)}</p>}
                <h2 className="flow-sub">{o.selected(photos.length)}</h2>
                {photos.length === 0 ? <p className="empty">{o.empty}</p> : (
                  <ul className="thumbs">
                    {photos.map((p) => (
                      <li key={p.id}>
                        <img src={p.src} alt={p.name} />
                        <button type="button" className="thumbs__remove" onClick={() => remove(p.id)} aria-label={o.remove(p.name)}>
                          <Icon name="close" size={14} stroke={2.4} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <StepTitle step={1} total={4}>{o.sizeTitle}</StepTitle>
                <TierBox calc={calc} />
                <div className="bulk">
                  <label htmlFor="bulk-size">{o.bulk}</label>
                  <div className="bulk__row">
                    <SizeSelect id="bulk-size" value={bulk} onChange={setBulk} withCm />
                    <button type="button" className="bulk__apply" onClick={() => setPhotos((p) => p.map((x) => ({ ...x, size: bulk })))}>{o.apply}</button>
                  </div>
                </div>
                <ul className="items">
                  {photos.map((p) => (
                    <li key={p.id} className="item">
                      <img src={p.src} alt={p.name} />
                      <div className="item__main">
                        <div className="item__top">
                          <span className="item__name">{p.name}</span>
                          <span className="item__price">{p.qty} × {unitPrice(p.size, calc.tier)} din</span>
                        </div>
                        <div className="item__controls">
                          <SizeSelect value={p.size} onChange={(v) => update(p.id, () => ({ size: v }))} label={o.sizeOf(p.name)} />
                          <div className="qty" role="group" aria-label={o.qtyOf(p.name)}>
                            <button type="button" onClick={() => update(p.id, (x) => ({ qty: Math.max(1, x.qty - 1) }))} aria-label={o.minus}>−</button>
                            <span aria-live="polite">{p.qty}</span>
                            <button type="button" onClick={() => update(p.id, (x) => ({ qty: Math.min(999, x.qty + 1) }))} aria-label={o.plus}>+</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle step={2} total={4}>{o.dataTitle}</StepTitle>
                <form className="form" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                  <Field id="o-name" label={o.name} required error={err('name')}>
                    <input id="o-name" className="input" autoComplete="name" value={form.name} onChange={setF('name')} onBlur={blur('name')}
                      aria-invalid={!!err('name')} aria-describedby={err('name') ? 'o-name-err' : undefined} />
                  </Field>
                  <Field id="o-phone" label={o.phone} required error={err('phone')}>
                    <input id="o-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={setF('phone')} onBlur={blur('phone')}
                      aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'o-phone-err' : undefined} />
                  </Field>
                  <Field id="o-email" label={o.email} required error={err('email')}>
                    <input id="o-email" className="input" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={setF('email')} onBlur={blur('email')}
                      aria-invalid={!!err('email')} aria-describedby={err('email') ? 'o-email-err' : undefined} />
                  </Field>
                  <Field id="o-note" label={o.note}>
                    <textarea id="o-note" className="input" rows="3" value={form.note} onChange={setF('note')} />
                  </Field>
                  <button type="submit" hidden>{o.next[2]}</button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle step={3} total={4}>{o.sumTitle}</StepTitle>
                <div className="sum-thumbs">{photos.map((p) => <img key={p.id} src={p.src} alt={p.name} />)}</div>
                <div className="panel">
                  <div className="panel__label">{o.items}</div>
                  <Lines calc={calc} />
                  <div className="total"><span>{o.total}</span><strong>{formatDin(calc.total)} din</strong></div>
                </div>
                <div className="panel">
                  <div className="panel__label">{o.customer}</div>
                  <div className="customer">
                    <strong>{form.name}</strong>
                    <span>{form.phone}</span>
                    <span>{form.email}</span>
                    {form.note && <span className="muted pre">{form.note}</span>}
                  </div>
                </div>
                <p className="demo-note mono">{o.demoNote}</p>
              </>
            )}

            {step === 4 && (
              <DoneScreen title={o.doneTitle} text={o.doneText}>
                <div className="done__sum"><span>{summaryText}</span><strong>{formatDin(calc.total)} din</strong></div>
                <button type="button" className="btn btn-dark btn-lg" onClick={restart}>{o.again}</button>
                <Link to="/" className="text-link done__home">{o.toHome}</Link>
              </DoneScreen>
            )}
          </div>
        </div>

        {step < 4 && (
          <aside className="app__aside" aria-label={o.summary}>
            <h2 className="aside-title">{o.summary}</h2>
            <p className="aside-sub">{summaryText}</p>
            <div className="aside-body">
              {calc.lines.length === 0 ? <p className="aside-empty">{o.empty}</p> : <Lines calc={calc} compact />}
              <div className="aside-tier">
                <span className="mono">{TIERS[calc.tier].label} {t.common.pcs}</span>
                <span>{tierHint(calc, o)}</span>
              </div>
            </div>
            <div className="aside-total"><span>{o.total}</span><strong>{formatDin(calc.total)} din</strong></div>
            <button type="button" className={`btn btn-lg btn-block ${btnTone}`} onClick={next} disabled={nextDisabled}>{o.next[step]}</button>
            <p className="aside-note mono">{o.prices} · {o.demoNote}</p>
          </aside>
        )}
      </div>

      {step < 4 && (
        <div className="app__bar">
          <div className="app__bar-sum">
            <span>{summaryText}</span>
            <strong>{formatDin(calc.total)} din</strong>
          </div>
          <button type="button" className={`btn btn-lg ${btnTone}`} onClick={next} disabled={nextDisabled}>{o.next[step]}</button>
        </div>
      )}
    </div>
  );
}
