(() => {
  const video = document.querySelector('[data-hero-video]');
  const sound = document.querySelector('[data-video-sound]');
  const label = document.querySelector('[data-video-sound-label]');
  const status = document.querySelector('[data-video-status]');
  if (!video || !sound) return;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slow = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  const medium = connection?.effectiveType === '3g';
  const sources = [
    'assets/video/won-hero-360.mp4',
    'assets/video/won-hero-480.mp4',
    'assets/video/won-hero-720.mp4',
    'assets/video/won-hero-1080.mp4'
  ];
  const preferredQuality = () => {
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return 0;
    if (connection?.effectiveType === '3g' || (connection?.downlink && connection.downlink < 2)) return 1;
    if (connection?.effectiveType === '4g' && (!connection.downlink || connection.downlink >= 5)) return 3;
    return 2;
  };
  let targetQuality = preferredQuality();
  let quality = slow ? 0 : medium ? 1 : targetQuality;
  let waits = 0;
  let stableTicks = 0;

  const switchQuality = next => {
    if (next === quality || next < 0 || next >= sources.length) return;
    const time = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const wasMuted = video.muted;
    quality = next;
    video.src = sources[quality];
    video.dataset.quality = String(quality);
    video.load();
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(time, Math.max(0, video.duration - .25));
      video.muted = wasMuted;
      video.play().catch(() => {});
    }, {once:true});
  };

  video.src = sources[quality];
  video.dataset.quality = String(quality);
  video.muted = true;
  video.defaultMuted = true;
  video.load();
  const start = video.play();
  if (start?.catch) start.catch(() => {
    status.textContent = 'Tap play to start the showreel';
  });

  video.addEventListener('playing', () => status.classList.add('is-ready'), {once:true});
  video.addEventListener('waiting', () => {
    waits += 1;
    stableTicks = 0;
    status.textContent = 'Adjusting video quality…';
    status.classList.remove('is-ready');
    if (waits >= 2 && quality > 0) {
      waits = 0;
      switchQuality(quality - 1);
    }
  });
  video.addEventListener('playing', () => {
    waits = 0;
    status.classList.add('is-ready');
  });
  video.addEventListener('error', () => {
    status.textContent = 'Showreel unavailable';
    status.classList.remove('is-ready');
  });

  sound.addEventListener('click', async () => {
    const enable = video.muted;
    video.muted = !enable;
    if (enable && video.paused) {
      try { await video.play(); } catch {}
    }
    sound.setAttribute('aria-pressed', String(enable));
    sound.setAttribute('aria-label', enable ? 'Mute showreel sound' : 'Turn showreel sound on');
    label.textContent = enable ? 'Sound off' : 'Sound on';
  });

  connection?.addEventListener?.('change', () => {
    targetQuality = preferredQuality();
    switchQuality(targetQuality);
  });

  window.setInterval(() => {
    if (video.paused || !video.buffered.length || quality >= targetQuality) return;
    const bufferedAhead = video.buffered.end(video.buffered.length - 1) - video.currentTime;
    stableTicks = bufferedAhead >= 20 ? stableTicks + 1 : 0;
    if (stableTicks >= 3) {
      stableTicks = 0;
      switchQuality(Math.min(targetQuality, quality + 1));
    }
  }, 10000);
})();
