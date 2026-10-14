const sharedNavigation = document.createElement('script'); sharedNavigation.src = 'navigation.js?v=20260912-schema11'; document.head.appendChild(sharedNavigation);
const allServices = window.WON_SERVICES;
const categoryId = document.body.dataset.category;
const service = allServices.find(entry => entry.id === categoryId) || allServices[0];
const root = document.querySelector('#categoryRoot');
const cursor = document.querySelector('.cursor');
const slugify = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

if (!root.dataset.prerendered) document.title = `${service.title} — Services & Pricing | Won Ads`;
document.documentElement.style.setProperty('--category-accent', service.accent);

const packageCard = pkg => `<article class="price-card${pkg.featured ? ' featured' : ''}">
  ${pkg.featured ? '<span class="popular">MOST POPULAR</span>' : ''}<h3>${pkg.name}</h3><p>${pkg.note}</p>
  <div class="price"><strong>${pkg.price}</strong><span>${pkg.suffix}</span></div>
  <ul>${pkg.includes.map(item => `<li><b>✓</b>${item}</li>`).join('')}</ul>
  <a href="contact?type=vip&service=${encodeURIComponent(service.title)}&plan=${encodeURIComponent(pkg.name)}">Choose ${pkg.name}<b>↗</b></a></article>`;

if (!root.dataset.prerendered) root.innerHTML = `
  <section class="category-hero">
    <p class="category-crumb"><a href="services">Services</a> &nbsp;/&nbsp; ${service.number} &nbsp;/&nbsp; ${service.title}</p>
    <h1>${service.title}<span>made to win.</span></h1>
    <div class="category-hero-foot"><p>${service.short} We combine sharp strategy, specialist execution and transparent reporting so every moving part works toward the same commercial goal.</p><div class="category-start"><small>PACKAGES FROM</small><strong>${service.packages[0].price}</strong><span>${service.packages[0].suffix}</span></div></div>
  </section>
  <section class="category-body">
    <div class="category-intro"><span class="eyebrow">${service.number} / The complete offer</span><h2>Choose your<br /><em>growth level.</em></h2><p>Packages bring multiple deliverables together at a lower combined price. Pick an individual service below when you need one precise intervention.</p></div>
    <div id="packages" class="package-label"><span class="eyebrow">Complete packages</span><p>${service.billing}</p></div>
    <div class="package-grid">${service.packages.map(packageCard).join('')}</div>
    <div class="deliverable-section"><div class="deliverable-head"><h2>Every specialist<br />service.</h2><p>Each service below has its own detailed page, scope and standalone starting price.</p></div>
      <div class="category-items">${service.items.map((item,index)=>`<article class="category-item"><span>${String(index+1).padStart(2,'0')} / ${service.number}</span><h3>${item[0]}</h3><p>A focused ${item[0].toLowerCase()} engagement planned around your business, audience and measurable growth objective.</p><footer><div><small>Starting at</small><strong>${item[1]}</strong></div><a href="service-${service.id}-${slugify(item[0])}" aria-label="Explore ${item[0]}">↗</a></footer></article>`).join('')}</div>
    </div>
  </section>
  <section class="category-process"><span class="eyebrow">How we deliver</span><h2>Clarity at<br />every step.</h2><div>
    <article><span>01</span><h3>Diagnose</h3><p>We audit the current position, audience and commercial target.</p></article><article><span>02</span><h3>Design</h3><p>We build a focused strategy, scope and measurable success plan.</p></article><article><span>03</span><h3>Deliver</h3><p>Specialists execute the work with senior creative and strategic oversight.</p></article><article><span>04</span><h3>Improve</h3><p>Performance becomes the brief for every next iteration.</p></article>
  </div></section>
  <section class="category-cta" id="category-contact"><span class="eyebrow">Ready when you are</span><h2>Make ${service.title}<br /><span>your advantage.</span></h2><a href="contact?type=vip&service=${encodeURIComponent(service.title)}">Get a proposal <b>↗</b></a></section>`;

document.querySelector('.nav-cta').href = `contact?type=vip&service=${encodeURIComponent(service.title)}`;

window.addEventListener('pointermove', e => {cursor.classList.add('ready');cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`});
document.addEventListener('pointerover',e=>{if(e.target.closest('a,.price-card'))cursor.classList.add('active')});
document.addEventListener('pointerout',e=>{if(e.target.closest('a,.price-card'))cursor.classList.remove('active')});
window.addEventListener('scroll',()=>document.querySelector('.nav-wrap').classList.toggle('scrolled',scrollY>24),{passive:true});
