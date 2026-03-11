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
        { name: "মাগরিব", time: cleanPrayerTime(timings.Maghrib) },
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
    if (state.hijriCache?.dateKey === getTodayDateKey()) {
      return state.hijriCache.text;
    }

    try {
      const today = getTodayDateKey();
      const data = await fetchJson(`https://api.aladhan.com/v1/gToH?date=${today}`);
      const hijri = data?.data?.hijri;
      if (!hijri) throw new Error("Hijri date unavailable");

      const text = `${banglaDigits(hijri.day)} ${hijri.month?.en || "রমজান"} ${banglaDigits(hijri.year)}`;
      state.hijriCache = { dateKey: today, text };
      return text;
    } catch (_) {
      return "রমজান ১৪৪৭";
    }
  }

  function populatePrayerTable(prayerTimes) {
    if (!elements.prayerTimesBody) return;
    elements.prayerTimesBody.innerHTML = "";

    prayerTimes.forEach((prayer, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${prayer.name}</td>
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