import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { brand } from '../data/site.js';
import LangSwitch from './LangSwitch.jsx';
import Icon from './Icon.jsx';

export const NAV = [
  ['/galeria', 'gallery'],
  ['/eskuvo', 'wedding'],
  ['/fine-art-album', 'fineArt'],
  ['/arlista', 'prices'],
  ['/kapcsolat', 'contact'],
];

export default function Header({ overHero }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const transparent = overHero && !scrolled && !open;
  const tone = transparent ? 'light' : 'dark';

  return (
    <header className={`site-header ${transparent ? 'is-transparent' : 'is-solid'} `}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label={t.nav.homeLink}>
          <img src={brand(transparent ? 'logo-white.png' : 'logo-black.png')} alt={t.common.logoAlt} />
        </Link>

        <nav className="site-nav" aria-label={t.nav.main}>
          {NAV.map(([to, key]) => (
            <NavLink key={to} to={to}>{t.nav[key]}</NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <LangSwitch tone={tone} />
          <Link to="/rendeles" className={`btn btn-sm ${transparent ? 'btn-light' : 'btn-dark'} hide-sm`}>{t.nav.order}</Link>
          <button type="button" className={`icon-btn menu-btn ${transparent ? 'icon-btn--light' : ''}`}
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label={t.nav.main}>
          <NavLink to="/" end>{t.nav.home}</NavLink>
          {NAV.map(([to, key]) => (
            <NavLink key={to} to={to}>{t.nav[key]}</NavLink>
          ))}
        </nav>
        <div className="mobile-menu__cta">
          <Link to="/rendeles" className="btn btn-dark btn-block">{t.nav.order}</Link>
          <Link to="/idopont" className="btn btn-outline btn-block">{t.nav.booking}</Link>
        </div>
      </div>
    </header>
  );
}
