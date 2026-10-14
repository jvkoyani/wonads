/* Keep the shared header lockup consistent on category and detail pages too. */
(() => {
  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  if (!schemaScript) return;
  let data;
  try { data = JSON.parse(schemaScript.textContent); } catch { return; }
  const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
  const find = type => graph.find(node => {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    return types.includes(type);
  });
  const upsert = node => {
    const index = graph.findIndex(item => item['@id'] && item['@id'] === node['@id']);
    if (index >= 0) graph[index] = {...graph[index], ...node};
    else graph.push(node);
  };

  const organization = find('Organization');
  if (organization) {
    Object.assign(organization, {
      name: 'Won Ads',
      alternateName: 'Won Ads Ai Digital Marketing Agency',
      founder: {'@id':'https://wonads.com/#suraj-jaiswal'},
      knowsAbout: ['Digital marketing','Search engine optimization','Paid advertising','Social media marketing','Website development','Lead generation','Branding','Conversion rate optimization','Marketing automation','Customer relationship management']
    });
  }

  const website = find('WebSite');
  if (website) website.alternateName = 'Won Ads Ai Digital Marketing Agency';

  const localBusiness = find('LocalBusiness') || find('ProfessionalService');
  if (localBusiness) {
    Object.assign(localBusiness, {
      '@type': ['LocalBusiness','ProfessionalService'],
      name: 'Won Ads',
      alternateName: 'Won Ads Ai Digital Marketing Agency',
      url: 'https://wonads.com/',
      logo: {'@id':'https://wonads.com/#logo'},
      image: {'@id':'https://wonads.com/#logo'},
      parentOrganization: {'@id':'https://wonads.com/#organization'},
      hasOfferCatalog: {
        '@type':'OfferCatalog',
        'name':'Won Ads digital marketing services',
        'itemListElement': [
          ['Paid Advertising','paid-advertising'],['Social Media Marketing','social-media'],['Search Engine Optimization','seo'],['Websites and Landing Pages','websites'],['Content and Creative','creative'],['Lead Generation and Sales Funnels','funnels'],['Email and WhatsApp Marketing','email-whatsapp'],['Branding','branding'],['Analytics and Conversion Optimization','analytics'],['Marketing Automation and CRM','automation']
        ].map(([name,url]) => ({'@type':'Offer','itemOffered':{'@type':'Service','name':name,'url':`https://wonads.com/${url}`,'provider':{'@id':'https://wonads.com/#organization'}}}))
      }
    });
  }

  const logo = graph.find(node => node['@id'] === 'https://wonads.com/#logo');
  if (logo) Object.assign(logo, {width:512,height:512,caption:'Won Ads logo'});

  upsert({
    '@type':'Person',
    '@id':'https://wonads.com/#suraj-jaiswal',
    name:'Suraj Jaiswal',
    jobTitle:'Founder',
    worksFor:{'@id':'https://wonads.com/#organization'},
    url:'https://wonads.com/about#founder'
  });

  const page = find('AboutPage') || find('ContactPage') || find('CollectionPage') || find('WebPage');
  if (page?.['@type'] === 'AboutPage') page.mainEntity = {'@id':'https://wonads.com/#organization'};
  if (page?.['@type'] === 'ContactPage') page.mainEntity = {'@id':'https://wonads.com/#chandigarh-office'};

  const questions = [...document.querySelectorAll('.faq-list details')].map((detail,index) => {
    const question = detail.querySelector('summary,button')?.textContent.replace(/^\s*\d+\s*/, '').trim();
    const answer = detail.querySelector('p')?.textContent.trim();
    return question && answer ? {'@type':'Question','@id':`${location.origin}${location.pathname}#faq-${index+1}`,'name':question,'acceptedAnswer':{'@type':'Answer','text':answer}} : null;
  }).filter(Boolean);
  if (questions.length >= 2) {
    const canonical = document.querySelector('link[rel="canonical"]')?.href || `${location.origin}${location.pathname}`;
    upsert({'@type':'FAQPage','@id':`${canonical}#faq`,'url':canonical,'mainEntity':questions,'isPartOf':{'@id':'https://wonads.com/#website'}});
  }

  data = {'@context':'https://schema.org','@graph':graph};
  schemaScript.textContent = JSON.stringify(data);
})();

document.querySelectorAll('.nav-wrap .brand').forEach(brand => {
  const label = brand.querySelector(':scope > span:last-child');
  if (!label || label.classList.contains('brand-copy')) return;
  label.className = 'brand-copy';
  label.innerHTML = '<strong>Won Ads</strong><small>Ai Digital Marketing Agency</small>';
  brand.classList.remove('magnetic');
});

/* Keep the footer brand lockup identical on every page, including legacy pages. */
document.querySelectorAll('.won-footer__logo').forEach(brand => {
  brand.setAttribute('aria-label', 'Won Ads home');
  brand.innerHTML = '<span class="won-footer__mark"><img src="assets/brand/logo-192.png" alt="" width="48" height="48" decoding="async"></span><span class="brand-copy"><strong>Won Ads</strong><small>Ai Digital Marketing Agency</small></span>';
});

document.querySelectorAll('.seo-wordmark').forEach(brand => {
  brand.setAttribute('aria-label', 'Won Ads home');
  brand.innerHTML = '<span class="brand-mark"><img src="assets/brand/logo-192.png" alt="" width="48" height="48" decoding="async"></span><span class="brand-copy"><strong>Won Ads</strong><small>Ai Digital Marketing Agency</small></span>';
});

(() => {
  if (document.querySelector('.services-nav')) return;
  const trigger = document.querySelector('.services-trigger');
  if (!trigger) return;

  const groups = [
    ['paid-advertising','Paid Advertising',[['Meta Ads','meta-ads-facebook-instagram'],['Google Search','google-search-ads'],['YouTube Ads','youtube-ads']]],
    ['social-media','Social Media',[['Instagram','instagram-management'],['Content Calendar','content-calendar'],['Community','community-management']]],
    ['seo','SEO',[['Technical SEO','technical-seo'],['Local SEO','local-seo'],['SEO Audit','seo-audits']]],
    ['websites','Websites & Landing Pages',[['Business','business-website'],['E-commerce','e-commerce-website'],['Landing Pages','landing-pages']]],
    ['creative','Content & Creative',[['Design','graphic-design'],['Reels','reels'],['Video','video-editing']]],
    ['funnels','Lead Gen & Funnels',[['Funnels','funnel-creation'],['CRM Setup','crm-setup'],['Booking','appointment-booking']]],
    ['email-whatsapp','Email & WhatsApp',[['Email','email-campaigns'],['WhatsApp Bot','whatsapp-chatbot-automation'],['Follow-ups','follow-up-sequences']]],
    ['branding','Branding',[['Logo','logo-design'],['Identity','brand-identity'],['Positioning','positioning']]],
    ['analytics','Analytics & CRO',[['Analytics','google-analytics'],['Tracking','conversion-tracking'],['A/B Tests','a-b-testing']]],
    ['automation','Automation & CRM',[['CRM','crm-implementation'],['Lead Automation','lead-automation'],['AI Chatbot','ai-chatbot-integrations']]]
  ];

  const wrapper = document.createElement('div');
  wrapper.className = 'services-nav';
  trigger.parentNode.insertBefore(wrapper, trigger);
  wrapper.appendChild(trigger);
  trigger.href = 'services';
  trigger.innerHTML = 'Services <span>＋</span>';

  const menu = document.createElement('div');
  menu.className = 'mega-menu';
  menu.innerHTML = `<div class="mega-intro"><span class="eyebrow">Everything we do</span><h2>Services built<br />to <em>perform.</em></h2><p>Choose a complete growth system or start with one focused service.</p><a href="services" class="mega-all">Explore all services <b>↗</b></a></div><div class="mega-grid">${groups.map((group,index)=>`<div class="mega-service"><a href="${group[0]}"><b>${String(index+1).padStart(2,'0')}</b><strong>${group[1]}</strong><i>↗</i></a><div>${group[2].map(item=>`<a href="service-${group[0]}-${item[1]}">${item[0]}</a>`).join('')}</div></div>`).join('')}</div>`;
  wrapper.appendChild(menu);

  let closeTimer;
  const open = () => { clearTimeout(closeTimer); wrapper.classList.add('menu-open'); };
  const close = () => { closeTimer = setTimeout(() => wrapper.classList.remove('menu-open'), 420); };
  wrapper.addEventListener('pointerenter', open);
  wrapper.addEventListener('pointerleave', close);
  wrapper.addEventListener('focusin', open);
  wrapper.addEventListener('focusout', close);
})();

/* Desktop mega-menu preview: every service tells its own story on hover/focus. */
(() => {
  if (window.__wonAdsMegaPreview) return;
  window.__wonAdsMegaPreview = true;

  const menu = document.querySelector('.mega-menu');
  if (!menu) return;

  const intro = menu.querySelector('.mega-intro');
  const cards = [...menu.querySelectorAll('.mega-service')];
  if (!intro || !cards.length) return;

  const eyebrow = intro.querySelector('.eyebrow');
  const heading = intro.querySelector('h2');
  const description = intro.querySelector(':scope > p');
  const cta = intro.querySelector('.mega-all');
  const previews = [
    { eyebrow:'01 / PERFORMANCE MARKETING', heading:'Turn clicks<br />into <em>revenue.</em>', description:'Focused paid campaigns built to generate qualified leads, sales and measurable return—not empty reach.', cta:'Explore Paid Advertising', href:'paid-advertising', accent:'#ff583c' },
    { eyebrow:'02 / SOCIAL MEDIA MARKETING', heading:'Stay relevant.<br /><em>Stay remembered.</em>', description:'Strategy, content and community management that keep your brand active, human and culturally visible.', cta:'Explore Social Media', href:'social-media', accent:'#d9ff3f' },
    { eyebrow:'03 / SEARCH ENGINE OPTIMIZATION', heading:'Be found.<br /><em>Stay chosen.</em>', description:'Technical clarity, useful content and search authority that bring high-intent customers to you over time.', cta:'Explore SEO', href:'seo', accent:'#78a8ff' },
    { eyebrow:'04 / DIGITAL EXPERIENCES', heading:'Pages built<br />to <em>convert.</em>', description:'Fast, persuasive websites and landing pages designed around one clear customer action.', cta:'Explore Websites', href:'websites', accent:'#dc8cff' },
    { eyebrow:'05 / CONTENT & CREATIVE', heading:'Ideas people<br /><em>remember.</em>', description:'Distinctive design, motion, video and copy that stop attention and make the message stick.', cta:'Explore Creative', href:'creative', accent:'#ff9b42' },
    { eyebrow:'06 / LEAD GENERATION & FUNNELS', heading:'Turn interest<br />into <em>action.</em>', description:'Connected journeys that capture, qualify and move better prospects toward a real sales conversation.', cta:'Explore Funnels', href:'funnels', accent:'#34d6a0' },
    { eyebrow:'07 / RETENTION MARKETING', heading:'Follow up.<br /><em>Sell more.</em>', description:'Timely email and WhatsApp journeys that nurture prospects, recover opportunities and reactivate customers.', cta:'Explore Email & WhatsApp', href:'email-whatsapp', accent:'#ffd84a' },
    { eyebrow:'08 / BRAND STRATEGY & IDENTITY', heading:'Become impossible<br />to <em>confuse.</em>', description:'A distinctive identity, position and voice that makes your business recognizable before the logo appears.', cta:'Explore Branding', href:'branding', accent:'#ff7eb6' },
    { eyebrow:'09 / MEASUREMENT & CRO', heading:'Measure. Learn.<br /><em>Improve.</em>', description:'Clean tracking and focused experiments that reveal what works and remove conversion guesswork.', cta:'Explore Analytics & CRO', href:'analytics', accent:'#8c9eff' },
    { eyebrow:'10 / AUTOMATION & CRM', heading:'Less repetition.<br /><em>More growth.</em>', description:'Connected CRM, follow-up and AI systems that help marketing and sales move faster together.', cta:'Explore Automation & CRM', href:'automation', accent:'#63e6ff' }
  ];
  const fallback = {
    eyebrow:'Everything we do',
    heading:'Services built<br />to <em>perform.</em>',
    description:'Choose a complete growth system or start with one focused service.',
    cta:'Explore all services',
    href:'services',
    accent:'#d9ff3f'
  };

  let swapTimer;
  const showPreview = (preview, activeCard = null, immediate = false) => {
    clearTimeout(swapTimer);
    cards.forEach(card => card.classList.toggle('is-previewing', card === activeCard));
    menu.style.setProperty('--menu-accent', preview.accent);
    if (!immediate) intro.classList.add('is-switching');
    const update = () => {
      eyebrow.textContent = preview.eyebrow;
      heading.innerHTML = preview.heading;
      description.textContent = preview.description;
      cta.innerHTML = `${preview.cta} <b>↗</b>`;
      cta.href = preview.href;
      intro.classList.remove('is-switching');
    };
    if (immediate) update();
    else swapTimer = setTimeout(update, 115);
  };

  cards.forEach((card, index) => {
    const activate = () => showPreview(previews[index], card);
    card.addEventListener('pointerenter', activate);
    card.addEventListener('focusin', activate);
  });
  menu.addEventListener('pointerleave', () => showPreview(fallback));
  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) showPreview(fallback);
  });
  showPreview(fallback, null, true);
})();

/* Always-on live offer rail above the main navigation. */
(() => {
  if (window.__wonAdsOfferRail) return;
  // Timed promotions require an actual approved deadline before publication.
  if (!window.WON_ADS_TIMED_OFFERS_ENABLED) return;
  window.__wonAdsOfferRail = true;

  const nav = document.querySelector('.nav-wrap');
  if (!nav) return;

  const offers = [
    ['Paid Advertising','META ADS','10% OFF','campaign setup','Paid Advertising'],
    ['Paid Advertising','GOOGLE SEARCH','17% OFF','first campaign management','Paid Advertising'],
    ['Social Media','SOCIAL MEDIA','5 BONUS','story creatives this month','Social Media Marketing'],
    ['SEO','SEO GROWTH','FREE AUDIT','with a 3-month SEO plan','SEO'],
    ['Websites','LANDING PAGE','FREE CRO REVIEW','before your build starts','Website / Landing Page'],
    ['Content & Creative','VIDEO EDITING','BUY 1 · GET 1 FREE','on today’s video slot','Branding / Creatives'],
    ['Lead Gen & Funnels','LEAD FUNNEL','FREE LEAD FORM','with funnel setup','Lead Generation'],
    ['Email & WhatsApp','WHATSAPP AUTOMATION','FIRST FLOW FREE','with a nurture package','Complete Digital Marketing'],
    ['Branding','BRAND STARTER','20% OFF','identity launch package','Branding / Creatives'],
    ['Automation & CRM','CRM AUTOMATION','FREE PIPELINE SETUP','with CRM implementation','Complete Digital Marketing']
  ];
  const dateLabel = new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short'}).format(new Date()).toUpperCase();
  const items = offers.map(([group,title,value,detail,service]) => {
    const href = `contact?type=vip&service=${encodeURIComponent(service)}&offer=${encodeURIComponent(`${title} — ${value}`)}`;
    return `<a class="offer-rail__item" href="${href}" aria-label="${title}: ${value}, ${detail}"><small>${group}</small><b>${title}</b><strong>${value}</strong><span>${detail}</span><i>↗</i></a>`;
  }).join('');

  const rail = document.createElement('aside');
  rail.className = 'offer-rail';
  rail.setAttribute('aria-label','Today’s live service offers');
  rail.innerHTML = `<div class="offer-rail__label"><i></i><span>LIVE OFFERS</span><b>${dateLabel}</b><time class="offer-rail__countdown" aria-label="Today’s offers end at midnight"><small>ENDS IN</small><strong data-offer-countdown>--:--:--</strong></time></div><div class="offer-rail__viewport"><div class="offer-rail__track"><div class="offer-rail__set">${items}</div><div class="offer-rail__set" aria-hidden="true">${items}</div></div></div><span class="offer-rail__terms">LIMITED SLOTS · T&amp;C APPLY</span>`;
  nav.insertAdjacentElement('beforebegin',rail);

  const countdown = rail.querySelector('[data-offer-countdown]');
  const pad = value => String(value).padStart(2,'0');
  let midnight = new Date();
  let restartTimer = 0;
  midnight.setHours(24,0,0,0);

  const renderCountdown = () => {
    const remaining = Math.max(0,midnight.getTime() - Date.now());
    const totalSeconds = remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdown.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    countdown.setAttribute('datetime',`PT${hours}H${minutes}M${seconds}S`);

    /* Hold 00:00:00 for one full second, then begin the next day's cycle. */
    if (remaining === 0 && !restartTimer) {
      countdown.classList.add('is-zero');
      restartTimer = window.setTimeout(() => {
        midnight = new Date();
        midnight.setHours(24,0,0,0);
        countdown.classList.remove('is-zero');
        restartTimer = 0;
        renderCountdown();
      },1000);
    }
  };

  renderCountdown();
  window.setInterval(renderCountdown,250);
})();

/* Mobile hierarchy: primary navigation → secondary service groups → tertiary services. */
(() => {
  if (window.__wonAdsMobileMenu) return;
  window.__wonAdsMobileMenu = true;
  const nav = document.querySelector('.nav-wrap');
  const navCta = nav && nav.querySelector('.nav-cta');
  if (!nav || !navCta) return;

  const toggle = document.createElement('button');
  toggle.className = 'mobile-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label','Open complete menu');
  toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML = '<span>Menu</span><i><b></b><b></b></i>';
  nav.insertBefore(toggle, navCta);

  const drawer = document.createElement('div');
  drawer.className = 'mobile-drawer';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `<div class="mobile-drawer__backdrop" data-mobile-close></div><aside class="mobile-drawer__panel" aria-label="Complete website menu"><header><a class="brand" href="index"><span class="brand-mark"><img src="assets/brand/logo-192.png" alt="" width="48" height="48" decoding="async"></span><span class="brand-copy"><strong>Won Ads</strong><small>Ai Digital Marketing Agency</small></span></a><button type="button" data-mobile-close aria-label="Close menu">×</button></header><div class="mobile-drawer__primary"><small>PRIMARY MENU</small><div><strong>Services</strong><a href="index#about">About</a><a href="contact">Enquire</a></div></div><div class="mobile-drawer__service-head"><div><small>SECONDARY MENU</small><h2>Our services.</h2></div><span>Tap a category<br>for every service</span></div><div class="mobile-drawer__services"><p>Loading complete services…</p></div></aside>`;
  document.body.appendChild(drawer);

  const closeMenu = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open complete menu');
    document.body.classList.remove('mobile-menu-lock');
  };
  const openMenu = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close complete menu');
    document.body.classList.add('mobile-menu-lock');
  };
  toggle.addEventListener('click', () => drawer.classList.contains('is-open') ? closeMenu() : openMenu());
  drawer.querySelectorAll('[data-mobile-close]').forEach(button => button.addEventListener('click', closeMenu));
  drawer.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeMenu(); });

  const categoryPages = {'paid-advertising':'paid-advertising','social-media':'social-media','seo':'seo','websites':'websites','creative':'creative','funnels':'funnels','email-whatsapp':'email-whatsapp','branding':'branding','analytics':'analytics','automation':'automation'};
  const slugify = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const renderServices = services => {
    const container = drawer.querySelector('.mobile-drawer__services');
    container.innerHTML = services.map((service,index) => `<article class="mobile-service-group${index === 0 ? ' is-expanded' : ''}"><button type="button" aria-expanded="${index === 0}"><span>${service.number}</span><strong>${service.title}</strong><i>＋</i></button><div class="mobile-service-group__items"><a class="mobile-category-link" href="${categoryPages[service.id] || 'services#'+service.id}"><b>View ${service.title} packages</b><em>↗</em></a><small>TERTIARY MENU · INDIVIDUAL SERVICES</small>${service.items.map(item => `<a href="service-${service.id}-${slugify(item[0])}"><span>${item[0]}</span><b>${item[1]}</b></a>`).join('')}</div></article>`).join('');
    container.querySelectorAll('.mobile-service-group>button').forEach(button => button.addEventListener('click', () => {
      const group = button.parentElement;
      const willOpen = !group.classList.contains('is-expanded');
      container.querySelectorAll('.mobile-service-group').forEach(item => {
        item.classList.remove('is-expanded');
        item.querySelector(':scope>button').setAttribute('aria-expanded','false');
      });
      if (willOpen) {
        group.classList.add('is-expanded');
        button.setAttribute('aria-expanded','true');
        setTimeout(() => button.scrollIntoView({behavior:'smooth',block:'nearest'}), 220);
      }
    }));
  };

  if (window.WON_SERVICES) {
    renderServices(window.WON_SERVICES);
  } else {
    const dataScript = document.createElement('script');
    dataScript.src = 'services-data.js?v=20260908-seo1';
    dataScript.onload = () => renderServices(window.WON_SERVICES || []);
    dataScript.onerror = () => { drawer.querySelector('.mobile-drawer__services').innerHTML = '<a class="mobile-menu-fallback" href="services">Explore all services <b>↗</b></a>'; };
    document.head.appendChild(dataScript);
  }
})();

/* Fast service finder: searches every secondary category and tertiary service. */
(() => {
  if (window.__wonAdsServiceSearch) return;
  window.__wonAdsServiceSearch = true;
  const nav = document.querySelector('.nav-wrap');
  const navCta = nav && nav.querySelector('.nav-cta');
  if (!nav || !navCta) return;

  const trigger = document.createElement('button');
  trigger.className = 'service-search-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label','Search Won Ads services');
  trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML = '<i aria-hidden="true"></i><span>Search</span>';
  nav.insertBefore(trigger, navCta);

  const panel = document.createElement('div');
  panel.className = 'service-search-panel';
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `<div class="service-search-panel__backdrop" data-search-close></div><section class="service-search-panel__dialog" role="dialog" aria-modal="true" aria-labelledby="service-search-title"><header><div><small>SECONDARY + TERTIARY SERVICES</small><h2 id="service-search-title">Find exactly<br><em>what you need.</em></h2></div><button type="button" data-search-close aria-label="Close service search">×</button></header><label class="service-search-box"><i aria-hidden="true"></i><input type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="service-search-results" placeholder="Try Meta Ads, SEO, website, CRM…" autocomplete="off" spellcheck="false"><kbd>ESC</kbd></label><div class="service-search-meta" aria-live="polite"><span>Start typing to search every service.</span><b>90 individual services</b></div><div class="service-search-results" id="service-search-results" role="listbox"></div></section>`;
  document.body.appendChild(panel);

  const input = panel.querySelector('input');
  const results = panel.querySelector('.service-search-results');
  const metaText = panel.querySelector('.service-search-meta span');
  const metaCount = panel.querySelector('.service-search-meta b');
  let searchIndex = [];
  let activeIndex = -1;
  let lastFocused = null;

  const slugify = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const normalize = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
  const buildIndex = services => {
    searchIndex = services.flatMap(service => [
      {type:'Secondary',title:service.title,parent:'Complete packages and category overview',href:`${service.id}.html`,haystack:normalize(`${service.title} ${service.short || ''}`)},
      ...service.items.map(item => ({type:'Tertiary',title:item[0],parent:service.title,price:item[1],href:`service-${service.id}-${slugify(item[0])}.html`,haystack:normalize(`${item[0]} ${service.title}`)}))
    ]);
    renderResults('');
  };

  const rankedMatches = query => {
    const words = normalize(query).split(' ').filter(Boolean);
    if (!words.length) return searchIndex.filter(item => item.type === 'Secondary');
    return searchIndex.filter(item => words.every(word => item.haystack.includes(word))).sort((a,b) => {
      const aTitle = normalize(a.title), bTitle = normalize(b.title), joined = words.join(' ');
      const score = item => item === joined ? 0 : item.startsWith(joined) ? 1 : item.includes(joined) ? 2 : 3;
      return score(aTitle) - score(bTitle) || (a.type === 'Secondary' ? -1 : 1) || a.title.localeCompare(b.title);
    });
  };

  const setActive = nextIndex => {
    const options = [...results.querySelectorAll('a')];
    if (!options.length) { activeIndex = -1; input.removeAttribute('aria-activedescendant'); return; }
    activeIndex = (nextIndex + options.length) % options.length;
    options.forEach((option,index) => option.classList.toggle('is-active', index === activeIndex));
    const active = options[activeIndex];
    input.setAttribute('aria-activedescendant',active.id);
    active.scrollIntoView({block:'nearest'});
  };

  const renderResults = query => {
    const matches = rankedMatches(query);
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    if (!matches.length) {
      results.innerHTML = `<div class="service-search-empty"><strong>No exact service found.</strong><span>Try a simpler keyword, or explore the complete service catalogue.</span><a href="services">View all services <b>↗</b></a></div>`;
      metaText.textContent = `No matches for “${query}”`;
      metaCount.textContent = 'Try another keyword';
      return;
    }
    results.innerHTML = matches.map((item,index) => `<a id="service-search-option-${index}" role="option" href="${item.href}"><span class="service-search-result__type">${item.type}</span><span class="service-search-result__copy"><strong>${item.title}</strong><small>${item.parent}${item.price ? ` · Starting ${item.price}` : ''}</small></span><b>↗</b></a>`).join('');
    metaText.textContent = query ? `Results for “${query}”` : 'Browse all service categories.';
    metaCount.textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`;
  };

  const positionPanel = () => panel.style.setProperty('--search-top',`${Math.ceil(nav.getBoundingClientRect().bottom + 10)}px`);
  const openSearch = () => {
    lastFocused = document.activeElement;
    positionPanel();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    trigger.setAttribute('aria-expanded','true');
    input.setAttribute('aria-expanded','true');
    document.body.classList.add('service-search-lock');
    setTimeout(() => input.focus({preventScroll:true}),180);
  };
  const closeSearch = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
    trigger.setAttribute('aria-expanded','false');
    input.setAttribute('aria-expanded','false');
    document.body.classList.remove('service-search-lock');
    if (lastFocused && lastFocused.focus) lastFocused.focus({preventScroll:true});
  };

  trigger.addEventListener('click', () => panel.classList.contains('is-open') ? closeSearch() : openSearch());
  panel.querySelectorAll('[data-search-close]').forEach(button => button.addEventListener('click', closeSearch));
  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', event => {
    const options = [...results.querySelectorAll('a')];
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(activeIndex + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeIndex - 1); }
    if (event.key === 'Enter' && options.length) { event.preventDefault(); (options[activeIndex >= 0 ? activeIndex : 0]).click(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) closeSearch();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  });
  window.addEventListener('resize', positionPanel,{passive:true});
  window.addEventListener('scroll', () => { if (panel.classList.contains('is-open')) positionPanel(); },{passive:true});

  const initialize = () => buildIndex(Array.isArray(window.WON_SERVICES) ? window.WON_SERVICES : []);
  if (Array.isArray(window.WON_SERVICES)) {
    initialize();
  } else {
    const existingDataScript = [...document.scripts].find(script => script.src.includes('services-data.js'));
    if (existingDataScript) {
      existingDataScript.addEventListener('load',initialize,{once:true});
    } else {
      const dataScript = document.createElement('script');
      dataScript.src = 'services-data.js?v=20260908-seo1';
      dataScript.addEventListener('load',initialize,{once:true});
      document.head.appendChild(dataScript);
    }
  }
})();

/* One original, company-wide footer shared by every Won Ads page. */
(() => {
  if (window.__wonAdsFooter || document.querySelector('.won-footer')) return;
  window.__wonAdsFooter = true;
  const footer = document.createElement('footer');
  footer.className = 'won-footer';
  footer.setAttribute('aria-label','Won Ads website footer');
  footer.innerHTML = `
    <div class="won-footer__lead">
      <div><span>READY WHEN YOU ARE</span><h2>Bring the brief.<br><em>We’ll bring the win.</em></h2></div>
      <a href="contact?type=vip#vip-form"><span>Start a serious project</span><b>↗</b></a>
    </div>
    <div class="won-footer__grid">
      <section class="won-footer__brand" aria-label="About Won Ads">
        <a href="index" class="won-footer__logo" aria-label="Won Ads home"><span class="won-footer__mark"><img src="assets/brand/logo-192.png" alt="" width="48" height="48" decoding="async"></span><span class="brand-copy"><strong>Won Ads</strong><small>Ai Digital Marketing Agency</small></span></a>
        <p>Digital marketing agency in Chandigarh connecting <strong>search, advertising, websites and lead follow-up.</strong></p>
        <small>CHANDIGARH · MOHALI · PANCHKULA · DERABASSI</small>
        <address style="font-style:normal;font-size:13px;line-height:1.65;margin-top:14px">1495/1, Sector - 30B, Chandi Path, Sector 30, Chandigarh, 160030, India</address>
        <a class="won-footer__email" href="mailto:wonads.com@gmail.com">wonads.com@gmail.com <b>↗</b></a>
        <a href="tel:+919463806327">+91 94638 06327</a> · <a href="https://wa.me/919463806327" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </section>
      <nav class="won-footer__column" aria-label="Explore Won Ads">
        <span>EXPLORE</span>
        
        <a href="about">About Won Ads <b>↗</b></a>
        <a href="resources">Marketing guides <b>↗</b></a>
        <a href="locations">Service areas <b>↗</b></a>
        <a href="industries">Business needs <b>↗</b></a>
        <a href="pricing">Pricing &amp; scope <b>↗</b></a>
        <a href="services">All services <b>↗</b></a>
        <a href="contact">Project enquiry <b>↗</b></a>
      </nav>
      <nav class="won-footer__column" aria-label="Growth services">
        <span>GROWTH &amp; MEDIA</span>
        <a href="paid-advertising">Paid Advertising <b>01</b></a>
        <a href="social-media">Social Media <b>02</b></a>
        <a href="seo">SEO <b>03</b></a>
        <a href="websites">Websites &amp; Landing Pages <b>04</b></a>
        <a href="creative">Content &amp; Creative <b>05</b></a>
      </nav>
      <nav class="won-footer__column" aria-label="Systems and brand services">
        <span>SYSTEMS &amp; BRAND</span>
        <a href="funnels">Lead Gen &amp; Funnels <b>06</b></a>
        <a href="email-whatsapp">Email &amp; WhatsApp <b>07</b></a>
        <a href="branding">Branding <b>08</b></a>
        <a href="analytics">Analytics &amp; CRO <b>09</b></a>
        <a href="automation">Automation &amp; CRM <b>10</b></a>
      </nav>
    </div>
    <section class="won-footer__quick" aria-label="Popular individual services">
      <span>QUICK SERVICE LINKS</span>
      <div>
        <a href="service-paid-advertising-meta-ads-facebook-instagram">Meta Ads</a>
        <a href="service-paid-advertising-google-search-ads">Google Search Ads</a>
        <a href="service-seo-seo-audit">SEO Audit</a>
        <a href="service-websites-landing-pages">Landing Pages</a>
        <a href="service-creative-video-editing">Video Editing</a>
        <a href="service-funnels-crm-setup">CRM Setup</a>
      </div>
    </section>
    <div class="won-footer__note"><span></span><p>Prices shown across this website are starting estimates. Final scope, timelines, deliverables and media spend are confirmed in your project proposal.</p></div>
    <div class="won-footer__bottom">
      <p>© ${new Date().getFullYear()} WON ADS · ALL RIGHTS RESERVED</p>
      <p><a href="privacy-policy">Privacy</a> · <a href="terms">Terms</a> · <a href="editorial-standards">Content standards</a></p>
      <a href="#">Back to top <b>↑</b></a>
    </div>`;
  document.body.appendChild(footer);
})();

/* Shared, defensive delivery flow for every enquiry form on the site. */
window.WonAdsEnquiry = (() => {
  const endpoint = 'https://formsubmit.co/ajax/wonads.com@gmail.com';
  const timeoutMs = 15000;

  const cleanSubjectPart = value => String(value || 'New client')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 70) || 'New client';

  const validateContactFields = form => {
    const name = form.elements.namedItem('Full Name');
    const phone = form.elements.namedItem('Phone Number');
    const business = form.elements.namedItem('Business Name');
    [name, phone, business].forEach(field => field.setCustomValidity(''));

    if (name.value.trim().length < 2) name.setCustomValidity('Please enter your full name.');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^[+()\d\s.-]+$/.test(phone.value.trim())) {
      phone.setCustomValidity('Please enter a valid phone number with 7 to 15 digits.');
    }
    if (business.value.trim().length < 2) business.setCustomValidity('Please enter your business or company name.');
  };

  const parseProviderResponse = async response => {
    const result = await response.json().catch(() => null);
    const accepted = result && (result.success === true || String(result.success).toLowerCase() === 'true');
    if (!response.ok || !accepted) {
      const providerMessage = result && String(result.error || result.message || '');
      throw new Error(providerMessage || 'Unable to confirm email delivery');
    }
  };

  const bind = ({form, serviceSelector, subjectPrefix, successTarget, resetButton}) => {
    if (!form || form.dataset.enquiryReady === 'true') return;
    form.dataset.enquiryReady = 'true';
    const serviceBoxes = [...form.querySelectorAll(serviceSelector)];
    const serviceError = form.querySelector('[data-service-error]');
    const deliveryStatus = form.querySelector('[data-popup-delivery-status], [data-hero-delivery-status]');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('span');
    const originalLabel = buttonLabel.textContent;
    const successFocus = successTarget.querySelector('[data-success-focus]');

    const validateServices = () => {
      const hasSelection = serviceBoxes.some(box => box.checked);
      serviceBoxes[0].setCustomValidity(hasSelection ? '' : 'Please select at least one service.');
      serviceBoxes[0].closest('fieldset').setAttribute('aria-invalid', String(!hasSelection));
      serviceError.textContent = hasSelection ? '' : 'Select at least one service.';
      return hasSelection;
    };

    form.querySelectorAll('input[name="Full Name"], input[name="Phone Number"], input[name="Business Name"]').forEach(field => {
      field.addEventListener('input', () => {
        field.setCustomValidity('');
        if (deliveryStatus.classList.contains('is-error')) {
          deliveryStatus.textContent = '';
          deliveryStatus.classList.remove('is-error');
        }
      });
    });
    serviceBoxes.forEach(box => box.addEventListener('change', validateServices));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      validateContactFields(form);
      const servicesAreValid = validateServices();
      deliveryStatus.textContent = '';
      deliveryStatus.classList.remove('is-error');
      if (!form.reportValidity() || !servicesAreValid) {
        deliveryStatus.textContent = 'Please check the highlighted details before sending.';
        deliveryStatus.classList.add('is-error');
        if (!servicesAreValid) serviceBoxes[0].focus({preventScroll:true});
        return;
      }

      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
      form.setAttribute('aria-busy', 'true');
      buttonLabel.textContent = 'Sending securely…';
      deliveryStatus.textContent = 'Sending your enquiry…';

      const data = new FormData(form);
      data.delete('Services');
      data.set('Selected Services', serviceBoxes.filter(box => box.checked).map(box => box.value).join(', '));
      data.set('_subject', `${subjectPrefix} — ${cleanSubjectPart(data.get('Business Name'))}`);
      data.set('Page URL', location.href);
      const payload = {};
      data.forEach((value, key) => { payload[key] = String(value).trim(); });

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(endpoint, {
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(payload),
          signal:controller.signal
        });
        await parseProviderResponse(response);
        window.WonAdsTracking?.accepted(form);
        successTarget.classList.add('is-success');
        form.reset();
        validateServices();
        form.inert = true;
        form.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => successFocus.focus({preventScroll:true}), 80);
      } catch (error) {
        const timedOut = error && error.name === 'AbortError';
        deliveryStatus.textContent = timedOut
          ? 'Sending took too long. Please retry, or email wonads.com@gmail.com.'
          : 'Enquiry could not be sent right now. Please retry, or email wonads.com@gmail.com.';
        deliveryStatus.classList.add('is-error');
      } finally {
        window.clearTimeout(timeout);
        button.disabled = false;
        button.removeAttribute('aria-disabled');
        form.removeAttribute('aria-busy');
        buttonLabel.textContent = originalLabel;
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        successTarget.classList.remove('is-success');
        form.inert = false;
        form.removeAttribute('aria-hidden');
        deliveryStatus.textContent = '';
        deliveryStatus.classList.remove('is-error');
        validateServices();
        form.elements.namedItem('Full Name').focus({preventScroll:true});
      });
    }
  };

  return {bind};
})();

/* Reusable enquiry dialog opened by the site's contact calls to action. */
(() => {
  if (window.__wonAdsEnquiryPopup) return;
  window.__wonAdsEnquiryPopup = true;

  /* Show only on the first session page and then after each five page views. */
  const viewKey = 'wonAdsSessionPageViews';
  let pageViews = Number.parseInt(sessionStorage.getItem(viewKey) || '0',10);
  pageViews = Number.isFinite(pageViews) ? pageViews + 1 : 1;
  sessionStorage.setItem(viewKey,String(pageViews));
  const isContactPage = /\/contact\.html$/i.test(location.pathname);
  const shouldAutoOpen = !isContactPage && (pageViews === 1 || pageViews % 5 === 0);
  if (!shouldAutoOpen) return;


  const services = ['Meta Ads','Google Ads','SEO','Social Media Management','Website / Landing Page','Branding / Creatives','Lead Generation','Complete Digital Marketing','Other'];
  const popupOffers = [
    ['Free 15-minute growth audit','A quick expert review to find your clearest next marketing move.'],
    ['Meta & Google Ads health check','Spot wasted spend, weak targeting and practical campaign improvements.'],
    ['Landing page conversion review','Find the friction that may be costing you qualified enquiries.'],
    ['Local SEO visibility snapshot','See how your business appears across local search and Maps.'],
    ['30-day social content roadmap','Get a practical month of content themes built around your audience.'],
    ['WhatsApp follow-up blueprint','Map a faster, cleaner follow-up flow for every incoming lead.'],
    ['Website speed & mobile check','Review the mobile experience, loading speed and key action paths.'],
    ['Tracking setup checklist','Check whether your ads and website measure the actions that matter.'],
    ['Brand messaging mini-review','Sharpen what you say, who it is for and why customers should care.'],
    ['CRM automation opportunity map','Identify repetitive lead tasks that can be handled automatically.']
  ];
  const shell = document.createElement('div');
  shell.className = 'lead-pop';
  shell.setAttribute('aria-hidden','true');
  shell.innerHTML = `<div class="lead-pop__backdrop" data-popup-close></div>
    <section class="lead-pop__dialog" role="dialog" aria-modal="true" aria-labelledby="lead-pop-title">
      <button class="lead-pop__close" type="button" aria-label="Close enquiry form" data-popup-close><span>Close</span><b>×</b></button>
      <div class="lead-pop__story">
        <span class="lead-pop__kicker"><i></i> A SMALL BRIEF CAN START SOMETHING BIG</span>
        <div class="lead-pop__orb" aria-hidden="true"><span>LET'S<br>GROW</span></div>
        <h2 id="lead-pop-title">Your next<br /><em>growth move</em><br />starts here.</h2>
        <p>Tell us what you need. We’ll turn your idea into a <strong>clear next step</strong>—without pressure or complicated calls.</p>
        <div class="lead-pop__offers" aria-label="Current offers">
          <div class="lead-pop__offer-track">${popupOffers.map((offer,index) => `<article class="lead-pop__offer" aria-hidden="${index ? 'true' : 'false'}"><span>${String(index + 1).padStart(2,'0')} / ${String(popupOffers.length).padStart(2,'0')}</span><h3>${offer[0]}</h3><p>${offer[1]}</p></article>`).join('')}</div>
          <div class="lead-pop__offer-controls"><span>OFFER <b data-offer-current>01</b></span><div><button type="button" aria-label="Previous offer" data-offer-prev>←</button><button type="button" aria-label="Next offer" data-offer-next>→</button></div></div>
        </div>
        <div class="lead-pop__proof"><span>01&nbsp; SIMPLE DETAILS</span><span>02&nbsp; HUMAN RESPONSE</span><span>03&nbsp; NO SPAM</span></div>
      </div>
      <div class="lead-pop__form-wrap">
        <div class="lead-pop__form-head"><span>QUICK ENQUIRY</span><b>Usually replies within 1 business day</b></div>
        <form class="lead-pop__form" action="https://formsubmit.co/wonads.com@gmail.com" method="POST" data-popup-form>
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="Enquiry Source" value="Website enquiry popup" />
          <input type="hidden" name="Page URL" value="${location.href}" />
          <input class="lead-pop__honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <label><span>Full name <b>*</b></span><input name="Full Name" type="text" autocomplete="name" placeholder="Your name" minlength="2" maxlength="80" required /></label>
          <label><span>Phone number <b>*</b></span><input name="Phone Number" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210" maxlength="24" required /></label>
          <label><span>Business / company <b>*</b></span><input name="Business Name" type="text" autocomplete="organization" placeholder="Your business" minlength="2" maxlength="120" required /></label>
          <fieldset class="lead-pop__service-checks" data-popup-services><legend>Which services? <b>*</b><i>Select multiple</i></legend><div>${services.map(service => `<label><input type="checkbox" name="Services" value="${service}" /><span>${service}</span></label>`).join('')}</div><small class="enquiry-service-error" data-service-error role="status" aria-live="polite"></small></fieldset>
          <button type="submit"><span>Get my growth direction</span><b>↗</b></button>
          <small>By submitting, you’re asking Won Ads to contact you about this enquiry. No newsletters. No noise.<span class="lead-pop__delivery-status" data-popup-delivery-status role="status" aria-live="polite"></span></small>
        </form>
        <div class="lead-pop__success" aria-live="polite" aria-atomic="true"><span>ENQUIRY RECEIVED</span><h3 tabindex="-1" data-success-focus>That was your<br /><em>first smart move.</em></h3><p>Your details are with Won Ads. We’ll review them and get in touch shortly.</p><button type="button" data-popup-close>Continue exploring <b>→</b></button></div>
      </div>
    </section>`;
  document.body.appendChild(shell);

  let previousFocus = null;
  let background = [];
  const offerTrack = shell.querySelector('.lead-pop__offer-track');
  const offerCards = [...shell.querySelectorAll('.lead-pop__offer')];
  const offerCurrent = shell.querySelector('[data-offer-current]');
  let offerIndex = 0;
  let offerTimer = 0;
  const showOffer = index => {
    offerIndex = (index + offerCards.length) % offerCards.length;
    offerTrack.style.transform = `translate3d(-${offerIndex * 100}%,0,0)`;
    offerCurrent.textContent = String(offerIndex + 1).padStart(2,'0');
    offerCards.forEach((card,cardIndex) => card.setAttribute('aria-hidden',String(cardIndex !== offerIndex)));
  };
  const stopOffers = () => window.clearInterval(offerTimer);
  const startOffers = () => {
    stopOffers();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) offerTimer = window.setInterval(() => showOffer(offerIndex + 1),3600);
  };
  const openPopup = () => {
    previousFocus = document.activeElement;
    if (shell.classList.contains('is-open')) return;
    shell.inert = false;
    background = [...document.body.children].filter(element => element !== shell && !element.inert && !['SCRIPT','STYLE'].includes(element.tagName));
    background.forEach(element => element.inert = true);
    shell.classList.add('is-open');
    shell.setAttribute('aria-hidden','false');
    document.body.classList.add('lead-pop-lock');
    showOffer(offerIndex);
    startOffers();
    requestAnimationFrame(() => (shell.classList.contains('is-success') ? shell.querySelector('[data-success-focus]') : shell.querySelector('input[name="Full Name"]')).focus({preventScroll:true}));
  };
  const closePopup = () => {
    background.forEach(element => element.inert = false);
    background = [];
    shell.inert = true;
    shell.classList.remove('is-open');
    shell.setAttribute('aria-hidden','true');
    document.body.classList.remove('lead-pop-lock');
    stopOffers();
    if (previousFocus && previousFocus.focus) previousFocus.focus({preventScroll:true});
  };

  shell.querySelectorAll('[data-popup-close]').forEach(button => button.addEventListener('click', closePopup));
  shell.querySelector('[data-offer-prev]').addEventListener('click', () => { showOffer(offerIndex - 1); startOffers(); });
  shell.querySelector('[data-offer-next]').addEventListener('click', () => { showOffer(offerIndex + 1); startOffers(); });
  shell.querySelector('.lead-pop__offers').addEventListener('pointerenter',stopOffers);
  shell.querySelector('.lead-pop__offers').addEventListener('pointerleave',startOffers);
  document.addEventListener('keydown', event => {
    if (!shell.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closePopup();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...shell.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]')]
      .filter(element => !element.closest('[inert]') && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const form = shell.querySelector('[data-popup-form]');
  window.WonAdsEnquiry.bind({
    form,
    serviceSelector:'[data-popup-services] input[type="checkbox"]',
    subjectPrefix:'Popup Enquiry',
    successTarget:shell,
    resetButton:null
  });

  shell.inert = true;
  window.setTimeout(openPopup,900);
})();
// Shared service-card and price targets are installed after page rendering.
const serviceClickTargets = document.createElement('script');
serviceClickTargets.src = 'service-click-targets.js?v=20260908-seo1';
document.head.append(serviceClickTargets);
