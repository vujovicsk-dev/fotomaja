import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { photo, HERO_SLIDES, CONTACT, COLLECTIONS } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';
import Icon from '../components/Icon.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { SmallPriceTable, LargePriceList } from '../components/PriceTable.jsx';

function Hero() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || paused) return undefined;
    const id = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {HERO_SLIDES.map((src, n) => (
        <img key={src} src={photo(src)} alt={n === i ? t.home.heroAlt : ''} aria-hidden={n === i ? undefined : 'true'}
          className={`hero__img ${n === i ? 'is-active' : ''}`} fetchpriority={n === 0 ? 'high' : undefined}
          loading={n === 0 ? 'eager' : 'lazy'} />
      ))}
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__content container">
        <div className="hero__text">
          <Kicker light>{t.home.kicker}</Kicker>
          <h1 className="hero__title">{t.home.motto}</h1>
          {/* Desktop: zlatno „zakazivanje“ + obrub „porudžbina“; mobilni: svetlo „porudžbina“ + obrub „zakazivanje“ (kao u maketi) */}
          <div className="hero__ctas hide-sm">
            <Link to="/idopont" className="btn btn-gold btn-lg">{t.home.ctaBook}</Link>
            <Link to="/rendeles" className="btn btn-ghost-light btn-lg">{t.home.ctaOrder}</Link>
          </div>
          <div className="hero__ctas show-sm">
            <Link to="/rendeles" className="btn btn-light btn-lg btn-block">{t.home.ctaOrder}</Link>
            <Link to="/idopont" className="btn btn-ghost-light btn-lg btn-block">{t.home.ctaBook}</Link>
          </div>
        </div>
        <div className="hero__dots">
          <span className="mono hide-sm" aria-live="polite">0{i + 1} / 0{HERO_SLIDES.length}</span>
          <div className="hero__dots-row">
            {HERO_SLIDES.map((s, n) => (
              <button key={s} type="button" className={n === i ? 'is-active' : ''} aria-current={n === i}
                aria-label={`${t.home.slide} ${n + 1}`} onClick={() => setI(n)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <Hero />

      <section className="container quick-actions show-sm">
        <Link to="/rendeles" className="quick-card quick-card--dark">
          <span className="mono upper gold">{t.home.quickOrderLabel}</span>
          <span className="quick-card__title">{t.home.quickOrderTitle}</span>
          <span className="small">{t.home.quickOrderText}</span>
        </Link>
        <Link to="/idopont" className="quick-card">
          <span className="mono upper gold-dark">{t.home.quickBookLabel}</span>
          <span className="quick-card__title">{t.home.quickBookTitle}</span>
          <span className="small muted">{t.home.quickBookText}</span>
        </Link>
      </section>

      <section className="container section intro">
        <div className="intro__text">
          <Kicker>{t.home.introKicker}</Kicker>
          <h2 className="display-l">{t.home.introA}<em className="gold-dark">{t.home.introB}</em></h2>
          <p className="lead">{t.home.introText}</p>
          <div className="person">
            <img src={photo('miklos.jpg')} alt={t.home.portraitAlt} />
            <div>
              <div className="person__name">Reperger Miklós</div>
              <div className="small muted">{t.home.photographer}</div>
            </div>
          </div>
        </div>
        <div className="intro__photos">
          <img src={photo('T-Cs-86.jpg')} alt="" loading="lazy" />
          <img src={photo('T-Cs-108.jpg')} alt="" loading="lazy" />
        </div>
      </section>

      <section className="band band--sand">
        <div className="container section">
          <div className="section-head">
            <h2 className="display-m">{t.home.servicesTitle}</h2>
            <Link to="/idopont" className="text-link">{t.home.quote} <Icon name="arrow" size={18} /></Link>
          </div>
          <ol className="services">
            {t.services.map((s, n) => (
              <li key={s.title}>
                <span className="mono gold-dark">{String(n + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section">
        <Kicker>{t.home.offersKicker}</Kicker>
        <div className="offers">
          {[
            ['/eskuvo', 'slide-3.jpg', 'wedding'],
            ['/fine-art-album', 'fineart.jpg', 'fineArt'],
            ['/rendeles', 'papirkep.jpg', 'prints'],
          ].map(([to, img, key]) => (
            <Link key={key} to={to} className={`offer ${key === 'prints' ? 'hide-sm' : ''}`}>
              <div className="offer__img"><img src={photo(img)} alt="" loading="lazy" /></div>
              <div className="offer__head"><h3>{t.home.offers[key].title}</h3><Icon name="arrow" /></div>
              <p>{t.home.offers[key].text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="band band--ink">
        <div className="container section">
          <div className="section-head">
            <div>
              <Kicker light>{t.home.galleryKicker}</Kicker>
              <h2 className="display-l">{t.home.galleryA}<br /><em>{t.home.galleryB}</em></h2>
            </div>
            <div className="gallery-chips">
              {COLLECTIONS.map((c) => (
                <Link key={c.id} to="/galeria" className="pill-link">
                  {t.gallery.collections[c.id]} <span className="mono">{c.total}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mosaic">
            {['IMG_9151.jpg', 'E-Zs-117.jpg', 'M-N-908.jpg', 'J-T-577.jpg', 'A-B-105.jpg'].map((f, n) => (
              <Link key={f} to="/galeria" className={`mosaic__item mosaic__item--${n + 1}`} aria-label={t.gallery.open}>
                <img src={photo(f)} alt="" loading="lazy" />
              </Link>
            ))}
          </div>
          <Link to="/galeria" className="btn btn-ghost-light btn-lg btn-block show-sm gallery-all">{t.home.allGallery}</Link>
        </div>
      </section>

      <section className="container section split">
        <div className="split__text">
          <Kicker>{t.home.orderKicker}</Kicker>
          <h2 className="display-l">{t.home.orderTitle}</h2>
          <p className="lead">{t.home.orderText}</p>
          <div className="btn-row">
            <Link to="/rendeles" className="btn btn-dark btn-lg">{t.home.orderCta}</Link>
            <Link to="/arlista" className="text-link">{t.home.fullPrices}</Link>
          </div>
        </div>
        <div className="card price-card">
          <div className="price-card__head">
            <h3 className="display-s">{t.prices.title}</h3>
            <span className="mono muted small">{t.common.perPcs}</span>
          </div>
          <SmallPriceTable />
          <LargePriceList />
        </div>
      </section>

      {/* Fine Art traka – na mobilnom je album već u „Szolgáltatások“ (kao u maketi) */}
      <section className="band band--sand hide-sm">
        <div className="container section split split--media">
          <img className="split__media" src={photo('fineart.jpg')} alt={t.fineArt.imgAlt} loading="lazy" />
          <div className="split__text">
            <Kicker>{t.home.fineKicker}</Kicker>
            <h2 className="display-l">{t.home.fineTitle}</h2>
            <ul className="dash-list">
              {t.fineArt.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <Link to="/fine-art-album" className="text-link">{t.home.fineMore} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="container section split">
        <div className="split__text">
          <Kicker>{t.home.contactKicker}</Kicker>
          <h2 className="display-l">{t.home.contactTitle}</h2>
          <div className="btn-row hide-sm">
            <Link to="/idopont" className="btn btn-gold btn-lg">{t.home.ctaBook}</Link>
            <a href={CONTACT.phoneHref} className="btn btn-outline btn-lg">{CONTACT.phoneDisplay}</a>
          </div>
        </div>
        <ContactBlock />
        <div className="btn-grid show-sm">
          <a href={CONTACT.phoneHref} className="btn btn-gold btn-lg">{t.contact.call}</a>
          <a href={`mailto:${CONTACT.email}`} className="btn btn-outline btn-lg">{t.common.email}</a>
        </div>
      </section>
    </>
  );
}
