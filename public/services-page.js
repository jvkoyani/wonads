const sharedNavigation = document.createElement('script'); sharedNavigation.src = 'navigation.js?v=20260912-schema11'; document.head.appendChild(sharedNavigation);
const services = window.WON_SERVICES;
const tabs = document.querySelector('#serviceTabs');
const detail = document.querySelector('#serviceDetail');
const nav = document.querySelector('.nav-wrap');
const cursor = document.querySelector('.cursor');

const categoryPages = {
  'paid-advertising':'paid-advertising','social-media':'social-media','seo':'seo',
  'websites':'websites','creative':'creative','funnels':'funnels',
  'email-whatsapp':'email-whatsapp','branding':'branding','analytics':'analytics','automation':'automation'
};

const slugify = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

tabs.innerHTML = services.map((service, index) => `
  <a class="service-tab${index === 0 ? ' active' : ''}" href="#${service.id}" data-service="${service.id}">
    <span>${service.number}</span><strong>${service.title}</strong><b>↓</b>
  </a>`).join('');

function packageCard(service, pkg) {
  return `<article class="price-card${pkg.featured ? ' featured' : ''}">
    ${pkg.featured ? '<span class="popular">MOST POPULAR</span>' : ''}
    <h3>${pkg.name}</h3><p>${pkg.note}</p>
    <div class="price"><strong>${pkg.price}</strong><span>${pkg.suffix}</span></div>
    <ul>${pkg.includes.map(item => `<li><b>✓</b>${item}</li>`).join('')}</ul>
    <a href="contact?type=vip&service=${encodeURIComponent(service.title)}&plan=${encodeURIComponent(pkg.name)}">Choose ${pkg.name} <b>↗</b></a>
  </article>`;
}

function serviceChapter(service) {
  return `<section class="service-chapter" id="${service.id}" style="--chapter-accent:${service.accent}">
    <div class="detail-head">
      <div><span>${service.number}</span><p class="eyebrow">${service.billing}</p></div>
      <h2>${service.title}</h2>
      <p>${service.short}</p>
    </div>
    <a class="category-deep-link" href="${categoryPages[service.id]}">Explore ${service.title} in depth <b>↗</b></a>
    <div class="package-label"><span class="eyebrow">Complete packages</span><p>Best value · Strategy + execution bundled together</p></div>
    <div class="package-grid">${service.packages.map(pkg => packageCard(service,pkg)).join('')}</div>
    <div class="package-label"><span class="eyebrow">Individual services</span><p>Click any service for its complete detail page</p></div>
    <div class="item-price-grid">
      ${service.items.map((item, index) => `<article><span>${String(index + 1).padStart(2,'0')}</span><h3>${item[0]}</h3><p>Starting at</p><strong>${item[1]}</strong><a href="service-${service.id}-${slugify(item[0])}" aria-label="View ${item[0]} details">↗</a></article>`).join('')}
    </div>
  </section>`;
}

if (!detail.dataset.prerendered) detail.innerHTML = services.map(serviceChapter).join('');

const chapters = [...document.querySelectorAll('.service-chapter')];
const chapterObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
  if (!visible) return;
  const id = visible.target.id;
  const service = services.find(item => item.id === id);
  document.documentElement.style.setProperty('--service-accent', service.accent);
  tabs.querySelectorAll('.service-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.service === id));
}, {rootMargin:'-18% 0px -65% 0px', threshold:[0,.2,.5]});
chapters.forEach(chapter => chapterObserver.observe(chapter));

tabs.addEventListener('click', event => {
  const link = event.target.closest('.service-tab');
  if (!link) return;
  event.preventDefault();
  document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth',block:'start'});
});

window.addEventListener('pointermove', event => { cursor.classList.add('ready'); cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; });
document.addEventListener('pointerover', event => { if (event.target.closest('a, button, .price-card')) cursor.classList.add('active'); });
document.addEventListener('pointerout', event => { if (event.target.closest('a, button, .price-card')) cursor.classList.remove('active'); });
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), {passive:true});

if (location.hash && document.querySelector(location.hash)) {
  setTimeout(() => document.querySelector(location.hash).scrollIntoView({block:'start'}), 120);
}
