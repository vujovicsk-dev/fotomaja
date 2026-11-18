import { useLang } from '../i18n/LanguageContext.jsx';
import { CONTACT } from '../data/site.js';

export default function ContactBlock() {
  const { t } = useLang();
  return (
    <div className="contact-block">
      <div className="contact-block__locs">
        {CONTACT.locations.map((loc) => (
          <div key={loc.id} className="contact-block__loc">
            <div className="mono muted upper">{t.contact.locations[loc.id]}</div>
            <div className="contact-block__addr">{loc.address}</div>
            <div className="muted small">{t.contact.locations[loc.id]}, {t.contact.countries[loc.id]}</div>
          </div>
        ))}
      </div>
      <div className="contact-block__meta">
        <span><span className="muted">{t.common.phoneViber}</span> {CONTACT.phoneDisplay}</span>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </div>
    </div>
  );
}
