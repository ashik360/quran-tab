// Quran Tab Application - Fixed Version
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
let isAudioMode = false;
let isPlaying = false;
let audioModeInterval;
let currentProgress = 0;
let audioSpeed = 1;
let sleepTimer = null;
let repeatMode = 'none'; // 'none', 'repeat-one', 'repeat-all'
let arabicTickerAnim;
let bengaliTickerAnim;
let surahBengaliNames = {};

// Bengali Surah Names Mapping
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

// Audio Mode Functions
function enterAudioMode() {
  isAudioMode = true;
  document.getElementById('audioModeScreen').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Update audio mode display with current data
  updateAudioModeDisplay();
  
  // Start updating progress
  startAudioModeProgress();
  
  // Start ticker animations
  setupTickerAnimations();
  
  showNotification('অডিও মোড শুরু হয়েছে');
}

function exitAudioMode() {
  isAudioMode = false;
  document.getElementById('audioModeScreen').style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Clear intervals
  if (audioModeInterval) {
    clearInterval(audioModeInterval);
  }
  if (arabicTickerAnim) {
    clearInterval(arabicTickerAnim);
  }
  if (bengaliTickerAnim) {
    clearInterval(bengaliTickerAnim);
  }
  
  // Clear sleep timer
  if (sleepTimer) {
    clearTimeout(sleepTimer);
    sleepTimer = null;
  }
}

function updateAudioModeDisplay() {
  // Update surah name
  const surahArabicName = getSurahArabicName(currentVerse.chapter);
  const surahBengaliName = bengaliSurahNames[currentVerse.chapter] || `সূরা ${currentVerse.chapter}`;
  
  document.getElementById('audioSurahArabic').textContent = surahArabicName;
  document.getElementById('audioSurahBengali').textContent = surahBengaliName;
  
  // Update ayah number in Bengali
  document.getElementById('currentAyahNumber').textContent = `আয়াত ${currentVerse.verse}`;
  
  // Update ticker content
  document.getElementById('arabicTickerContent').textContent = elements.verseArabic.textContent;
  document.getElementById('bengaliTickerContent').textContent = elements.verseTranslation.textContent;
  
  // Update reciter name in Bengali
  const reciterName = bengaliReciterNames[currentVerse.audioEdition] || currentVerse.audioEdition;
  document.getElementById('audioReciterName').textContent = reciterName;
}

function getSurahArabicName(chapter) {
  const surahNames = {
    1: 'الفاتحة',
    2: 'البقرة',
    3: 'آل عمران',
    4: 'النساء',
    5: 'المائدة',
    6: 'الأنعام',
    7: 'الأعراف',
    8: 'الأنفال',
    9: 'التوبة',
    10: 'يونس',
    114: 'الناس'
  };
  return surahNames[chapter] || `سورة ${chapter}`;
}

function setupTickerAnimations() {
  const audio = elements.audioPlayer;
  if (!audio.duration) return;
  
  const arabicContent = document.getElementById('arabicTickerContent');
  const bengaliContent = document.getElementById('bengaliTickerContent');
  const arabicTrack = document.getElementById('arabicTickerTrack');
  const bengaliTrack = document.getElementById('bengaliTickerTrack');
  
  // Clear existing animations
  if (arabicTickerAnim) clearInterval(arabicTickerAnim);
  if (bengaliTickerAnim) clearInterval(bengaliTickerAnim);
  
  // Calculate text widths
  const arabicWidth = arabicContent.scrollWidth;
  const bengaliWidth = bengaliContent.scrollWidth;
  const trackWidth = arabicTrack.clientWidth;
  
  // Calculate total distance to travel
  const arabicTravel = arabicWidth + trackWidth;
  const bengaliTravel = bengaliWidth + trackWidth;
  
  // Reset positions
  arabicContent.style.transform = 'translateX(100%)';
  bengaliContent.style.transform = 'translateX(-100%)';
  
  // Start synchronized animations based on audio duration
  const duration = audio.duration * 1000; // Convert to milliseconds
  let startTime = Date.now();
  
  arabicTickerAnim = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Arabic moves left to right (positive direction)
    const arabicPos = (1 - progress) * 100;
    arabicContent.style.transform = `translateX(${arabicPos}%)`;
    
    // Bengali moves right to left (negative direction)
    const bengaliPos = -(1 - progress) * 100;
    bengaliContent.style.transform = `translateX(${bengaliPos}%)`;
    
    if (progress >= 1) {
      clearInterval(arabicTickerAnim);
      clearInterval(bengaliTickerAnim);
    }
  }, 16); // ~60fps
}

function startAudioModeProgress() {
  const audio = elements.audioPlayer;
  const progressCircle = document.querySelector('.progress-ring__circle');
  const progressSlider = document.getElementById('audioProgress');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const progressFill = document.querySelector('.progress-fill');
  
  if (audioModeInterval) {
    clearInterval(audioModeInterval);
  }
  
  audioModeInterval = setInterval(() => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      currentProgress = progress;
      
      // Update circle progress
      const circumference = 2 * Math.PI * 140;
      const offset = circumference - (progress / 100) * circumference;
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = offset;
      
      // Update slider
      progressSlider.value = progress;
      progressFill.style.width = `${progress}%`;
      
      // Update times in Bengali format
      currentTimeEl.textContent = formatTimeBangla(audio.currentTime);
      totalTimeEl.textContent = formatTimeBangla(audio.duration);
      
      // Update header time
      document.getElementById('audioModeTime').textContent = 
        `${formatTimeBangla(audio.currentTime)} / ${formatTimeBangla(audio.duration)}`;
    }
  }, 100);
}

function formatTimeBangla(seconds) {
  if (isNaN(seconds)) return '০০:০০';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  // Convert to Bengali numerals
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const formatNumber = (num) => {
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
  };
  
  return `${formatNumber(mins.toString().padStart(2, '0'))}:${formatNumber(secs.toString().padStart(2, '0'))}`;
}

function toggleAudioPlayPause() {
  const audio = elements.audioPlayer;
  const playPauseIcon = document.getElementById('playPauseIcon');
  
  if (audio.paused) {
    audio.play().then(() => {
      playPauseIcon.textContent = 'pause';
      isPlaying = true;
      if (isAudioMode) {
        startAudioModeProgress();
        setupTickerAnimations();
      }
    });
  } else {
    audio.pause();
    playPauseIcon.textContent = 'play_arrow';
    isPlaying = false;
  }
}

function seekAudio(value) {
  const audio = elements.audioPlayer;
  if (audio.duration) {
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
    if (isAudioMode) {
      setupTickerAnimations();
    }
  }
}

function setAudioVolume(value) {
  const audio = elements.audioPlayer;
  audio.volume = value / 100;
}

function changeAudioSpeed(speed) {
  const audio = elements.audioPlayer;
  audio.playbackRate = speed;
  audioSpeed = speed;
  showNotification(`পঠন গতি: ${speed}x`);
}

function setSleepTimer(minutes) {
  if (sleepTimer) {
    clearTimeout(sleepTimer);
    sleepTimer = null;
  }
  
  if (minutes > 0) {
    sleepTimer = setTimeout(() => {
      const audio = elements.audioPlayer;
      audio.pause();
      if (isAudioMode) {
        document.getElementById('playPauseIcon').textContent = 'play_arrow';
        isPlaying = false;
      }
      showNotification('ঘুমের টাইমার সম্পন্ন হয়েছে');
    }, minutes * 60 * 1000);
    
    showNotification(`${minutes} মিনিটের ঘুমের টাইমার সেট করা হয়েছে`);
  } else {
    showNotification('ঘুমের টাইমার বন্ধ করা হয়েছে');
  }
}

function toggleRepeatMode() {
  const btn = document.getElementById('audioRepeatShuffle');
  const icon = btn.querySelector('.material-icons');
  
  if (repeatMode === 'none') {
    repeatMode = 'repeat-one';
    icon.textContent = 'repeat_one';
    btn.querySelector('.control-label').textContent = 'একক পুনরাবৃত্তি';
    elements.audioPlayer.loop = true;
    showNotification('একক পুনরাবৃত্তি চালু');
  } else if (repeatMode === 'repeat-one') {
    repeatMode = 'repeat-all';
    icon.textContent = 'repeat';
    btn.querySelector('.control-label').textContent = 'সকল পুনরাবৃত্তি';
    elements.audioPlayer.loop = false;
    showNotification('সকল পুনরাবৃত্তি চালু');
  } else {
    repeatMode = 'none';
    icon.textContent = 'repeat';
    btn.querySelector('.control-label').textContent = 'পুনরাবৃত্তি';
    elements.audioPlayer.loop = false;
    showNotification('পুনরাবৃত্তি বন্ধ');
  }
}

function toggleAutoPlay() {
  const btn = document.getElementById('audioAutoPlay');
  isAutoplayEnabled = !isAutoplayEnabled;
  localStorage.setItem('autoplay', isAutoplayEnabled);
  
  if (isAutoplayEnabled) {
    btn.classList.add('active');
    showNotification('স্বয়ংক্রিয় প্লে চালু');
  } else {
    btn.classList.remove('active');
    showNotification('স্বয়ংক্রিয় প্লে বন্ধ');
  }
}


// ==================== DOM ELEMENTS ====================
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
  favouriteBtn: document.getElementById('favouriteBtn')
};

// ==================== UTILITY FUNCTIONS ====================
function showLoading(show = true) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.add('show');
  } else {
    overlay.classList.remove('show');
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateProgressBar(percent) {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

function resetProgressBar() {
  updateProgressBar(0);
}

// Audio Mode Functions
function enterAudioMode() {
  isAudioMode = true;
  document.getElementById('audioModeScreen').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Update audio mode display with current data
  updateAudioModeDisplay();
  
  // Start updating progress
  startAudioModeProgress();
  
  showNotification('Entered Audio Mode');
}

function exitAudioMode() {
  isAudioMode = false;
  document.getElementById('audioModeScreen').style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Clear interval
  if (audioModeInterval) {
    clearInterval(audioModeInterval);
  }
}

function updateAudioModeDisplay() {
  // Update surah name
  const surahName = elements.verseInfo.textContent.split(' ')[1];
  const surahArabicName = getSurahArabicName(currentVerse.chapter);
  document.getElementById('audioSurahArabic').textContent = surahArabicName;
  document.getElementById('audioSurahEnglish').textContent = surahName;
  
  // Update ayah number
  document.getElementById('currentAyahNumber').textContent = `Ayah ${currentVerse.verse}`;
  
  // Update ticker
  document.getElementById('tickerArabic').textContent = elements.verseArabic.textContent;
  document.getElementById('tickerTranslation').textContent = elements.verseTranslation.textContent;
  
  // Update reciter name
  const reciterSelect = document.querySelector('#reciterDropdown li[data-selected="true"]');
  if (reciterSelect) {
    document.getElementById('audioReciterName').textContent = reciterSelect.textContent;
  }
}

function getSurahArabicName(chapter) {
  // Arabic names for first few surahs
  const surahNames = {
    1: 'الفاتحة',
    2: 'البقرة',
    3: 'آل عمران',
    4: 'النساء',
    5: 'المائدة',
    6: 'الأنعام',
    7: 'الأعراف',
    8: 'الأنفال',
    9: 'التوبة',
    10: 'يونس'
  };
  return surahNames[chapter] || `سورة ${chapter}`;
}

function startAudioModeProgress() {
  const audio = elements.audioPlayer;
  const progressCircle = document.querySelector('.progress-ring__circle');
  const progressSlider = document.getElementById('audioProgress');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const progressFill = document.querySelector('.progress-fill');
  
  if (audioModeInterval) {
    clearInterval(audioModeInterval);
  }
  
  audioModeInterval = setInterval(() => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      currentProgress = progress;
      
      // Update circle progress
      const circumference = 2 * Math.PI * 140;
      const offset = circumference - (progress / 100) * circumference;
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = offset;
      
      // Update slider
      progressSlider.value = progress;
      progressFill.style.width = `${progress}%`;
      
      // Update times
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
      
      // Update header time
      document.getElementById('audioModeTime').textContent = 
        `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  }, 100);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleAudioPlayPause() {
  const audio = elements.audioPlayer;
  const playPauseIcon = document.getElementById('playPauseIcon');
  
  if (audio.paused) {
    audio.play();
    playPauseIcon.textContent = 'pause';
    isPlaying = true;
  } else {
    audio.pause();
    playPauseIcon.textContent = 'play_arrow';
    isPlaying = false;
  }
}

function seekAudio(value) {
  const audio = elements.audioPlayer;
  if (audio.duration) {
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
  }
}

function setAudioVolume(value) {
  const audio = elements.audioPlayer;
  audio.volume = value / 100;
}

// ==================== QURAN DATA FUNCTIONS ====================
async function getGlobalAyahNumber(chapter, verse) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}`);
    const data = await response.json();
    return data.data.number;
  } catch (error) {
    console.error('Error getting ayah number:', error);
    return null;
  }
}

async function getSurahAyahCount(chapter) {
  if (surahAyahCounts[chapter]) return surahAyahCounts[chapter];
  
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${chapter}`);
    const data = await res.json();
    const count = data.data.numberOfAyahs;
    surahAyahCounts[chapter] = count;
    return count;
  } catch (error) {
    console.error('Error getting surah count:', error);
    return 7; // Default for Al-Fatiha
  }
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
    
    // Update UI
    elements.verseArabic.textContent = arabicData.data.text;
    elements.verseTranslation.textContent = transData.data[0].text;
    elements.verseInfo.textContent = `Surah ${arabicData.data.surah.englishName} (${chapter}:${verse})`;
    
    currentVerse.chapter = chapter;
    currentVerse.verse = verse;
    
    updateProgressBar(70);
    await loadAudioByAyah(chapter, verse);
    updateProgressBar(100);
    
    // Animate the verse change
    elements.verseArabic.style.animation = 'none';
    elements.verseTranslation.style.animation = 'none';
    setTimeout(() => {
      elements.verseArabic.style.animation = 'fadeInUp 0.8s ease-out';
      elements.verseTranslation.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
    }, 10);
    
  } catch (error) {
    console.error('Failed to load verse:', error);
    // Fallback
    elements.verseArabic.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    elements.verseTranslation.textContent = 'In the name of Allah, the Most Gracious, the Most Merciful.';
    elements.verseInfo.textContent = 'Surah Al-Fatiha (1:1)';
    currentVerse.chapter = 1;
    currentVerse.verse = 1;
    showNotification('Failed to load verse. Please check your connection.', 'error');
  } finally {
    isLoading = false;
    if (showLoader) showLoading(false);
    setTimeout(() => resetProgressBar(), 1000);
  }
}

async function loadAudioByAyah(chapter, verse) {
  try {
    const ayahNum = await getGlobalAyahNumber(chapter, verse);
    if (!ayahNum) throw new Error('Could not get ayah number');
    
    const player = elements.audioPlayer;
    player.src = `https://cdn.islamic.network/quran/audio/${currentVerse.bitrate}/${currentVerse.audioEdition}/${ayahNum}.mp3`;
    player.load();
    
    if (isAutoplayEnabled) {
      await player.play().catch(err => console.warn('Autoplay failed:', err));
    }
    
    // Update progress bar during playback
    player.addEventListener('timeupdate', () => {
      const percent = (player.currentTime / player.duration) * 100 || 0;
      updateProgressBar(percent);
    });
    
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
    const ayahCount = await getSurahAyahCount(prevChapter);
    await loadVerse(prevChapter, ayahCount);
  }
}

async function nextVerse() {
  const ayahCount = await getSurahAyahCount(currentVerse.chapter);
  
  if (currentVerse.verse < ayahCount) {
    await loadVerse(currentVerse.chapter, currentVerse.verse + 1);
  } else if (currentVerse.chapter < 114) {
    await loadVerse(currentVerse.chapter + 1, 1);
  }
}

async function loadRandomVerse() {
  const chapter = Math.floor(Math.random() * 114) + 1;
  const ayahCount = await getSurahAyahCount(chapter);
  const verse = Math.floor(Math.random() * ayahCount) + 1;
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
    li.addEventListener('mouseenter', () => {
      li.style.background = '#f5f5f5';
    });
    li.addEventListener('mouseleave', () => {
      li.style.background = '';
    });
    menu.appendChild(li);
  });
}

function toggleDropdown(dropdownId) {
  const menu = document.getElementById(dropdownId);
  if (!menu) return;
  
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(d => {
    if (d.id !== dropdownId) d.style.display = 'none';
  });
  
  // Toggle current dropdown
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'block';
    menu.style.zIndex = '10000';
  }
}

// ==================== BOOKMARK FUNCTIONS ====================
function renderBookmarks() {
  if (!elements.bookmarkList) return;
  
  elements.bookmarkList.innerHTML = '';
  
  if (bookmarks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No bookmarks yet.';
    li.style.cssText = 'color:#888;padding:10px;text-align:center;font-style:italic;';
    elements.bookmarkList.appendChild(li);
    return;
  }
  
  bookmarks.forEach((bm, index) => {
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;';
    
    const link = document.createElement('a');
    link.href = bm.url;
    link.textContent = bm.title.length > 30 ? bm.title.substring(0, 30) + '...' : bm.title;
    link.target = '_blank';
    link.title = bm.url;
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
    savedDropdown.style.cssText = `
      display: none;
      position: absolute;
      bottom: 50px;
      left: 0;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 10px;
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      min-width: 220px;
    `;
    
    const ul = document.createElement('ul');
    ul.id = 'savedList';
    ul.style.cssText = 'list-style:none;margin:0;padding:0;';
    savedDropdown.appendChild(ul);
    savedContainer.appendChild(savedDropdown);
  }
  
  const ul = savedDropdown.querySelector('#savedList');
  ul.innerHTML = '';
  
  if (savedAyahs.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No saved Ayah.';
    li.style.cssText = 'color:#888;padding:10px;text-align:center;font-style:italic;';
    ul.appendChild(li);
    return;
  }
  
  savedAyahs.forEach((ref, index) => {
    const li = document.createElement('li');
    li.textContent = ref;
    li.style.cssText = 'cursor:pointer;padding:10px;border-bottom:1px solid #eee;';
    li.addEventListener('click', () => {
      const match = ref.match(/\((\d+):(\d+)\)/);
      if (match) {
        loadVerse(parseInt(match[1]), parseInt(match[2]));
        savedDropdown.style.display = 'none';
      }
    });
    
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<span class="material-icons" style="font-size:16px;float:right;">close</span>';
    delBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#d32f2f;float:right;';
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

// ==================== QUOTE & TIME FUNCTIONS ====================
async function loadRandomQuote() {
  try {
    const res = await fetch('https://api.islamic.network/quran/en/random');
    const data = await res.json();
    if (data?.data?.text) {
      elements.quoteContainer.textContent = data.data.text;
    }
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
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  elements.timeDisplay.textContent = timeStr;
}

// ==================== MODAL FUNCTIONS ====================
async function populateSurahDropdown() {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await res.json();
    
    elements.chapterSelect.innerHTML = '';
    data.data.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName}`;
      elements.chapterSelect.appendChild(option);
    });
    
    // Set current surah
    elements.chapterSelect.value = currentVerse.chapter;
    await updateVerseSelect(currentVerse.chapter);
    elements.verseSelect.value = currentVerse.verse;
    
  } catch (error) {
    console.error('Error loading surah list:', error);
  }
}

async function updateVerseSelect(chapter) {
  try {
    const count = await getSurahAyahCount(chapter);
    elements.verseSelect.innerHTML = '';
    
    for (let v = 1; v <= count; v++) {
      const option = document.createElement('option');
      option.value = v;
      option.textContent = `Ayah ${v}`;
      elements.verseSelect.appendChild(option);
    }
  } catch (error) {
    console.error('Error updating verse select:', error);
  }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Navigation buttons
  elements.prevVerse.addEventListener('click', prevVerse);
  elements.nextVerse.addEventListener('click', nextVerse);
  
  // Double-click for random verse
  document.querySelector('.verse-content').addEventListener('dblclick', loadRandomVerse);
  
  // Auto-play toggle
  elements.autoplayToggle.addEventListener('change', (e) => {
    isAutoplayEnabled = e.target.checked;
    localStorage.setItem('autoplay', isAutoplayEnabled);
  });
  
  // Dropdown buttons
  elements.audioIconBtn.addEventListener('click', () => toggleDropdown('reciterDropdown'));
  elements.translationIconBtn.addEventListener('click', () => toggleDropdown('translationDropdown'));
  
  // Audio ended event
  elements.audioPlayer.addEventListener('ended', () => {
    if (isAutoplayEnabled) {
      setTimeout(nextVerse, 500);
    }
  });
  
  // Surah/Ayah modal
  elements.verseInfo.addEventListener('click', async () => {
    elements.chapterSelect.value = currentVerse.chapter;
    await updateVerseSelect(currentVerse.chapter);
    elements.verseSelect.value = currentVerse.verse;
    elements.ayahModal.style.display = 'flex';
  });
  
  elements.goToAyahBtn.addEventListener('click', () => {
    const chapter = parseInt(elements.chapterSelect.value);
    const verse = parseInt(elements.verseSelect.value);
    loadVerse(chapter, verse);
    elements.ayahModal.style.display = 'none';
  });
  
  elements.cancelAyahBtn.addEventListener('click', () => {
    elements.ayahModal.style.display = 'none';
  });
  
  elements.chapterSelect.addEventListener('change', async () => {
    await updateVerseSelect(parseInt(elements.chapterSelect.value));
  });
  
  // Google Apps dropdown
  elements.googleAppsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.appsDropdown.style.display = 
      elements.appsDropdown.style.display === 'grid' ? 'none' : 'grid';
  });
  
  // Bookmark functionality
  elements.bookmarkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.bookmarkDropdown.style.display = 
      elements.bookmarkDropdown.style.display === 'block' ? 'none' : 'block';
    if (elements.bookmarkDropdown.style.display === 'block') {
      renderBookmarks();
    }
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
      savedDropdown.style.display = 
        savedDropdown.style.display === 'block' ? 'none' : 'block';
      if (savedDropdown.style.display === 'block') {
        renderSavedAyahs();
      }
    }
  });

  // Add these inside setupEventListeners function:

// Audio Mode Button
document.getElementById('audioModeBtn')?.addEventListener('click', enterAudioMode);

// Exit Audio Mode
document.getElementById('exitAudioMode')?.addEventListener('click', exitAudioMode);

// Audio Play/Pause
document.getElementById('audioPlayPause')?.addEventListener('click', toggleAudioPlayPause);

// Audio Navigation
document.getElementById('audioPrev')?.addEventListener('click', prevVerse);
document.getElementById('audioNext')?.addEventListener('click', nextVerse);

// Audio Progress
document.getElementById('audioProgress')?.addEventListener('input', (e) => {
  seekAudio(e.target.value);
});

// Audio Volume
document.getElementById('audioVolume')?.addEventListener('input', (e) => {
  setAudioVolume(e.target.value);
});

// Repeat/Shuffle Button
document.getElementById('audioRepeatShuffle')?.addEventListener('click', toggleRepeatMode);

// Auto Play Button
document.getElementById('audioAutoPlay')?.addEventListener('click', toggleAutoPlay);

// Speed Button
document.getElementById('audioSpeed')?.addEventListener('click', function() {
  const modal = document.getElementById('speedModal');
  modal.style.display = 'block';
});

// Sleep Button
document.getElementById('audioSleep')?.addEventListener('click', function() {
  const modal = document.getElementById('sleepModal');
  modal.style.display = 'block';
});

// Speed Options
document.querySelectorAll('.speed-option').forEach(btn => {
  btn.addEventListener('click', function() {
    const speed = parseFloat(this.dataset.speed);
    changeAudioSpeed(speed);
    
    // Update active state
    document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Hide modal
    document.getElementById('speedModal').style.display = 'none';
  });
});

// Sleep Options
document.querySelectorAll('.sleep-option').forEach(btn => {
  btn.addEventListener('click', function() {
    const minutes = parseInt(this.dataset.minutes);
    setSleepTimer(minutes);
    document.getElementById('sleepModal').style.display = 'none';
  });
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const speedModal = document.getElementById('speedModal');
  const sleepModal = document.getElementById('sleepModal');
  
  if (speedModal.style.display === 'block' && !e.target.closest('.speed-modal')) {
    speedModal.style.display = 'none';
  }
  
  if (sleepModal.style.display === 'block' && !e.target.closest('.sleep-modal')) {
    sleepModal.style.display = 'none';
  }
});

// Update audio mode when verse changes
elements.audioPlayer.addEventListener('play', () => {
  if (isAudioMode) {
    document.getElementById('playPauseIcon').textContent = 'pause';
    isPlaying = true;
    startAudioModeProgress();
    setupTickerAnimations();
  }
});

elements.audioPlayer.addEventListener('pause', () => {
  if (isAudioMode) {
    document.getElementById('playPauseIcon').textContent = 'play_arrow';
    isPlaying = false;
  }
});

elements.audioPlayer.addEventListener('ended', () => {
  if (isAudioMode) {
    if (repeatMode === 'repeat-one') {
      elements.audioPlayer.currentTime = 0;
      elements.audioPlayer.play();
    } else if (isAutoplayEnabled) {
      setTimeout(nextVerse, 1000);
    }
  }
});

// Update audio mode when verse loads
// Modify the loadVerse function to update audio mode if active
// Add this at the end of loadVerse function, before the final closing brace:
if (isAudioMode) {
  updateAudioModeDisplay();
  setupTickerAnimations();
}
  
  // Favourite button
  elements.favouriteBtn.addEventListener('click', saveCurrentAyah);
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    // Close reciter/translation dropdowns
    if (!e.target.closest('.custom-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
    
    // Close bookmark dropdown
    if (!elements.bookmarkBtn.contains(e.target) && !elements.bookmarkDropdown.contains(e.target)) {
      elements.bookmarkDropdown.style.display = 'none';
    }
    
    // Close apps dropdown
    if (!elements.googleAppsBtn.contains(e.target) && !elements.appsDropdown.contains(e.target)) {
      elements.appsDropdown.style.display = 'none';
    }
    
    // Close saved dropdown
    const savedDropdown = document.querySelector('.saved-dropdown');
    if (savedDropdown && !elements.savedBtn.contains(e.target) && !savedDropdown.contains(e.target)) {
      savedDropdown.style.display = 'none';
    }
  });
}

// ==================== INITIALIZATION ====================
async function initializeApp() {
  // Set up time
  updateTime();
  setInterval(updateTime, 1000);
  
  // Load saved preferences
  isAutoplayEnabled = localStorage.getItem('autoplay') === 'true';
  elements.autoplayToggle.checked = isAutoplayEnabled;
  
  // Populate dropdowns
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
  });
  
  populateDropdown('translationDropdown', [
    { code: 'bn.bengali', label: 'Bangla (Mohiuddin Khan)' },
    { code: 'bn.hoque', label: 'Bengali (জহুরুল হক)' },
    { code: 'en.maududi', label: 'English (Abul Ala Maududi)' },
    { code: 'en.shakir', label: 'English (Mohammad Habib Shakir)' },
    { code: 'en.itani', label: 'English (Clear Quran by Talal Itani)' },
    { code: 'en.wahiduddin', label: 'English (Wahiduddin Khan)' },
    { code: 'hi.hindi',           label: 'Hindi (Muhammad Junagarhi)' },
    { code: 'hi.farooq',         label: 'Hindi (Muhammad Farooq Khan and Muhammad Ahmed)' },
    { code: 'ur.jawadi',         label: 'Urdu (Syed Zeeshan Haider Jawadi)' },
    { code: 'ur.kanzuliman',     label: 'Urdu (Ahmed Raza Khan)' },
    { code: 'ur.qadri',          label: 'Urdu (Tahir ul Qadri)' },
    { code: 'uz.sodik',          label: 'Uzbek (Muhammad Sodik Muhammad Yusuf)' },
    { code: 'es.cortes',         label: 'Spanish (Julio Cortes)' },
    { code: 'fa.ansarian',       label: 'Persian (Hussain Ansarian)' },
    { code: 'bg.theophanov',     label: 'Bulgarian (Tzvetan Theophanov)' },
    { code: 'bs.mlivo',          label: 'Bosnian (Mustafa Mlivo)' },
    { code: 'fa.bahrampour',     label: 'Persian (Abolfazl Bahrampour)' },
    { code: 'es.asad',           label: 'Spanish (Muhammad Asad - Abdurrasak Pérez)' },
    { code: 'fa.khorramshahi',   label: 'Persian (Baha\'oddin Khorramshahi)' },
    { code: 'fa.mojtabavi',      label: 'Persian (Sayyed Jalaloddin Mojtabavi)' },
    { code: 'id.muntakhab',      label: 'Indonesian (Muhammad Quraish Shihab et al.)' },
    { code: 'ms.basmeih',        label: 'Malay (Abdullah Muhammad Basmeih)' },
    { code: 'ru.abuadel',        label: 'Russian (Abu Adel)' },
    { code: 'ru.krachkovsky',    label: 'Russian (Ignaty Yulianovich Krachkovsky)' },
    { code: 'ru.muntahab',       label: 'Russian (Ministry of Awqaf, Egypt)' },
    { code: 'ru.sablukov',       label: 'Russian (Gordy Semyonovich Sablukov)' },
    { code: 'ur.junagarhi',      label: 'Urdu (Muhammad Junagarhi)' },
    { code: 'ur.maududi',        label: 'Urdu (Abul A\'ala Maududi)' },
    { code: 'zh.jian',           label: 'Chinese (Ma Jian)' },
    { code: 'zh.majian',         label: 'Chinese (Ma Jian)' },
    { code: 'fa.khorramdel',     label: 'Persian (Mostafa Khorramdel)' },
    { code: 'fa.moezzi',         label: 'Persian (Mohammad Kazem Moezzi)' },
    { code: 'bs.korkut',         label: 'Bosnian (Besim Korkut)' },
  ], (code) => {
    currentVerse.translation = code;
    loadVerse(currentVerse.chapter, currentVerse.verse);
  });
  
  // Set up event listeners
  setupEventListeners();
  
  // Initial render
  renderBookmarks();
  renderSavedAyahs();
  
  // Load initial data
  await populateSurahDropdown();
  await loadRandomQuote();
  
  // Start with a random verse
  setTimeout(() => loadRandomVerse(), 1000);
// Set Bengali as default translation for audio mode
if (!currentVerse.translation.includes('bn.')) {
  currentVerse.translation = 'bn.bengali';
}
}

// ==================== START THE APP ====================
document.addEventListener('DOMContentLoaded', initializeApp);