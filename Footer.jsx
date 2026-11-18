import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { brand, CONTACT } from '../data/site.js';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <img src={brand('logo-white.png')} alt={t.common.logoAlt} className="site-footer__logo" />
        <nav aria-label={t.nav.footer} className="site-footer__nav">
          <Link to="/galeria">{t.nav.gallery}</Link>
          <a href="https://foto-maja.com/blog/" target="_blank" rel="noreferrer">{t.common.blog}</a>
          <Link to="/arlista">{t.nav.prices}</Link>
          <Link to="/rendeles">{t.nav.order}</Link>
          <Link to="/idopont">{t.nav.booking}</Link>
          <a href={CONTACT.facebook} target="_blank" rel="noreferrer">{t.common.facebook}</a>
        </nav>
      </div>
      <div className="container site-footer__bottom mono">
        <span>{t.common.rights}</span>
        <span>{t.common.demo}</span>
      </div>
    </footer>
  );
}
