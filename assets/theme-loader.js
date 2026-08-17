(function () {
  const THEME_PREFIX = 'theme-';
  const SITE_META_URL = '/site-meta.json';
  const DEFAULT_SITE_META = {
    title: 'Dashboard | RapidIdentity',
    favicon: 'https://northallegheny.us004-rapididentity.com:443/files/NAlogo_gold_flat.png',
  };

  const clearThemeClasses = (element) => {
    if (!element) return;
    for (const className of Array.from(element.classList)) {
      if (className.startsWith(THEME_PREFIX)) {
        element.classList.remove(className);
      }
    }
  };

  const applyThemeToElement = (element, themeName) => {
    if (!element) return;
    clearThemeClasses(element);
    if (themeName && themeName !== 'default') {
      element.classList.add(`${THEME_PREFIX}${themeName}`);
    }
  };

  const applyTheme = (themeName) => {
    applyThemeToElement(document.documentElement, themeName);

    if (document.body) {
      applyThemeToElement(document.body, themeName);
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        () => applyThemeToElement(document.body, themeName),
        { once: true }
      );
    }
  };

  const syncStoredTheme = () => {
    const themeName = localStorage.getItem('carson_theme') || 'default';
    applyTheme(themeName);
  };

  const applySiteMeta = (meta) => {
    const resolvedMeta = {
      ...DEFAULT_SITE_META,
      ...(meta || {}),
    };

    if (resolvedMeta.title) {
      document.title = resolvedMeta.title;
    }

    if (resolvedMeta.favicon) {
      let faviconLink = document.querySelector('link[rel="icon"]');
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.setAttribute('rel', 'icon');
        document.head.appendChild(faviconLink);
      }
      faviconLink.setAttribute('href', resolvedMeta.favicon);
      faviconLink.setAttribute('type', 'image/svg+xml');
    }
  };

  const syncSiteMeta = async () => {
    try {
      const response = await fetch(SITE_META_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const meta = await response.json();
      applySiteMeta(meta);
    } catch (error) {
      applySiteMeta(DEFAULT_SITE_META);
    }
  };

  window.CarsonGamesTheme = {
    apply(themeName) {
      const resolvedTheme = themeName || 'default';
      localStorage.setItem('carson_theme', resolvedTheme);
      applyTheme(resolvedTheme);
    },
    sync: syncStoredTheme,
  };

  syncStoredTheme();
  syncSiteMeta();

  window.addEventListener('storage', (event) => {
    if (event.key === 'carson_theme') {
      applyTheme(event.newValue || 'default');
    }
  });
})();
