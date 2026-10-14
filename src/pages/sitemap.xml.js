// Generates /sitemap.xml from every page, using each page's "updated" date as <lastmod>.
import { SITE } from '../data/site.mjs';
import { getServices, getGuides, getPages } from '../lib/content.mjs';

export function GET() {
  const pages = getPages();
  const first = ['index', 'services', 'contact'];
  const entries = [
    ...first.map(slug => pages.find(p => p.slug === slug)).map(p => [p.meta.path, p.meta.updated]),
    ...[
      ...pages.filter(p => !first.includes(p.slug)).map(p => [p.slug, p.meta.updated]),
      ...getServices().map(s => [s.slug, s.data.updated]),
      ...getGuides().map(g => [g.slug, g.data.updated]),
    ].sort((a, b) => a[0].localeCompare(b[0])),
  ];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.map(([path, date]) => `  <url><loc>${SITE}${path}</loc><lastmod>${date}</lastmod></url>\n`).join('')
    + '</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
