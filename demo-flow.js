(() => {
  const steps = [
    ['Người dân mở Tủ sách', 'Trang chủ, tìm kiếm, 6 kệ sách', 'index.html'],
    ['Mở một kệ chủ đề', 'Đếm sách, giới thiệu tủ và sách con', 'thu-vien.html'],
    ['Đọc sách đa phương tiện', 'Lật trang, minh họa và nguồn tham khảo', 'doc-sach.html?id=0'],
    ['Nghe giọng đọc AI', 'Chọn MC nam miền Bắc hoặc nữ miền Nam', 'doc-sach.html?id=0#voice'],
    ['Cập nhật bản tin', 'Danh sách tin có hình ảnh và phân loại', 'ban-tin.html'],
    ['Đọc chi tiết bản tin', 'Breadcrumb, ảnh, audio và tin liên quan', 'doc-sach.html?news=Đề xuất xây dựng Tủ sách điện tử phường Cẩm Phả'],
    ['Tra cứu văn bản', 'Tìm kiếm, nhóm văn bản và bộ lọc', 'van-ban.html'],
    ['Cán bộ soạn nội dung', 'Tạo bản thảo, tệp đính kèm, gửi duyệt', 'soan-thao.html'],
    ['Lãnh đạo duyệt hoặc trả lại', 'Theo dõi hồ sơ đang chờ xử lý', 'phe-duyet.html'],
    ['Kho lưu trữ dùng chung', '7 nhóm tài liệu, tìm kiếm và phiên bản', 'kho-luu-tru.html'],
    ['Phòng ban và điều hành', 'Dự án, tiến độ, lượt đọc và báo cáo', 'dieu-hanh.html'],
    ['An toàn thông tin', 'Phân quyền, nhật ký, sao lưu và hạ tầng', 'an-toan-thong-tin.html']
  ];

  const roles = [
    ['public', 'Người dân', 'index.html'],
    ['editor', 'Cán bộ biên soạn', 'soan-thao.html'],
    ['lead', 'Lãnh đạo ban', 'phe-duyet.html'],
    ['office', 'Văn phòng', 'kho-luu-tru.html'],
    ['chief', 'Lãnh đạo phường', 'dieu-hanh.html']
  ];

  const introSeenKey = 'cam-pha-demo-intro-seen-v1';
  const pageName = window.location.pathname.split('/').pop().toLowerCase();
  const isHomePage = pageName === '' || pageName === 'index.html';
  const hasSeenIntro = () => {
    try { return window.localStorage.getItem(introSeenKey) === 'true'; } catch (error) { return false; }
  };
  const rememberIntroSeen = () => {
    try { window.localStorage.setItem(introSeenKey, 'true'); } catch (error) { /* storage may be unavailable */ }
  };

  function navigate(url) { window.location.href = url; }

  function mountGlossary() {
    const items = [
      ['.nav a[href="index.html"]', 'Trang chủ: xem tổng quan, kệ sách, bản tin và các điểm vào chính.'],
      ['.nav a[href="thu-vien.html"]', 'Tủ sách: mở các kệ chủ đề, sách con và trình đọc riêng.'],
      ['.nav a[href="ban-tin.html"]', 'Bản tin: xem danh sách tin có ảnh, phân loại và nội dung chi tiết.'],
      ['.nav a[href="van-ban.html"]', 'Văn bản & liên kết: tra cứu văn bản và mở nguồn chính thống.'],
      ['.demo-role', 'Vai trò: chuyển nhanh giữa trải nghiệm người dân và các vai trò nghiệp vụ.'],
      ['.home-section .section-head', 'Kệ sách: dùng nút mũi tên để chuyển các nhóm kệ trên màn hình.'],
      ['.demo-fab', 'Kịch bản trình diễn: mở 12 bước trải nghiệm từ người dân đến quản trị.']
    ];
    items.forEach(([selector, tip]) => {
      const target = document.querySelector(selector);
      if (!target || target.querySelector('.demo-help')) return;
      target.setAttribute('data-demo-help', 'true');
      const help = document.createElement('span');
      help.className = 'demo-help';
      help.tabIndex = 0;
      help.setAttribute('role', 'img');
      help.setAttribute('aria-label', tip);
      help.dataset.tip = tip;
      help.textContent = 'i';
      target.appendChild(help);
    });
  }

  function introMarkup() {
    return `<div class="demo-intro" id="demo-intro" role="dialog" aria-modal="true" aria-label="Giới thiệu Tủ sách Cẩm Phả" hidden>
      <section class="demo-intro-card">
        <button class="demo-intro-close" type="button" aria-label="Đóng giới thiệu">×</button>
        <div class="demo-intro-identity" aria-label="Thông tin bản trình diễn">
          <img src="cam-pha-logo.svg" alt="Logo Cẩm Phả">
          <span class="demo-intro-identity-divider" aria-hidden="true"></span>
          <img src="Logo-VHMT2-Final.svg" alt="Logo VHMT">
          <span class="demo-intro-identity-copy">Tủ sách điện tử phường Cẩm Phả · Bản trình diễn đề xuất 30/09/2026</span>
        </div>
        <span class="demo-intro-kicker">Cẩm Phả · Đất mỏ · Biển xanh</span>
        <h2>Từ tư liệu rời rạc thành một không gian tri thức</h2>
        <p class="demo-intro-lead">Tủ sách điện tử phường Cẩm Phả giúp người dân đọc và nghe về lịch sử, truyền thống vùng mỏ, văn hóa và đời sống địa phương; đồng thời tạo một luồng làm việc rõ ràng cho cán bộ, lãnh đạo và Văn phòng.</p>
        <div class="demo-flow-grid">
          <article><b>01</b><strong>Đọc & nghe</strong><span>Người dân tìm sách, bản tin và tư liệu địa phương.</span></article>
          <article><b>02</b><strong>Biên soạn</strong><span>Các ban tạo nội dung từ Word, ảnh, âm thanh và video.</span></article>
          <article><b>03</b><strong>Duyệt nội dung</strong><span>Lãnh đạo ban và Văn phòng kiểm tra trước khi công khai.</span></article>
          <article><b>04</b><strong>Lưu & báo cáo</strong><span>Kho dùng chung, phân quyền, sao lưu và có số liệu đọc.</span></article>
        </div>
        <p class="muted">Bản demo đang dùng nội dung minh họa Cẩm Phả. Khi triển khai chính thức, nội dung sẽ thay bằng hồ sơ được phường cung cấp và thẩm định.</p>
        <div class="demo-intro-actions">
          <a class="button primary" href="index.html">Trang chủ</a>
          <a class="button" href="soan-thao.html">Xem hệ thống nghiệp vụ</a>
          <button class="button accent" type="button" data-open-script>Xem kịch bản 12 bước</button>
        </div>
      </section>
    </div>`;
  }

  function mount() {
    const topbar = document.querySelector('.topbar-inner');
    const nav = document.querySelector('.nav');
    if (topbar && nav && !document.querySelector('.demo-tools')) {
      const tools = document.createElement('div');
      tools.className = 'demo-tools nav-tools';
      tools.innerHTML = `<button class="demo-link demo-toggle" type="button" data-toggle-glossary aria-pressed="false"><span class="demo-toggle-track" aria-hidden="true"><span class="demo-toggle-thumb"></span></span><span>Chú giải chức năng</span></button>
        <button class="demo-link" type="button" data-open-intro>Giới thiệu</button>
        <label class="demo-role">Vai trò <select data-role-switch aria-label="Chọn vai trò trình diễn">${roles.map(([id,label]) => `<option value="${id}">${label}</option>`).join('')}</select></label>`;
      nav.appendChild(tools);
    }
    if (document.querySelector('.demo-fab')) return;

    document.body.insertAdjacentHTML('beforeend', `<button class="button primary demo-fab" type="button" data-open-script>Kịch bản trình diễn</button><aside class="demo-script" id="demo-script" hidden aria-label="Kịch bản trình diễn"><div class="demo-script-head"><strong>Kịch bản trình diễn · 12 bước</strong><button type="button" data-close-script aria-label="Đóng">×</button></div><p>Bấm từng bước để đi đúng theo flow người dùng.</p><ol class="demo-script-list">${steps.map(([title,desc,url]) => `<li><a href="${url}">${title}<span>${desc}</span></a></li>`).join('')}</ol></aside>${introMarkup()}`);

    const script = document.querySelector('#demo-script');
    const intro = document.querySelector('#demo-intro');
    const closeIntro = (remember = false) => {
      if (intro) intro.hidden = true;
      document.body.classList.remove('modal-open');
      if (remember) rememberIntroSeen();
    };
    const openScript = () => { script.hidden = false; };
    document.querySelectorAll('[data-open-script]').forEach(button => button.addEventListener('click', () => { closeIntro(true); openScript(); }));
    document.querySelector('[data-close-script]')?.addEventListener('click', () => { script.hidden = true; });
    document.querySelector('[data-open-intro]')?.addEventListener('click', () => { intro.hidden = false; document.body.classList.add('modal-open'); });
    document.querySelector('[data-toggle-glossary]')?.addEventListener('click', event => { const on = document.body.classList.toggle('show-glossary'); event.currentTarget.setAttribute('aria-pressed', String(on)); });
    const closeIntroButton = document.querySelector('.demo-intro-close');
    const handleIntroClose = event => {
      event.preventDefault();
      event.stopPropagation();
      closeIntro(true);
    };
    closeIntroButton?.addEventListener('click', handleIntroClose);
    closeIntroButton?.addEventListener('pointerup', event => {
      if (event.pointerType === 'touch') handleIntroClose(event);
    });
    intro?.addEventListener('click', event => { if (event.target === intro) closeIntro(false); });
    document.querySelector('[data-role-switch]')?.addEventListener('change', event => { const role = roles.find(item => item[0] === event.target.value); if (role) navigate(role[2]); });
    mountGlossary();
    if (isHomePage && !hasSeenIntro()) document.querySelector('[data-open-intro]')?.click();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else setTimeout(mount, 0);
})();
