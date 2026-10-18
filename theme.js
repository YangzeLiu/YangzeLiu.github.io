// The only stored preference is the reader's choice of light or dark appearance.
(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // The page also works when browser storage is unavailable.
  }

  if (preference) root.dataset.theme = preference;

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    const isDark = () => (preference ? preference === 'dark' : systemTheme.matches);
    const updateLabel = () => {
      const label = `Switch to ${isDark() ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.title = label;
    };

    updateLabel();
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = isDark() ? 'light' : 'dark';
      root.dataset.theme = preference;
      try {
        localStorage.setItem('theme', preference);
      } catch {
        // An in-memory choice still works for this visit.
      }
      updateLabel();
    });
    systemTheme.addEventListener('change', updateLabel);

    // Include every manuscript in print, then restore the reader's disclosure.
    // Eager loading also gives the print engine access to offscreen figures.
    let printState = null;
    window.addEventListener('beforeprint', () => {
      if (printState) return;
      printState = {
        details: [...document.querySelectorAll('details')].map(element => [element, element.open]),
        images: [...document.querySelectorAll('img[loading="lazy"]')]
      };
      printState.details.forEach(([element]) => { element.open = true; });
      printState.images.forEach(element => { element.loading = 'eager'; });
    });
    window.addEventListener('afterprint', () => {
      if (!printState) return;
      printState.details.forEach(([element, open]) => { element.open = open; });
      printState.images.forEach(element => { element.loading = 'lazy'; });
      printState = null;
    });
  });
})();
