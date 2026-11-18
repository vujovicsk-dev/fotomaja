import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLang();
  return (
    <section className="container page-top" style={{ minHeight: '50vh' }}>
      <h1 className="display-l">{t.notFound.title}</h1>
      <Link className="btn btn-dark" to="/">{t.notFound.back}</Link>
    </section>
  );
}
