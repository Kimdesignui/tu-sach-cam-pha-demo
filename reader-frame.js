(() => {
  const shell = document.querySelector('.reader-shell');
  if (!shell || document.querySelector('.article-layout')) return;

  const crumb = document.querySelector('.reader-crumb');
  const fallbackUrl = crumb?.querySelector('a[href*="thu-vien"]')?.href || 'thu-vien.html';

  document.body.classList.add('reader-frame-mode');
  document.querySelector('.topbar')?.remove();
  document.querySelector('#site-nav')?.remove();
  document.querySelector('footer')?.remove();
  crumb?.remove();

  const titlebar = shell.querySelector('.reader-titlebar');
  if (!titlebar || titlebar.querySelector('.reader-back-button')) return;

  const backButton = document.createElement('button');
  backButton.className = 'reader-back-button';
  backButton.type = 'button';
  backButton.textContent = '← Quay lại';
  backButton.setAttribute('aria-label', 'Quay lại trang trước');
  backButton.addEventListener('click', () => {
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
      return;
    }
    window.location.href = fallbackUrl;
  });
  titlebar.append(backButton);
})();
