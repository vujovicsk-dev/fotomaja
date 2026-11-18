// Podaci preuzeti sa foto-maja.com. Ne dodavati informacije koje ne postoje na originalnom sajtu.

const base = import.meta.env.BASE_URL;
export const photo = (file) => `${base}photos/${file}`;
export const brand = (file) => `${base}brand/${file}`;

export const CONTACT = {
  phoneDisplay: '+381 63/88-63-901',
  phoneHref: 'tel:+381638863901',
  email: 'repmiki@gmail.com',
  facebook: 'https://foto-maja.com/foto-maja-facebook-oldala/',
  originalSite: 'https://foto-maja.com/',
  locations: [
    { id: 'zenta', address: 'Posta utca 13.', mapQuery: 'Posta utca 13, Zenta' },
    { id: 'szeged', address: 'Szent Miklós utca 2/6', mapQuery: 'Szent Miklós utca 2/6, Szeged' },
  ],
};

export const HERO_SLIDES = ['slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg', 'slide-4.jpg', 'slide-5.jpg'];

// Dve kolekcije sa originalne galerije; ovde je reprezentativan izbor fotografija.
export const COLLECTIONS = [
  {
    id: 'portre',
    total: 118,
    url: 'https://foto-maja.com/foto-maja-galeria/gallery/paros-kreativ-portre',
    photos: ['T-Cs-86.jpg', 'N-Cs-113.jpg', 'F-N-160.jpg', 'A-A-39.jpg', 'T-Cs-108.jpg', 'IMG_9151.jpg', 'V-L-93.jpg', 'B-N-145.jpg', 'H-G-63.jpg', 'D-A-26.jpg', 'A-B-105.jpg', 'K-T-77.jpg'],
  },
  {
    id: 'lakodalom',
    total: 128,
    url: 'https://foto-maja.com/foto-maja-galeria/gallery/lakodalom',
    photos: ['M-N-908.jpg', 'J-T-577.jpg', 'K-A-836.jpg', 'N-A-194.jpg', 'E-Zs-117.jpg', 'J-B-71.jpg', 'K-A-3.jpg', 'E-Zs-111.jpg'],
  },
];

// Fotografije za demo porudžbinu (fotografije studija).
export const DEMO_ORDER_PHOTOS = ['IMG_9151.jpg', 'T-Cs-108.jpg', 'E-Zs-117.jpg', 'J-T-577.jpg', 'A-B-105.jpg', 'T-Cs-86.jpg', 'M-N-908.jpg', 'A-A-39.jpg', 'E-Zs-111.jpg', 'F-N-160.jpg', 'K-A-3.jpg', 'N-A-194.jpg'];

// Blog priče sa originalnog sajta (naslovi i linkovi).
export const STORIES = [
  { title: 'Szeged – Füvészkert, szeptemberi fények', url: 'https://foto-maja.com/eskuvoi-fotozas-szeged-fuveszkert-szeptemberi-fenyek/' },
  { title: 'Szeged – belvárosi fények', url: 'https://foto-maja.com/szeged-belvarosi-fenyek-eskuvoi-fotozas/' },
  { title: 'Hódmezővásárhely és a Mártélyi Holtág', url: 'https://foto-maja.com/eskuvoi-fotos-hodmezovasarhely-es-martely-i-holtag/' },
  { title: 'Szeged – Szélmalom Vendéglő', url: 'https://foto-maja.com/szelmalom-vendeglo-eskuvoi-fotozas-szeged/' },
  { title: 'Szeged – Tisza River Étterem', url: 'https://foto-maja.com/eskuvoi-fotozas-szeged-tisza/' },
  { title: 'Szeged – Kastélykert Fogadó', url: 'https://foto-maja.com/szeged-kastelykert-fogado-eskuvoi-fotozas/' },
  { title: 'Kiskunmajsa', url: 'https://foto-maja.com/eskuvoi-fotozas-kiskunmajsa/' },
  { title: 'Szekszárd – Tihany', url: 'https://foto-maja.com/eskuvoi-fotozas-szekszard-tihany/' },
  { title: 'Lajosmizse – Tanyacsárda', url: 'https://foto-maja.com/eskuvoi-fotozas-lajosmizse/' },
  { title: 'Kecskemét', url: 'https://foto-maja.com/eskuvoi-fotozas-kecskemet/' },
  { title: 'Baja', url: 'https://foto-maja.com/eskuvoi-fotozas-baja/' },
];
