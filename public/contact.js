const sharedNavigation = document.createElement('script'); sharedNavigation.src = 'navigation.js?v=20260912-schema11'; document.head.appendChild(sharedNavigation);
const cursor = document.querySelector('.cursor');
const nav = document.querySelector('.nav-wrap');
const params = new URLSearchParams(location.search);
const requestedType = params.get('type') || 'quick';
const requestedService = params.get('service') || '';
const requestedPlan = params.get('plan') || '';
const requestedOffer = params.get('offer') || '';

function matchService(value) {
  const text = value.toLowerCase();
  if (text.includes('paid') || text.includes('advertising')) return 'Meta Ads';
  if (text.includes('meta')) return 'Meta Ads';
  if (text.includes('google')) return 'Google Ads';
  if (text.includes('seo')) return 'SEO';
  if (text.includes('social')) return 'Social Media Management';
  if (text.includes('website') || text.includes('landing')) return 'Website / Landing Page';
  if (text.includes('brand') || text.includes('creative') || text.includes('content')) return 'Branding / Creatives';
  if (text.includes('lead') || text.includes('funnel')) return 'Lead Generation';
  if (text.includes('automation') || text.includes('analytics') || text.includes('email') || text.includes('whatsapp')) return 'Complete Digital Marketing';
  return value ? 'Other' : '';
}

document.querySelectorAll('[data-service-checks]').forEach(group => {
  const boxes = [...group.querySelectorAll('input[type="checkbox"]')];
  const matchedService = matchService(requestedService);
  boxes.forEach(box => { box.checked = box.value === matchedService; });
  const validate = () => {
    const hasSelection = boxes.some(box => box.checked);
    boxes[0].setCustomValidity(hasSelection ? '' : 'Please select at least one service.');
  };
  boxes.forEach(box => box.addEventListener('change', validate));
  group.closest('form').addEventListener('reset', () => setTimeout(validate));
  validate();
});
document.querySelectorAll('.plan-context').forEach(input => {
  const context = [requestedService, requestedPlan, requestedOffer].filter(Boolean).join(' — ');
  input.value = context;
  input.setAttribute('value', context);
});

if (requestedService || requestedPlan || requestedOffer) {
  document.querySelectorAll('form').forEach(form => {
    const context = document.createElement('div');
    context.className = 'selected-context';
    const label = document.createElement('small');
    const value = document.createElement('strong');
    label.textContent = requestedOffer ? 'Today’s selected offer' : 'Selected from pricing';
    value.textContent = [requestedService, requestedPlan, requestedOffer].filter(Boolean).join(' — ');
    context.append(label, value);
    form.prepend(context);
  });
}

if (requestedType === 'vip') {
  requestAnimationFrame(() => document.querySelector('#vip-form').scrollIntoView({behavior:'smooth',block:'start'}));
}

const enquiryEndpoint = 'https://formsubmit.co/ajax/wonads.com@gmail.com';

document.querySelectorAll('form[data-form-name]').forEach(form => {
  const sourceUrl = form.querySelector('input[name="_url"]');
  if (sourceUrl) sourceUrl.value = location.href;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const values = [...formData.entries()].filter(([key,value]) => key !== '_honey' && value);
    const subject = `${form.dataset.formName} — ${values.find(([key]) => key === 'Business Name')?.[1] || 'New enquiry'}`;
    formData.set('_subject', subject);
    formData.set('_template', 'table');
    formData.set('Enquiry Type', form.dataset.formName);
    formData.set('_url', location.href);
    formData.set('Page', location.href);
    const selectedServices = [...form.querySelectorAll('[data-service-checks] input:checked')].map(box => box.value);
    formData.delete('Services');
    formData.set('Selected Services', selectedServices.join(', '));
    const replyEmail = formData.get('Email Address');
    if (replyEmail) formData.set('_replyto', replyEmail);
    if (requestedService || requestedPlan) formData.set('Selected Service / Plan', [requestedService, requestedPlan].filter(Boolean).join(' — '));
    if (requestedOffer) formData.set('Selected Offer', requestedOffer);
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('span');
    const originalLabel = buttonLabel.textContent;
    button.disabled = true;
    buttonLabel.textContent = 'Sending enquiry...';
    const toast = document.querySelector('.submit-toast');
    toast.classList.remove('error');
    const payload = {};
    formData.forEach((value, key) => { payload[key] = String(value); });
    try {
      const response = await fetch(enquiryEndpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      const accepted = result.success === true || result.success === 'true';
      const providerMessage = String(result.error || result.message || '');
      if (!response.ok || !accepted) {
        throw new Error(providerMessage || 'Form delivery could not be confirmed');
      }
      window.WonAdsTracking?.accepted(form);
      form.reset();
      document.querySelectorAll('.plan-context').forEach(input => input.value = [requestedService, requestedPlan, requestedOffer].filter(Boolean).join(' — '));
      toast.querySelector('b').textContent = 'Enquiry sent.';
      toast.querySelector('span').textContent = 'Your enquiry was accepted for delivery. We will review it and get back to you.';
      toast.classList.remove('error');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    } catch (error) {
      toast.querySelector('b').textContent = 'Enquiry could not be sent.';
      toast.querySelector('span').textContent = 'Please retry in a moment or email wonads.com@gmail.com.';
      toast.classList.add('show', 'error');
      setTimeout(() => toast.classList.remove('show'), 6500);
    } finally {
      button.disabled = false;
      buttonLabel.textContent = originalLabel;
    }
  });
});

window.addEventListener('pointermove', event => {cursor.classList.add('ready');cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`});
document.addEventListener('pointerover',event=>{if(event.target.closest('a,button,input,select,textarea,label'))cursor.classList.add('active')});
document.addEventListener('pointerout',event=>{if(event.target.closest('a,button,input,select,textarea,label'))cursor.classList.remove('active')});
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>24),{passive:true});
