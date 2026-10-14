/* Owner-confirmed Won Ads property. Google is loaded only after an affirmative choice. */
(() => {
  if (window.WonAdsAnalytics || location.hostname !== 'wonads.com') return;
  const id = 'G-LM1KM5Q83G', key = 'wonads-analytics-choice-v1';
  let enabled = false, loaded = false;
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = value => { try { localStorage.setItem(key, value); } catch {} };
  const clean = value => { try { const u = new URL(value); return u.origin + u.pathname; } catch { return ''; } };
  const send = function () { window.dataLayer.push(arguments); };
  const start = () => {
    enabled = true;
    window['ga-disable-' + id] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    send('consent', 'default', {analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    send('js', new Date());
    send('config', id, {send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      page_location:clean(location.href),page_referrer:clean(document.referrer)});
    send('event','page_view',{send_to:id,page_location:clean(location.href),page_referrer:clean(document.referrer)});
    const script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  };
  const stop = () => {
    enabled = false;
    window['ga-disable-' + id] = true;
    // Remove first-party GA cookies; preference storage is retained.
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', '; domain=wonads.com', '; domain=.wonads.com'])
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
    }
  };
  window.WonAdsAnalytics = {track(event, details) {
    if (enabled) send('event', event, {...details,send_to:id,page_location:clean(location.href),page_referrer:clean(document.referrer)});
  }};
  const panel = document.createElement('section');
  panel.className = 'won-analytics-choice'; panel.setAttribute('aria-label','Analytics preferences');
  panel.innerHTML = '<p><strong>Help us improve this website?</strong> Optional Google Analytics measures visits and contact actions. You can use every service without it. <a href="privacy-policy">Privacy notice</a></p><div><button type="button" data-choice="yes">Allow analytics</button><button type="button" data-choice="no">No thanks</button></div>';
  const settings = document.createElement('button');
  settings.type = 'button'; settings.className = 'won-analytics-settings'; settings.textContent = 'Analytics preferences';
  settings.addEventListener('click', () => {panel.hidden=false;panel.querySelector('button').focus();});
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]'); if (!button) return;
    const choice = button.getAttribute('data-choice'); save(choice);
    if (choice === 'yes') start(); else stop();
    panel.hidden = true; settings.focus();
  });
  (document.querySelector('.won-footer') || document.body).appendChild(settings);
  document.body.appendChild(panel);
  const choice = read(); panel.hidden = choice === 'yes' || choice === 'no';
  if (choice === 'yes') start(); else window['ga-disable-' + id] = true;
})();
