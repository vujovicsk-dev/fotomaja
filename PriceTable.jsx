import { SMALL_PRICES, SMALL_SIZES, LARGE_PRICES, TIERS, sizeLabel } from '../data/pricing.js';
import { useLang } from '../i18n/LanguageContext.jsx';

export function SmallPriceTable({ highlightTier }) {
  const { t } = useLang();
  return (
    <div className="table-scroll">
      <table className="price-table">
        <caption className="sr-only">{t.prices.small} – {t.prices.note}</caption>
        <thead>
          <tr>
            <th scope="col">{t.prices.qty}</th>
            {SMALL_SIZES.map((s) => <th scope="col" key={s}>{sizeLabel(s)}</th>)}
          </tr>
        </thead>
        <tbody>
          {TIERS.map((tier, i) => (
            <tr key={tier.label} className={highlightTier === i ? 'is-active' : undefined}>
              <th scope="row">{tier.label}</th>
              {SMALL_SIZES.map((s) => <td key={s}>{SMALL_PRICES[s][i]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LargePriceList() {
  const { t } = useLang();
  return (
    <ul className="large-prices" aria-label={t.prices.large}>
      {Object.entries(LARGE_PRICES).map(([s, p]) => (
        <li key={s}>
          <span className="mono muted">{sizeLabel(s)} cm</span>
          <span className="large-prices__price">{p} <small>din</small></span>
        </li>
      ))}
    </ul>
  );
}
