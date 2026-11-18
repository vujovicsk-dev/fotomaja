import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { CONTACT } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';
import Icon from '../components/Icon.jsx';

export default function Contact() {
  const { t } = useLang();
  return (
    <section className="container page-top">
      <Kicker>{t.contact.kicker}</Kicker>
      <h1 className="display-xl">{t.contact.title}</h1>
      <p className="lead">{t.contact.text}</p>
      <div className="btn-row">
        <a href={CONTACT.phoneHref} className="btn btn-gold btn-lg"><Icon name="phone" size={18} /> {t.contact.call}</a>
        <a href={`mailto:${CONTACT.email}`} className="btn btn-outline btn-lg"><Icon name="mail" size={18} /> {t.contact.write}</a>
        <Link to="/idopont" className="btn btn-dark btn-lg">{t.contact.book}</Link>
      </div>
      <dl className="contact-meta">
        <div><dt className="mono muted upper">{t.common.phoneViber}</dt><dd>{CONTACT.phoneDisplay}</dd></div>
        <div><dt className="mono muted upper">{t.common.email}</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
      </dl>
      <div className="locations">
        {CONTACT.locations.map((loc) => (
          <article key={loc.id} className="location">
            <div className="location__head">
              <div>
                <div className="mono muted upper">{t.contact.locations[loc.id]}</div>
                <h2 className="display-s">{loc.address}</h2>
                <div className="muted">{t.contact.locations[loc.id]}, {t.contact.countries[loc.id]}</div>
              </div>
              <Icon name="pin" size={28} />
            </div>
            <iframe title={t.contact.mapTitle + t.contact.locations[loc.id]} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&output=embed`} />
          </article>
        ))}
      </div>
    </section>
  );
}
