// Business details used across the whole website: schema (JSON-LD), llms.txt and sitemap.
// Change something here (phone, address, social links...) and every page updates on the next build.

export const SITE = 'https://wonads.com/';

export const business = {
  name: 'Won Ads',
  alternateName: 'Won Ads Ai Digital Marketing Agency',
  description: 'Digital marketing agency in Chandigarh serving Chandigarh, Mohali, Panchkula and Derabassi with SEO, paid advertising, websites, content and automation.',
  email: 'wonads.com@gmail.com',
  telephone: '+919463806327',
  phoneDisplay: '+91 94638 06327',
  address: {
    streetAddress: '1495/1, Sector - 30B, Chandi Path, Sector 30',
    addressLocality: 'Chandigarh',
    addressRegion: 'Chandigarh',
    postalCode: '160030',
    addressCountry: 'IN',
  },
  areaServed: ['Chandigarh', 'Mohali', 'Panchkula', 'Derabassi'],
  // Add LinkedIn, Facebook, YouTube and Google Business Profile URLs here.
  sameAs: ['https://www.instagram.com/won.ads/'],
  logo: 'assets/brand/logo-512.png',
  knowsAbout: ['Digital marketing', 'Search engine optimization', 'Paid advertising', 'Social media marketing',
    'Website development', 'Lead generation', 'Branding', 'Conversion rate optimization',
    'Marketing automation', 'Customer relationship management'],
  founder: {
    id: 'suraj-jaiswal',
    name: 'Suraj Jaiswal',
    jobTitle: 'Founder',
    image: 'assets/suraj-jaiswal.webp',
    url: 'about#founder',
  },
  // Shown in llms.txt for AI assistants.
  experience: 'four years of hands-on work for brands in India and international markets',
  credentials: ['Meta Business Partner', 'Google Partner', 'Shopify Partner', 'ISO 9001:2015', 'MSME registered', 'GeM registered'],
  team: ['Atul Diwakar (Performance Marketing)', 'Arjun Verma (Creative Director)', 'Arti Diwakar (Meta Ads & eCommerce)',
    'Kartik (UI/UX & Conversion)', 'Jitender Khatri (Technology & Full-Stack)'],
};

// Service categories listed in the LocalBusiness offer catalogue (name, page).
const catalog = [
  ['Paid Advertising', 'paid-advertising'], ['Social Media Marketing', 'social-media'],
  ['Search Engine Optimization', 'seo'], ['Websites and Landing Pages', 'websites'],
  ['Content and Creative', 'creative'], ['Lead Generation and Sales Funnels', 'funnels'],
  ['Email and WhatsApp Marketing', 'email-whatsapp'], ['Branding', 'branding'],
  ['Analytics and Conversion Optimization', 'analytics'], ['Marketing Automation and CRM', 'automation'],
];

const ref = id => ({ '@id': SITE + id });
const postalAddress = () => ({ '@type': 'PostalAddress', ...business.address });
export const cities = () => business.areaServed.map(name => ({ '@type': 'City', name }));

/** The schema nodes that appear on every page, split into the ones placed before and after the page's own nodes. */
export function sharedNodes() {
  const b = business;
  const before = [
    {
      '@type': 'Organization', '@id': SITE + '#organization', name: b.name, url: SITE, email: b.email,
      telephone: b.telephone, logo: ref('#logo'), address: postalAddress(), description: b.description,
      areaServed: cities(),
      contactPoint: { '@type': 'ContactPoint', telephone: b.telephone, contactType: 'sales', url: SITE + 'contact' },
      alternateName: b.alternateName, sameAs: b.sameAs, founder: ref('#' + b.founder.id), knowsAbout: b.knowsAbout,
    },
    {
      '@type': 'WebSite', '@id': SITE + '#website', url: SITE, name: b.name, publisher: ref('#organization'),
      inLanguage: 'en-IN', alternateName: b.alternateName,
    },
  ];
  const after = [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'], '@id': SITE + '#chandigarh-office', name: b.name,
      alternateName: b.alternateName, url: SITE, parentOrganization: ref('#organization'), address: postalAddress(),
      telephone: b.telephone, email: b.email, areaServed: cities(), image: ref('#logo'), logo: ref('#logo'),
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Won Ads digital marketing services',
        itemListElement: catalog.map(([name, url]) => ({
          '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: SITE + url, provider: ref('#organization') },
        })),
      },
    },
    {
      '@type': 'ImageObject', '@id': SITE + '#logo', url: SITE + b.logo, contentUrl: SITE + b.logo,
      width: 512, height: 512, caption: 'Won Ads logo',
    },
    {
      '@type': 'Person', '@id': SITE + '#' + b.founder.id, name: b.founder.name, jobTitle: b.founder.jobTitle,
      image: SITE + b.founder.image, url: SITE + b.founder.url, worksFor: ref('#organization'),
    },
  ];
  return { before, after };
}

/** Standard WebPage + BreadcrumbList nodes. crumbs: [[name, path], ...] starting after "Home". */
export function pageNodes({ path, title, description, type = 'WebPage', crumbs, mainEntity }) {
  const url = SITE + path;
  return [
    {
      '@type': type, '@id': url + '#webpage', url, name: title, description,
      isPartOf: ref('#website'), about: ref('#organization'), inLanguage: 'en-IN',
      breadcrumb: { '@id': url + '#breadcrumb' }, mainEntity,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [['Home', ''], ...crumbs].map(([name, p], i) => ({
        '@type': 'ListItem', position: i + 1, name, item: SITE + p,
      })),
      '@id': url + '#breadcrumb',
    },
  ];
}
