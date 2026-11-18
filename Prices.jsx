import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { photo } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';
import { SmallPriceTable, LargePriceList } from '../components/PriceTable.jsx';

export default function Prices() {
  const { t } = useLang();
  return (
    <>
      <section className="container page-top">
        <Kicker>{t.prices.kicker}</Kicker>
        <h1 className="display-xl">{t.prices.title}</h1>
        <p className="lead">{t.prices.intro}</p>
        <div className="prices-grid">
          <div className="card">
            <h2 className="display-s">{t.prices.small}</h2>
            <SmallPriceTable />
            <p className="mono small muted">{t.prices.note}</p>
          </div>
          <div className="card">
            <h2 className="display-s">{t.prices.large}</h2>
            <LargePriceList />
            <p className="mono small muted">{t.prices.note}</p>
            <Link to="/rendeles" className="btn btn-dark btn-block">{t.prices.cta}</Link>
          </div>
        </div>
      </section>
      <section className="band band--sand">
        <div className="container section split split--media">
          <img className="split__media" src={photo('papirkep.jpg')} alt={t.prices.paperAlt} loading="lazy" />
          <div className="split__text">
            <h2 className="display-l">{t.prices.paperTitle}</h2>
            <p className="lead">{t.prices.paperText}</p>
            <p className="lead">{t.prices.weddingNote}</p>
            <Link to="/idopont" className="text-link">{t.prices.weddingCta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
