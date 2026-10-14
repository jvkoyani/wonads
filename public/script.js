const stack = document.querySelector('#cardStack');
const stage = document.querySelector('.hero-stage');
const navigation = document.querySelector('.nav-wrap');
const servicesNavigation = document.querySelector('.services-nav');

/* Every tertiary service becomes a direct, continuously moving page link. */
const serviceTicker = document.querySelector('[data-service-ticker]');
if (serviceTicker && Array.isArray(window.WON_SERVICES)) {
  const tickerTrack = serviceTicker.querySelector('[data-service-ticker-track]');
  const slugifyService = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const tertiaryServices = window.WON_SERVICES.flatMap(service => service.items.map(item => ({
    title:item[0],
    href:`service-${service.id}-${slugifyService(item[0])}.html`
  })));
  const renderTickerSet = duplicate => tertiaryServices.map(service => `<a href="${service.href}"${duplicate ? ' aria-hidden="true" tabindex="-1"' : ''}><span>${service.title}</span><b>↗</b></a><i aria-hidden="true">✦</i>`).join('');
  tickerTrack.innerHTML = renderTickerSet(false) + renderTickerSet(true);
  serviceTicker.dataset.ready = 'true';
  serviceTicker.addEventListener('pointerdown', () => serviceTicker.classList.add('is-paused'), {passive:true});
}

if (servicesNavigation) {
  let closeMenuTimer;
  servicesNavigation.addEventListener('pointerenter', () => {
    clearTimeout(closeMenuTimer);
    servicesNavigation.classList.add('menu-open');
  });
  servicesNavigation.addEventListener('pointerleave', () => {
    closeMenuTimer = setTimeout(() => servicesNavigation.classList.remove('menu-open'), 420);
  });
  servicesNavigation.addEventListener('focusin', () => servicesNavigation.classList.add('menu-open'));
  servicesNavigation.addEventListener('focusout', () => {
    closeMenuTimer = setTimeout(() => servicesNavigation.classList.remove('menu-open'), 420);
  });
}

if (stage && stack) {
  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stack.style.transform = `translate(-50%, -50%) rotateY(${x * 22}deg) rotateX(${-y * 18}deg)`;
  });

  stage.addEventListener('pointerleave', () => {
    stack.style.transform = 'translate(-50%, -50%) rotateY(0deg) rotateX(0deg)';
  });
}

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  item.addEventListener('pointerleave', () => item.style.transform = '');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  observer.observe(item);
});

// The hero fills more than a viewport, so its large children may never meet an
// intersection-ratio threshold. Start that first beat explicitly on page load.
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach((item) => {
    item.classList.add('visible');
    observer.unobserve(item);
  });
});

document.querySelectorAll('.service-row').forEach((row) => {
  row.style.setProperty('--row', row.dataset.color);
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      navigation.classList.toggle('scrolled', window.scrollY > 24);
      const rotation = window.scrollY * 0.035;
      document.documentElement.style.setProperty('--scroll-rotation', `${rotation}deg`);
      if (stack && window.scrollY < window.innerHeight * 1.2) {
        stack.style.marginTop = `${window.scrollY * 0.09}px`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* Turn the trust credentials into one seamless, continuously moving row. */
const credentialGrid = document.querySelector('.credential-grid');
if (credentialGrid && !credentialGrid.dataset.carouselReady) {
  credentialGrid.dataset.carouselReady = 'true';
  credentialGrid.setAttribute('aria-label','Won Ads certifications and platform credentials');

  const cards = [...credentialGrid.querySelectorAll(':scope > .credential-card')];
  const track = document.createElement('div');
  const firstSet = document.createElement('div');
  track.className = 'credential-track';
  firstSet.className = 'credential-set';

  cards.forEach(card => {
    card.classList.remove('reveal');
    card.classList.add('visible');
    card.style.transitionDelay = '';
    firstSet.appendChild(card);
  });

  const duplicateSet = firstSet.cloneNode(true);
  duplicateSet.setAttribute('aria-hidden','true');
  track.append(firstSet, duplicateSet);
  credentialGrid.appendChild(track);
}

/* Homepage hero enquiry: same validated delivery flow as the popup form. */
const heroEnquiryForm = document.querySelector('[data-hero-form]');
if (heroEnquiryForm) {
  const heroEnquiry = heroEnquiryForm.closest('.hero-enquiry');
  window.WonAdsEnquiry.bind({
    form:heroEnquiryForm,
    serviceSelector:'[data-hero-services] input[type="checkbox"]',
    subjectPrefix:'Homepage Enquiry',
    successTarget:heroEnquiry,
    resetButton:heroEnquiry.querySelector('[data-hero-reset]')
  });
}

/* Core team: desktop uses deliberate click-to-select; touch devices keep native tap-to-expand. */
const coreTeamMembers = document.querySelectorAll('.team-core__member');
if (coreTeamMembers.length && window.innerWidth > 700) {
  const activateMember = (member) => {
    if (member.open) return;
    coreTeamMembers.forEach((other) => { other.open = other === member; });
  };

  coreTeamMembers.forEach((member) => {
    member.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault();
      activateMember(member);
    });
  });
}

coreTeamMembers.forEach((member) => {
  member.querySelector('.team-core__close')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    member.open = false;
  });
});
