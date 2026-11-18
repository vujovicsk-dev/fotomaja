import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { photo, STORIES } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';
import Icon from '../components/Icon.jsx';

export default function Wedding() {
  const { t } = useLang();
  return (
    <>
      <section className="page-hero">
        <img src={photo('slide-2.jpg')} alt={t.wedding.heroAlt} />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container page-hero__text">
          <Kicker light>{t.wedding.kicker}</Kicker>
          <h1 className="display-xl">{t.wedding.title}</h1>
        </div>
      </section>

      <section className="container section split split--top">
        <div className="split__text">
          <p className="lead lead--big">{t.wedding.lead}</p>
          <Link to="/idopont" className="btn btn-gold btn-lg">{t.wedding.ctaBook}</Link>
        </div>
        <div>
          <h2 className="display-s">{t.wedding.includes}</h2>
          <ol className="services services--single">
            {t.services.map((s, n) => (
              <li key={s.title}>
                <span className="mono gold-dark">{String(n + 1).padStart(2, '0')}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container photo-strip" aria-hidden="true">
        {['F-N-160.jpg', 'D-A-26.jpg', 'B-N-145.jpg'].map((f) => <img key={f} src={photo(f)} alt="" loading="lazy" />)}
      </section>

      <section className="band band--sand">
        <div className="container section">
          <h2 className="display-m">{t.wedding.storiesTitle}</h2>
          <p className="lead">{t.wedding.storiesText}</p>
          <ul className="stories">
            {STORIES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  <span>{s.title}</span>
                  <span className="mono small">{t.wedding.read} <Icon name="external" size={14} /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section cta-band">
        <h2 className="display-l">{t.wedding.ctaTitle}</h2>
        <p className="lead">{t.wedding.ctaText}</p>
        <Link to="/idopont" className="btn btn-dark btn-lg">{t.wedding.ctaBook}</Link>
      </section>
    </>
  );
}
