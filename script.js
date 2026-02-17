// Quran Tab Application - Production Ready (with enhanced audio mode)

let currentVerse = {
  chapter: 1,
  verse: 1,
  translation: 'bn.bengali',
  audioEdition: 'ar.shaatree',
  bitrate: '128'
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
  'ar.shaatree': 'আবু বকর আশ-শাতেরী',
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
  audioRepeatShuffle: document.getElementById('audioRepeatShuffle'),
  audioAutoPlay: document.getElementById('audioAutoPlay'),
  audioSpeed: document.getElementById('audioSpeed'),
  audioSleep: document.getElementById('audioSleep'),
  audioVolume: document.getElementById('audioVolume'),
  audioProgress: document.getElementById('audioProgress'),
  currentTime: document.getElementById('currentTime'),
  totalTime: document.getElementById('totalTime'),
  audioModeTime: document.getElementById('audioModeTime'),
  audioSurahBengali: document.getElementById('audioSurahBengali'),
  currentAyahNumber: document.getElementById('currentAyahNumber'),
  audioReciterName: document.getElementById('audioReciterName'),
  speedModal: document.getElementById('speedModal'),
  sleepModal: document.getElementById('sleepModal'),
  audioReciterBtn: document.getElementById('audioReciterBtn'),
  audioTranslationBtn: document.getElementById('audioTranslationBtn'),
  audioReciterDropdown: document.getElementById('audioReciterDropdown'),
  audioTranslationDropdown: document.getElementById('audioTranslationDropdown'),
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
async function loadVerse(chapter, verse, showLoader = true) {
  if (isLoading) return;
  isLoading = true;
  if (showLoader) showLoading(true);
  updateProgressBar(30);

  try {
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

    updateProgressBar(70);
    await loadAudioByAyah(chapter, verse);
    updateProgressBar(100);

    // Animate
    elements.verseArabic.style.animation = 'none';
    elements.verseTranslation.style.animation = 'none';
    setTimeout(() => {
      elements.verseArabic.style.animation = 'fadeInUp 0.8s ease-out';
      elements.verseTranslation.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
    }, 10);

    if (isAudioMode) updateAudioModeDisplay();
  } catch (error) {
    console.error('Failed to load verse:', error);
    // fallback
    elements.verseArabic.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    elements.verseTranslation.textContent = 'In the name of Allah, the Most Gracious, the Most Merciful.';
    elements.verseInfo.textContent = 'Surah Al-Fatiha (1:1)';
    currentVerse.chapter = 1;
    currentVerse.verse = 1;
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
      await elements.audioPlayer.play().catch(() => {});
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
  const count = await getSurahAyahCount(currentVerse.chapter);
  if (currentVerse.verse < count) {
    await loadVerse(currentVerse.chapter, currentVerse.verse + 1);
  } else if (currentVerse.chapter < 114) {
    await loadVerse(currentVerse.chapter + 1, 1);
  }
  if (isAudioMode && !elements.audioPlayer.paused) {
    elements.audioPlayer.play();
  }
}

async function loadRandomVerse() {
  const chapter = Math.floor(Math.random() * 114) + 1;
  const count = await getSurahAyahCount(chapter);
  const verse = Math.floor(Math.random() * count) + 1;
  await loadVerse(chapter, verse);
  showNotification('Loaded random verse!');
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
    link.textContent = bm.title.length > 30 ? bm.title.substring(0,30)+'...' : bm.title;
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
    data.data.forEach(surah => {
      const opt = document.createElement('option');
      opt.value = surah.number;
      opt.textContent = `${surah.number}. ${surah.englishName}`;
      elements.chapterSelect.appendChild(opt);
    });
    elements.chapterSelect.value = currentVerse.chapter;
    await updateVerseSelect(currentVerse.chapter);
    elements.verseSelect.value = currentVerse.verse;
  } catch (error) { console.error('Error loading surah list:', error); }
}

async function updateVerseSelect(chapter) {
  const count = await getSurahAyahCount(chapter);
  elements.verseSelect.innerHTML = '';
  for (let v=1; v<=count; v++) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = `Ayah ${v}`;
    elements.verseSelect.appendChild(opt);
  }
}

// ==================== AUDIO MODE FUNCTIONS ====================
function enterAudioMode() {
  isAudioMode = true;
  elements.audioModeScreen.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateAudioModeDisplay();
  syncAudioUI();
  showNotification('অডিও মোড চালু হয়েছে');
}

function exitAudioMode() {
  isAudioMode = false;
  elements.audioModeScreen.style.display = 'none';
  document.body.style.overflow = 'auto';
  if (audioModeInterval) clearInterval(audioModeInterval);
}

function updateAudioModeDisplay() {
  const bengaliName = bengaliSurahNames[currentVerse.chapter] || `সূরা ${currentVerse.chapter}`;
  elements.audioSurahBengali.textContent = bengaliName;
  elements.currentAyahNumber.textContent = `আয়াত ${currentVerse.verse}`;
  const reciterName = bengaliReciterNames[currentVerse.audioEdition] || currentVerse.audioEdition;
  elements.audioReciterName.textContent = reciterName;
}

function syncAudioUI() {
  elements.audioPlayer.removeEventListener('timeupdate', handleTimeUpdate);
  elements.audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
  elements.audioPlayer.removeEventListener('ended', handleAudioEnded);
  elements.audioPlayer.addEventListener('ended', handleAudioEnded);
}

function handleTimeUpdate() {
  if (!isAudioMode) return;
  const audio = elements.audioPlayer;
  if (!audio.duration) return;
  const progress = audio.currentTime / audio.duration;
  // Circle progress
  const circle = document.querySelector('.progress-ring__circle');
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference - progress * circumference;
  // Slider and times
  const percent = progress * 100;
  elements.audioProgress.value = percent;
  document.querySelector('.progress-fill').style.width = `${percent}%`;
  elements.currentTime.textContent = formatTimeBangla(audio.currentTime);
  elements.totalTime.textContent = formatTimeBangla(audio.duration);
  elements.audioModeTime.textContent = `${formatTimeBangla(audio.currentTime)} / ${formatTimeBangla(audio.duration)}`;
}

function handleAudioEnded() {
  if (!isAudioMode) return;
  if (repeatMode === 'repeat-one') {
    elements.audioPlayer.currentTime = 0;
    elements.audioPlayer.play();
  } else if (isAutoplayEnabled) {
    setTimeout(() => {
      nextVerse();
      if (!elements.audioPlayer.paused) elements.audioPlayer.play();
    }, 500);
  }
}

function formatTimeBangla(seconds) {
  if (isNaN(seconds)) return '০০:০০';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const toBangla = num => num.toString().split('').map(d => bengaliDigits[parseInt(d)]).join('');
  return `${toBangla(mins.toString().padStart(2,'0'))}:${toBangla(secs.toString().padStart(2,'0'))}`;
}

function togglePlayPause() {
  if (elements.audioPlayer.paused) {
    elements.audioPlayer.play();
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
  const btn = elements.audioRepeatShuffle;
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

  // Google Apps
  elements.googleAppsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.appsDropdown.style.display = elements.appsDropdown.style.display === 'grid' ? 'none' : 'grid';
  });

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
  elements.audioRepeatShuffle.addEventListener('click', toggleRepeatMode);
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
    btn.addEventListener('click', function() {
      const speed = parseFloat(this.dataset.speed);
      changeAudioSpeed(speed);
      document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      elements.speedModal.style.display = 'none';
    });
  });

  // Sleep options
  document.querySelectorAll('.sleep-option').forEach(btn => {
    btn.addEventListener('click', function() {
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
  });

  // Play/pause icon sync
  elements.audioPlayer.addEventListener('play', () => {
    if (isAudioMode) elements.playPauseIcon.textContent = 'pause';
  });
  elements.audioPlayer.addEventListener('pause', () => {
    if (isAudioMode) elements.playPauseIcon.textContent = 'play_arrow';
  });

  // Additional controls in audio mode footer
  document.getElementById('showTafseer')?.addEventListener('click', () => showNotification('তাফসীর শীঘ্রই আসছে', 'info'));
  document.getElementById('showTranslation')?.addEventListener('click', () => showNotification('অনুবাদ মোড শীঘ্রই আসছে', 'info'));
  document.getElementById('bookmarkAudio')?.addEventListener('click', saveCurrentAyah);
  document.getElementById('shareAudio')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quran Tab',
        text: `${elements.verseArabic.textContent} - ${elements.verseTranslation.textContent}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      showNotification('শেয়ার করা সমর্থিত নয়', 'error');
    }
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
    { code: 'ar.shaatree', label: 'আবু বকর আশ-শাতেরী' },
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