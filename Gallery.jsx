import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { COLLECTIONS, photo } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';
import Icon from '../components/Icon.jsx';

function Lightbox({ items, index, onClose, onMove }) {
  const { t } = useLang();
  const closeRef = useRef(null);
  const touch = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); };
  }, [onClose, onMove]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.gallery.title}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
        touch.current = null;
      }}>
      <button ref={closeRef} type="button" className="icon-btn icon-btn--light lightbox__close" onClick={onClose} aria-label={t.gallery.close}><Icon name="close" /></button>
      <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--prev" onClick={() => onMove(-1)} aria-label={t.gallery.prev}><Icon name="chevL" /></button>
      <img src={photo(items[index])} alt="" />
      <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--next" onClick={() => onMove(1)} aria-label={t.gallery.next}><Icon name="chevR" /></button>
      <div className="lightbox__count mono">{index + 1} {t.gallery.of} {items.length}</div>
    </div>
  );
}

export default function Gallery() {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const items = useMemo(
    () => (filter === 'all' ? COLLECTIONS.flatMap((c) => c.photos) : COLLECTIONS.find((c) => c.id === filter).photos),
    [filter],
  );
  const move = useCallback((d) => setOpen((v) => (v + d + items.length) % items.length), [items.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="container page-top">
      <Kicker>{t.gallery.kicker}</Kicker>
      <h1 className="display-xl">{t.gallery.title}</h1>
      <p className="lead">{t.gallery.intro}</p>

      <div className="chips" role="group" aria-label={t.gallery.kicker}>
        <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t.gallery.all}</button>
        {COLLECTIONS.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {t.gallery.collections[c.id]} <span className="mono gold-dark">{c.total}</span>
          </button>
        ))}
      </div>

      <div className="masonry">
        {items.map((f, n) => (
          <button key={f} type="button" className="masonry__item" onClick={() => setOpen(n)} aria-label={`${t.gallery.open} ${n + 1}`}>
            <img src={photo(f)} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="btn-row center">
        {COLLECTIONS.map((c) => (
          <a key={c.id} href={c.url} target="_blank" rel="noreferrer" className="text-link">
            {t.gallery.collections[c.id]} – {t.gallery.viewAll} <Icon name="external" size={16} />
          </a>
        ))}
      </div>

      {open != null && <Lightbox items={items} index={open} onClose={close} onMove={move} />}
    </section>
  );
}
