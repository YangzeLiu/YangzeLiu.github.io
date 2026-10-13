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
  });
})();
