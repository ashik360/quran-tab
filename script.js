// Quran Tab Application - Production Ready (with enhanced audio mode)

let currentVerse = {
  chapter: 1,
  verse: 1,
  translation: 'bn.bengali',
  audioEdition: 'ar.shaatree',
  bitrate: '128',
  surahArabicName: 'الفاتحة'
};

let isAutoplayEnabled = false;
let surahAyahCounts = {};
let savedAyahs = JSON.parse(localStorage.getItem('savedAyahs') || '[]');
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let isLoading = false;

// Audio mode state
let isAudioMode = false;
let audioModeInterval;
let sleepTimer = null;
let repeatMode = 'none'; // 'none', 'repeat-one', 'repeat-all'
const ayahDetailsCache = new Map();
const ayahTafsirCache = new Map();

// Bengali Surah Names
const bengaliSurahNames = {
  1: "সূরা আল-ফাতিহা",
  2: "সূরা আল-বাকারা",
  3: "সূরা আল-ইমরান",
  4: "সূরা আন-নিসা",
  5: "সূরা আল-মায়িদা",
  6: "সূরা আল-আন'আম",
  7: "সূরা আল-আ'রাফ",
  8: "সূরা আল-আনফাল",
  9: "সূরা আত-তাওবা",
  10: "সূরা ইউনুস",
  11: "সূরা হুদ",
  12: "সূরা ইউসুফ",
  13: "সূরা আর-রাদ",
  14: "সূরা ইবরাহীম",
  15: "সূরা আল-হিজর",
  16: "সূরা আন-নাহল",
  17: "সূরা আল-ইসরা",
  18: "সূরা আল-কাহফ",
  19: "সূরা মারইয়াম",
  20: "সূরা তাহা",
  21: "সূরা আল-আম্বিয়া",
  22: "সূরা আল-হাজ্জ",
  23: "সূরা আল-মুমিনুন",
  24: "সূরা আন-নূর",
  25: "সূরা আল-ফুরকান",
  26: "সূরা আশ-শু'আরা",
  27: "সূরা আন-নামল",
  28: "সূরা আল-কাসাস",
  29: "সূরা আল-আনকাবুত",
  30: "সূরা আর-রূম",
  31: "সূরা লুকমান",
  32: "সূরা আস-সাজদা",
  33: "সূরা আল-আহযাব",
  34: "সূরা সাবা",
  35: "সূরা ফাতির",
  36: "সূরা ইয়াসীন",
  37: "সূরা আস-সাফফাত",
  38: "সূরা সাদ",
  39: "সূরা আয-যুমার",
  40: "সূরা গাফির",
  41: "সূরা ফুসসিলাত",
  42: "সূরা আশ-শুরা",
  43: "সূরা আয-যুখরুফ",
  44: "সূরা আদ-দুখান",
  45: "সূরা আল-জাসিয়া",
  46: "সূরা আল-আহকাফ",
  47: "সূরা মুহাম্মদ",
  48: "সূরা আল-ফাতহ",
  49: "সূরা আল-হুজুরাত",
  50: "সূরা কাফ",
  51: "সূরা আয-যারিয়াত",
  52: "সূরা আত-তূর",
  53: "সূরা আন-নাজম",
  54: "সূরা আল-কামার",
  55: "সূরা আর-রহমান",
  56: "সূরা আল-ওয়াকিয়াহ",
  57: "সূরা আল-হাদিদ",
  58: "সূরা আল-মুজাদালাহ",
  59: "সূরা আল-হাশর",
  60: "সূরা আল-মুমতাহিনা",
  61: "সূরা আস-সাফ",
  62: "সূরা আল-জুমু'আহ",
  63: "সূরা আল-মুনাফিকুন",
  64: "সূরা আত-তাগাবুন",
  65: "সূরা আত-তালাক",
  66: "সূরা আত-তাহরীম",
  67: "সূরা আল-মুলক",
  68: "সূরা আল-কলম",
  69: "সূরা আল-হাক্কাহ",
  70: "সূরা আল-মাআ'রিজ",
  71: "সূরা নূহ",
  72: "সূরা আল-জিন্ন",
  73: "সূরা আল-মুযযাম্মিল",
  74: "সূরা আল-মুদ্দাস্সির",
  75: "সূরা আল-কিয়ামাহ",
  76: "সূরা আদ-দাহর",
  77: "সূরা আল-মুরসালাত",
  78: "সূরা আন-নাবা",
  79: "সূরা আন-নাযিয়াত",
  80: "সূরা আবাসা",
  81: "সূরা আত-তাকভীর",
  82: "সূরা আল-ইনফিতার",
  83: "সূরা আল-মুতাফফিফীন",
  84: "সূরা আল-ইনশিকাক",
  85: "সূরা আল-বুরুজ",
  86: "সূরা আত-তারিক",
  87: "সূরা আল-আ'লা",
  88: "সূরা আল-গাশিয়াহ",
  89: "সূরা আল-ফাজর",
  90: "সূরা আল-বালাদ",
  91: "সূরা আশ-শামস",
  92: "সূরা আল-লাইল",
  93: "সূরা আদ-দুহা",
  94: "সূরা আল-ইনশিরাহ",
  95: "সূরা আত-তীন",
  96: "সূরা আল-আলাক",
  97: "সূরা আল-কাদর",
  98: "সূরা আল-বাইয়িনাহ",
  99: "সূরা আয-যিলযাল",
  100: "সূরা আল-আদিয়াত",
  101: "সূরা আল-কারিয়াহ",
  102: "সূরা আত-তাকাসুর",
  103: "সূরা আল-আসর",
  104: "সূরা আল-হুমাজাহ",
  105: "সূরা আল-ফীল",
  106: "সূরা কুরাইশ",
  107: "সূরা আল-মাউন",
  108: "সূরা আল-কাউসার",
  109: "সূরা আল-কাফিরুন",
  110: "সূরা আন-নাসর",
  111: "সূরা আল-মাসাদ",
  112: "সূরা আল-ইখলাস",
  113: "সূরা আল-ফালাক",
  114: "সূরা আন-নাস"
};

// Bengali Reciter Names
const bengaliReciterNames = {
  'ar.shaatree': 'আবু বকর আশ-শাত্রী',
  'ar.ahmedajamy': 'আহমেদ ইবনে আলী আল-আজামী',
  'ar.alafasy': 'আল-আফাসী',
  'ar.abdurrahmaansudais': 'আব্দুর রহমান আস-সুদাইস',
  'ar.abdulbasitmurattal': 'আব্দুল বাসিত (মুরাত্তাল)',
  'ar.abdullahbasfar': 'আব্দুল্লাহ বাসফার',
  'ar.abdulsamad': 'আব্দুল সামাদ',
  'ar.husary': 'হুসারী',
  'ar.husarymujawwad': 'হুসারী (মুজাওয়াদ)',
  'ar.hudhaify': 'হুদাইফী',
  'ar.mahermuaiqly': 'মাহের আল মুয়াইকলী',
  'ar.minshawi': 'মিনশাবী',
  'ar.muhammadayyoub': 'মুহাম্মদ আইয়ুব',
  'ar.muhammadjibreel': 'মুহাম্মদ জিবরীল',
  'zh.chinese': 'চীনা',
  'fr.leclerc': 'ইউসুফ লেক্লার্ক (ফরাসি)',
  'ru.kuliev-audio': 'এলমির কুলিয়েভ (রাশিয়ান)'
};

// DOM Elements
const elements = {
  timeDisplay: document.getElementById('timeDisplay'),
  verseArabic: document.getElementById('verseArabic'),
  verseTranslation: document.getElementById('verseTranslation'),
  verseInfo: document.getElementById('verseInfo'),
  audioPlayer: document.getElementById('audioPlayer'),
  prevVerse: document.getElementById('prevVerse'),
  nextVerse: document.getElementById('nextVerse'),
  quoteContainer: document.getElementById('quoteContainer'),
  autoplayToggle: document.getElementById('autoplayToggle'),
  audioIconBtn: document.getElementById('audioIconBtn'),
  translationIconBtn: document.getElementById('translationIconBtn'),
  reciterDropdown: document.getElementById('reciterDropdown'),
  translationDropdown: document.getElementById('translationDropdown'),
  chapterSelect: document.getElementById('chapterSelect'),
  verseSelect: document.getElementById('verseSelect'),
  ayahModal: document.getElementById('ayahSelectModal'),
  goToAyahBtn: document.getElementById('goToAyahBtn'),
  cancelAyahBtn: document.getElementById('cancelAyahBtn'),
  googleAppsBtn: document.getElementById('googleAppsBtn'),
  appsDropdown: document.getElementById('appsDropdown'),
  bookmarkBtn: document.getElementById('bookmarkBtn'),
  bookmarkDropdown: document.getElementById('bookmarkDropdown'),
  addBookmarkBtn: document.getElementById('addBookmarkBtn'),
  bookmarkTitle: document.getElementById('bookmarkTitle'),
  bookmarkURL: document.getElementById('bookmarkURL'),
  bookmarkList: document.getElementById('bookmarkList'),
  savedBtn: document.getElementById('savedBtn'),
  favouriteBtn: document.getElementById('favouriteBtn'),
  audioModeBtn: document.getElementById('audioModeBtn'),
  audioModeScreen: document.getElementById('audioModeScreen'),
  exitAudioMode: document.getElementById('exitAudioMode'),
  audioPlayPause: document.getElementById('audioPlayPause'),
  playPauseIcon: document.getElementById('playPauseIcon'),
  audioPrev: document.getElementById('audioPrev'),
  audioNext: document.getElementById('audioNext'),
  audioRepeat: document.getElementById('audioRepeat'),
  audioShuffle: document.getElementById('audioShuffle'),
  audioAutoPlay: document.getElementById('audioAutoPlay'),
  audioSpeed: document.getElementById('audioSpeed'),
  audioSleep: document.getElementById('audioSleep'),
  audioVolume: document.getElementById('audioVolume'),
  audioProgress: document.getElementById('audioProgress'),
  currentTime: document.getElementById('currentTime'),
  totalTime: document.getElementById('totalTime'),
  audioModeTime: document.getElementById('audioModeTime'),
  audioSurahArabic: document.getElementById('audioSurahArabic'),
  audioSurahBengali: document.getElementById('audioSurahBengali'),
  audioSurahTrigger: document.getElementById('audioSurahTrigger'),
  currentAyahNumber: document.getElementById('currentAyahNumber'),
  audioSideDrawer: document.getElementById('audioSideDrawer'),
  audioDrawerTitle: document.getElementById('audioDrawerTitle'),
  audioDrawerBody: document.getElementById('audioDrawerBody'),
  audioDrawerClose: document.getElementById('audioDrawerClose'),
  audioReciterName: document.getElementById('audioReciterName'),
  speedModal: document.getElementById('speedModal'),
  sleepModal: document.getElementById('sleepModal'),
  audioReciterBtn: document.getElementById('audioReciterBtn'),
  audioTranslationBtn: document.getElementById('audioTranslationBtn'),
  audioReciterDropdown: document.getElementById('audioReciterDropdown'),
  audioTranslationDropdown: document.getElementById('audioTranslationDropdown'),
  audioAyahDrawer: document.getElementById('audioAyahDrawer'),
  audioAyahClose: document.getElementById('audioAyahClose'),
  audioChapterSelect: document.getElementById('audioChapterSelect'),
  audioVerseSelect: document.getElementById('audioVerseSelect'),
  audioGoToAyahBtn: document.getElementById('audioGoToAyahBtn'),
  audioCancelAyahBtn: document.getElementById('audioCancelAyahBtn'),
  audioAutoplayToggle: document.getElementById('audioAutoplayToggle')
};

// ==================== UTILITY FUNCTIONS ====================
function showLoading(show = true) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) overlay.classList.add('show');
  else overlay.classList.remove('show');
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `<span class="material-icons" style="margin-right:8px; vertical-align:middle;">${type === 'success' ? 'check_circle' : 'error'}</span>${message}`;
  notification.style.cssText = `
    position: fixed; top: 100px; right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white; padding: 12px 24px; border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;
    animation: slideInRight 0.3s ease; display: flex; align-items: center;
    font-family: 'Noto Sans Bengali', sans-serif;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateProgressBar(percent) {
  const bar = document.querySelector('.progress-bar');
  if (bar) bar.style.width = `${percent}%`;
}
function resetProgressBar() { updateProgressBar(0); }

// ==================== QURAN API FUNCTIONS ====================
async function getGlobalAyahNumber(chapter, verse) {
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}`);
    const data = await res.json();
    return data.data.number;
  } catch { return null; }
}

async function getSurahAyahCount(chapter) {
  if (surahAyahCounts[chapter]) return surahAyahCounts[chapter];
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${chapter}`);
    const data = await res.json();
    const count = data.data.numberOfAyahs;
    surahAyahCounts[chapter] = count;
    return count;
  } catch { return 7; }
}

// ==================== VERSE LOADING ====================
async function loadVerse(chapter, verse, showLoader = true, resumeAudio = false) {
  if (isLoading) return;
  isLoading = true;
  if (showLoader) showLoading(true);
  updateProgressBar(30);

  try {
    const wasPlaying = isAudioMode && !elements.audioPlayer.paused;
    const [arabicRes, transRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}/ar.alafasy`),
      fetch(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}/editions/${currentVerse.translation}`)
    ]);
    if (!arabicRes.ok || !transRes.ok) throw new Error('API error');

    const arabicData = await arabicRes.json();
    const transData = await transRes.json();

    elements.verseArabic.textContent = arabicData.data.text;
    elements.verseTranslation.textContent = transData.data[0].text;
    elements.verseInfo.textContent = `Surah ${arabicData.data.surah.englishName} (${chapter}:${verse})`;

    currentVerse.chapter = chapter;
    currentVerse.verse = verse;
    currentVerse.surahArabicName = arabicData.data.surah.name || '';

    updateProgressBar(70);
    await loadAudioByAyah(chapter, verse);
    if (resumeAudio || wasPlaying) {
      await elements.audioPlayer.play().catch(() => { });
    }
    updateProgressBar(100);

    // Animate
    elements.verseArabic.style.animation = 'none';
    elements.verseTranslation.style.animation = 'none';
    setTimeout(() => {
      elements.verseArabic.style.animation = 'fadeInUp 0.8s ease-out';
      elements.verseTranslation.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
    }, 10);

    if (isAudioMode) {
      updateAudioModeDisplay();
      updateAudioModeProgress();
    }
  } catch (error) {
    console.error('Failed to load verse:', error);
    // fallback
    elements.verseArabic.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    elements.verseTranslation.textContent = 'In the name of Allah, the Most Gracious, the Most Merciful.';
    elements.verseInfo.textContent = 'Surah Al-Fatiha (1:1)';
    currentVerse.chapter = 1;
    currentVerse.verse = 1;
    currentVerse.surahArabicName = 'الفاتحة';
    showNotification('Failed to load verse. Check connection.', 'error');
  } finally {
    isLoading = false;
    if (showLoader) showLoading(false);
    setTimeout(resetProgressBar, 1000);
  }
}

async function loadAudioByAyah(chapter, verse) {
  try {
    const ayahNum = await getGlobalAyahNumber(chapter, verse);
    if (!ayahNum) throw new Error('No ayah number');
    elements.audioPlayer.src = `https://cdn.islamic.network/quran/audio/${currentVerse.bitrate}/${currentVerse.audioEdition}/${ayahNum}.mp3`;
    elements.audioPlayer.load();
    if (isAutoplayEnabled) {
      await elements.audioPlayer.play().catch(() => { });
    }
  } catch (error) {
    console.error('Audio load error:', error);
    showNotification('Failed to load audio', 'error');
  }
}

// ==================== NAVIGATION ====================
async function prevVerse() {
  if (currentVerse.verse > 1) {
    await loadVerse(currentVerse.chapter, currentVerse.verse - 1);
  } else if (currentVerse.chapter > 1) {
    const prevChapter = currentVerse.chapter - 1;
    const count = await getSurahAyahCount(prevChapter);
    await loadVerse(prevChapter, count);
  }
  if (isAudioMode && !elements.audioPlayer.paused) {
    elements.audioPlayer.play();
  }
}

async function nextVerse() {

  // ✅ If shuffle is ON → load random verse
  if (shuffleMode === 'shuffle') {
    await loadRandomVerse();

    if (isAudioMode && !elements.audioPlayer.paused) {
      elements.audioPlayer.play().catch(() => { });
    }
    return;
  }

  // ✅ Normal sequential logic
  const count = await getSurahAyahCount(currentVerse.chapter);

  if (currentVerse.verse < count) {
    await loadVerse(currentVerse.chapter, currentVerse.verse + 1);
  } else if (currentVerse.chapter < 114) {
    await loadVerse(currentVerse.chapter + 1, 1);
  }

  if (isAudioMode && !elements.audioPlayer.paused) {
    elements.audioPlayer.play().catch(() => { });
  }
}

let shuffleMode = 'none';
let currentVerseIndex = 0;
let verses = []; // Your verses array
let isPlaying = false;

async function loadRandomVerse() {
  const chapter = Math.floor(Math.random() * 114) + 1;
  const count = await getSurahAyahCount(chapter);
  const verse = Math.floor(Math.random() * count) + 1;

  await loadVerse(chapter, verse, true, true);

  if (isAudioMode) {
    elements.audioPlayer.play().catch(() => {});
  }
}

async function playNextVerse() {
  if (shuffleMode === 'shuffle') {
    await loadRandomVerse();
  } else {
    // Sequential playback
    currentVerseIndex = (currentVerseIndex + 1) % verses.length;
    await loadVerse(verses[currentVerseIndex].chapter, verses[currentVerseIndex].verse);
  }
}


// ==================== DROPDOWN FUNCTIONS ====================
function populateDropdown(dropdownId, items, handler) {
  const menu = document.getElementById(dropdownId);
  if (!menu) return;
  menu.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.label || item;
    li.style.cssText = 'padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f1f1;';
    li.addEventListener('click', () => {
      handler(item.code || item);
      menu.style.display = 'none';
    });
    menu.appendChild(li);
  });
}

function toggleDropdown(dropdownId) {
  const menu = document.getElementById(dropdownId);
  if (!menu) return;
  document.querySelectorAll('.dropdown-menu').forEach(d => { if (d.id !== dropdownId) d.style.display = 'none'; });
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ==================== BOOKMARK FUNCTIONS ====================
function renderBookmarks() {
  if (!elements.bookmarkList) return;
  elements.bookmarkList.innerHTML = '';
  if (bookmarks.length === 0) {
    elements.bookmarkList.innerHTML = '<li style="color:#888;padding:10px;text-align:center;font-style:italic;">No bookmarks yet.</li>';
    return;
  }
  bookmarks.forEach((bm, index) => {
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;';
    const link = document.createElement('a');
    link.href = bm.url;
    link.textContent = bm.title.length > 30 ? bm.title.substring(0, 30) + '...' : bm.title;
    link.target = '_blank';
    link.style.cssText = 'color:#1a73e8;text-decoration:none;flex:1;margin-right:10px;';
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<span class="material-icons">delete</span>';
    delBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#d32f2f;padding:4px;';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bookmarks.splice(index, 1);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      renderBookmarks();
      showNotification('Bookmark removed!');
    });
    li.appendChild(link);
    li.appendChild(delBtn);
    elements.bookmarkList.appendChild(li);
  });
}

// ==================== SAVED AYAHS FUNCTIONS ====================
function saveCurrentAyah() {
  const ref = elements.verseInfo.textContent.trim();
  if (!ref || savedAyahs.includes(ref)) {
    showNotification('Ayah already saved!', 'error');
    return;
  }
  savedAyahs.push(ref);
  localStorage.setItem('savedAyahs', JSON.stringify(savedAyahs));
  renderSavedAyahs();
  showNotification('Ayah saved to favorites!');
}

function renderSavedAyahs() {
  const savedContainer = document.querySelector('.saved-container');
  let savedDropdown = savedContainer.querySelector('.saved-dropdown');
  if (!savedDropdown) {
    savedDropdown = document.createElement('div');
    savedDropdown.className = 'saved-dropdown';
    savedDropdown.style.cssText = 'display:none;position:absolute;bottom:50px;left:0;background:white;border:1px solid #ccc;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.1);padding:10px;z-index:1000;max-height:300px;overflow-y:auto;min-width:220px;';
    const ul = document.createElement('ul');
    ul.id = 'savedList';
    ul.style.cssText = 'list-style:none;margin:0;padding:0;';
    savedDropdown.appendChild(ul);
    savedContainer.appendChild(savedDropdown);
  }
  const ul = savedDropdown.querySelector('#savedList');
  ul.innerHTML = '';
  if (savedAyahs.length === 0) {
    ul.innerHTML = '<li style="color:#888;padding:10px;text-align:center;font-style:italic;">No saved Ayah.</li>';
    return;
  }
  savedAyahs.forEach((ref, index) => {
    const li = document.createElement('li');
    li.textContent = ref;
    li.style.cssText = 'cursor:pointer;padding:10px;border-bottom:1px solid #eee;position:relative;';
    li.addEventListener('click', () => {
      const match = ref.match(/\((\d+):(\d+)\)/);
      if (match) loadVerse(parseInt(match[1]), parseInt(match[2]));
      savedDropdown.style.display = 'none';
    });
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<span class="material-icons" style="font-size:16px;">close</span>';
    delBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#d32f2f;position:absolute;right:5px;top:5px;';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      savedAyahs.splice(index, 1);
      localStorage.setItem('savedAyahs', JSON.stringify(savedAyahs));
      renderSavedAyahs();
    });
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

// ==================== QUOTE & TIME ====================
async function loadRandomQuote() {
  try {
    const res = await fetch('https://api.islamic.network/quran/en/random');
    const data = await res.json();
    if (data?.data?.text) elements.quoteContainer.textContent = data.data.text;
  } catch {
    const quotes = [
      "Verily, with hardship comes ease. (94:5)",
      "Allah does not burden a soul beyond that it can bear. (2:286)",
      "Do not lose hope, nor be sad. (3:139)",
      "We have certainly made the Quran easy for remembrance. (54:17)"
    ];
    elements.quoteContainer.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }
}

function updateTime() {
  const now = new Date();
  elements.timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ==================== MODAL FUNCTIONS ====================
async function populateSurahDropdown() {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await res.json();
    elements.chapterSelect.innerHTML = '';
    if (elements.audioChapterSelect) elements.audioChapterSelect.innerHTML = '';
    data.data.forEach(surah => {
      const opt = document.createElement('option');
      opt.value = surah.number;
      opt.textContent = `${surah.number}. ${surah.englishName}`;
      elements.chapterSelect.appendChild(opt);
      if (elements.audioChapterSelect) {
        const opt2 = document.createElement('option');
        opt2.value = surah.number;
        opt2.textContent = `${surah.number}. ${surah.englishName}`;
        elements.audioChapterSelect.appendChild(opt2);
      }
    });
    elements.chapterSelect.value = currentVerse.chapter;
    await updateVerseSelect(currentVerse.chapter);
    elements.verseSelect.value = currentVerse.verse;
    if (elements.audioChapterSelect) {
      elements.audioChapterSelect.value = currentVerse.chapter;
      await updateVerseSelectFor(elements.audioVerseSelect, currentVerse.chapter);
      if (elements.audioVerseSelect) elements.audioVerseSelect.value = currentVerse.verse;
    }
  } catch (error) { console.error('Error loading surah list:', error); }
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTafsirText(text) {
  return String(text || '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

function hasBengaliText(text) {
  return /[\u0980-\u09FF]/.test(String(text || ''));
}

function isBengaliKeyPath(keyPath) {
  const p = String(keyPath || '').toLowerCase();
  return p.includes('bangla') || p.includes('bengali') || p.includes('.bn') || p.endsWith('bn');
}

function extractBestTafsirText(payload) {
  if (!payload || typeof payload !== 'object') return '';

  const ibnKathirBn = [];
  const preferredBn = [];
  const fallbackBn = [];
  const seen = new Set();
  const stack = [{ path: '', value: payload }];

  while (stack.length) {
    const { path, value } = stack.pop();
    if (value == null) continue;

    if (typeof value === 'string') {
      const text = normalizeTafsirText(value).trim();
      if (!text || seen.has(text)) continue;
      seen.add(text);

      const keyPath = path.toLowerCase();
      const isPreferredKey =
        keyPath.includes('tafsir') ||
        isBengaliKeyPath(keyPath) ||
        keyPath.includes('marif') ||
        keyPath.includes('kathir') ||
        keyPath.includes('maududi') ||
        keyPath.includes('explain') ||
        keyPath.includes('comment');
      const isIbnKathirBn = keyPath.includes('kathir') && isBengaliKeyPath(keyPath);

      if (hasBengaliText(text)) {
        let targetBn = fallbackBn;
        if (isIbnKathirBn) targetBn = ibnKathirBn;
        else if (isPreferredKey) targetBn = preferredBn;
        targetBn.push(text);
      }
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        stack.push({ path: `${path}[${index}]`, value: item });
      });
      continue;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => {
        const nextPath = path ? `${path}.${key}` : key;
        stack.push({ path: nextPath, value: child });
      });
    }
  }

  const pickLongest = (items) => items.sort((a, b) => b.length - a.length)[0] || '';
  // Bengali-only preference for drawer output.
  return pickLongest(ibnKathirBn) || pickLongest(preferredBn) || pickLongest(fallbackBn) || '';
}

async function getAyahDetails(chapter, verse) {
  const key = `${chapter}:${verse}`;
  if (ayahDetailsCache.has(key)) return ayahDetailsCache.get(key);
  const res = await fetch(`https://quranapi.pages.dev/api/${chapter}/${verse}.json`);
  if (!res.ok) throw new Error('Failed ayah details request');
  const data = await res.json();
  ayahDetailsCache.set(key, data);
  return data;
}

async function getAyahTafsir(chapter, verse) {
  const key = `${chapter}:${verse}`;
  if (ayahTafsirCache.has(key)) return ayahTafsirCache.get(key);

  const urls = [
    `https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/bn-tafseer-ibn-e-kaseer/${chapter}/${verse}.json`,
    `https://cdn.statically.io/gh/spa5k/tafsir_api/main/tafsir/bn-tafseer-ibn-e-kaseer/${chapter}/${verse}.json`
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed tafsir request: ${res.status}`);
      const data = await res.json();
      ayahTafsirCache.set(key, data);
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Failed tafsir request');
}

async function updateVerseSelect(chapter) {
  await updateVerseSelectFor(elements.verseSelect, chapter);
}

async function updateVerseSelectFor(selectEl, chapter) {
  if (!selectEl) return;
  const count = await getSurahAyahCount(chapter);
  selectEl.innerHTML = '';
  for (let v = 1; v <= count; v++) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = `Ayah ${v}`;
    selectEl.appendChild(opt);
  }
}

// ==================== AUDIO MODE FUNCTIONS ====================
function enterAudioMode() {
  isAudioMode = true;
  elements.audioModeScreen.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('audio-mode-active');
  updateAudioModeDisplay();
  syncAudioUI();
  syncAudioModeState();
  showNotification('অডিও মোড চালু হয়েছে');
}

function exitAudioMode() {
  isAudioMode = false;
  elements.audioModeScreen.style.display = 'none';
  document.body.style.overflow = 'auto';
  document.body.classList.remove('audio-mode-active');
  if (audioModeInterval) clearInterval(audioModeInterval);
}

function updateAudioModeDisplay() {
  const arabicName = currentVerse.surahArabicName || '';
  if (elements.audioSurahArabic) {
    elements.audioSurahArabic.textContent = arabicName ? `${arabicName}` : `سورة ${currentVerse.chapter}`;
  }
  if (elements.audioSurahBengali) {
    const bengaliName = bengaliSurahNames[currentVerse.chapter] || `সূরা ${currentVerse.chapter}`;
    elements.audioSurahBengali.textContent = bengaliName;
  }
  elements.currentAyahNumber.textContent = `আয়াত ${currentVerse.verse}`;
  const reciterName = bengaliReciterNames[currentVerse.audioEdition] || currentVerse.audioEdition;
  elements.audioReciterName.textContent = reciterName;
}

function syncAudioUI() {
  elements.audioPlayer.removeEventListener('timeupdate', handleTimeUpdate);
  elements.audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
  elements.audioPlayer.removeEventListener('ended', handleAudioEnded);
  elements.audioPlayer.addEventListener('ended', handleAudioEnded);
  elements.audioPlayer.removeEventListener('loadedmetadata', handleTimeUpdate);
  elements.audioPlayer.addEventListener('loadedmetadata', handleTimeUpdate);
  elements.audioPlayer.removeEventListener('durationchange', handleTimeUpdate);
  elements.audioPlayer.addEventListener('durationchange', handleTimeUpdate);
  elements.audioPlayer.removeEventListener('seeked', handleTimeUpdate);
  elements.audioPlayer.addEventListener('seeked', handleTimeUpdate);
}

function handleTimeUpdate() {
  if (!isAudioMode) return;
  updateAudioModeProgress();
}

function updateAudioModeProgress() {
  const audio = elements.audioPlayer;
  const duration = audio.duration || 0;
  const progress = duration ? audio.currentTime / duration : 0;
  // Circle progress
  const circle = document.querySelector('.progress-ring__circle');
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  if (circle) {
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference - progress * circumference;
  }
  // Slider and times
  const percent = progress * 100;
  if (elements.audioProgress) elements.audioProgress.value = percent;
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) progressFill.style.width = `${percent}%`;
  elements.currentTime.textContent = formatTimeBangla(audio.currentTime);
  elements.totalTime.textContent = formatTimeBangla(duration);
  if (elements.audioModeTime) {
    elements.audioModeTime.textContent = `${formatTimeBangla(audio.currentTime)} / ${formatTimeBangla(duration)}`;
  }
}

function syncAudioModeState() {
  if (!isAudioMode) return;
  elements.playPauseIcon.textContent = elements.audioPlayer.paused ? 'play_arrow' : 'pause';
  elements.audioVolume.value = Math.round(elements.audioPlayer.volume * 100);
  if (elements.audioAutoPlay) {
    if (isAutoplayEnabled) elements.audioAutoPlay.classList.add('active');
    else elements.audioAutoPlay.classList.remove('active');
  }
  if (elements.audioAutoplayToggle) elements.audioAutoplayToggle.checked = isAutoplayEnabled;
  updateAudioModeProgress();
}

function handleAudioEnded() {
  if (!isAudioMode) return;
  if (repeatMode === 'repeat-one') {
    elements.audioPlayer.currentTime = 0;
    elements.audioPlayer.play().catch(() => { });
  } else if (repeatMode === 'repeat-all') {
    setTimeout(async () => {
      const count = await getSurahAyahCount(currentVerse.chapter);
      if (currentVerse.chapter === 114 && currentVerse.verse === count) {
        await loadVerse(1, 1, true, true);
      } else if (currentVerse.verse < count) {
        await loadVerse(currentVerse.chapter, currentVerse.verse + 1, true, true);
      } else {
        await loadVerse(currentVerse.chapter + 1, 1, true, true);
      }
    }, 500);
  } else if (isAutoplayEnabled) {

    setTimeout(async () => {

      // ✅ Shuffle takes priority
      if (shuffleMode === 'shuffle') {
        await loadRandomVerse();
      } else {
        await nextVerse();
      }

      elements.audioPlayer.play().catch(() => { });

    }, 500);
  }
}

function formatTimeBangla(seconds) {
  if (isNaN(seconds)) return '০০:০০';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBangla = num => num.toString().split('').map(d => bengaliDigits[parseInt(d)]).join('');
  return `${toBangla(mins.toString().padStart(2, '0'))}:${toBangla(secs.toString().padStart(2, '0'))}`;
}

function togglePlayPause() {
  if (elements.audioPlayer.paused) {
    elements.audioPlayer.play().catch(() => { });
    elements.playPauseIcon.textContent = 'pause';
  } else {
    elements.audioPlayer.pause();
    elements.playPauseIcon.textContent = 'play_arrow';
  }
}

function seekAudio(value) {
  if (elements.audioPlayer.duration) {
    elements.audioPlayer.currentTime = (value / 100) * elements.audioPlayer.duration;
  }
}

function setAudioVolume(value) {
  elements.audioPlayer.volume = value / 100;
}

function changeAudioSpeed(speed) {
  elements.audioPlayer.playbackRate = speed;
  showNotification(`পঠন গতি: ${speed}x`);
}

function setSleepTimer(minutes) {
  if (sleepTimer) clearTimeout(sleepTimer);
  if (minutes > 0) {
    sleepTimer = setTimeout(() => {
      elements.audioPlayer.pause();
      if (isAudioMode) elements.playPauseIcon.textContent = 'play_arrow';
      showNotification('ঘুমের টাইমার সম্পন্ন হয়েছে');
    }, minutes * 60000);
    showNotification(`${minutes} মিনিটের ঘুমের টাইমার সেট করা হয়েছে`);
  } else {
    showNotification('ঘুমের টাইমার বন্ধ করা হয়েছে');
  }
}

function toggleRepeatMode() {
  const btn = elements.audioRepeat;
  const icon = btn.querySelector('.material-icons');
  if (repeatMode === 'none') {
    repeatMode = 'repeat-one';
    icon.textContent = 'repeat_one';
    btn.querySelector('.control-label').textContent = 'একক পুনরাবৃত্তি';
    showNotification('একক পুনরাবৃত্তি চালু');
  } else if (repeatMode === 'repeat-one') {
    repeatMode = 'repeat-all';
    icon.textContent = 'repeat';
    btn.querySelector('.control-label').textContent = 'সকল পুনরাবৃত্তি';
    showNotification('সকল পুনরাবৃত্তি চালু');
  } else {
    repeatMode = 'none';
    icon.textContent = 'repeat';
    btn.querySelector('.control-label').textContent = 'পুনরাবৃত্তি';
    showNotification('পুনরাবৃত্তি বন্ধ');
  }
}


function toggleShuffleMode() {
  const btn = elements.audioShuffle;
  const icon = btn.querySelector('.material-icons');

  if (shuffleMode === 'none') {
    shuffleMode = 'shuffle';
    btn.classList.add('active');
    localStorage.setItem('shuffleMode', 'shuffle');
    showNotification('শাফল চালু');

    // 🔥 Immediately jump to random verse
    loadRandomVerse();

  } else {
    shuffleMode = 'none';
    btn.classList.remove('active');
    localStorage.setItem('shuffleMode', 'none');
    showNotification('শাফল বন্ধ');
  }
}

// Load shuffle mode from storage on page load
function initShuffleMode() {
  const saved = localStorage.getItem('shuffleMode');
  if (saved) {
    shuffleMode = saved;
    if (shuffleMode === 'shuffle') {
      elements.audioShuffle.classList.add('active');
    }
  }
}

function toggleAutoPlay() {
  isAutoplayEnabled = !isAutoplayEnabled;
  localStorage.setItem('autoplay', isAutoplayEnabled);
  const btn = elements.audioAutoPlay;
  if (isAutoplayEnabled) {
    btn.classList.add('active');
    showNotification('স্বয়ংক্রিয় প্লে চালু');
  } else {
    btn.classList.remove('active');
    showNotification('স্বয়ংক্রিয় প্লে বন্ধ');
  }
  // Sync main toggle if exists
  if (elements.autoplayToggle) elements.autoplayToggle.checked = isAutoplayEnabled;
  if (elements.audioAutoplayToggle) elements.audioAutoplayToggle.checked = isAutoplayEnabled;
}

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
  // Main navigation
  elements.prevVerse.addEventListener('click', prevVerse);
  elements.nextVerse.addEventListener('click', nextVerse);
  document.querySelector('.verse-content').addEventListener('dblclick', loadRandomVerse);

  // Autoplay toggle (main)
  elements.autoplayToggle.addEventListener('change', (e) => {
    isAutoplayEnabled = e.target.checked;
    localStorage.setItem('autoplay', isAutoplayEnabled);
    if (elements.audioAutoPlay) {
      if (isAutoplayEnabled) elements.audioAutoPlay.classList.add('active');
      else elements.audioAutoPlay.classList.remove('active');
    }
    if (elements.audioAutoplayToggle) elements.audioAutoplayToggle.checked = isAutoplayEnabled;
  });

  // Dropdowns (main)
  elements.audioIconBtn.addEventListener('click', () => toggleDropdown('reciterDropdown'));
  elements.translationIconBtn.addEventListener('click', () => toggleDropdown('translationDropdown'));

  // Audio ended for main mode (non-audio-mode)
  elements.audioPlayer.addEventListener('ended', () => {
    if (!isAudioMode && isAutoplayEnabled) setTimeout(nextVerse, 500);
  });

  // Surah/Ayah modal
  elements.verseInfo.addEventListener('click', async () => {
    elements.chapterSelect.value = currentVerse.chapter;
    await updateVerseSelect(currentVerse.chapter);
    elements.verseSelect.value = currentVerse.verse;
    elements.ayahModal.style.display = 'flex';
  });
  if (elements.audioSurahTrigger) {
    elements.audioSurahTrigger.addEventListener('click', async () => {
      if (elements.audioChapterSelect) {
        elements.audioChapterSelect.value = currentVerse.chapter;
        await updateVerseSelectFor(elements.audioVerseSelect, currentVerse.chapter);
        if (elements.audioVerseSelect) elements.audioVerseSelect.value = currentVerse.verse;
        elements.audioAyahDrawer.classList.add('open');
        elements.audioAyahDrawer.setAttribute('aria-hidden', 'false');
      } else {
        elements.chapterSelect.value = currentVerse.chapter;
        await updateVerseSelect(currentVerse.chapter);
        elements.verseSelect.value = currentVerse.verse;
        elements.ayahModal.style.display = 'flex';
      }
    });
  }
  if (elements.currentAyahNumber) {
    elements.currentAyahNumber.addEventListener('click', async () => {
      if (elements.audioChapterSelect) {
        elements.audioChapterSelect.value = currentVerse.chapter;
        await updateVerseSelectFor(elements.audioVerseSelect, currentVerse.chapter);
        if (elements.audioVerseSelect) elements.audioVerseSelect.value = currentVerse.verse;
        elements.audioAyahDrawer.classList.add('open');
        elements.audioAyahDrawer.setAttribute('aria-hidden', 'false');
      } else {
        elements.chapterSelect.value = currentVerse.chapter;
        await updateVerseSelect(currentVerse.chapter);
        elements.verseSelect.value = currentVerse.verse;
        elements.ayahModal.style.display = 'flex';
      }
    });
  }
  elements.goToAyahBtn.addEventListener('click', () => {
    const ch = parseInt(elements.chapterSelect.value);
    const v = parseInt(elements.verseSelect.value);
    loadVerse(ch, v);
    elements.ayahModal.style.display = 'none';
  });
  elements.cancelAyahBtn.addEventListener('click', () => elements.ayahModal.style.display = 'none');
  elements.chapterSelect.addEventListener('change', async () => {
    await updateVerseSelect(parseInt(elements.chapterSelect.value));
  });
  if (elements.audioChapterSelect) {
    elements.audioChapterSelect.addEventListener('change', async () => {
      await updateVerseSelectFor(elements.audioVerseSelect, parseInt(elements.audioChapterSelect.value));
    });
  }
  elements.audioGoToAyahBtn?.addEventListener('click', () => {
    const ch = parseInt(elements.audioChapterSelect.value);
    const v = parseInt(elements.audioVerseSelect.value);
    loadVerse(ch, v);
    elements.audioAyahDrawer.classList.remove('open');
    elements.audioAyahDrawer.setAttribute('aria-hidden', 'true');
  });
  elements.audioCancelAyahBtn?.addEventListener('click', () => {
    elements.audioAyahDrawer.classList.remove('open');
    elements.audioAyahDrawer.setAttribute('aria-hidden', 'true');
  });
  elements.audioAyahClose?.addEventListener('click', () => {
    elements.audioAyahDrawer.classList.remove('open');
    elements.audioAyahDrawer.setAttribute('aria-hidden', 'true');
  });

  // Google Apps
  // elements.googleAppsBtn.addEventListener('click', (e) => {
  //   e.stopPropagation();
  //   elements.appsDropdown.style.display = elements.appsDropdown.style.display === 'grid' ? 'none' : 'grid';
  // });

  // Bookmarks
  elements.bookmarkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.bookmarkDropdown.style.display = elements.bookmarkDropdown.style.display === 'block' ? 'none' : 'block';
    if (elements.bookmarkDropdown.style.display === 'block') renderBookmarks();
  });
  elements.addBookmarkBtn.addEventListener('click', () => {
    const title = elements.bookmarkTitle.value.trim();
    const url = elements.bookmarkURL.value.trim();
    if (title && url && url.startsWith('http')) {
      bookmarks.push({ title, url });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      elements.bookmarkTitle.value = '';
      elements.bookmarkURL.value = 'https://';
      renderBookmarks();
      showNotification('Bookmark added!');
    } else {
      showNotification('Please enter valid title and URL', 'error');
    }
  });

  // Saved ayahs
  elements.savedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const savedDropdown = document.querySelector('.saved-dropdown');
    if (savedDropdown) {
      savedDropdown.style.display = savedDropdown.style.display === 'block' ? 'none' : 'block';
      if (savedDropdown.style.display === 'block') renderSavedAyahs();
    }
  });
  elements.favouriteBtn.addEventListener('click', saveCurrentAyah);

  // Audio mode toggle
  elements.audioModeBtn.addEventListener('click', enterAudioMode);
  elements.exitAudioMode.addEventListener('click', exitAudioMode);

  // Audio mode controls
  elements.audioPlayPause.addEventListener('click', togglePlayPause);
  elements.audioPrev.addEventListener('click', prevVerse);
  elements.audioNext.addEventListener('click', nextVerse);
  elements.audioProgress.addEventListener('input', (e) => seekAudio(e.target.value));
  elements.audioVolume.addEventListener('input', (e) => setAudioVolume(e.target.value));
  elements.audioRepeat.addEventListener('click', toggleRepeatMode);
  elements.audioShuffle.addEventListener('click', toggleShuffleMode);
  elements.audioAutoPlay.addEventListener('click', toggleAutoPlay);
  elements.audioSpeed.addEventListener('click', () => elements.speedModal.style.display = 'block');
  elements.audioSleep.addEventListener('click', () => elements.sleepModal.style.display = 'block');

  // Audio mode dropdowns (reciter & translation)
  if (elements.audioReciterBtn) {
    elements.audioReciterBtn.addEventListener('click', () => toggleDropdown('audioReciterDropdown'));
  }
  if (elements.audioTranslationBtn) {
    elements.audioTranslationBtn.addEventListener('click', () => toggleDropdown('audioTranslationDropdown'));
  }

  // Speed options
  document.querySelectorAll('.speed-option').forEach(btn => {
    btn.addEventListener('click', function () {
      const speed = parseFloat(this.dataset.speed);
      changeAudioSpeed(speed);
      document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      elements.speedModal.style.display = 'none';
    });
  });

  // Sleep options
  document.querySelectorAll('.sleep-option').forEach(btn => {
    btn.addEventListener('click', function () {
      const minutes = parseInt(this.dataset.minutes);
      setSleepTimer(minutes);
      elements.sleepModal.style.display = 'none';
    });
  });

  // Close modals on outside click
  document.addEventListener('click', (e) => {
    if (elements.speedModal.style.display === 'block' && !e.target.closest('.speed-modal')) {
      elements.speedModal.style.display = 'none';
    }
    if (elements.sleepModal.style.display === 'block' && !e.target.closest('.sleep-modal')) {
      elements.sleepModal.style.display = 'none';
    }
    // Close dropdowns
    if (!e.target.closest('.custom-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
    }
    if (!elements.bookmarkBtn.contains(e.target) && !elements.bookmarkDropdown.contains(e.target)) {
      elements.bookmarkDropdown.style.display = 'none';
    }
    if (!elements.googleAppsBtn.contains(e.target) && !elements.appsDropdown.contains(e.target)) {
      elements.appsDropdown.style.display = 'none';
    }
    const savedDropdown = document.querySelector('.saved-dropdown');
    if (savedDropdown && !elements.savedBtn.contains(e.target) && !savedDropdown.contains(e.target)) {
      savedDropdown.style.display = 'none';
    }
    if (elements.audioSideDrawer) {
      const clickedDrawer = e.target.closest('#audioSideDrawer');
      const clickedTafseer = e.target.closest('#showTafseer');
      const clickedTranslation = e.target.closest('#showTranslation');
      if (!clickedDrawer && !clickedTafseer && !clickedTranslation) {
        elements.audioSideDrawer.classList.remove('open');
        elements.audioSideDrawer.setAttribute('aria-hidden', 'true');
      }
    }
    if (elements.audioAyahDrawer) {
      const clickedAyahDrawer = e.target.closest('#audioAyahDrawer');
      const clickedAyahTrigger = e.target.closest('#audioSurahTrigger') || e.target.closest('#currentAyahNumber');
      if (!clickedAyahDrawer && !clickedAyahTrigger) {
        elements.audioAyahDrawer.classList.remove('open');
        elements.audioAyahDrawer.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Play/pause icon sync
  elements.audioPlayer.addEventListener('play', () => {
    if (isAudioMode) elements.playPauseIcon.textContent = 'pause';
  });
  elements.audioPlayer.addEventListener('pause', () => {
    if (isAudioMode) elements.playPauseIcon.textContent = 'play_arrow';
  });

  // Additional controls in audio mode footer
  document.getElementById('bookmarkAudio')?.addEventListener('click', saveCurrentAyah);
  document.getElementById('shareAudio')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quran Tab',
        text: `${elements.verseArabic.textContent} - ${elements.verseTranslation.textContent}`,
        url: window.location.href
      }).catch(() => { });
    } else {
      showNotification('শেয়ার করা সমর্থিত নয়', 'error');
    }
  });

  const openAudioDrawer = (title, bodyHtml) => {
    if (!elements.audioSideDrawer) return;
    elements.audioDrawerTitle.textContent = title;
    elements.audioDrawerBody.innerHTML = bodyHtml;
    elements.audioSideDrawer.classList.add('open');
    elements.audioSideDrawer.setAttribute('aria-hidden', 'false');
  };

  const openTafsirDrawer = async () => {
    openAudioDrawer('তাফসীর', '<div class="drawer-loading">লোড হচ্ছে...</div>');
    try {
      const [ayahDetails, tafsirData] = await Promise.all([
        getAyahDetails(currentVerse.chapter, currentVerse.verse),
        getAyahTafsir(currentVerse.chapter, currentVerse.verse)
      ]);

      const arabic = escapeHtml(ayahDetails?.arabic1 || elements.verseArabic.textContent);
      const bengali = escapeHtml(ayahDetails?.bengali || elements.verseTranslation.textContent);
      const ref = `(${currentVerse.chapter}:${currentVerse.verse})`;
      const tafsirTextRaw = normalizeTafsirText(tafsirData?.text || '');
      const tafsirText = escapeHtml(tafsirTextRaw || 'বাংলা তাফসীর পাওয়া যায়নি।');

      openAudioDrawer(
        'তাফসীর',
        `
          <div class="drawer-ayah-arabic">${arabic}</div>
          <div class="drawer-ayah-bengali">${bengali}</div>
          <div class="drawer-ayah-ref">${ref}</div>
          <hr class="drawer-separator" />
          <div class="drawer-tafsir-text">${tafsirText}</div>
        `
      );
    } catch (error) {
      console.error('Tafsir drawer load error:', error);
      openAudioDrawer('তাফসীর', '<div class="drawer-error">তথ্য লোড করা যায়নি।</div>');
    }
  };

  const openTranslationDrawer = async () => {
    openAudioDrawer('অনুবাদ', '<div class="drawer-loading">লোড হচ্ছে...</div>');
    try {
      const ayahDetails = await getAyahDetails(currentVerse.chapter, currentVerse.verse);
      const arabic = escapeHtml(ayahDetails?.arabic1 || elements.verseArabic.textContent);
      const bengali = escapeHtml(ayahDetails?.bengali || elements.verseTranslation.textContent);
      const ref = `(${currentVerse.chapter}:${currentVerse.verse})`;

      openAudioDrawer(
        'অনুবাদ',
        `
          <div class="drawer-ayah-arabic">${arabic}</div>
          <div class="drawer-ayah-bengali">${bengali}</div>
          <div class="drawer-ayah-ref">${ref}</div>
        `
      );
    } catch (error) {
      console.error('Translation drawer load error:', error);
      openAudioDrawer('অনুবাদ', '<div class="drawer-error">তথ্য লোড করা যায়নি।</div>');
    }
  };


  document.getElementById('showTafseer')?.addEventListener('click', () => {
    openTafsirDrawer();
  });

  document.getElementById('showTafseerFooter')?.addEventListener('click', () => {
    openTafsirDrawer();
  });

  document.getElementById('showTranslation')?.addEventListener('click', () => {
    openTranslationDrawer();
  });
  elements.audioDrawerClose?.addEventListener('click', () => {
    elements.audioSideDrawer?.classList.remove('open');
    elements.audioSideDrawer?.setAttribute('aria-hidden', 'true');
  });

  // Audio mode autoplay toggle
  if (elements.audioAutoplayToggle) {
    elements.audioAutoplayToggle.checked = isAutoplayEnabled;
    elements.audioAutoplayToggle.addEventListener('change', (e) => {
      isAutoplayEnabled = e.target.checked;
      localStorage.setItem('autoplay', isAutoplayEnabled);
      if (elements.audioAutoPlay) {
        if (isAutoplayEnabled) elements.audioAutoPlay.classList.add('active');
        else elements.audioAutoPlay.classList.remove('active');
      }
      if (elements.autoplayToggle) elements.autoplayToggle.checked = isAutoplayEnabled;
    });
  }

}

// ==================== INITIALIZATION ====================
async function initializeApp() {
  updateTime();
  setInterval(updateTime, 1000);

  // Load autoplay preference
  isAutoplayEnabled = localStorage.getItem('autoplay') === 'true';
  elements.autoplayToggle.checked = isAutoplayEnabled;
  if (elements.audioAutoPlay) {
    if (isAutoplayEnabled) elements.audioAutoPlay.classList.add('active');
    else elements.audioAutoPlay.classList.remove('active');
  }
  if (elements.audioAutoplayToggle) elements.audioAutoplayToggle.checked = isAutoplayEnabled;

  // Populate main dropdowns
  populateDropdown('reciterDropdown', [
    { code: 'ar.shaatree', label: 'Abu Bakr Ash-Shaatree' },
    { code: 'ar.ahmedajamy', label: 'Ahmed ibn Ali al-Ajamy' },
    { code: 'ar.alafasy', label: 'Alafasy' },
    { code: 'ar.abdurrahmaansudais', label: 'Abdurrahmaan As-Sudais' },
    { code: 'ar.abdulbasitmurattal', label: 'Abdul Basit (Murattal)' },
    { code: 'ar.abdullahbasfar', label: 'Abdullah Basfar' },
    { code: 'ar.abdulsamad', label: 'Abdul Samad' },
    { code: 'ar.husary', label: 'Husary' },
    { code: 'ar.husarymujawwad', label: 'Husary (Mujawwad)' },
    { code: 'ar.hudhaify', label: 'Hudhaify' },
    { code: 'ar.mahermuaiqly', label: 'Maher Al Muaiqly' },
    { code: 'ar.minshawi', label: 'Minshawi' },
    { code: 'ar.muhammadayyoub', label: 'Muhammad Ayyoub' },
    { code: 'ar.muhammadjibreel', label: 'Muhammad Jibreel' },
    { code: 'zh.chinese', label: 'Chinese' },
    { code: 'fr.leclerc', label: 'Youssouf Leclerc (French)' },
    { code: 'ru.kuliev-audio', label: 'Elmir Kuliev by 1MuslimApp (Russian)' },
  ], (code) => {
    currentVerse.audioEdition = code;
    loadAudioByAyah(currentVerse.chapter, currentVerse.verse);
    if (isAudioMode) updateAudioModeDisplay();
  });

  populateDropdown('translationDropdown', [
    { code: 'bn.bengali', label: 'Bangla (Mohiuddin Khan)' },
    { code: 'bn.hoque', label: 'Bengali (জহুরুল হক)' },
    { code: 'en.maududi', label: 'English (Abul Ala Maududi)' },
    { code: 'en.shakir', label: 'English (Mohammad Habib Shakir)' },
    { code: 'en.itani', label: 'English (Clear Quran by Talal Itani)' },
    { code: 'en.wahiduddin', label: 'English (Wahiduddin Khan)' },
    { code: 'hi.hindi', label: 'Hindi (Muhammad Junagarhi)' },
    { code: 'hi.farooq', label: 'Hindi (Muhammad Farooq Khan and Muhammad Ahmed)' },
    { code: 'ur.jawadi', label: 'Urdu (Syed Zeeshan Haider Jawadi)' },
    { code: 'ur.kanzuliman', label: 'Urdu (Ahmed Raza Khan)' },
    { code: 'ur.qadri', label: 'Urdu (Tahir ul Qadri)' },
    { code: 'uz.sodik', label: 'Uzbek (Muhammad Sodik Muhammad Yusuf)' },
    { code: 'es.cortes', label: 'Spanish (Julio Cortes)' },
    { code: 'fa.ansarian', label: 'Persian (Hussain Ansarian)' },
    { code: 'bg.theophanov', label: 'Bulgarian (Tzvetan Theophanov)' },
    { code: 'bs.mlivo', label: 'Bosnian (Mustafa Mlivo)' },
    { code: 'fa.bahrampour', label: 'Persian (Abolfazl Bahrampour)' },
    { code: 'es.asad', label: 'Spanish (Muhammad Asad - Abdurrasak Pérez)' },
    { code: 'fa.khorramshahi', label: 'Persian (Baha\'oddin Khorramshahi)' },
    { code: 'fa.mojtabavi', label: 'Persian (Sayyed Jalaloddin Mojtabavi)' },
    { code: 'id.muntakhab', label: 'Indonesian (Muhammad Quraish Shihab et al.)' },
    { code: 'ms.basmeih', label: 'Malay (Abdullah Muhammad Basmeih)' },
    { code: 'ru.abuadel', label: 'Russian (Abu Adel)' },
    { code: 'ru.krachkovsky', label: 'Russian (Ignaty Yulianovich Krachkovsky)' },
    { code: 'ru.muntahab', label: 'Russian (Ministry of Awqaf, Egypt)' },
    { code: 'ru.sablukov', label: 'Russian (Gordy Semyonovich Sablukov)' },
    { code: 'ur.junagarhi', label: 'Urdu (Muhammad Junagarhi)' },
    { code: 'ur.maududi', label: 'Urdu (Abul A\'ala Maududi)' },
    { code: 'zh.jian', label: 'Chinese (Ma Jian)' },
    { code: 'zh.majian', label: 'Chinese (Ma Jian)' },
    { code: 'fa.khorramdel', label: 'Persian (Mostafa Khorramdel)' },
    { code: 'fa.moezzi', label: 'Persian (Mohammad Kazem Moezzi)' },
    { code: 'bs.korkut', label: 'Bosnian (Besim Korkut)' },
  ], (code) => {
    currentVerse.translation = code;
    loadVerse(currentVerse.chapter, currentVerse.verse);
    if (isAudioMode) updateAudioModeDisplay();
  });

  // Populate audio mode dropdowns (same data)
  populateDropdown('audioReciterDropdown', [
    { code: 'ar.shaatree', label: 'আবু বকর আশ-শাত্রী' },
    { code: 'ar.ahmedajamy', label: 'আহমেদ ইবনে আলী আল-আজামী' },
    { code: 'ar.alafasy', label: 'আল-আফাসী' },
    { code: 'ar.abdurrahmaansudais', label: 'আব্দুর রহমান আস-সুদাইস' },
    { code: 'ar.abdulbasitmurattal', label: 'আব্দুল বাসিত (মুরাত্তাল)' },
    { code: 'ar.abdullahbasfar', label: 'আব্দুল্লাহ বাসফার' },
    { code: 'ar.abdulsamad', label: 'আব্দুল সামাদ' },
    { code: 'ar.husary', label: 'হুসারী' },
    { code: 'ar.husarymujawwad', label: 'হুসারী (মুজাওয়াদ)' },
    { code: 'ar.hudhaify', label: 'হুদাইফী' },
    { code: 'ar.mahermuaiqly', label: 'মাহের আল মুয়াইকলী' },
    { code: 'ar.minshawi', label: 'মিনশাবী' },
    { code: 'ar.muhammadayyoub', label: 'মুহাম্মদ আইয়ুব' },
    { code: 'ar.muhammadjibreel', label: 'মুহাম্মদ জিবরীল' },
  ], (code) => {
    currentVerse.audioEdition = code;
    loadAudioByAyah(currentVerse.chapter, currentVerse.verse);
    if (isAudioMode) updateAudioModeDisplay();
  });

  populateDropdown('audioTranslationDropdown', [
    { code: 'bn.bengali', label: 'বাংলা (মুহিউদ্দীন খান)' },
    { code: 'bn.hoque', label: 'বাংলা (জহুরুল হক)' },
    { code: 'en.maududi', label: "ইংরেজি (আবুল আ'লা মওদুদী)" },
    { code: 'en.itani', label: 'ইংরেজি (তালাল ইতানী)' },
    { code: 'en.wahiduddin', label: 'ইংরেজি (ওয়াহিদুদ্দিন খান)' },
  ], (code) => {
    currentVerse.translation = code;
    loadVerse(currentVerse.chapter, currentVerse.verse);
    if (isAudioMode) updateAudioModeDisplay();
  });

  // Set default translation to Bengali if not already
  if (!currentVerse.translation.startsWith('bn.')) {
    currentVerse.translation = 'bn.bengali';
  }

  setupEventListeners();

  renderBookmarks();
  renderSavedAyahs();

  await populateSurahDropdown();
  await loadRandomQuote();
  setTimeout(loadRandomVerse, 1000);
}

// Start
document.addEventListener('DOMContentLoaded', initializeApp);