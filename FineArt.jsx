import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { photo } from '../data/site.js';
import Kicker from '../components/Kicker.jsx';

export default function FineArt() {
  const { t } = useLang();
  return (
    <section className="container page-top">
      <div className="split split--media">
        <img className="split__media" src={photo('fineart.jpg')} alt={t.fineArt.imgAlt} />
        <div className="split__text">
          <Kicker>{t.fineArt.kicker}</Kicker>
          <h1 className="display-xl">{t.fineArt.title}</h1>
          <p className="lead">{t.fineArt.lead}</p>
          <ul className="dash-list">{t.fineArt.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <p className="lead">{t.fineArt.lasting}</p>
          <Link to="/idopont" className="btn btn-dark btn-lg">{t.fineArt.cta}</Link>
        </div>
      </div>
    </section>
  );
}
