/* Click/tap disclosures with sticky headings and keyboard support. */
(() => {
  const list = document.querySelector('.service-list');
  if (!list || !Array.isArray(window.WON_SERVICES)) return;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slug = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const originalRows = [...list.querySelectorAll('.service-row')];
  list.classList.add('service-explorer');
  if (!list.dataset.prerendered) list.innerHTML = window.WON_SERVICES.map((service, index) => {
    const first = service.packages[0];
    const title = originalRows[index]?.querySelector('h3')?.textContent || service.title;
    return `<details class="service-offer" data-href="${escape(service.id)}" style="--service-accent:${escape(service.accent)}">
      <summary class="service-offer__summary"><span class="service-offer__number">${escape(service.number)}</span><h3>${escape(title)}</h3><span class="service-offer__starting"><small>Packages from</small><strong>${escape(first.price)}<small>${escape(first.suffix)}</small></strong><span class="service-offer__hint">Click or tap to explore</span></span><span class="service-offer__toggle" aria-hidden="true"></span></summary>
      <div class="service-offer__body">
        <div class="service-offer__intro"><p>${escape(service.short)}</p><a href="${escape(service.id)}">Full service overview ↗</a></div>
        <div class="service-offer__label"><h4>Complete packages</h4><p>${escape(service.billing)}</p></div>
        <div class="service-offer__packages">${service.packages.map(plan => `<article class="service-plan${plan.featured ? ' service-plan--featured' : ''}"><div class="service-plan__name"><h5>${escape(plan.name)}</h5>${plan.featured ? '<span>Popular</span>' : ''}</div><p class="service-plan__price">${escape(plan.price)}<small>${escape(plan.suffix)}</small></p><p>${escape(plan.note)}</p><ul>${plan.includes.map(item => `<li>${escape(item)}</li>`).join('')}</ul><a href="contact?type=vip&service=${encodeURIComponent(service.title)}&plan=${encodeURIComponent(plan.name)}#vip-form">Discuss this package ↗</a></article>`).join('')}</div>
        <div class="service-offer__label"><h4>Individual services</h4><p>Click or tap a service for its price and details.</p></div>
        <div class="service-offer__items">${service.items.map(item => { const href = `service-${service.id}-${slug(item[0])}`; return `<details class="service-option" data-href="${escape(href)}"><summary><h5>${escape(item[0])}</h5><span aria-hidden="true">+</span></summary><div class="service-option__body"><small>Starting at</small><strong>${escape(item[1])}</strong><p>A focused ${escape(item[0].toLowerCase())} engagement planned around your business, audience and growth objective. Scope and deliverables are agreed before work begins.</p><a href="${escape(href)}">View service details ↗</a></div></details>`; }).join('')}</div>
        <p class="service-offer__note">Individual services are priced separately from packages. Final scope, volume and timeline are confirmed in your proposal.</p>
        <button class="service-offer__close" type="button">Close ${escape(title)} <span aria-hidden="true">×</span></button>
      </div>
    </details>`;
  }).join('');

  const header = document.querySelector('.nav-wrap');
  const updateStickyTop = () => list.style.setProperty('--service-sticky-top', `${header ? header.getBoundingClientRect().bottom + 12 : 16}px`);
  updateStickyTop();
  window.addEventListener('resize', updateStickyTop);
  window.addEventListener('scroll', updateStickyTop, {passive:true});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motions = new WeakMap();
  function setExpanded(card, expanded, immediate = false) {
    card.querySelector(':scope > summary > button')?.setAttribute('aria-expanded', String(expanded));
    const previous = motions.get(card);
    if (!immediate && (previous ? previous.expanded === expanded : card.open === expanded)) return;
    const startHeight = card.getBoundingClientRect().height;
    previous?.animation.cancel();
    motions.delete(card);
    if (immediate || reducedMotion.matches) {
      card.open = expanded;
      return;
    }
    // Keep content mounted during collapse, and reverse from the current
    // rendered height if the pointer returns before the animation finishes.
    card.open = true;
    const border = parseFloat(getComputedStyle(card).borderTopWidth) + parseFloat(getComputedStyle(card).borderBottomWidth);
    const endHeight = expanded ? card.getBoundingClientRect().height : card.querySelector('summary').getBoundingClientRect().height + border;
    const animation = card.animate(
      {height: [`${startHeight}px`, `${endHeight}px`]},
      {duration: card.classList.contains('service-offer') ? 485 : 388, easing: 'cubic-bezier(.45, 0, .55, 1)', fill: 'forwards'}
    );
    motions.set(card, {animation, expanded});
    animation.onfinish = () => {
      if (motions.get(card)?.animation !== animation) return;
      card.open = expanded;
      motions.delete(card);
      animation.cancel();
    };
  }
  list.querySelectorAll('details').forEach((card, index) => {
    const summary = card.querySelector(':scope > summary');
    const arrow = summary.querySelector('.service-offer__toggle, :scope > span[aria-hidden]');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = `${arrow.className} service-preview-toggle`;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', `Show details for ${summary.querySelector('h3, h5').textContent}`);
    const body = card.querySelector(':scope > div');
    body.id = `service-preview-${index}`;
    toggle.setAttribute('aria-controls', body.id);
    arrow.replaceWith(toggle);
    toggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const parent = card.parentElement.closest('.service-offer');
      const parentMotion = parent && motions.get(parent);
      if (parentMotion?.expanded) setExpanded(parent, true, true);
      setExpanded(card, !(motions.get(card)?.expanded ?? card.open));
    });
    summary.addEventListener('click', event => {
      if (event.target.closest('a,button')) return;
      event.preventDefault();
      // Keep the heading a predictable disclosure control on every device.
      setExpanded(card, !(motions.get(card)?.expanded ?? card.open));
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setExpanded(card, false, true);
      card.querySelector(':scope > summary').focus();
    });
  });
  list.querySelectorAll('.service-offer__close').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.service-offer');
      setExpanded(card, false, true);
      card.querySelector('summary').focus({preventScroll: true});
      card.scrollIntoView({block: 'nearest', behavior: 'instant'});
    });
  });
})();
