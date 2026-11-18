import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import Wedding from './pages/Wedding.jsx';
import FineArt from './pages/FineArt.jsx';
import Prices from './pages/Prices.jsx';
import Contact from './pages/Contact.jsx';
import Order from './pages/Order.jsx';
import Booking from './pages/Booking.jsx';
import NotFound from './pages/NotFound.jsx';
import { useLang } from './i18n/LanguageContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const isApp = pathname === '/rendeles' || pathname === '/idopont';
  return (
    <>
      <a className="skip-link" href="#main">{t.nav.skip}</a>
      <ScrollToTop />
      {!isApp && <Header overHero={pathname === '/'} />}
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/eskuvo" element={<Wedding />} />
          <Route path="/fine-art-album" element={<FineArt />} />
          <Route path="/arlista" element={<Prices />} />
          <Route path="/kapcsolat" element={<Contact />} />
          <Route path="/rendeles" element={<Order />} />
          <Route path="/idopont" element={<Booking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isApp && <Footer />}
    </>
  );
}
