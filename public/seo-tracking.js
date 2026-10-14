/* Contact events contain no form contents or query strings.
   The separate analytics adapter sends them only after visitor opt-in. */
(() => {
  if (window.WonAdsTracking) return;
  const track = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, page_path: location.pathname, ...details});
    window.WonAdsAnalytics?.track(event, {page_path: location.pathname, ...details});
  };
  const forms = new WeakMap();
  const accepted = form => {
    // One accepted event per submission attempt, including duplicate success callbacks.
    const attempt = forms.get(form);
    if (attempt?.reported) return;
    if (attempt) attempt.reported = true;
    else forms.set(form, {reported:true});
    track('generate_lead', {form_id: form.hasAttribute('data-hero-form') ? 'home_enquiry' :
      form.closest('#vip-form') ? 'project_enquiry' : 'general_enquiry', delivery_status:'provider_accepted'});
  };
  document.addEventListener('submit', event => {
    if (event.target instanceof HTMLFormElement) forms.set(event.target,{reported:false});
  },true);
  document.addEventListener('click', event => {
    const a = event.target.closest('a[href]'); if (!a) return;
    const href=a.getAttribute('href');
    if (href.startsWith('tel:')) track('phone_click');
    else if (/^https:\/\/wa\.me\//.test(href)) track('whatsapp_click');
    else if (href.startsWith('mailto:')) track('email_click');
    else if (/contact\.html/.test(href)) track('enquiry_cta_click');
  });
  window.WonAdsTracking={accepted};
})();
/* Legacy editorial pages share the same navigation/footer behavior as the main site. */
if (!document.querySelector('link[data-won-main-styles]')) {
  const mainStyles = document.createElement('link');
  mainStyles.rel = 'stylesheet';
  mainStyles.href = 'styles.css?v=20260911-fix7';
  mainStyles.dataset.wonMainStyles = 'true';
  document.head.appendChild(mainStyles);
}

if (!document.querySelector('script[data-won-navigation]')) {
  const sharedNavigation = document.createElement('script');
  sharedNavigation.src = 'navigation.js?v=20260912-schema11';
  sharedNavigation.defer = true;
  sharedNavigation.dataset.wonNavigation = 'true';
  document.head.appendChild(sharedNavigation);
}
