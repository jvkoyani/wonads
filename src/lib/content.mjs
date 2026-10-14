// Loads all website content: service categories/prices, service pages, guides and other pages.
import matter from 'gray-matter';
import { marked } from 'marked';
import servicesDataSource from '../data/services-data.js?raw';

export const slugify = value =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Service categories, packages and prices from src/data/services-data.js. */
export const categories = (() => {
  const window = {};
  new Function('window', servicesDataSource)(window);
  return window.WON_SERVICES;
})();

const serviceFiles = import.meta.glob('../content/services/*/*.md', { query: '?raw', import: 'default', eager: true });
const guideFiles = import.meta.glob('../content/guides/*.md', { query: '?raw', import: 'default', eager: true });
const pageMeta = import.meta.glob('../content/pages/*.json', { import: 'default', eager: true });
const pageHtml = import.meta.glob('../content/pages/*.html', { query: '?raw', import: 'default', eager: true });

const fileName = path => path.split('/').pop().replace(/\.[a-z]+$/, '');

/** Every service page: one per item in services-data.js, with text from src/content/services/<category>/<item>.md. */
export function getServices() {
  return categories.flatMap(category => category.items.map(([name, price]) => {
    const item = slugify(name);
    const source = serviceFiles[`../content/services/${category.id}/${item}.md`];
    if (!source) throw new Error(`Missing src/content/services/${category.id}/${item}.md for "${name}"`);
    // {price} in the text is replaced with the current price from services-data.js.
    const fill = text => text.split('{price}').join(price);
    const { data: raw, content } = matter(source);
    const data = JSON.parse(JSON.stringify(raw), (key, value) => typeof value === 'string' ? fill(value) : value);
    return { slug: `service-${category.id}-${item}`, category, item, name, price, data, body: fill(content.trim()) };
  }));
}

/** Every guide: src/content/guides/<name>.md becomes /guide-<name>. */
export function getGuides() {
  return Object.entries(guideFiles).map(([path, source]) => {
    const { data, content } = matter(source);
    return { slug: `guide-${fileName(path)}`, data, body: content.trim() };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Other pages: src/content/pages/<name>.json (SEO details) + <name>.html (page body). */
export function getPages() {
  return Object.entries(pageMeta).map(([path, raw]) => {
    const name = fileName(path);
    // {packagesFrom} on a category page = its first package price, e.g. "₹25,000/mo".
    const first = categories.find(c => c.id === name)?.packages[0];
    const meta = first ? JSON.parse(JSON.stringify(raw).split('{packagesFrom}').join(first.price + first.suffix)) : raw;
    return { slug: name, meta, html: pageHtml[`../content/pages/${name}.html`] };
  });
}

const servicePrice = new Map(getServices().map(s => [s.slug, s.price]));
const findPackage = (categoryTitle, name) =>
  categories.find(c => c.title === categoryTitle)?.packages.find(p => p.name === name);

/**
 * Keeps prices on the home, services and category pages in sync with services-data.js,
 * because those pages are stored as HTML (src/content/pages). Updated automatically:
 *  - service cards: an <article> (or a home-page "service-option") linking to one service-... page
 *  - package cards: an <article> whose button links to contact?...service=<category>&plan=<package>
 *  - "Packages from" on the home page and "PACKAGES FROM" / "Packages start at" on category pages
 */
export function syncPrices(html, pageName) {
  const servicePriceIn = (block, pattern) => {
    const links = new Set([...block.matchAll(/(?:href|data-href)="(service-[a-z0-9-]+)"/g)].map(m => m[1]));
    const price = links.size === 1 && servicePrice.get([...links][0]);
    return price ? block.replace(pattern, `$1${price}$2`) : block;
  };
  const startingAt = /(Starting at(?:<\/small>|<\/p>)\s*<strong>)[^<]*(<\/strong>)/;
  let out = html
    // cards: articles never nest, so each match is one card
    .replace(/<article\b[\s\S]*?<\/article>/g, block => {
      const plan = block.match(/service=([^&"#]+)&(?:amp;)?plan=([^&"#]+)/);
      const pkg = plan && findPackage(decodeURIComponent(plan[1]), decodeURIComponent(plan[2]));
      if (!pkg) return servicePriceIn(block, startingAt);
      return block
        .replace(/(<p class="service-plan__price">)[^<]*(<small>)[^<]*(<\/small>)/, `$1${pkg.price}$2${pkg.suffix}$3`)
        .replace(/(<div class="price"><strong>)[^<]*(<\/strong><span>)[^<]*(<\/span>)/, `$1${pkg.price}$2${pkg.suffix}$3`);
    })
    // home page: one service per <details class="service-option">
    .replace(/<details class="service-option"[\s\S]*?<\/details>/g, block => servicePriceIn(block, startingAt))
    // home page: "Packages from" in each category heading
    .replace(/(<details class="service-offer" data-href="([a-z-]+)"[^>]*>\s*<summary[\s\S]*?<small>Packages from<\/small><strong>)[^<]*(<small>)[^<]*(<\/small>)/g,
      (all, before, id, small, end) => {
        const first = categories.find(c => c.id === id)?.packages[0];
        return first ? `${before}${first.price}${small}${first.suffix}${end}` : all;
      });
  const category = categories.find(c => c.id === pageName);
  if (category) {
    const first = category.packages[0];
    out = out
      .replace(/(<small>PACKAGES FROM<\/small><strong>)[^<]*(<\/strong><span>)[^<]*(<\/span>)/, `$1${first.price}$2${first.suffix}$3`)
      .replace(/Packages start at ₹[0-9,]+(?:\/[a-z]+)?/g, `Packages start at ${first.price}${first.suffix}`);
  }
  return out;
}

/** Markdown to HTML. */
export const markdown = text => marked.parse(text, { gfm: true });
