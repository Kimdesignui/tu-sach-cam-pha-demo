(() => {
  const voiceCopy = {
    nam: {
      tag: 'GIỌNG NAM - MIỀN BẮC · ẤM VÀ TRANG TRỌNG',
      description: 'Demo MP3 giọng Nam - miền Bắc, phù hợp sách lịch sử, văn bản pháp luật và sổ tay tuyên truyền.',
      note: 'Minh Long · Giọng Nam - miền Bắc · Đọc câu giới thiệu mẫu'
    },
    nu: {
      tag: 'GIỌNG NỮ - MIỀN BẮC · SÁNG VÀ TRUYỀN CẢM',
      description: 'Demo MP3 giọng Nữ - miền Bắc, phù hợp sách văn hóa, ẩm thực và bản tin địa phương.',
      note: 'An Hà · Giọng Nữ - miền Bắc · Đọc câu giới thiệu mẫu'
    }
  };

  function applyVoiceLabels() {
    const cards = document.querySelectorAll('.ai-card');
    if (cards.length >= 2) {
      [['nam', cards[0]], ['nu', cards[1]]].forEach(([key, card]) => {
        const copy = voiceCopy[key];
        const tag = card.querySelector('.tag');
        const description = card.querySelector('.muted');
        if (tag && tag.textContent !== copy.tag) tag.textContent = copy.tag;
        if (description && description.textContent !== copy.description) description.textContent = copy.description;
      });
    }

    const voiceNote = document.querySelector('#voice-note');
    if (voiceNote) {
      const key = document.querySelector('#voice-nam.active') ? 'nam' : 'nu';
      if (voiceNote.textContent !== voiceCopy[key].note) voiceNote.textContent = voiceCopy[key].note;
    }
    const audio = document.querySelector('#reader-audio');
    if (audio) {
      const key = document.querySelector('#voice-nam.active') ? 'nam' : 'nu';
      audio.setAttribute('aria-label', `Demo ${voiceCopy[key].note}`);
    }
  }

  const observer = new MutationObserver(applyVoiceLabels);
  observer.observe(document.body, { childList: true, subtree: true });
  applyVoiceLabels();
})();
