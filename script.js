// Quran Tab - Premium Production Script
// Fully cleaned, responsive, Ramadan fixed, audio-mode fixed

(() => {
  "use strict";

  // =========================
  // APP STATE
  // =========================
  const state = {
    currentVerse: {
      chapter: 1,
      verse: 1,
      translation: "bn.bengali",
      audioEdition: "ar.shaatree",
      bitrate: "128",
      surahArabicName: "الفاتحة",
      surahEnglishName: "Al-Fatihah"
    },

    isLoading: false,
    isAudioMode: false,
    isAutoplayEnabled: localStorage.getItem("autoplay") === "true",
    repeatMode: "none", // none | repeat-one | repeat-all
    shuffleMode: localStorage.getItem("shuffleMode") || "none",
    sleepTimer: null,
    ramadanInterval: null,
    azanInterval: null,
    prayerRefreshInterval: null,
    prayerTimesCache: [],
    lastAzanPlayed: {},
    lastPlayedAzanKey: null,
    currentAzanKey: null,
    lastCheckedMinute: null,

    savedAyahs: JSON.parse(localStorage.getItem("savedAyahs") || "[]"),
    surahAyahCounts: {},
    ayahDetailsCache: new Map(),
    ayahTafsirCache: new Map(),
    prayerTimesCache: [],
    lastAzanPlayed: {},
    hijriCache: null,
    allSurahs: []
  };

  // =========================
  // DOM ELEMENTS
  // =========================
  const elements = {
    timeDisplay: document.getElementById("timeDisplay"),
    verseArabic: document.getElementById("verseArabic"),
    verseTranslation: document.getElementById("verseTranslation"),
    verseInfo: document.getElementById("verseInfo"),
    quoteContainer: document.getElementById("quoteContainer"),
    audioPlayer: document.getElementById("audioPlayer"),
    prevVerse: document.getElementById("prevVerse"),
    nextVerse: document.getElementById("nextVerse"),
    autoplayToggle: document.getElementById("autoplayToggle"),

    audioIconBtn: document.getElementById("audioIconBtn"),
    translationIconBtn: document.getElementById("translationIconBtn"),
    reciterDropdown: document.getElementById("reciterDropdown"),
    translationDropdown: document.getElementById("translationDropdown"),

    savedBtn: document.getElementById("savedBtn"),
    favouriteBtn: document.getElementById("favouriteBtn"),
    savedDropdown: document.getElementById("savedDropdown"),
    savedList: document.getElementById("savedList"),

    chapterSelect: document.getElementById("chapterSelect"),
    verseSelect: document.getElementById("verseSelect"),
    ayahSelectModal: document.getElementById("ayahSelectModal"),
    goToAyahBtn: document.getElementById("goToAyahBtn"),
    cancelAyahBtn: document.getElementById("cancelAyahBtn"),

    loadingOverlay: document.getElementById("loadingOverlay"),

    // Ramadan
    ramadanModeBtn: document.getElementById("ramadanModeBtn"),
    ramadanModeScreen: document.getElementById("ramadanModeScreen"),
    exitRamadanMode: document.getElementById("exitRamadanMode"),
    ramadanDate: document.getElementById("ramadanDate"),
    iftarLabel: document.getElementById("iftarLabel"),
    sehriLabel: document.getElementById("sehriLabel"),
    iftarCountdown: document.getElementById("iftarCountdown"),
    sehriCountdown: document.getElementById("sehriCountdown"),
    prayerTimesBody: document.getElementById("prayerTimesBody"),

    // Audio mode
    audioModeBtn: document.getElementById("audioModeBtn"),
    audioModeScreen: document.getElementById("audioModeScreen"),
    exitAudioMode: document.getElementById("exitAudioMode"),
    audioPlayPause: document.getElementById("audioPlayPause"),
    playPauseIcon: document.getElementById("playPauseIcon"),
    audioPrev: document.getElementById("audioPrev"),
    audioNext: document.getElementById("audioNext"),
    audioRepeat: document.getElementById("audioRepeat"),
    audioShuffle: document.getElementById("audioShuffle"),
    audioAutoPlay: document.getElementById("audioAutoPlay"),
    audioSpeed: document.getElementById("audioSpeed"),
    audioSleep: document.getElementById("audioSleep"),
    audioVolume: document.getElementById("audioVolume"),
    audioProgress: document.getElementById("audioProgress"),
    currentTime: document.getElementById("currentTime"),
    totalTime: document.getElementById("totalTime"),
    audioSurahArabic: document.getElementById("audioSurahArabic"),
    audioSurahBengali: document.getElementById("audioSurahBengali"),
    currentAyahNumber: document.getElementById("currentAyahNumber"),
    audioReciterName: document.getElementById("audioReciterName"),

    audioReciterBtn: document.getElementById("audioReciterBtn"),
    audioTranslationBtn: document.getElementById("audioTranslationBtn"),
    audioReciterDropdown: document.getElementById("audioReciterDropdown"),
    audioTranslationDropdown: document.getElementById("audioTranslationDropdown"),

    audioSurahTrigger: document.getElementById("audioSurahTrigger"),
    audioAyahDrawer: document.getElementById("audioAyahDrawer"),
    audioAyahClose: document.getElementById("audioAyahClose"),
    audioChapterSelect: document.getElementById("audioChapterSelect"),
    audioVerseSelect: document.getElementById("audioVerseSelect"),
    audioGoToAyahBtn: document.getElementById("audioGoToAyahBtn"),
    audioCancelAyahBtn: document.getElementById("audioCancelAyahBtn"),

    audioSideDrawer: document.getElementById("audioSideDrawer"),
    audioDrawerTitle: document.getElementById("audioDrawerTitle"),
    audioDrawerBody: document.getElementById("audioDrawerBody"),
    audioDrawerClose: document.getElementById("audioDrawerClose"),

    showTafseer: document.getElementById("showTafseer"),
    showTafseerFooter: document.getElementById("showTafseerFooter"),
    showTranslation: document.getElementById("showTranslation"),
    bookmarkAudio: document.getElementById("bookmarkAudio"),
    shareAudio: document.getElementById("shareAudio"),

    speedModal: document.getElementById("speedModal"),
    sleepModal: document.getElementById("sleepModal")
  };

  // =========================
  // STATIC DATA
  // =========================
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

  const reciters = [
    { code: "ar.shaatree", label: "Abu Bakr Ash-Shaatree", bn: "আবু বকর আশ-শাত্রী" },
    { code: "ar.ahmedajamy", label: "Ahmed ibn Ali al-Ajamy", bn: "আহমেদ ইবনে আলী আল-আজামী" },
    { code: "ar.alafasy", label: "Alafasy", bn: "আল-আফাসী" },
    { code: "ar.abdurrahmaansudais", label: "Abdurrahmaan As-Sudais", bn: "আব্দুর রহমান আস-সুদাইস" },
    { code: "ar.abdulbasitmurattal", label: "Abdul Basit (Murattal)", bn: "আব্দুল বাসিত (মুরাত্তাল)" },
    { code: "ar.abdullahbasfar", label: "Abdullah Basfar", bn: "আব্দুল্লাহ বাসফার" },
    { code: "ar.abdulsamad", label: "Abdul Samad", bn: "আব্দুল সামাদ" },
    { code: "ar.husary", label: "Husary", bn: "হুসারী" },
    { code: "ar.husarymujawwad", label: "Husary (Mujawwad)", bn: "হুসারী (মুজাওয়াদ)" },
    { code: "ar.hudhaify", label: "Hudhaify", bn: "হুদাইফী" },
    { code: "ar.mahermuaiqly", label: "Maher Al Muaiqly", bn: "মাহের আল মুয়াইকলী" },
    { code: "ar.minshawi", label: "Minshawi", bn: "মিনশাবী" },
    { code: "ar.muhammadayyoub", label: "Muhammad Ayyoub", bn: "মুহাম্মদ আইয়ুব" },
    { code: "ar.muhammadjibreel", label: "Muhammad Jibreel", bn: "মুহাম্মদ জিবরীল" }
  ];

  const translations = [
    { code: "bn.bengali", label: "Bangla (Mohiuddin Khan)", bn: "বাংলা (মুহিউদ্দীন খান)" },
    { code: "bn.hoque", label: "Bangla (Zohurul Hoque)", bn: "বাংলা (জহুরুল হক)" },
    { code: "en.itani", label: "English (Talal Itani)", bn: "ইংরেজি (তালাল ইতানী)" },
    { code: "en.maududi", label: "English (Maududi)", bn: "ইংরেজি (মওদুদী)" },
    { code: "en.wahiduddin", label: "English (Wahiduddin Khan)", bn: "ইংরেজি (ওয়াহিদুদ্দিন খান)" },
    { code: "ur.junagarhi", label: "Urdu (Junagarhi)", bn: "উর্দু (জুনাগড়ী)" },
    { code: "hi.hindi", label: "Hindi", bn: "হিন্দি" }
  ];

  const azanAudio = new Audio(
    "https://download.tvquran.com/download/TvQuran.com__Athan/TvQuran.com__08.athan.mp3"
  );
  azanAudio.preload = "auto";
  azanAudio.volume = 1;

  // =========================
  // HELPERS
  // =========================
  function safeText(value = "") {
    return String(value ?? "").trim();
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showLoading(show = true) {
    if (!elements.loadingOverlay) return;
    elements.loadingOverlay.classList.toggle("show", show);
    elements.loadingOverlay.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
      <span class="material-icons" style="font-size:20px;">
        ${type === "success" ? "check_circle" : "error"}
      </span>
      <span>${escapeHtml(message)}</span>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 96px;
      right: 16px;
      max-width: min(360px, calc(100vw - 32px));
      background: ${type === "success" ? "#10b981" : "#ef4444"};
      color: white;
      padding: 12px 16px;
      border-radius: 14px;
      box-shadow: 0 18px 36px rgba(0,0,0,0.18);
      z-index: 100005;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      animation: slideInRight 0.25s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.25s ease";
      setTimeout(() => notification.remove(), 250);
    }, 2600);
  }

  function banglaDigits(value) {
    const map = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(value).replace(/\d/g, (d) => map[Number(d)]);
  }

  function formatTimeBangla(seconds) {
    if (!Number.isFinite(seconds)) return "০০:০০";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${banglaDigits(String(mins).padStart(2, "0"))}:${banglaDigits(String(secs).padStart(2, "0"))}`;
  }

  function formatDurationBangla(hours, minutes, seconds) {
    return `${banglaDigits(String(hours).padStart(2, "0"))}:${banglaDigits(String(minutes).padStart(2, "0"))}:${banglaDigits(String(seconds).padStart(2, "0"))}`;
  }

  function setBodyScrollLock(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    setBodyScrollLock(true);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (!state.isAudioMode && elements.ramadanModeScreen.style.display !== "flex") {
      setBodyScrollLock(false);
    }
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  function getCurrentReciterName() {
    return reciters.find((r) => r.code === state.currentVerse.audioEdition)?.bn
      || state.currentVerse.audioEdition;
  }

  function buildVerseInfoText(chapter, verse, englishName) {
    return `Surah ${englishName} (${chapter}:${verse})`;
  }

  function getTodayDateKey() {
    return new Date().toISOString().split("T")[0];
  }

  function cleanPrayerTime(timeString) {
    return safeText(timeString).split(" ")[0].slice(0, 5);
  }

  function getTodayTime(timeString) {
    const [h, m] = cleanPrayerTime(timeString).split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  }

  function getNextOccurrence(timeString) {
    const target = getTodayTime(timeString);
    const now = new Date();
    if (target <= now) target.setDate(target.getDate() + 1);
    return target;
  }

  function getRemainingParts(targetDate) {
    const now = new Date();
    const diff = Math.max(0, targetDate - now);
    return {
      diff,
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  // =========================
  // TIME / QUOTE
  // =========================
  function updateClock() {
    if (!elements.timeDisplay) return;
    const now = new Date();
    elements.timeDisplay.textContent = now.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  async function loadRandomQuote() {
    const fallback = [
      "Verily, with hardship comes ease. (94:5)",
      "Allah does not burden a soul beyond that it can bear. (2:286)",
      "Do not lose hope, nor be sad. (3:139)",
      "We have certainly made the Quran easy for remembrance. (54:17)"
    ];

    try {
      const data = await fetchJson("https://api.islamic.network/quran/en/random");
      if (data?.data?.text && elements.quoteContainer) {
        elements.quoteContainer.textContent = data.data.text;
        return;
      }
    } catch (_) { }

    if (elements.quoteContainer) {
      elements.quoteContainer.textContent = fallback[Math.floor(Math.random() * fallback.length)];
    }
  }

  // =========================
  // DROPDOWN UI
  // =========================
  function hideAllDropdowns(exceptId = "") {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      if (menu.id !== exceptId) menu.style.display = "none";
    });

    if (elements.savedDropdown && elements.savedDropdown.id !== exceptId) {
      elements.savedDropdown.style.display = "none";
    }
  }

  function toggleDropdown(dropdownId, triggerBtn = null) {
    const menu = document.getElementById(dropdownId);
    if (!menu) return;
    const isOpen = menu.style.display === "block";
    hideAllDropdowns(dropdownId);
    menu.style.display = isOpen ? "none" : "block";
    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    }
  }

  function populateDropdown(dropdownId, items, onSelect, useBangla = false) {
    const menu = document.getElementById(dropdownId);
    if (!menu) return;

    menu.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("role", "menuitem");
      li.textContent = useBangla ? item.bn || item.label : item.label || item;
      li.addEventListener("click", () => {
        onSelect(item.code || item);
        menu.style.display = "none";
      });
      menu.appendChild(li);
    });
  }

  // =========================
  // SURAH / AYAH API
  // =========================
  async function getGlobalAyahNumber(chapter, verse) {
    const data = await fetchJson(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}`);
    return data?.data?.number;
  }

  async function getSurahAyahCount(chapter) {
    if (state.surahAyahCounts[chapter]) {
      return state.surahAyahCounts[chapter];
    }

    const data = await fetchJson(`https://api.alquran.cloud/v1/surah/${chapter}`);
    const count = Number(data?.data?.numberOfAyahs || 7);
    state.surahAyahCounts[chapter] = count;
    return count;
  }

  async function fetchAllSurahs() {
    const data = await fetchJson("https://api.alquran.cloud/v1/surah");
    state.allSurahs = data?.data || [];
  }

  async function populateSurahDropdowns() {
    if (!state.allSurahs.length) await fetchAllSurahs();

    const fill = (select) => {
      if (!select) return;
      select.innerHTML = "";
      state.allSurahs.forEach((surah) => {
        const option = document.createElement("option");
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.englishName}`;
        select.appendChild(option);
      });
    };

    fill(elements.chapterSelect);
    fill(elements.audioChapterSelect);

    if (elements.chapterSelect) elements.chapterSelect.value = String(state.currentVerse.chapter);
    if (elements.audioChapterSelect) elements.audioChapterSelect.value = String(state.currentVerse.chapter);

    await updateVerseSelectFor(elements.verseSelect, state.currentVerse.chapter);
    await updateVerseSelectFor(elements.audioVerseSelect, state.currentVerse.chapter);

    if (elements.verseSelect) elements.verseSelect.value = String(state.currentVerse.verse);
    if (elements.audioVerseSelect) elements.audioVerseSelect.value = String(state.currentVerse.verse);
  }

  async function updateVerseSelectFor(selectEl, chapter) {
    if (!selectEl) return;
    const count = await getSurahAyahCount(chapter);
    selectEl.innerHTML = "";
    for (let i = 1; i <= count; i += 1) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Ayah ${i}`;
      selectEl.appendChild(option);
    }
  }

  // =========================
  // AUDIO
  // =========================
  async function loadAudioByAyah(chapter, verse, autoplay = false) {
    try {
      const globalAyahNumber = await getGlobalAyahNumber(chapter, verse);
      if (!globalAyahNumber) throw new Error("Unable to resolve ayah number");

      const src = `https://cdn.islamic.network/quran/audio/${state.currentVerse.bitrate}/${state.currentVerse.audioEdition}/${globalAyahNumber}.mp3`;
      elements.audioPlayer.src = src;
      elements.audioPlayer.load();

      if (autoplay) {
        await elements.audioPlayer.play().catch(() => { });
      }

      updateAudioModeDisplay();
      syncAudioModeState();
    } catch (error) {
      console.error("Audio loading failed:", error);
      showNotification("অডিও লোড করতে সমস্যা হয়েছে", "error");
    }
  }

  async function loadVerse(chapter, verse, options = {}) {
    const { showLoader = true, autoplay = false } = options;
    if (state.isLoading) return;

    state.isLoading = true;
    if (showLoader) showLoading(true);

    try {
      const [arabicData, translationData] = await Promise.all([
        fetchJson(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}/ar.alafasy`),
        fetchJson(`https://api.alquran.cloud/v1/ayah/${chapter}:${verse}/editions/${state.currentVerse.translation}`)
      ]);

      const arabicAyah = arabicData?.data;
      const translatedAyah = translationData?.data?.[0];

      if (!arabicAyah || !translatedAyah) {
        throw new Error("Verse data missing");
      }

      state.currentVerse.chapter = chapter;
      state.currentVerse.verse = verse;
      state.currentVerse.surahArabicName = arabicAyah.surah?.name || "";
      state.currentVerse.surahEnglishName = arabicAyah.surah?.englishName || `Surah ${chapter}`;

      elements.verseArabic.textContent = arabicAyah.text || "";
      elements.verseTranslation.textContent = translatedAyah.text || "";
      elements.verseInfo.textContent = buildVerseInfoText(
        chapter,
        verse,
        state.currentVerse.surahEnglishName
      );

      if (elements.chapterSelect) elements.chapterSelect.value = String(chapter);
      if (elements.audioChapterSelect) elements.audioChapterSelect.value = String(chapter);

      await updateVerseSelectFor(elements.verseSelect, chapter);
      await updateVerseSelectFor(elements.audioVerseSelect, chapter);

      if (elements.verseSelect) elements.verseSelect.value = String(verse);
      if (elements.audioVerseSelect) elements.audioVerseSelect.value = String(verse);

      await loadAudioByAyah(chapter, verse, autoplay);
      updateAudioModeDisplay();
    } catch (error) {
      console.error("Verse loading failed:", error);
      elements.verseArabic.textContent = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      elements.verseTranslation.textContent = "অনুবাদ লোড হয়নি। সংযোগ পরীক্ষা করুন।";
      elements.verseInfo.textContent = `Surah ${chapter} (${chapter}:${verse})`;
      showNotification("আয়াত লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      state.isLoading = false;
      if (showLoader) showLoading(false);
    }
  }

  async function loadRandomVerse(autoplay = false) {
    const chapter = Math.floor(Math.random() * 114) + 1;
    const count = await getSurahAyahCount(chapter);
    const verse = Math.floor(Math.random() * count) + 1;
    await loadVerse(chapter, verse, { autoplay });
  }

  async function prevVerse() {
    if (state.currentVerse.verse > 1) {
      await loadVerse(state.currentVerse.chapter, state.currentVerse.verse - 1, {
        autoplay: state.isAudioMode && !elements.audioPlayer.paused
      });
      return;
    }

    if (state.currentVerse.chapter > 1) {
      const prevChapter = state.currentVerse.chapter - 1;
      const count = await getSurahAyahCount(prevChapter);
      await loadVerse(prevChapter, count, {
        autoplay: state.isAudioMode && !elements.audioPlayer.paused
      });
    }
  }

  async function nextVerse() {
    if (state.shuffleMode === "shuffle") {
      await loadRandomVerse(state.isAudioMode && !elements.audioPlayer.paused);
      return;
    }

    const currentCount = await getSurahAyahCount(state.currentVerse.chapter);

    if (state.currentVerse.verse < currentCount) {
      await loadVerse(state.currentVerse.chapter, state.currentVerse.verse + 1, {
        autoplay: state.isAudioMode && !elements.audioPlayer.paused
      });
      return;
    }

    if (state.currentVerse.chapter < 114) {
      await loadVerse(state.currentVerse.chapter + 1, 1, {
        autoplay: state.isAudioMode && !elements.audioPlayer.paused
      });
    }
  }

  function updateAudioModeDisplay() {
    if (elements.audioSurahArabic) {
      elements.audioSurahArabic.textContent = state.currentVerse.surahArabicName || "";
    }

    if (elements.audioSurahBengali) {
      elements.audioSurahBengali.textContent =
        bengaliSurahNames[state.currentVerse.chapter] || `সূরা ${state.currentVerse.chapter}`;
    }

    if (elements.currentAyahNumber) {
      elements.currentAyahNumber.textContent = `আয়াত ${banglaDigits(state.currentVerse.verse)}`;
    }

    if (elements.audioReciterName) {
      elements.audioReciterName.textContent = getCurrentReciterName();
    }
  }

  function updateAudioProgressUI() {
    const audio = elements.audioPlayer;
    const duration = audio.duration || 0;
    const current = audio.currentTime || 0;
    const progress = duration ? current / duration : 0;
    const percent = progress * 100;

    if (elements.audioProgress) {
      elements.audioProgress.value = String(percent);
    }

    const fill = document.querySelector(".progress-fill");
    if (fill) fill.style.width = `${percent}%`;

    if (elements.currentTime) elements.currentTime.textContent = formatTimeBangla(current);
    if (elements.totalTime) elements.totalTime.textContent = formatTimeBangla(duration);

    const circle = document.querySelector(".progress-ring__circle");
    if (circle) {
      const radius = 140;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference - progress * circumference}`;
    }
  }

  function syncAudioModeState() {
    if (elements.playPauseIcon) {
      elements.playPauseIcon.textContent = elements.audioPlayer.paused ? "play_arrow" : "pause";
    }

    if (elements.audioVolume) {
      elements.audioVolume.value = String(Math.round((elements.audioPlayer.volume || 0.8) * 100));
    }

    if (elements.audioAutoPlay) {
      elements.audioAutoPlay.classList.toggle("active", state.isAutoplayEnabled);
    }

    if (elements.autoplayToggle) {
      elements.autoplayToggle.checked = state.isAutoplayEnabled;
    }

    if (elements.audioShuffle) {
      elements.audioShuffle.classList.toggle("active", state.shuffleMode === "shuffle");
    }

    updateAudioProgressUI();
  }

  function togglePlayPause() {
    if (elements.audioPlayer.paused) {
      elements.audioPlayer.play().catch(() => {
        showNotification("অডিও চালু করা যায়নি", "error");
      });
    } else {
      elements.audioPlayer.pause();
    }
  }

  function seekAudio(percent) {
    const duration = elements.audioPlayer.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    elements.audioPlayer.currentTime = (Number(percent) / 100) * duration;
  }

  function setAudioVolume(value) {
    elements.audioPlayer.volume = Math.max(0, Math.min(1, Number(value) / 100));
  }

  function changeAudioSpeed(speed) {
    elements.audioPlayer.playbackRate = speed;
    showNotification(`পাঠের গতি ${speed}x করা হয়েছে`);
  }

  function setSleepTimer(minutes) {
    if (state.sleepTimer) {
      clearTimeout(state.sleepTimer);
      state.sleepTimer = null;
    }

    if (minutes > 0) {
      state.sleepTimer = setTimeout(() => {
        elements.audioPlayer.pause();
        syncAudioModeState();
        showNotification("ঘুমের টাইমার সম্পন্ন হয়েছে");
      }, minutes * 60 * 1000);
      showNotification(`${banglaDigits(minutes)} মিনিটের টাইমার সেট করা হয়েছে`);
    } else {
      showNotification("ঘুমের টাইমার বন্ধ করা হয়েছে");
    }
  }

  function toggleRepeatMode() {
    if (state.repeatMode === "none") {
      state.repeatMode = "repeat-one";
      showNotification("একক রিপিট চালু");
    } else if (state.repeatMode === "repeat-one") {
      state.repeatMode = "repeat-all";
      showNotification("সকল রিপিট চালু");
    } else {
      state.repeatMode = "none";
      showNotification("রিপিট বন্ধ");
    }

    const icon = elements.audioRepeat?.querySelector(".material-icons");
    if (icon) {
      icon.textContent = state.repeatMode === "repeat-one" ? "repeat_one" : "repeat";
    }

    elements.audioRepeat?.classList.toggle("active", state.repeatMode !== "none");
  }

  async function toggleShuffleMode() {
    if (state.shuffleMode === "none") {
      state.shuffleMode = "shuffle";
      localStorage.setItem("shuffleMode", "shuffle");
      elements.audioShuffle?.classList.add("active");
      showNotification("শাফল চালু");
    } else {
      state.shuffleMode = "none";
      localStorage.setItem("shuffleMode", "none");
      elements.audioShuffle?.classList.remove("active");
      showNotification("শাফল বন্ধ");
    }
  }

  function toggleAutoplay() {
    state.isAutoplayEnabled = !state.isAutoplayEnabled;
    localStorage.setItem("autoplay", String(state.isAutoplayEnabled));
    syncAudioModeState();
    showNotification(state.isAutoplayEnabled ? "অটো-প্লে চালু" : "অটো-প্লে বন্ধ");
  }

  async function handleAudioEnded() {
    if (state.repeatMode === "repeat-one") {
      elements.audioPlayer.currentTime = 0;
      await elements.audioPlayer.play().catch(() => { });
      return;
    }

    if (state.repeatMode === "repeat-all") {
      await nextVerse();
      if (!elements.audioPlayer.paused) {
        await elements.audioPlayer.play().catch(() => { });
      }
      return;
    }

    if (state.isAutoplayEnabled) {
      await nextVerse();
      await elements.audioPlayer.play().catch(() => { });
    }
  }

  // =========================
  // SAVED AYAHS
  // =========================
  function getCurrentVerseRef() {
    return buildVerseInfoText(
      state.currentVerse.chapter,
      state.currentVerse.verse,
      state.currentVerse.surahEnglishName
    );
  }

  function renderSavedAyahs() {
    if (!elements.savedList) return;
    elements.savedList.innerHTML = "";

    if (!state.savedAyahs.length) {
      const li = document.createElement("li");
      li.textContent = "No saved ayah yet.";
      li.style.cursor = "default";
      li.style.color = "#64748b";
      elements.savedList.appendChild(li);
      return;
    }

    state.savedAyahs.forEach((ref, index) => {
      const li = document.createElement("li");
      li.textContent = ref;

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.innerHTML = '<span class="material-icons" style="font-size:16px;">close</span>';
      delBtn.style.cssText = `
        position:absolute;
        right:8px;
        top:8px;
        border:none;
        background:none;
        color:#ef4444;
        cursor:pointer;
      `;

      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.savedAyahs.splice(index, 1);
        localStorage.setItem("savedAyahs", JSON.stringify(state.savedAyahs));
        renderSavedAyahs();
        showNotification("সেভ করা আয়াত মুছে ফেলা হয়েছে");
      });

      li.appendChild(delBtn);

      li.addEventListener("click", async () => {
        const match = ref.match(/\((\d+):(\d+)\)/);
        if (!match) return;
        const chapter = Number(match[1]);
        const verse = Number(match[2]);
        hideAllDropdowns();
        await loadVerse(chapter, verse);
      });

      elements.savedList.appendChild(li);
    });
  }

  function saveCurrentAyah() {
    const ref = getCurrentVerseRef();
    if (state.savedAyahs.includes(ref)) {
      showNotification("এই আয়াত আগে থেকেই সেভ করা আছে", "error");
      return;
    }

    state.savedAyahs.unshift(ref);
    localStorage.setItem("savedAyahs", JSON.stringify(state.savedAyahs));
    renderSavedAyahs();
    showNotification("আয়াত সেভ হয়েছে");
  }

  // =========================
  // TAFSIR / TRANSLATION DRAWER
  // =========================
  function normalizeTafsirText(text) {
    return String(text || "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trim();
  }

  async function getAyahDetails(chapter, verse) {
    const key = `${chapter}:${verse}`;
    if (state.ayahDetailsCache.has(key)) return state.ayahDetailsCache.get(key);

    const data = await fetchJson(`https://quranapi.pages.dev/api/${chapter}/${verse}.json`);
    state.ayahDetailsCache.set(key, data);
    return data;
  }

  async function getAyahTafsir(chapter, verse) {
    const key = `${chapter}:${verse}`;
    if (state.ayahTafsirCache.has(key)) return state.ayahTafsirCache.get(key);

    const urls = [
      `https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/bn-tafseer-ibn-e-kaseer/${chapter}/${verse}.json`,
      `https://cdn.statically.io/gh/spa5k/tafsir_api/main/tafsir/bn-tafseer-ibn-e-kaseer/${chapter}/${verse}.json`
    ];

    let lastError = null;
    for (const url of urls) {
      try {
        const data = await fetchJson(url);
        state.ayahTafsirCache.set(key, data);
        return data;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Tafsir unavailable");
  }

  function openAudioInfoDrawer(title, bodyHtml) {
    if (!elements.audioSideDrawer) return;
    if (elements.audioDrawerTitle) elements.audioDrawerTitle.textContent = title;
    if (elements.audioDrawerBody) elements.audioDrawerBody.innerHTML = bodyHtml;
    openDrawer(elements.audioSideDrawer);
  }

  async function openTafsirDrawer() {
    openAudioInfoDrawer("তাফসীর", '<div class="drawer-loading">লোড হচ্ছে...</div>');

    try {
      const [ayahDetails, tafsirData] = await Promise.all([
        getAyahDetails(state.currentVerse.chapter, state.currentVerse.verse),
        getAyahTafsir(state.currentVerse.chapter, state.currentVerse.verse)
      ]);

      const arabic = escapeHtml(ayahDetails?.arabic1 || elements.verseArabic.textContent);
      const bangla = escapeHtml(ayahDetails?.bengali || elements.verseTranslation.textContent);
      const tafsir = escapeHtml(normalizeTafsirText(tafsirData?.text || "বাংলা তাফসীর পাওয়া যায়নি।"));

      openAudioInfoDrawer(
        "তাফসীর",
        `
          <div class="drawer-ayah-arabic">${arabic}</div>
          <div class="drawer-ayah-bengali">${bangla}</div>
          <div class="drawer-ayah-ref">(${state.currentVerse.chapter}:${state.currentVerse.verse})</div>
          <hr class="drawer-separator" />
          <div class="drawer-tafsir-text">${tafsir}</div>
        `
      );
    } catch (error) {
      console.error(error);
      openAudioInfoDrawer("তাফসীর", '<div class="drawer-error">তথ্য লোড করা যায়নি।</div>');
    }
  }

  async function openTranslationDrawer() {
    openAudioInfoDrawer("অনুবাদ", '<div class="drawer-loading">লোড হচ্ছে...</div>');

    try {
      const ayahDetails = await getAyahDetails(state.currentVerse.chapter, state.currentVerse.verse);
      const arabic = escapeHtml(ayahDetails?.arabic1 || elements.verseArabic.textContent);
      const bangla = escapeHtml(ayahDetails?.bengali || elements.verseTranslation.textContent);

      openAudioInfoDrawer(
        "অনুবাদ",
        `
          <div class="drawer-ayah-arabic">${arabic}</div>
          <div class="drawer-ayah-bengali">${bangla}</div>
          <div class="drawer-ayah-ref">(${state.currentVerse.chapter}:${state.currentVerse.verse})</div>
        `
      );
    } catch (error) {
      console.error(error);
      openAudioInfoDrawer("অনুবাদ", '<div class="drawer-error">তথ্য লোড করা যায়নি।</div>');
    }
  }

  // =========================
  // RAMADAN MODE
  // =========================
  async function fetchPrayerTimes(city = "Dhaka", country = "Bangladesh") {
    function addMinutes(time, minutes) {
      const [h, m] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m + minutes, 0);
      return date.toTimeString().slice(0, 5);
    }

    try {
      const data = await fetchJson(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1`
      );

      const timings = data?.data?.timings;
      if (!timings) throw new Error("Prayer timing missing");

      return [
        { name: "ফজর", time: cleanPrayerTime(timings.Fajr) },
        { name: "যোহর", time: cleanPrayerTime(timings.Dhuhr) },
        { name: "আসর", time: cleanPrayerTime(timings.Asr) },
        { name: "মাগরিব", time: addMinutes(cleanPrayerTime(timings.Maghrib), 2) },
        { name: "ইশা", time: cleanPrayerTime(timings.Isha) }
      ];
    } catch (error) {
      console.error("Prayer time fetch failed:", error);
      return [
        { name: "ফজর", time: "05:00" },
        { name: "যোহর", time: "12:15" },
        { name: "আসর", time: "15:45" },
        { name: "মাগরিব", time: "18:15" },
        { name: "ইশা", time: "19:45" }
      ];
    }
  }

 async function fetchHijriDate() {
  const today = getTodayDateKey();

  if (state.hijriCache?.dateKey === today) {
    return state.hijriCache.text;
  }

  try {
    const url =
      `https://api.aladhan.com/v1/timingsByCity` +
      `?city=Dhaka&country=Bangladesh&method=1`;

    const data = await fetchJson(url);
    const hijri = data?.data?.date?.hijri;

    if (!hijri) throw new Error("Hijri date unavailable");

    let day = Number(hijri.day) - 1;

    const text =
      `${banglaDigits(day)} ${hijri.month?.en || "হিজরি_মাস"} ${banglaDigits(hijri.year)}`;

    state.hijriCache = { dateKey: today, text };
    return text;

  } catch (err) {
    console.error("Hijri fetch failed:", err);
    return "হিজরি তারিখ পাওয়া যায়নি";
  }
}

const prayerIcons = {
  "ফজর": `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="size-5 text-primary"><path d="M13.8595 9.1875C14.0695 9.1875 14.2495 9.0075 14.2345 8.7975C14.032 6.0825 11.767 3.9375 8.99953 3.9375C6.23203 3.9375 3.96705 6.075 3.76455 8.7975C3.74955 9.0075 3.92955 9.1875 4.13955 9.1875H13.8595Z" fill="currentColor"></path><path d="M16.5 9.75H16.44C16.0275 9.75 15.69 9.4125 15.69 9C15.69 8.5875 16.0275 8.25 16.44 8.25C16.8525 8.25 17.22 8.5875 17.22 9C17.22 9.4125 16.9125 9.75 16.5 9.75ZM1.56001 9.75H1.5C1.0875 9.75 0.75 9.4125 0.75 9C0.75 8.5875 1.0875 8.25 1.5 8.25C1.9125 8.25 2.27998 8.5875 2.27998 9C2.27998 9.4125 1.97251 9.75 1.56001 9.75ZM14.2575 4.4925C14.0625 4.4925 13.875 4.4175 13.725 4.275C13.4325 3.9825 13.4325 3.50999 13.725 3.21749L13.8225 3.12C14.115 2.8275 14.5875 2.8275 14.88 3.12C15.1725 3.4125 15.1725 3.88501 14.88 4.17751L14.7825 4.275C14.64 4.4175 14.4525 4.4925 14.2575 4.4925ZM3.74249 4.4925C3.54749 4.4925 3.36002 4.4175 3.21002 4.275L3.11252 4.17751C2.82002 3.88501 2.82002 3.4125 3.11252 3.12C3.40502 2.8275 3.8775 2.8275 4.17 3.12L4.2675 3.21749C4.56 3.50999 4.56 3.9825 4.2675 4.275C4.125 4.4175 3.92999 4.4925 3.74249 4.4925ZM9 2.27999C8.5875 2.27999 8.25 1.9725 8.25 1.56V1.5C8.25 1.0875 8.5875 0.75 9 0.75C9.4125 0.75 9.75 1.0875 9.75 1.5C9.75 1.9125 9.4125 2.27999 9 2.27999Z" fill="currentColor"></path><path opacity="0.4" d="M15 11.8125H3C2.6925 11.8125 2.4375 11.5575 2.4375 11.25C2.4375 10.9425 2.6925 10.6875 3 10.6875H15C15.3075 10.6875 15.5625 10.9425 15.5625 11.25C15.5625 11.5575 15.3075 11.8125 15 11.8125Z" fill="currentColor"></path><path opacity="0.4" d="M13.5 14.0625H4.5C4.1925 14.0625 3.9375 13.8075 3.9375 13.5C3.9375 13.1925 4.1925 12.9375 4.5 12.9375H13.5C13.8075 12.9375 14.0625 13.1925 14.0625 13.5C14.0625 13.8075 13.8075 14.0625 13.5 14.0625Z" fill="currentColor"></path><path opacity="0.4" d="M11.25 16.3125H6.75C6.4425 16.3125 6.1875 16.0575 6.1875 15.75C6.1875 15.4425 6.4425 15.1875 6.75 15.1875H11.25C11.5575 15.1875 11.8125 15.4425 11.8125 15.75C11.8125 16.0575 11.5575 16.3125 11.25 16.3125Z" fill="currentColor"></path></svg>`,

  "যোহর": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5 text-primary"><g clip-path="url(#clip0_1711_82225)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 0.1875C9.31066 0.1875 9.5625 0.43934 9.5625 0.75V2.25C9.5625 2.56066 9.31066 2.8125 9 2.8125C8.68934 2.8125 8.4375 2.56066 8.4375 2.25V0.75C8.4375 0.43934 8.68934 0.1875 9 0.1875ZM2.76725 2.76725C2.98692 2.54758 3.34308 2.54758 3.56275 2.76725L4.62775 3.83225C4.84742 4.05192 4.84742 4.40808 4.62775 4.62775C4.40808 4.84742 4.05192 4.84742 3.83225 4.62775L2.76725 3.56275C2.54758 3.34308 2.54758 2.98692 2.76725 2.76725ZM15.2327 2.76725C15.4524 2.98692 15.4524 3.34308 15.2327 3.56275L14.1677 4.62775C13.9481 4.84742 13.5919 4.84742 13.3723 4.62775C13.1526 4.40808 13.1526 4.05192 13.3723 3.83225L14.4373 2.76725C14.6569 2.54758 15.0131 2.54758 15.2327 2.76725ZM0.1875 9C0.1875 8.68934 0.43934 8.4375 0.75 8.4375H2.25C2.56066 8.4375 2.8125 8.68934 2.8125 9C2.8125 9.31066 2.56066 9.5625 2.25 9.5625H0.75C0.43934 9.5625 0.1875 9.31066 0.1875 9ZM15.1875 9C15.1875 8.68934 15.4393 8.4375 15.75 8.4375H17.25C17.5607 8.4375 17.8125 8.68934 17.8125 9C17.8125 9.31066 17.5607 9.5625 17.25 9.5625H15.75C15.4393 9.5625 15.1875 9.31066 15.1875 9ZM4.62775 13.3723C4.84742 13.5919 4.84742 13.9481 4.62775 14.1677L3.56275 15.2327C3.34308 15.4524 2.98692 15.4524 2.76725 15.2327C2.54758 15.0131 2.54758 14.6569 2.76725 14.4373L3.83225 13.3723C4.05192 13.1526 4.40808 13.1526 4.62775 13.3723ZM13.3723 13.3723C13.5919 13.1526 13.9481 13.1526 14.1677 13.3723L15.2327 14.4373C15.4524 14.6569 15.4524 15.0131 15.2327 15.2327C15.0131 15.4524 14.6569 15.4524 14.4373 15.2327L13.3723 14.1677C13.1526 13.9481 13.1526 13.5919 13.3723 13.3723ZM9 15.1875C9.31066 15.1875 9.5625 15.4393 9.5625 15.75V17.25C9.5625 17.5607 9.31066 17.8125 9 17.8125C8.68934 17.8125 8.4375 17.5607 8.4375 17.25V15.75C8.4375 15.4393 8.68934 15.1875 9 15.1875Z" fill="currentColor"></path><circle opacity="0.4" cx="9" cy="9" r="6" fill="currentColor"></circle></g><defs><clipPath id="clip0_1711_82225"><rect width="18" height="18" fill="white"></rect></clipPath></defs></svg>`,

  "আসর": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5 text-primary"><path opacity="0.4" d="M9 14.25C11.8995 14.25 14.25 11.8995 14.25 9C14.25 6.10051 11.8995 3.75 9 3.75C6.10051 3.75 3.75 6.10051 3.75 9C3.75 11.8995 6.10051 14.25 9 14.25Z" fill="currentColor"></path><path d="M9 17.22C8.5875 17.22 8.25 16.9125 8.25 16.5V16.44C8.25 16.0275 8.5875 15.69 9 15.69C9.4125 15.69 9.75 16.0275 9.75 16.44C9.75 16.8525 9.4125 17.22 9 17.22ZM14.355 15.105C14.16 15.105 13.9725 15.03 13.8225 14.8875L13.725 14.79C13.4325 14.4975 13.4325 14.025 13.725 13.7325C14.0175 13.44 14.49 13.44 14.7825 13.7325L14.88 13.83C15.1725 14.1225 15.1725 14.595 14.88 14.8875C14.7375 15.03 14.55 15.105 14.355 15.105ZM3.645 15.105C3.45 15.105 3.2625 15.03 3.1125 14.8875C2.82 14.595 2.82 14.1225 3.1125 13.83L3.21 13.7325C3.5025 13.44 3.975 13.44 4.2675 13.7325C4.56 14.025 4.56 14.4975 4.2675 14.79L4.17 14.8875C4.0275 15.03 3.8325 15.105 3.645 15.105ZM16.5 9.75H16.44C16.0275 9.75 15.69 9.4125 15.69 9C15.69 8.5875 16.0275 8.25 16.44 8.25C16.8525 8.25 17.22 8.5875 17.22 9C17.22 9.4125 16.9125 9.75 16.5 9.75ZM1.56 9.75H1.5C1.0875 9.75 0.75 9.4125 0.75 9C0.75 8.5875 1.0875 8.25 1.5 8.25C1.9125 8.25 2.28 8.5875 2.28 9C2.28 9.4125 1.9725 9.75 1.56 9.75ZM14.2575 4.4925C14.0625 4.4925 13.875 4.4175 13.725 4.275C13.4325 3.9825 13.4325 3.51 13.725 3.2175L13.8225 3.12C14.115 2.8275 14.5875 2.8275 14.88 3.12C15.1725 3.4125 15.1725 3.885 14.88 4.1775L14.7825 4.275C14.64 4.4175 14.4525 4.4925 14.2575 4.4925ZM3.7425 4.4925C3.5475 4.4925 3.36 4.4175 3.21 4.275L3.1125 4.17C2.82 3.8775 2.82 3.405 3.1125 3.1125C3.405 2.82 3.8775 2.82 4.17 3.1125L4.2675 3.21C4.56 3.5025 4.56 3.975 4.2675 4.2675C4.125 4.4175 3.93 4.4925 3.7425 4.4925ZM9 2.28C8.5875 2.28 8.25 1.9725 8.25 1.56V1.5C8.25 1.0875 8.5875 0.75 9 0.75C9.4125 0.75 9.75 1.0875 9.75 1.5C9.75 1.9125 9.4125 2.28 9 2.28Z" fill="currentColor"></path></svg>`,

  "মাগরিব": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5 text-primary"><path d="M13.8595 9.1875C14.0695 9.1875 14.2495 9.0075 14.2345 8.7975C14.032 6.0825 11.767 3.9375 8.99953 3.9375C6.23203 3.9375 3.96705 6.075 3.76455 8.7975C3.74955 9.0075 3.92955 9.1875 4.13955 9.1875H13.8595Z" fill="currentColor"></path><path opacity="0.4" d="M15 11.8125H3C2.6925 11.8125 2.4375 11.5575 2.4375 11.25C2.4375 10.9425 2.6925 10.6875 3 10.6875H15C15.3075 10.6875 15.5625 10.9425 15.5625 11.25C15.5625 11.5575 15.3075 11.8125 15 11.8125Z" fill="currentColor"></path><path opacity="0.4" d="M13.5 14.0625H4.5C4.1925 14.0625 3.9375 13.8075 3.9375 13.5C3.9375 13.1925 4.1925 12.9375 4.5 12.9375H13.5C13.8075 12.9375 14.0625 13.1925 14.0625 13.5C14.0625 13.8075 13.8075 14.0625 13.5 14.0625Z" fill="currentColor"></path><path opacity="0.4" d="M11.25 16.3125H6.75C6.4425 16.3125 6.1875 16.0575 6.1875 15.75C6.1875 15.4425 6.4425 15.1875 6.75 15.1875H11.25C11.5575 15.1875 11.8125 15.4425 11.8125 15.75C11.8125 16.0575 11.5575 16.3125 11.25 16.3125Z" fill="currentColor"></path></svg>`,

  "ইশা": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5 text-primary"><path d="M6.74905 14.25C6.74905 14.88 6.84655 15.495 7.02655 16.065C4.14655 15.0675 1.97155 12.42 1.74655 9.32253C1.52155 6.03003 3.41905 2.95503 6.48655 1.66503C7.28155 1.33503 7.68655 1.57503 7.85905 1.74753C8.02405 1.91253 8.25655 2.31003 7.92655 3.06753C7.58905 3.84753 7.42405 4.67253 7.42405 5.52753C7.43155 7.05753 8.03155 8.47503 9.00655 9.56253C7.63405 10.6575 6.74905 12.3525 6.74905 14.25Z" fill="currentColor"></path><path opacity="0.4" d="M15.9075 13.29C14.4225 15.3075 12.0675 16.4925 9.555 16.4925C9.435 16.4925 9.315 16.485 9.195 16.4775C8.445 16.4475 7.7175 16.305 7.0275 16.065C6.8475 15.495 6.75 14.88 6.75 14.25C6.75 12.3525 7.635 10.6575 9.0075 9.5625C10.11 10.8 11.6925 11.6025 13.44 11.6775C13.9125 11.7 14.385 11.6625 14.85 11.58C15.69 11.43 16.0275 11.745 16.1475 11.9475C16.275 12.15 16.41 12.5925 15.9075 13.29Z" fill="currentColor"></path></svg>`
};

  function populatePrayerTable(prayerTimes) {
  if (!elements.prayerTimesBody) return;

  elements.prayerTimesBody.innerHTML = "";

  prayerTimes.forEach((prayer, index) => {

    const icon = prayerIcons[prayer.name] || "";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="flex items-center gap-2">
        ${icon}
        <span>${prayer.name}</span>
      </td>
      <td>${banglaDigits(prayer.time)}</td>
      <td class="countdown-cell" id="countdown-${index}">--:--:--</td>
    `;

    elements.prayerTimesBody.appendChild(row);
  });
}


  function updateRamadanCountdowns() {
    if (!state.prayerTimesCache.length) return;

    const fajr = state.prayerTimesCache.find((p) => p.name === "ফজর");
    const maghrib = state.prayerTimesCache.find((p) => p.name === "মাগরিব");
    if (!fajr || !maghrib) return;

    const now = new Date();
    const fajrToday = getTodayTime(fajr.time);
    const nextFajr = getNextOccurrence(fajr.time);
    const maghribToday = getTodayTime(maghrib.time);
    const nextMaghrib = getNextOccurrence(maghrib.time);

    // Iftar
    if (now < maghribToday) {
      const remain = getRemainingParts(maghribToday);
      elements.iftarLabel.textContent = "ইফতার শুরু হতে সময় বাকি";
      elements.iftarCountdown.textContent = formatDurationBangla(remain.hours, remain.minutes, remain.seconds);
    } else {
      elements.iftarLabel.textContent = "আগামীকাল ইফতার";
      elements.iftarCountdown.textContent = banglaDigits(
        nextMaghrib.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })
      );
    }

    // Sehri
    if (now < fajrToday) {
      const remain = getRemainingParts(fajrToday);
      elements.sehriLabel.textContent = "সেহরির সময় বাকি";
      elements.sehriCountdown.textContent = formatDurationBangla(remain.hours, remain.minutes, remain.seconds);
    } else {
      const display = new Date(nextFajr);
      display.setMinutes(display.getMinutes() - 1);
      elements.sehriLabel.textContent = "পরবর্তী সেহরীর শেষ সময়";
      elements.sehriCountdown.textContent = banglaDigits(
        display.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })
      );
    }

    // Table countdown
    state.prayerTimesCache.forEach((prayer, index) => {
      const target = getNextOccurrence(prayer.time);
      const remain = getRemainingParts(target);
      const cell = document.getElementById(`countdown-${index}`);
      if (cell) {
        cell.textContent = formatDurationBangla(remain.hours, remain.minutes, remain.seconds);
      }
    });
  }

  async function enterRamadanMode() {
    elements.ramadanModeScreen.style.display = "flex";
    elements.ramadanModeScreen.setAttribute("aria-hidden", "false");
    setBodyScrollLock(true);

    elements.ramadanDate.textContent = await fetchHijriDate();
    state.prayerTimesCache = await fetchPrayerTimes("Dhaka", "Bangladesh");
    populatePrayerTable(state.prayerTimesCache);
    updateRamadanCountdowns();

    if (state.ramadanInterval) clearInterval(state.ramadanInterval);
    state.ramadanInterval = setInterval(updateRamadanCountdowns, 1000);
  }

  function exitRamadanMode() {
    elements.ramadanModeScreen.style.display = "none";
    elements.ramadanModeScreen.setAttribute("aria-hidden", "true");

    if (!state.isAudioMode && elements.ayahSelectModal.style.display !== "flex") {
      setBodyScrollLock(false);
    }

    if (state.ramadanInterval) {
      clearInterval(state.ramadanInterval);
      state.ramadanInterval = null;
    }
  }

  function playAzan(prayerName, azanKey) {
    // যদি এই azan already play হয়ে থাকে বা এখন play হয়, তাহলে skip
    if (state.currentAzanKey === azanKey) return;
    if (!azanAudio.paused) return;

    state.currentAzanKey = azanKey;
    state.lastPlayedAzanKey = azanKey;

    showNotification(`🕌 ${prayerName} নামাজের সময় হয়েছে`);

    azanAudio.currentTime = 0;
    azanAudio.play().catch(() => {
      state.currentAzanKey = null;
    });
  }

  function checkPrayerTimeAndPlayAzan() {
    if (!state.prayerTimesCache.length) return;

    const now = new Date();
    const current = now.toTimeString().slice(0, 5);
    const dayKey = now.toDateString();

    // একই মিনিটে একবারের বেশি check হলে skip
    const minuteKey = `${dayKey}-${current}`;
    if (state.lastCheckedMinute === minuteKey) return;
    state.lastCheckedMinute = minuteKey;

    for (const prayer of state.prayerTimesCache) {
      if (cleanPrayerTime(prayer.time) === current) {
        const azanKey = `${prayer.name}-${current}-${dayKey}`;

        if (state.lastPlayedAzanKey !== azanKey) {
          playAzan(prayer.name, azanKey);
        }
        break; // এক prayer time-এ একবারই play
      }
    }
  }

  // V2
  /*
  function playAzan(prayerName, azanKey) {
    if (state.lastPlayedAzanKey === azanKey) return;
    if (!azanAudio.paused) return;
  
    state.lastPlayedAzanKey = azanKey;
    state.currentAzanKey = azanKey;
  
    showNotification(`🕌 ${prayerName} নামাজের সময় হয়েছে`);
  
    azanAudio.currentTime = 0;
    azanAudio.play().catch(() => {
      state.currentAzanKey = null;
    });
  }
  
  function checkPrayerTimeAndPlayAzan() {
    if (!state.prayerTimesCache.length) return;
  
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);
    const dayKey = now.toDateString();
  
    for (const prayer of state.prayerTimesCache) {
      if (cleanPrayerTime(prayer.time) === current) {
        const azanKey = `${prayer.name}-${current}-${dayKey}`;
        playAzan(prayer.name, azanKey);
        break;
      }
    }
  }
  
  azanAudio.addEventListener("ended", () => {
    state.currentAzanKey = null;
  });
  */

  // azan শেষ হলে lock release হবে
  azanAudio.addEventListener("ended", () => {
    state.currentAzanKey = null;
  });

  async function initPrayerSystem() {
    state.prayerTimesCache = await fetchPrayerTimes("Dhaka", "Bangladesh");

    if (state.azanInterval) clearInterval(state.azanInterval);
    state.azanInterval = setInterval(checkPrayerTimeAndPlayAzan, 60 * 1000);

    if (state.prayerRefreshInterval) clearInterval(state.prayerRefreshInterval);
    state.prayerRefreshInterval = setInterval(async () => {
      state.prayerTimesCache = await fetchPrayerTimes("Dhaka", "Bangladesh");
    }, 24 * 60 * 60 * 1000);

    checkPrayerTimeAndPlayAzan();
  }

  // =========================
  // AUDIO MODE SCREEN
  // =========================
  function enterAudioMode() {
    state.isAudioMode = true;
    elements.audioModeScreen.style.display = "flex";
    elements.audioModeScreen.setAttribute("aria-hidden", "false");
    document.body.classList.add("audio-mode-active");
    setBodyScrollLock(true);
    updateAudioModeDisplay();
    syncAudioModeState();
    showNotification("অডিও মোড চালু হয়েছে");
  }

  function exitAudioMode() {
    state.isAudioMode = false;
    elements.audioModeScreen.style.display = "none";
    elements.audioModeScreen.setAttribute("aria-hidden", "true");
    document.body.classList.remove("audio-mode-active");
    closeDrawer(elements.audioAyahDrawer);
    closeDrawer(elements.audioSideDrawer);

    if (elements.ramadanModeScreen.style.display !== "flex" && elements.ayahSelectModal.style.display !== "flex") {
      setBodyScrollLock(false);
    }
  }

  // =========================
  // EVENTS
  // =========================
  function bindEvents() {
    // Main nav
    elements.prevVerse?.addEventListener("click", prevVerse);
    elements.nextVerse?.addEventListener("click", nextVerse);

    document.querySelector(".verse-content")?.addEventListener("dblclick", () => {
      loadRandomVerse();
    });

    // Main dropdown buttons
    elements.audioIconBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown("reciterDropdown", elements.audioIconBtn);
    });

    elements.translationIconBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown("translationDropdown", elements.translationIconBtn);
    });

    // Saved
    elements.savedBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      renderSavedAyahs();
      const isOpen = elements.savedDropdown.style.display === "block";
      hideAllDropdowns();
      elements.savedDropdown.style.display = isOpen ? "none" : "block";
    });

    elements.favouriteBtn?.addEventListener("click", saveCurrentAyah);

    // Modal open
    elements.verseInfo?.addEventListener("click", async () => {
      if (elements.chapterSelect) elements.chapterSelect.value = String(state.currentVerse.chapter);
      await updateVerseSelectFor(elements.verseSelect, state.currentVerse.chapter);
      if (elements.verseSelect) elements.verseSelect.value = String(state.currentVerse.verse);
      openModal(elements.ayahSelectModal);
    });

    elements.goToAyahBtn?.addEventListener("click", async () => {
      const chapter = Number(elements.chapterSelect.value);
      const verse = Number(elements.verseSelect.value);
      closeModal(elements.ayahSelectModal);
      await loadVerse(chapter, verse);
    });

    elements.cancelAyahBtn?.addEventListener("click", () => {
      closeModal(elements.ayahSelectModal);
    });

    elements.chapterSelect?.addEventListener("change", async () => {
      await updateVerseSelectFor(elements.verseSelect, Number(elements.chapterSelect.value));
    });

    // Main autoplay
    elements.autoplayToggle?.addEventListener("change", (e) => {
      state.isAutoplayEnabled = e.target.checked;
      localStorage.setItem("autoplay", String(state.isAutoplayEnabled));
      syncAudioModeState();
    });

    // Audio mode entry
    elements.audioModeBtn?.addEventListener("click", enterAudioMode);
    elements.exitAudioMode?.addEventListener("click", exitAudioMode);

    // Audio main controls
    elements.audioPlayPause?.addEventListener("click", togglePlayPause);
    elements.audioPrev?.addEventListener("click", prevVerse);
    elements.audioNext?.addEventListener("click", nextVerse);
    elements.audioRepeat?.addEventListener("click", toggleRepeatMode);
    elements.audioShuffle?.addEventListener("click", toggleShuffleMode);
    elements.audioAutoPlay?.addEventListener("click", toggleAutoplay);

    elements.audioSpeed?.addEventListener("click", () => {
      elements.speedModal.style.display = "block";
      elements.speedModal.setAttribute("aria-hidden", "false");
    });

    elements.audioSleep?.addEventListener("click", () => {
      elements.sleepModal.style.display = "block";
      elements.sleepModal.setAttribute("aria-hidden", "false");
    });

    elements.audioVolume?.addEventListener("input", (e) => setAudioVolume(e.target.value));
    elements.audioProgress?.addEventListener("input", (e) => seekAudio(e.target.value));

    // Audio dropdowns
    elements.audioReciterBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown("audioReciterDropdown", elements.audioReciterBtn);
    });

    elements.audioTranslationBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown("audioTranslationDropdown", elements.audioTranslationBtn);
    });

    // Audio ayah drawer
    const openAyahDrawer = async () => {
      if (elements.audioChapterSelect) {
        elements.audioChapterSelect.value = String(state.currentVerse.chapter);
        await updateVerseSelectFor(elements.audioVerseSelect, state.currentVerse.chapter);
      }
      if (elements.audioVerseSelect) {
        elements.audioVerseSelect.value = String(state.currentVerse.verse);
      }
      openDrawer(elements.audioAyahDrawer);
    };

    elements.audioSurahTrigger?.addEventListener("click", openAyahDrawer);
    elements.currentAyahNumber?.addEventListener("click", openAyahDrawer);
    elements.audioSurahTrigger?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAyahDrawer();
      }
    });

    elements.audioAyahClose?.addEventListener("click", () => closeDrawer(elements.audioAyahDrawer));
    elements.audioCancelAyahBtn?.addEventListener("click", () => closeDrawer(elements.audioAyahDrawer));

    elements.audioChapterSelect?.addEventListener("change", async () => {
      await updateVerseSelectFor(elements.audioVerseSelect, Number(elements.audioChapterSelect.value));
    });

    elements.audioGoToAyahBtn?.addEventListener("click", async () => {
      const chapter = Number(elements.audioChapterSelect.value);
      const verse = Number(elements.audioVerseSelect.value);
      closeDrawer(elements.audioAyahDrawer);
      await loadVerse(chapter, verse);
    });

    // Tafsir / translation
    elements.showTafseer?.addEventListener("click", openTafsirDrawer);
    elements.showTafseerFooter?.addEventListener("click", openTafsirDrawer);
    elements.showTranslation?.addEventListener("click", openTranslationDrawer);
    elements.audioDrawerClose?.addEventListener("click", () => closeDrawer(elements.audioSideDrawer));

    // Bookmark audio = save ayah
    elements.bookmarkAudio?.addEventListener("click", saveCurrentAyah);

    // Share
    elements.shareAudio?.addEventListener("click", async () => {
      const text = `${elements.verseArabic.textContent}\n\n${elements.verseTranslation.textContent}\n\n${getCurrentVerseRef()}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Quran Tab",
            text,
            url: location.href
          });
        } catch (_) { }
      } else {
        try {
          await navigator.clipboard.writeText(text);
          showNotification("কপি করা হয়েছে");
        } catch (_) {
          showNotification("শেয়ার করা যায়নি", "error");
        }
      }
    });

    // Ramadan
    elements.ramadanModeBtn?.addEventListener("click", enterRamadanMode);
    elements.exitRamadanMode?.addEventListener("click", exitRamadanMode);

    // Speed options
    document.querySelectorAll(".speed-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const speed = Number(btn.dataset.speed || "1");
        changeAudioSpeed(speed);
        document.querySelectorAll(".speed-option").forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");
        elements.speedModal.style.display = "none";
        elements.speedModal.setAttribute("aria-hidden", "true");
      });
    });

    // Sleep options
    document.querySelectorAll(".sleep-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const minutes = Number(btn.dataset.minutes || "0");
        setSleepTimer(minutes);
        elements.sleepModal.style.display = "none";
        elements.sleepModal.setAttribute("aria-hidden", "true");
      });
    });

    // Audio events
    elements.audioPlayer?.addEventListener("timeupdate", updateAudioProgressUI);
    elements.audioPlayer?.addEventListener("loadedmetadata", updateAudioProgressUI);
    elements.audioPlayer?.addEventListener("durationchange", updateAudioProgressUI);
    elements.audioPlayer?.addEventListener("seeked", updateAudioProgressUI);
    elements.audioPlayer?.addEventListener("play", syncAudioModeState);
    elements.audioPlayer?.addEventListener("pause", syncAudioModeState);
    elements.audioPlayer?.addEventListener("ended", handleAudioEnded);

    // Global close clicks
    document.addEventListener("click", (e) => {
      const target = e.target;

      if (!target.closest(".custom-dropdown")) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none";
        });
      }

      if (elements.savedDropdown && !target.closest(".saved-container")) {
        elements.savedDropdown.style.display = "none";
      }

      if (
        elements.audioSideDrawer &&
        !target.closest("#audioSideDrawer") &&
        !target.closest("#showTafseer") &&
        !target.closest("#showTafseerFooter") &&
        !target.closest("#showTranslation")
      ) {
        closeDrawer(elements.audioSideDrawer);
      }

      if (
        elements.audioAyahDrawer &&
        !target.closest("#audioAyahDrawer") &&
        !target.closest("#audioSurahTrigger") &&
        !target.closest("#currentAyahNumber")
      ) {
        closeDrawer(elements.audioAyahDrawer);
      }

      if (target === elements.ayahSelectModal) closeModal(elements.ayahSelectModal);
      if (target === elements.speedModal) {
        elements.speedModal.style.display = "none";
        elements.speedModal.setAttribute("aria-hidden", "true");
      }
      if (target === elements.sleepModal) {
        elements.sleepModal.style.display = "none";
        elements.sleepModal.setAttribute("aria-hidden", "true");
      }
    });

    // Keyboard close
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      closeModal(elements.ayahSelectModal);
      closeDrawer(elements.audioSideDrawer);
      closeDrawer(elements.audioAyahDrawer);

      if (elements.speedModal.style.display === "block") {
        elements.speedModal.style.display = "none";
        elements.speedModal.setAttribute("aria-hidden", "true");
      }

      if (elements.sleepModal.style.display === "block") {
        elements.sleepModal.style.display = "none";
        elements.sleepModal.setAttribute("aria-hidden", "true");
      }

      if (state.isAudioMode) {
        exitAudioMode();
      } else if (elements.ramadanModeScreen.style.display === "flex") {
        exitRamadanMode();
      }
    });

    // Unlock azan after first interaction
    document.addEventListener(
      "click",
      () => {
        azanAudio.play()
          .then(() => {
            azanAudio.pause();
            azanAudio.currentTime = 0;
          })
          .catch(() => { });
      },
      { once: true }
    );
  }

  // =========================
  // INIT
  // =========================
  async function initializeApp() {
    try {
      updateClock();
      setInterval(updateClock, 1000);

      populateDropdown("reciterDropdown", reciters, async (code) => {
        state.currentVerse.audioEdition = code;
        await loadAudioByAyah(state.currentVerse.chapter, state.currentVerse.verse, false);
        updateAudioModeDisplay();
      });

      populateDropdown("translationDropdown", translations, async (code) => {
        state.currentVerse.translation = code;
        await loadVerse(state.currentVerse.chapter, state.currentVerse.verse);
      });

      populateDropdown("audioReciterDropdown", reciters, async (code) => {
        state.currentVerse.audioEdition = code;
        await loadAudioByAyah(state.currentVerse.chapter, state.currentVerse.verse, false);
        updateAudioModeDisplay();
      }, true);

      populateDropdown("audioTranslationDropdown", translations, async (code) => {
        state.currentVerse.translation = code;
        await loadVerse(state.currentVerse.chapter, state.currentVerse.verse);
      }, true);

      bindEvents();
      renderSavedAyahs();
      await populateSurahDropdowns();
      syncAudioModeState();
      await loadRandomQuote();
      await initPrayerSystem();

      // Start with a random verse for premium feel
      await loadRandomVerse(false);
    } catch (error) {
      console.error("Initialization error:", error);
      showNotification("অ্যাপ চালু করতে সমস্যা হয়েছে", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", initializeApp);
})();