// Generates /llms.txt (a summary of the business for AI assistants) from the site's data.
import { SITE, business } from '../data/site.mjs';
import { categories, getServices, getGuides } from '../lib/content.mjs';

export function GET() {
  const b = business;
  const a = b.address;
  const services = getServices();
  const lines = [
    `# ${b.name}`, '',
    `> ${b.name} (${b.alternateName}) is a digital marketing agency in Chandigarh, India, founded by ${b.founder.name}. `
      + `It serves businesses in ${b.areaServed.join(', ').replace(/, ([^,]*)$/, ' and $1')}, and clients across India and international markets, `
      + 'with SEO, Google and Meta advertising, websites, social media, creative, lead-generation funnels, email and WhatsApp marketing, branding, analytics and marketing automation.', '',
    '## Key facts', '',
    `- Founder: ${b.founder.name}`,
    `- Experience: ${b.experience}`,
    `- Office: ${a.streetAddress}, ${a.addressLocality} ${a.postalCode}, India (visits by appointment)`,
    `- Phone / WhatsApp: ${b.phoneDisplay}`,
    `- Email: ${b.email}`,
    `- Service areas: ${b.areaServed.join(', ')}`,
    `- Credentials: ${b.credentials.join(', ')}`,
    '- Pricing: published starting prices per service (below); proposals confirm final scope and fee before work begins; advertising media spend is paid separately to the ad platform',
    `- Core team leads: ${b.team.join(', ')}`,
    ...b.sameAs.map(url => `- Profile: ${url}`), '',
    '## Primary pages', '',
    `- [Home](${SITE}): Agency overview, services, team, credentials and FAQs`,
    `- [About](${SITE}about): Founder, core team, credentials and how we work`,
    `- [Services](${SITE}services): Complete service directory`,
    `- [Pricing](${SITE}pricing): Starting prices and how project scope is agreed`,
    `- [Service areas](${SITE}locations): Chandigarh, Mohali, Panchkula and Derabassi coverage`,
    `- [Industries](${SITE}industries): Marketing for local services, B2B and ecommerce businesses`,
    `- [Contact](${SITE}contact): Enquiry form, phone, WhatsApp and office address`, '',
  ];
  for (const category of categories) {
    lines.push(`## ${category.title}`, '', `- [${category.title} overview](${SITE}${category.id}): ${category.short} Billing: ${category.billing}.`);
    for (const s of services.filter(x => x.category.id === category.id)) {
      lines.push(`- [${s.name}](${SITE}${s.slug}): from ${s.price}. ${s.data.intro}`);
    }
    lines.push('');
  }
  lines.push('## Guides', '', `- [All marketing guides](${SITE}resources)`);
  for (const g of getGuides()) lines.push(`- [${g.data.heading}](${SITE}${g.slug}): ${g.data.description}`);
  lines.push('', '## Policies', '', `- [Editorial standards](${SITE}editorial-standards)`,
    `- [Privacy notice](${SITE}privacy-policy)`, `- [Terms](${SITE}terms)`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
