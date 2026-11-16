(() => {
  // 1. Diagnostics hook (from original extension.js)
  var v = (window.__cdsDiagBorn ||= Date.now()),
    o = (window.__cdsDiagLog ||= []),
    b = (e) => {
      if (e instanceof Error)
        return `${e.name}: ${e.message}${
          e.stack
            ? `\n    ${e.stack.split("\n").slice(1, 4).join("\n    ").trim()}`
            : ""
        }`;
      if (typeof e == "string") return e;
      try {
        return JSON.stringify(e);
      } catch {
        return String(e);
      }
    };
  function a(e, ...r) {
    o.push({
      at: Date.now(),
      level: e,
      msg: r.map(b).join(" ").slice(0, 600),
    });
    if (o.length > 60) o.shift();
  }
  if (!window.__cdsDiagHooked) {
    window.__cdsDiagHooked = true;
    for (let e of ["warn", "error"]) {
      let r = console[e].bind(console);
      console[e] = (...t) => {
        if (typeof t[0] == "string" && t[0].startsWith("[cd-shelf]")) a(e, ...t);
        r(...t);
      };
    }
    window.addEventListener("error", (e) => {
      if (/cd-shelf/.test(e.filename || "") || /cd-shelf/.test(e.error?.stack || ""))
        a("uncaught", e.error || e.message);
    });
    window.addEventListener("unhandledrejection", (e) => {
      if (/cd-shelf/.test(e.reason?.stack || "")) a("unhandled", e.reason);
    });
  }

  // 2. Pure JS MD5 implementation for Subsonic token authentication (md5(password + salt))
  function md5(str) {
    function cmn(q, a, b, x, s, t) {
      a = (((a + q) | 0) + ((x + t) | 0)) | 0;
      return (((a << s) | (a >>> (32 - s))) + b) | 0;
    }
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function md5cycle(x, k) {
      let [a, b, c, d] = x;
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = (a + x[0]) | 0;
      x[1] = (b + x[1]) | 0;
      x[2] = (c + x[2]) | 0;
      x[3] = (d + x[3]) | 0;
    }
    const utf8 = unescape(encodeURIComponent(str));
    const n = utf8.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      const tail = [];
      for (let j = i - 64; j < i; j += 4) {
        tail.push(
          utf8.charCodeAt(j) |
            (utf8.charCodeAt(j + 1) << 8) |
            (utf8.charCodeAt(j + 2) << 16) |
            (utf8.charCodeAt(j + 3) << 24)
        );
      }
      md5cycle(state, tail);
    }
    const tail = new Array(16).fill(0);
    let j = 0;
    for (i -= 64; i < n; i++, j++) {
      tail[j >> 2] |= utf8.charCodeAt(i) << ((j % 4) << 3);
    }
    tail[j >> 2] |= 0x80 << ((j % 4) << 3);
    if (j > 55) {
      md5cycle(state, tail);
      tail.fill(0);
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    const hex = "0123456789abcdef";
    let out = "";
    for (let k = 0; k < 4; k++) {
      for (let m = 0; m < 4; m++) {
        const byte = (state[k] >> (m * 8)) & 0xff;
        out += hex.charAt((byte >>> 4) & 0x0f) + hex.charAt(byte & 0x0f);
      }
    }
    return out;
  }

  // 3. Navidrome Auth & Configuration Manager
  const AUTH_KEY = "cd-shelf:navidrome-auth";
  const DEFAULT_SERVER_URL = "";
  function loadAuth() {
    try {
      const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (saved && saved.serverUrl && saved.username && saved.subsonicToken && saved.subsonicSalt) {
        return saved;
      }
    } catch {}
    return null;
  }

  let authState = loadAuth();
  const libraryListeners = new Set();
  function emitLibraryUpdate() {
    for (const fn of libraryListeners) {
      try {
        fn();
      } catch (e) {
        console.error("[cd-shelf] listener error", e);
      }
    }
  }

  function getServerUrl() {
    let url = authState?.serverUrl || DEFAULT_SERVER_URL;
    return url.replace(/\/+$/, "");
  }

  function subsonicParams(extra = {}) {
    if (!authState) return new URLSearchParams(extra).toString();
    const params = new URLSearchParams({
      u: authState.username,
      t: authState.subsonicToken,
      s: authState.subsonicSalt,
      v: "1.16.1",
      c: "cd-shelf",
      f: "json",
      ...extra,
    });
    return params.toString();
  }

  async function subsonicGet(endpoint, params = {}) {
    if (!authState) {
      openLoginModal();
      throw new Error("Conecta tu cuenta de Navidrome para cargar tu biblioteca");
    }
    const url = `${getServerUrl()}/rest/${endpoint}.view?${subsonicParams(params)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${endpoint}`);
    const data = await res.json();
    const sr = data?.["subsonic-response"];
    if (!sr || sr.status !== "ok") {
      const code = sr?.error?.code;
      const msg = sr?.error?.message || "Error de Subsonic API";
      if (code === 40 || code === 41) {
        openLoginModal(msg);
      }
      throw new Error(msg);
    }
    return sr;
  }

  function coverArtUrl(id, size = 600) {
    if (!id || !authState) return null;
    return `${getServerUrl()}/rest/getCoverArt.view?${subsonicParams({ id, size })}`;
  }

  function streamUrl(id) {
    if (!id || !authState) return "";
    return `${getServerUrl()}/rest/stream.view?${subsonicParams({ id })}`;
  }

  // Caches for albums, playlists, and tracks
  const albumCache = new Map();
  const playlistCache = new Map();
  const trackMetaCache = new Map();
  const starredMeta = {
    albumDates: new Map(),
    songCounts: new Map(),
  };

  function recordStarredData(starred2) {
    if (!starred2) return;
    for (const al of starred2.album || []) {
      if (al?.id && al.starred) {
        starredMeta.albumDates.set(String(al.id), String(al.starred));
      }
    }
    if (Array.isArray(starred2.song)) {
      starredMeta.songCounts.clear();
      const starredIds = new Set();
      for (const s of starred2.song) {
        if (s?.id != null) {
          const sid = String(s.id);
          starredIds.add(sid);
          if (!songStarPending.has(sid)) {
            songStarServer.set(sid, true);
            songStarConfirmed.add(sid);
          }
        }
        if (s?.albumId) {
          const aid = String(s.albumId);
          starredMeta.songCounts.set(aid, (starredMeta.songCounts.get(aid) || 0) + 1);
        }
      }
      for (const [sid] of songStarServer) {
        if (!songStarPending.has(sid) && !starredIds.has(sid)) {
          songStarServer.set(sid, false);
        }
      }
    }
  }

  function cacheTrack(t, albumFallback = {}) {
    if (!t?.id) return;
    if (!songStarConfirmed.has(String(t.id))) songStarServer.set(String(t.id), !!t.starred);
    trackMetaCache.set(String(t.id), {
      id: String(t.id),
      uri: `spotify:track:${t.id}`,
      name: t.title || t.name || "Untitled",
      artist: t.artist || albumFallback.artist || "Unknown Artist",
      album: t.album || albumFallback.name || "",
      albumId: String(t.albumId || albumFallback.id || ""),
      coverArt: t.coverArt || albumFallback.coverArt || albumFallback.id || "",
      durationMs: (Number(t.duration) || 0) * 1000,
    });
  }

  // Song favorites (Subsonic star/unstar). `songStarServer` mirrors the last known server
  // state; cached album/playlist payloads can be stale, so a local toggle always wins until
  // the server confirms it, and the current song is re-checked with getSong on track change.
  const songStarServer = new Map();
  const songStarConfirmed = new Set();
  const songStarOverride = new Map();
  const songStarPending = new Set();
  let lastStarSyncId = null;

  function isSongStarred(id) {
    const key = String(id);
    if (songStarOverride.has(key)) return songStarOverride.get(key);
    return !!songStarServer.get(key);
  }

  async function refreshSongStar(id) {
    try {
      const sr = await subsonicGet("getSong", { id });
      if (sr?.song && !songStarPending.has(id)) {
        songStarServer.set(id, !!sr.song.starred);
        songStarConfirmed.add(id);
        songStarOverride.delete(id);
        updateStarButton();
      }
    } catch {}
  }

  function updateStarButton() {
    if (!npElements?.like) return;
    const cur = currentTrackObj();
    const btn = npElements.like;
    if (!cur || !authState) {
      btn.disabled = true;
      btn.classList.remove("is-starred", "is-pending");
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Agregar a favoritos";
      btn.setAttribute("aria-label", "Agregar a favoritos");
      setIcon(btn, "heart");
      lastStarSyncId = null;
      return;
    }
    if (cur.id !== lastStarSyncId) {
      lastStarSyncId = cur.id;
      refreshSongStar(cur.id);
    }
    const starred = isSongStarred(cur.id);
    btn.disabled = false;
    btn.classList.toggle("is-starred", starred);
    btn.classList.toggle("is-pending", songStarPending.has(cur.id));
    btn.setAttribute("aria-pressed", String(starred));
    const label = starred ? "Quitar de favoritos" : "Agregar a favoritos";
    btn.title = label;
    btn.setAttribute("aria-label", label);
    setIcon(btn, starred ? "heartFilled" : "heart");
  }

  async function toggleCurrentStar() {
    const cur = currentTrackObj();
    if (!cur || !authState || songStarPending.has(cur.id)) return;
    const id = String(cur.id);
    const prev = isSongStarred(id);
    const next = !prev;
    songStarOverride.set(id, next);
    songStarPending.add(id);
    updateStarButton();
    try {
      await subsonicGet(next ? "star" : "unstar", { id });
      songStarServer.set(id, next);
      songStarConfirmed.add(id);
      if (cur.albumId) {
        const aid = String(cur.albumId);
        const prevCount = starredMeta.songCounts.get(aid) || 0;
        const nextCount = Math.max(0, prevCount + (next ? 1 : -1));
        if (nextCount > 0) starredMeta.songCounts.set(aid, nextCount);
        else starredMeta.songCounts.delete(aid);
        const cachedAlbum = albumCache.get(aid);
        const cachedSong = cachedAlbum?.song?.find((s) => String(s?.id) === id);
        if (cachedSong) {
          if (next) cachedSong.starred = new Date().toISOString();
          else delete cachedSong.starred;
        }
      }
    } catch (e) {
      console.warn("[cd-shelf] favorito", e);
    } finally {
      songStarOverride.delete(id);
      songStarPending.delete(id);
      updateStarButton();
    }
  }

  function mapSubsonicTrack(s, at = 0, extra = {}) {
    cacheTrack(s, extra.albumFallback || {});
    return {
      at,
      id: String(s.id),
      uri: `spotify:track:${s.id}`,
      name: s.title || s.name || "Untitled",
      artist: s.artist || extra.artist || "Unknown Artist",
      album: s.album || extra.album || "",
      albumId: String(s.albumId || extra.albumId || ""),
      coverArt: s.coverArt || extra.coverArt || s.albumId || "",
      durationMs: (Number(s.duration) || 0) * 1000,
      _fromLibraryRandom: !!extra.fromLibraryRandom,
    };
  }

  // 4. Audio Engine & Player State
  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.preload = "auto";
  try {
    const savedVol = parseFloat(localStorage.getItem("cd-shelf:volume"));
    if (Number.isFinite(savedVol)) audio.volume = Math.max(0, Math.min(1, savedVol));
  } catch {}

  const playerListeners = {
    songchange: new Set(),
    onplaypause: new Set(),
    onprogress: new Set(),
  };

  function emitPlayer(event) {
    const set = playerListeners[event];
    if (!set) return;
    for (const fn of set) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
    updateNowPlayingBar();
  }

  let currentShuffleScope = "disc";
  try {
    const savedSettings = JSON.parse(localStorage.getItem("cd-shelf:settings") || "{}");
    if (savedSettings?.shuffleScope === "library") currentShuffleScope = "library";
  } catch {}
  function getShuffleScope() {
    return currentShuffleScope === "library" ? "library" : "disc";
  }

  const playerState = {
    contextUri: null,
    contextMeta: {},
    tracks: [], // original order
    queue: [], // play order (shuffled or linear)
    index: -1,
    shuffle: false,
    libraryShuffle: false,
    refillingRandom: false,
    queueSeq: 0,
    repeat: 0, // 0 = off, 1 = context, 2 = one
    scrobbledCurrent: false,
  };
  let isSeekingDrag = false;
  let dragSeekDirty = false;
  let pendingSeekMs = null;

  function currentTrackObj() {
    if (playerState.index < 0 || playerState.index >= playerState.queue.length) return null;
    return playerState.queue[playerState.index];
  }

  function syncSpicetifyPlayerData() {
    const cur = currentTrackObj();
    if (!cur) {
      Spicetify.Player.data = null;
      return;
    }
    const art = coverArtUrl(cur.coverArt || cur.albumId, 600);
    const thumb = coverArtUrl(cur.coverArt || cur.albumId, 300);
    const isLibShuffle = playerState.libraryShuffle;
    const contextUri =
      isLibShuffle && cur._fromLibraryRandom && cur.albumId
        ? `spotify:album:${cur.albumId}`
        : playerState.contextUri || `spotify:album:${cur.albumId}`;
    const contextMeta = isLibShuffle
      ? {
          context_description: cur.album || playerState.contextMeta?.context_description || "Aleatorio",
          context_owner: cur.artist || "",
          image_url: art,
        }
      : playerState.contextMeta || {};
    Spicetify.Player.data = {
      context: {
        uri: contextUri,
        metadata: contextMeta,
      },
      item: {
        uri: cur.uri,
        name: cur.name,
        artists: [{ name: cur.artist }],
        duration: { milliseconds: cur.durationMs || Math.round((audio.duration || 0) * 1000) },
        album: {
          uri: `spotify:album:${cur.albumId}`,
          name: cur.album,
          images: [
            { label: "xlarge", url: art, width: 600 },
            { label: "large", url: art, width: 600 },
            { label: "standard", url: thumb, width: 300 },
          ],
        },
      },
    };
  }

  async function fetchRandomLibraryTracks(size = 50, excludeIds = []) {
    if (!authState) return [];
    const sr = await subsonicGet("getRandomSongs", { size });
    const songs = sr?.randomSongs?.song || [];
    const excluded = new Set(
      (Array.isArray(excludeIds) ? excludeIds : [excludeIds]).filter(Boolean).map(String)
    );
    const filtered = songs.filter((s) => s?.id && !excluded.has(String(s.id)));
    const pool = filtered.length ? filtered : songs.filter((s) => s?.id);
    return pool.map((s, idx) => mapSubsonicTrack(s, idx, { fromLibraryRandom: true }));
  }

  function refillLibraryShuffleQueue(seq, { emitPause = false } = {}) {
    if (playerState.refillingRandom) return Promise.resolve();
    playerState.refillingRandom = true;
    const upcomingIds = playerState.queue.slice(Math.max(0, playerState.index)).map((t) => t.id);
    return fetchRandomLibraryTracks(50, upcomingIds)
      .then((more) => {
        if (seq !== playerState.queueSeq || !playerState.libraryShuffle || !more.length) return;
        if (playerState.index > 100) {
          const trim = playerState.index - 100;
          playerState.queue = playerState.queue.slice(trim);
          playerState.index -= trim;
        }
        playerState.queue.push(...more);
        if (emitPause) emitPlayer("onplaypause");
      })
      .catch(() => {})
      .finally(() => {
        if (seq === playerState.queueSeq) {
          playerState.refillingRandom = false;
        }
      });
  }

  async function startLibraryShuffle() {
    if (!authState) {
      openLoginModal();
      return false;
    }
    const seq = ++playerState.queueSeq;
    playerState.refillingRandom = false;
    const songs = await fetchRandomLibraryTracks(50, []);
    if (seq !== playerState.queueSeq || !songs.length) return false;
    playerState.shuffle = true;
    playerState.libraryShuffle = true;
    playerState.tracks = [];
    playerState.queue = songs;
    playerState.index = 0;
    const first = songs[0];
    playerState.contextUri = first.albumId ? `spotify:album:${first.albumId}` : null;
    playerState.contextMeta = {
      context_description: first.album || "Aleatorio",
      context_owner: first.artist || "",
      image_url: coverArtUrl(first.coverArt || first.albumId, 600),
    };
    playCurrentQueueIndex();
    return true;
  }

  function rebuildQueueForCurrent() {
    const seq = ++playerState.queueSeq;
    playerState.refillingRandom = false;
    const cur = currentTrackObj();
    const wantLibShuffle = playerState.shuffle && getShuffleScope() === "library";

    if (wantLibShuffle) {
      playerState.libraryShuffle = true;
      if (cur) {
        const historyBefore = playerState.queue.slice(0, Math.max(0, playerState.index));
        playerState.queue = [...historyBefore, cur];
        playerState.index = historyBefore.length;
        syncSpicetifyPlayerData();
        emitPlayer("onplaypause");
        refillLibraryShuffleQueue(seq, { emitPause: true });
      } else {
        emitPlayer("onplaypause");
      }
      return;
    }

    playerState.libraryShuffle = false;
    if (!cur) {
      emitPlayer("onplaypause");
      return;
    }

    const inCurrentTracks = playerState.tracks.findIndex((t) => t.uri === cur.uri);
    if (!cur._fromLibraryRandom && inCurrentTracks >= 0 && playerState.tracks.length) {
      const built = buildQueueFromTracks(playerState.tracks, inCurrentTracks, playerState.shuffle);
      playerState.queue = built.queue;
      playerState.index = built.index;
      syncSpicetifyPlayerData();
      emitPlayer("onplaypause");
      return;
    }

    const historyBefore = playerState.queue.slice(0, Math.max(0, playerState.index));
    playerState.queue = [...historyBefore, cur];
    playerState.index = historyBefore.length;
    if (cur.albumId) {
      const albumUri = `spotify:album:${cur.albumId}`;
      playerState.contextUri = albumUri;
      playerState.contextMeta = {
        context_description: cur.album || "Album",
        context_owner: cur.artist || "",
        image_url: coverArtUrl(cur.coverArt || cur.albumId, 600),
      };
      syncSpicetifyPlayerData();
      emitPlayer("onplaypause");
      fetchContextTracks(albumUri)
        .then(({ meta, tracks }) => {
          if (seq !== playerState.queueSeq || !tracks.length) return;
          if (currentTrackObj()?.uri !== cur.uri) return;
          if (playerState.shuffle && getShuffleScope() === "library") return;
          playerState.contextUri = albumUri;
          playerState.contextMeta = meta;
          playerState.tracks = tracks;
          const idx = tracks.findIndex((t) => t.uri === cur.uri);
          const built = buildQueueFromTracks(tracks, Math.max(0, idx), playerState.shuffle);
          playerState.queue = built.queue;
          playerState.index = built.index;
          syncSpicetifyPlayerData();
          emitPlayer("onplaypause");
        })
        .catch(() => {});
    } else {
      syncSpicetifyPlayerData();
      emitPlayer("onplaypause");
    }
  }

  function playCurrentQueueIndex() {
    isSeekingDrag = false;
    dragSeekDirty = false;
    pendingSeekMs = null;
    try {
      audio.currentTime = 0;
    } catch {}
    const cur = currentTrackObj();
    if (!cur) {
      audio.pause();
      syncSpicetifyPlayerData();
      emitPlayer("songchange");
      emitPlayer("onplaypause");
      return;
    }
    playerState.scrobbledCurrent = false;
    syncSpicetifyPlayerData();
    audio.src = streamUrl(cur.id);
    audio.play().catch((err) => console.warn("[cd-shelf] play error:", err));
    emitPlayer("songchange");
    emitPlayer("onplaypause");
    if (
      playerState.libraryShuffle &&
      playerState.shuffle &&
      getShuffleScope() === "library" &&
      playerState.queue.length - 1 - playerState.index < 8 &&
      !playerState.refillingRandom
    ) {
      refillLibraryShuffleQueue(playerState.queueSeq);
    }
    // Scrobble "now playing" to Navidrome
    subsonicGet("scrobble", { id: cur.id, submission: "false" }).catch(() => {});
    if ("mediaSession" in navigator) {
      try {
        const art = coverArtUrl(cur.coverArt || cur.albumId, 600);
        navigator.mediaSession.metadata = new MediaMetadata({
          title: cur.name,
          artist: cur.artist,
          album: cur.album,
          artwork: art ? [{ src: art, sizes: "600x600", type: "image/jpeg" }] : [],
        });
      } catch {}
    }
  }

  audio.addEventListener("play", () => emitPlayer("onplaypause"));
  audio.addEventListener("pause", () => emitPlayer("onplaypause"));
  audio.addEventListener("loadedmetadata", () => {
    const cur = currentTrackObj();
    if (cur && !cur.durationMs && Number.isFinite(audio.duration)) {
      cur.durationMs = Math.round(audio.duration * 1000);
      syncSpicetifyPlayerData();
      emitPlayer("songchange");
    }
    if (pendingSeekMs !== null) {
      const target = pendingSeekMs;
      pendingSeekMs = null;
      try {
        audio.currentTime = Math.max(0, target / 1000);
      } catch {}
    }
    updateProgressBarOnly();
  });
  audio.addEventListener("seeked", () => updateProgressBarOnly());
  audio.addEventListener("durationchange", () => updateProgressBarOnly());
  audio.addEventListener("timeupdate", () => {
    const cur = currentTrackObj();
    if (cur && !playerState.scrobbledCurrent && audio.currentTime > 10) {
      const dur = audio.duration || (cur.durationMs ? cur.durationMs / 1000 : 0);
      if ((dur > 0 && audio.currentTime >= dur * 0.5) || audio.currentTime >= 240) {
        playerState.scrobbledCurrent = true;
        subsonicGet("scrobble", { id: cur.id, submission: "true" }).catch(() => {});
      }
    }
    updateProgressBarOnly();
  });
  audio.addEventListener("ended", () => {
    if (playerState.repeat === 2) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    Spicetify.Player.next();
  });

  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("play", () => Spicetify.Player.play());
      navigator.mediaSession.setActionHandler("pause", () => Spicetify.Player.pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => Spicetify.Player.back());
      navigator.mediaSession.setActionHandler("nexttrack", () => Spicetify.Player.next());
    } catch {}
  }

  async function fetchContextTracks(contextUri) {
    const parts = String(contextUri || "").split(":");
    const kind = parts[1];
    const id = parts.slice(2).join(":");
    if (kind === "album") {
      let al = albumCache.get(id);
      if (!al) {
        const sr = await subsonicGet("getAlbum", { id });
        al = sr.album;
        if (al) albumCache.set(id, al);
      }
      const songs = al?.song || [];
      songs.forEach((s) => cacheTrack(s, al));
      return {
        meta: {
          context_description: al?.name || "Album",
          context_owner: al?.artist || "",
          image_url: coverArtUrl(al?.coverArt || id, 600),
        },
        tracks: songs.map((s, idx) => ({
          at: idx,
          id: String(s.id),
          uri: `spotify:track:${s.id}`,
          name: s.title,
          artist: s.artist || al?.artist || "",
          album: al?.name || s.album || "",
          albumId: String(al?.id || id),
          coverArt: s.coverArt || al?.coverArt || id,
          durationMs: (Number(s.duration) || 0) * 1000,
        })),
      };
    }
    if (kind === "playlist") {
      let pl = playlistCache.get(id);
      if (!pl) {
        const sr = await subsonicGet("getPlaylist", { id });
        pl = sr.playlist;
        if (pl) playlistCache.set(id, pl);
      }
      const entries = pl?.entry || [];
      entries.forEach((s) => cacheTrack(s, {}));
      return {
        meta: {
          context_description: pl?.name || "Playlist",
          context_owner: pl?.owner || "",
          image_url: pl?.coverArt ? coverArtUrl(pl.coverArt, 600) : null,
        },
        tracks: entries.map((s, idx) => ({
          at: idx,
          id: String(s.id),
          uri: `spotify:track:${s.id}`,
          name: s.title,
          artist: s.artist || "",
          album: s.album || pl?.name || "",
          albumId: String(s.albumId || ""),
          coverArt: s.coverArt || pl?.coverArt || "",
          durationMs: (Number(s.duration) || 0) * 1000,
        })),
      };
    }
    if (kind === "user") {
      // Liked / Starred songs
      const sr = await subsonicGet("getStarred2");
      recordStarredData(sr?.starred2);
      const songs = sr.starred2?.song || [];
      songs.forEach((s) => cacheTrack(s, {}));
      return {
        meta: {
          context_description: "Favoritos",
          context_owner: authState?.name || authState?.username || "",
        },
        tracks: songs.map((s, idx) => ({
          at: idx,
          id: String(s.id),
          uri: `spotify:track:${s.id}`,
          name: s.title,
          artist: s.artist || "",
          album: s.album || "Favoritos",
          albumId: String(s.albumId || ""),
          coverArt: s.coverArt || s.albumId || "",
          durationMs: (Number(s.duration) || 0) * 1000,
        })),
      };
    }
    return { meta: {}, tracks: [] };
  }

  function buildQueueFromTracks(tracks, startIdx, shuffle) {
    if (!tracks.length) return { queue: [], index: -1 };
    const safeIdx = Math.max(0, Math.min(tracks.length - 1, startIdx ?? 0));
    if (!shuffle) {
      return { queue: [...tracks], index: safeIdx };
    }
    const first = tracks[safeIdx];
    const rest = tracks.filter((_, i) => i !== safeIdx);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return { queue: [first, ...rest], index: 0 };
  }

  // 5. Lyrics Parser & Fetcher (OpenSubsonic + Subsonic + LRCLIB fallback)
  function parseLrcText(raw) {
    if (!raw || typeof raw !== "string") return null;
    const lines = raw.split(/\r?\n/);
    const timeRegex = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
    const syncedLines = [];
    const plainLines = [];
    for (const line of lines) {
      const matches = [...line.matchAll(timeRegex)];
      const text = line.replace(timeRegex, "").trim();
      if (matches.length > 0) {
        for (const m of matches) {
          const min = parseInt(m[1], 10);
          const sec = parseInt(m[2], 10);
          const frac = m[3] ? parseInt(m[3].padEnd(3, "0").slice(0, 3), 10) : 0;
          syncedLines.push({ startTimeMs: String(min * 60000 + sec * 1000 + frac), words: text });
        }
      } else if (text && !/^\[(ar|ti|al|by|offset|length|re|ve):/i.test(line.trim())) {
        plainLines.push({ startTimeMs: "0", words: text });
      }
    }
    if (syncedLines.length > 0) {
      syncedLines.sort((a, b) => Number(a.startTimeMs) - Number(b.startTimeMs));
      return {
        lyrics: {
          syncType: "LINE_SYNCED",
          isRtlLanguage: false,
          language: "",
          lines: syncedLines,
        },
      };
    }
    if (plainLines.length > 0) {
      return {
        lyrics: {
          syncType: "UNSYNCED",
          isRtlLanguage: false,
          language: "",
          lines: plainLines,
        },
      };
    }
    return null;
  }

  async function fetchTrackLyrics(trackId) {
    // 1. Try OpenSubsonic getLyricsBySongId
    try {
      const sr = await subsonicGet("getLyricsBySongId", { id: trackId });
      const list = sr?.lyricsList?.structuredLyrics;
      if (Array.isArray(list) && list.length > 0) {
        const best = list.find((l) => l.synced && l.line?.length) || list.find((l) => l.line?.length);
        if (best) {
          return {
            lyrics: {
              syncType: best.synced ? "LINE_SYNCED" : "UNSYNCED",
              isRtlLanguage: false,
              language: best.lang || "",
              lines: best.line.map((ln) => ({
                startTimeMs: String(Number(ln.start) || 0),
                words: (ln.value || "").trim(),
              })),
            },
          };
        }
      }
    } catch {}

    const meta = trackMetaCache.get(String(trackId)) || currentTrackObj();
    // 2. Try standard Subsonic getLyrics
    if (meta?.artist && meta?.name) {
      try {
        const sr = await subsonicGet("getLyrics", { artist: meta.artist, title: meta.name });
        const val = sr?.lyrics?.value;
        const parsed = parseLrcText(val);
        if (parsed) return parsed;
      } catch {}

      // 3. Try LRCLIB public API as fallback for synced lyrics
      try {
        const q = new URLSearchParams({
          artist_name: meta.artist,
          track_name: meta.name,
        });
        if (meta.album) q.set("album_name", meta.album);
        const res = await fetch(`https://lrclib.net/api/get?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const parsed = parseLrcText(data?.syncedLyrics || data?.plainLyrics);
          if (parsed) return parsed;
        }
      } catch {}
    }
    return null;
  }

  // 6. History Manager for Spicetify.Platform.History
  const historyListeners = new Set();
  const historyObj = {
    location: { pathname: "/cd-shelf", state: {} },
    push(pathname, state = {}) {
      if (pathname === "/" && state?.cdsHome) {
        openLoginModal();
        return;
      }
      if (pathname.startsWith("/album/") || pathname.startsWith("/playlist/") || pathname.startsWith("/collection/")) {
        const base = getServerUrl();
        if (pathname.startsWith("/album/")) {
          window.open(`${base}/app/#/album/${pathname.slice(7)}/show`, "_blank", "noopener");
        } else if (pathname.startsWith("/playlist/")) {
          window.open(`${base}/app/#/playlist/${pathname.slice(10)}/show`, "_blank", "noopener");
        } else {
          window.open(`${base}/app/#/song`, "_blank", "noopener");
        }
        return;
      }
      historyObj.location = { pathname, state };
      for (const fn of historyListeners) {
        try {
          fn(historyObj.location);
        } catch (e) {
          console.error(e);
        }
      }
    },
    replace(pathname, state = {}) {
      historyObj.location = { pathname, state };
      for (const fn of historyListeners) {
        try {
          fn(historyObj.location);
        } catch (e) {
          console.error(e);
        }
      }
    },
    listen(fn) {
      historyListeners.add(fn);
      return () => historyListeners.delete(fn);
    },
  };

  // 7. Build window.Spicetify object for Navidrome
  window.Spicetify = {
    get React() {
      return window.React;
    },
    get ReactDOM() {
      return window.ReactDOM;
    },
    Config: {
      version: "Navidrome 1.0",
      current_theme: "Navidrome CD Shelf",
      extensions: ["extension.js"],
    },
    Locale: {
      getLocale: () => navigator.language || "es",
    },
    CosmosAsync: {
      async get(url) {
        const m = String(url).match(/color-lyrics\/v2\/track\/([^/?&]+)/);
        if (m) {
          return await fetchTrackLyrics(decodeURIComponent(m[1]));
        }
        return null;
      },
    },
    GraphQL: {
      Definitions: {
        queryAlbumTracks: "queryAlbumTracks",
        getAlbum: "getAlbum",
        canvas: "canvas",
      },
      async Request(def, vars = {}) {
        if (def === "canvas") {
          return { data: { trackUnion: { canvas: null } } };
        }
        const albumId = String(vars.uri || "").split(":").slice(2).join(":");
        if (!albumId) return { data: {} };
        let al = albumCache.get(albumId);
        if (!al) {
          const sr = await subsonicGet("getAlbum", { id: albumId });
          al = sr.album;
          if (al) albumCache.set(albumId, al);
        }
        const songs = al?.song || [];
        songs.forEach((s) => cacheTrack(s, al));
        if (def === "queryAlbumTracks") {
          return {
            data: {
              albumUnion: {
                tracksV2: {
                  items: songs.map((s) => ({
                    track: {
                      uri: `spotify:track:${s.id}`,
                      name: s.title,
                      artists: {
                        items: [{ profile: { name: s.artist || al?.artist || "" } }],
                      },
                      duration: {
                        totalMilliseconds: (Number(s.duration) || 0) * 1000,
                      },
                    },
                  })),
                },
              },
            },
          };
        }
        if (def === "getAlbum") {
          const maxDisc = songs.reduce((m, s) => Math.max(m, Number(s.discNumber) || 1), 1);
          const artistSet = new Set([al?.artist, ...songs.map((s) => s.artist)].filter(Boolean));
          const labelName =
            (Array.isArray(al?.recordLabels) && al.recordLabels[0]?.name) || al?.genre || "";
          return {
            data: {
              albumUnion: {
                date: al?.year
                  ? { isoString: `${al.year}-01-01`, precision: "YEAR" }
                  : al?.created
                  ? { isoString: al.created, precision: "DAY" }
                  : null,
                label: labelName,
                copyright: {
                  items: [
                    ...(al?.genre ? [{ type: "C", text: al.genre }] : []),
                  ],
                },
                discs: { totalCount: maxDisc },
                artists: {
                  items: [...artistSet].map((name) => ({ profile: { name } })),
                },
              },
            },
          };
        }
        return { data: {} };
      },
    },
    Platform: {
      version: "Navidrome Subsonic 1.16.1",
      History: historyObj,
      Session: {
        locale: { getLocale: () => navigator.language || "es" },
      },
      AuthorizationAPI: {
        getState: () => ({ token: { accessToken: authState?.subsonicToken || "" } }),
      },
      UserAPI: {
        async getUser() {
          if (!authState) return { username: "navidrome", displayName: "Navidrome" };
          return {
            username: authState.username,
            displayName: authState.name || authState.username,
          };
        },
      },
      LibraryAPI: {
        async getContents({ filters = [], limit = 500, offset = 0 } = {}) {
          if (!authState) {
            openLoginModal();
            throw new Error("Inicia sesión en tu servidor Navidrome");
          }
          const filter = String(filters[0] ?? "0");
          if (filter === "0") {
            // Albums
            const sr = await subsonicGet("getAlbumList2", {
              type: "newest",
              size: limit,
              offset,
            });
            const albums = sr?.albumList2?.album || [];
            const items = albums.map((al) => {
              if (al.starred && al.id) {
                starredMeta.albumDates.set(String(al.id), String(al.starred));
              }
              const count = Number(al.songCount) || 0;
              const albumType = al.compilation
                ? "compilation"
                : count > 0 && count <= 3
                ? "single"
                : count > 0 && count <= 6
                ? "ep"
                : "album";
              return {
                type: "album",
                uri: `spotify:album:${al.id}`,
                name: al.name || al.title || "Untitled",
                artists: [{ name: al.albumArtist || al.artist || "Unknown Artist" }],
                albumType,
                images: [{ url: coverArtUrl(al.coverArt || al.id, 256) }],
                addedAt: al.created || new Date().toISOString(),
                lastPlayedAt: al.played || "",
                starredAt: al.starred || "",
              };
            });
            return {
              items,
              totalLength: items.length < limit ? offset + items.length : offset + limit + 1,
            };
          }
          if (filter === "2") {
            // Playlists
            if (offset > 0) return { items: [], totalLength: 0 };
            const sr = await subsonicGet("getPlaylists");
            const pls = sr?.playlists?.playlist || [];
            const items = pls.map((pl) => ({
              type: "playlist",
              uri: `spotify:playlist:${pl.id}`,
              name: pl.name || "Playlist",
              owner: { name: pl.owner || authState.username },
              images: pl.coverArt ? [{ url: coverArtUrl(pl.coverArt, 256) }] : [],
              addedAt: pl.created || new Date().toISOString(),
              lastPlayedAt: pl.changed || "",
            }));
            return { items, totalLength: items.length };
          }
          return { items: [], totalLength: 0 };
        },
        async getTracks({ limit = 500, offset = 0 } = {}) {
          if (!authState) return { items: [] };
          const sr = await subsonicGet("getStarred2");
          recordStarredData(sr?.starred2);
          const songs = sr?.starred2?.song || [];
          songs.forEach((s) => cacheTrack(s, {}));
          const slice = songs.slice(offset, offset + limit);
          return {
            items: slice.map((s) => {
              const art = coverArtUrl(s.coverArt || s.albumId, 600);
              const thumb = coverArtUrl(s.coverArt || s.albumId, 300);
              return {
                uri: `spotify:track:${s.id}`,
                name: s.title,
                artists: [{ name: s.artist || "" }],
                album: {
                  uri: s.albumId ? `spotify:album:${s.albumId}` : "",
                  name: s.album || "",
                  images: [
                    ...(art ? [{ label: "large", url: art, width: 600 }] : []),
                    ...(thumb ? [{ label: "standard", url: thumb, width: 300 }] : []),
                  ],
                },
                duration: { milliseconds: (Number(s.duration) || 0) * 1000 },
              };
            }),
          };
        },
        getStarredInfo(uri) {
          const parts = String(uri || "").split(":");
          if (parts[1] !== "album") return null;
          const id = parts.slice(2).join(":");
          return {
            starredAt: starredMeta.albumDates.get(id) || "",
            starredSongs: starredMeta.songCounts.get(id) || 0,
          };
        },
        getEvents() {
          return {
            addListener(ev, fn) {
              if (ev === "update") libraryListeners.add(fn);
            },
            removeListener(ev, fn) {
              if (ev === "update") libraryListeners.delete(fn);
            },
          };
        },
      },
      PlaylistAPI: {
        async getContents(uri, { offset = 0, limit = 5000 } = {}) {
          const plId = String(uri || "").split(":").slice(2).join(":");
          let pl = playlistCache.get(plId);
          if (!pl) {
            const sr = await subsonicGet("getPlaylist", { id: plId });
            pl = sr.playlist;
            if (pl) playlistCache.set(plId, pl);
          }
          const entries = pl?.entry || [];
          entries.forEach((s) => cacheTrack(s, {}));
          return {
            totalLength: entries.length,
            items: entries.slice(offset, offset + limit).map((s) => ({
              type: "track",
              uri: `spotify:track:${s.id}`,
              name: s.title,
              artists: [{ name: s.artist || "" }],
              duration: { milliseconds: (Number(s.duration) || 0) * 1000 },
            })),
          };
        },
        async getMetadata(uri) {
          const plId = String(uri || "").split(":").slice(2).join(":");
          let pl = playlistCache.get(plId);
          if (!pl) {
            const sr = await subsonicGet("getPlaylist", { id: plId });
            pl = sr.playlist;
            if (pl) playlistCache.set(plId, pl);
          }
          return {
            description: pl?.comment || "",
            owner: { displayName: pl?.owner || authState?.username || "" },
          };
        },
      },
      PlayHistoryAPI: {
        async getContents({ limit = 50 } = {}) {
          if (!authState) return { items: [] };
          try {
            const sr = await subsonicGet("getAlbumList2", {
              type: "recent",
              size: limit,
              offset: 0,
            });
            const albums = sr?.albumList2?.album || [];
            return {
              items: albums.map((al) => ({
                album: {
                  uri: `spotify:album:${al.id}`,
                  name: al.name || al.title || "",
                  images: [
                    { width: 300, url: coverArtUrl(al.coverArt || al.id, 300) },
                    { width: 600, url: coverArtUrl(al.coverArt || al.id, 600) },
                  ],
                },
                artists: [{ name: al.albumArtist || al.artist || "" }],
              })),
            };
          } catch {
            return { items: [] };
          }
        },
      },
      PlayerAPI: {
        async getQueue() {
          if (playerState.index < 0 || !playerState.queue.length) {
            return { queued: [], nextUp: [] };
          }
          const upcoming = playerState.queue.slice(playerState.index + 1, playerState.index + 8);
          return {
            queued: [],
            nextUp: upcoming.map((t, i) => ({
              uid: `${t.uri}:${playerState.index + 1 + i}`,
              uri: t.uri,
              name: t.name,
              artists: [{ name: t.artist }],
              album: {
                uri: `spotify:album:${t.albumId}`,
                name: t.album,
                images: [{ url: coverArtUrl(t.coverArt || t.albumId, 300) }],
              },
              _queueIndex: playerState.index + 1 + i,
            })),
          };
        },
        async skipTo(ref) {
          if (!ref) return;
          if (typeof ref._queueIndex === "number" && playerState.queue[ref._queueIndex]) {
            playerState.index = ref._queueIndex;
            playCurrentQueueIndex();
            return;
          }
          const idx = playerState.queue.findIndex((t) => t.uri === ref.uri);
          if (idx >= 0) {
            playerState.index = idx;
            playCurrentQueueIndex();
          }
        },
        _contextPlayer: {
          async getPositionState() {
            return { position: Math.round((audio.currentTime || 0) * 1000) };
          },
        },
      },
    },
    Player: {
      data: null,
      isPlaying() {
        return !audio.paused && !audio.ended && !!audio.src;
      },
      async playUri(contextUri, _options = {}, skipOpts = {}) {
        const seq = ++playerState.queueSeq;
        playerState.refillingRandom = false;
        const { meta, tracks } = await fetchContextTracks(contextUri);
        if (seq !== playerState.queueSeq || !tracks.length) return false;
        playerState.contextUri = contextUri;
        playerState.contextMeta = meta;
        playerState.tracks = tracks;
        const useLibShuffle = playerState.shuffle && getShuffleScope() === "library";
        playerState.libraryShuffle = useLibShuffle;
        let startIdx = 0;
        if (skipOpts?.skipTo) {
          if (skipOpts.skipTo.last) {
            startIdx = Math.max(0, tracks.length - 1);
          } else if (typeof skipOpts.skipTo.index === "number" && skipOpts.skipTo.index >= 0) {
            startIdx = skipOpts.skipTo.index;
          } else if (skipOpts.skipTo.uri) {
            const found = tracks.findIndex((t) => t.uri === skipOpts.skipTo.uri);
            if (found >= 0) startIdx = found;
          }
        } else if (playerState.shuffle) {
          startIdx = Math.floor(Math.random() * tracks.length);
        }
        if (useLibShuffle) {
          const safeIdx = Math.max(0, Math.min(tracks.length - 1, startIdx));
          const firstTrack = tracks[safeIdx];
          playerState.queue = [firstTrack];
          playerState.index = 0;
          playCurrentQueueIndex();
          fetchRandomLibraryTracks(50, firstTrack.id)
            .then((more) => {
              if (seq !== playerState.queueSeq || !playerState.libraryShuffle || !more.length) return;
              playerState.queue.push(...more);
              emitPlayer("onplaypause");
            })
            .catch(() => {});
          return true;
        }
        const built = buildQueueFromTracks(tracks, startIdx, playerState.shuffle);
        playerState.queue = built.queue;
        playerState.index = built.index;
        playCurrentQueueIndex();
        return true;
      },
      togglePlay() {
        if (!audio.src) {
          if (playerState.queue.length) {
            playCurrentQueueIndex();
          } else if (playerState.shuffle && getShuffleScope() === "library") {
            startLibraryShuffle();
          }
          return;
        }
        if (audio.paused) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      },
      play() {
        if (audio.src) audio.play().catch(() => {});
      },
      pause() {
        audio.pause();
      },
      next() {
        if (!playerState.queue.length) {
          if (playerState.shuffle && getShuffleScope() === "library") {
            startLibraryShuffle();
          }
          return;
        }
        if (playerState.index + 1 < playerState.queue.length) {
          playerState.index++;
          playCurrentQueueIndex();
        } else if (playerState.repeat === 1 && !playerState.libraryShuffle) {
          playerState.index = 0;
          playCurrentQueueIndex();
        } else if (playerState.libraryShuffle && playerState.shuffle && getShuffleScope() === "library") {
          const seq = playerState.queueSeq;
          const curId = currentTrackObj()?.id;
          fetchRandomLibraryTracks(50, curId)
            .then((more) => {
              if (seq !== playerState.queueSeq || !playerState.libraryShuffle || !more.length) {
                if (playerState.repeat === 1 && playerState.queue.length) {
                  playerState.index = 0;
                  playCurrentQueueIndex();
                } else {
                  audio.pause();
                  audio.currentTime = 0;
                  emitPlayer("onplaypause");
                }
                return;
              }
              playerState.queue.push(...more);
              playerState.index++;
              playCurrentQueueIndex();
            })
            .catch(() => {});
        } else if (!playerState.shuffle && typeof window.__cdsNextShelfDisc === "function") {
          const cur = currentTrackObj();
          const finishedUri =
            playerState.contextUri || (cur?.albumId ? `spotify:album:${cur.albumId}` : null);
          const seq = playerState.queueSeq;
          Promise.resolve(window.__cdsNextShelfDisc(finishedUri))
            .then((started) => {
              if (seq !== playerState.queueSeq) return;
              if (!started) {
                audio.pause();
                audio.currentTime = 0;
                emitPlayer("onplaypause");
              }
            })
            .catch(() => {
              if (seq !== playerState.queueSeq) return;
              audio.pause();
              audio.currentTime = 0;
              emitPlayer("onplaypause");
            });
        } else {
          audio.pause();
          audio.currentTime = 0;
          emitPlayer("onplaypause");
        }
      },
      back() {
        if (!playerState.queue.length) return;
        const resetCur = () => {
          pendingSeekMs = null;
          audio.currentTime = 0;
          updateProgressBarOnly(0);
        };
        if (audio.currentTime > 3) {
          resetCur();
          return;
        }
        if (playerState.index > 0) {
          playerState.index--;
          playCurrentQueueIndex();
        } else if (playerState.repeat === 1) {
          playerState.index = playerState.queue.length - 1;
          playCurrentQueueIndex();
        } else if (!playerState.shuffle && typeof window.__cdsPrevShelfDisc === "function") {
          const cur = currentTrackObj();
          const curUri =
            playerState.contextUri || (cur?.albumId ? `spotify:album:${cur.albumId}` : null);
          const seq = playerState.queueSeq;
          Promise.resolve(window.__cdsPrevShelfDisc(curUri))
            .then((started) => {
              if (seq === playerState.queueSeq && !started) resetCur();
            })
            .catch(() => {
              if (seq === playerState.queueSeq) resetCur();
            });
        } else {
          resetCur();
        }
      },
      seek(ms) {
        if (!Number.isFinite(ms)) return;
        const dur = this.getDuration();
        const clampedMs = Math.max(0, dur > 0 ? Math.min(dur, ms) : ms);
        if (typeof audio.readyState === "number" && audio.readyState < 1) {
          pendingSeekMs = clampedMs;
          try {
            audio.currentTime = clampedMs / 1000;
          } catch {}
        } else {
          pendingSeekMs = null;
          audio.currentTime = clampedMs / 1000;
        }
        updateProgressBarOnly(clampedMs);
      },
      getProgress() {
        return Math.round((audio.currentTime || 0) * 1000);
      },
      getDuration() {
        const cur = currentTrackObj();
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          return Math.round(audio.duration * 1000);
        }
        return cur?.durationMs || 0;
      },
      getVolume() {
        return audio.volume;
      },
      setVolume(v) {
        const clamped = Math.max(0, Math.min(1, Number(v) || 0));
        audio.volume = clamped;
        try {
          localStorage.setItem("cd-shelf:volume", String(clamped));
        } catch {}
        updateNowPlayingBar();
      },
      getShuffle() {
        return playerState.shuffle;
      },
      setShuffle(val) {
        const nextShuffle = !!val;
        if (nextShuffle === playerState.shuffle) return;
        playerState.shuffle = nextShuffle;
        rebuildQueueForCurrent();
      },
      getRepeat() {
        return playerState.repeat;
      },
      setRepeat(mode) {
        playerState.repeat = Number(mode) % 3;
        emitPlayer("onplaypause");
      },
      addEventListener(type, fn) {
        playerListeners[type]?.add(fn);
      },
      removeEventListener(type, fn) {
        playerListeners[type]?.delete(fn);
      },
      _getQueueSeq() {
        return playerState.queueSeq;
      },
    },
  };

  // 8. Original extension.js CSS + Standalone Player Bar & Login Modal CSS
  var p = `/* The library sidebar is gone: the shelf is the library. Its grid column collapses to nothing. */
body.cds-hide-sidebar .Root__nav-bar {
  display: none !important;
}
body.cds-hide-sidebar .Root__top-container {
  grid-template-columns: 0px minmax(0, 1fr) auto !important;
}

/* The player bar's cover, pressed onto a CD: round, a clear hub with a hole, a rainbow sheen. */
body.cds-disc .main-nowPlayingWidget-coverArt {
  position: relative;
  border-radius: 50% !important;
  overflow: visible !important;
  background: none !important;
  box-shadow: none !important;
}
body.cds-disc .main-nowPlayingWidget-coverArt .cover-art {
  border-radius: 50% !important;
  overflow: hidden;
  background: #c9ccd1 !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.35),
    0 3px 10px rgba(0, 0, 0, 0.55) !important;
  -webkit-mask: radial-gradient(circle, transparent 0 9%, #000 9.5%);
  mask: radial-gradient(circle, transparent 0 9%, #000 9.5%);
  animation: cds-spin 1.6s linear infinite;
  animation-play-state: paused;
}
body.cds-disc .main-nowPlayingWidget-coverArt .cover-art img {
  border-radius: 50% !important;
  /* The print stops short of the clear hub, like a real disc. */
  -webkit-mask: radial-gradient(circle, transparent 0 26%, #000 27%);
  mask: radial-gradient(circle, transparent 0 26%, #000 27%);
}
body.cds-disc.cds-playing .main-nowPlayingWidget-coverArt .cover-art {
  animation-play-state: running;
}
/* The light doesn't turn with the disc: the sheen and hub ring sit above it, still. */
body.cds-disc .main-nowPlayingWidget-coverArt::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  background:
    radial-gradient(circle, transparent 0 25%, rgba(255, 255, 255, 0.5) 26%, transparent 28.5%),
    conic-gradient(
      from 200deg,
      transparent 0deg,
      rgba(255, 80, 200, 0.28) 20deg,
      rgba(80, 220, 255, 0.32) 40deg,
      rgba(255, 240, 120, 0.25) 60deg,
      transparent 85deg,
      transparent 180deg,
      rgba(120, 255, 180, 0.22) 200deg,
      rgba(160, 120, 255, 0.28) 220deg,
      transparent 250deg
    );
  -webkit-mask: radial-gradient(circle, transparent 0 9%, #000 9.5%);
  mask: radial-gradient(circle, transparent 0 9%, #000 9.5%);
  mix-blend-mode: screen;
}
body.cds-disc [data-testid='cover-art-button'] {
  border-radius: 50% !important;
}
@keyframes cds-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  body.cds-disc .main-nowPlayingWidget-coverArt .cover-art {
    animation: none;
  }
}

/* Navidrome Standalone Layout & Now Playing Bar */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0e0d0c;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.Root__top-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.Root__main-view {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}
.Root__now-playing-bar {
  height: 78px;
  background: rgba(16, 15, 14, 0.96);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 16px;
  z-index: 60;
  user-select: none;
}
.cds-np-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 200px;
  flex: 1;
}
.cds-np-cover-btn {
  appearance: none;
  border: 0;
  padding: 0;
  background: none;
  width: 54px;
  height: 54px;
  cursor: pointer;
  flex: none;
}
.cds-np-cover-btn .cover-art {
  width: 54px;
  height: 54px;
  display: block;
}
.cds-np-cover-btn .cover-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cds-np-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.cds-np-title {
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cds-np-title.is-clickable,
.cds-np-artist.is-clickable {
  cursor: pointer;
  width: fit-content;
  max-width: 100%;
}
.cds-np-title.is-clickable:hover {
  text-decoration: underline;
  color: #1ed760;
}
.cds-np-artist {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cds-np-artist.is-clickable:hover {
  text-decoration: underline;
  color: #fff;
}
.cds-np-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1.5;
  max-width: 560px;
}
.cds-np-btns {
  display: flex;
  align-items: center;
  gap: 14px;
}
.cds-np-btn {
  appearance: none;
  border: 0;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.15s, transform 0.1s;
}
.cds-np-btn svg,
.cds-np-volicon svg {
  width: 16px;
  height: 16px;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cds-np-btn:hover {
  color: #fff;
}
.cds-np-btn:active {
  transform: scale(0.94);
}
.cds-np-btn.is-active {
  color: #1ed760;
}
.cds-np-btn.is-active::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: currentColor;
}
.cds-np-btn.is-play {
  width: 36px;
  height: 36px;
  background: #fff;
  color: #000;
}
.cds-np-btn.is-play:hover {
  transform: scale(1.06);
  background: #1ed760;
}
.cds-np-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  font-variant-numeric: tabular-nums;
}
.cds-np-range {
  flex: 1;
  accent-color: #1ed760;
  height: 4px;
  cursor: pointer;
}
.cds-np-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 200px;
  flex: 1;
}
.cds-np-volicon {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  margin-right: -4px;
}
.cds-np-vol {
  width: 90px;
  accent-color: #fff;
  height: 4px;
  cursor: pointer;
}
.cds-nd-badge {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.cds-nd-badge:hover {
  background: rgba(255, 255, 255, 0.14);
}
.cds-nd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1ed760;
}
.cds-nd-dot.is-off {
  background: #ff5555;
}
.cds-np-like {
  flex: none;
}
.cds-np-like.is-starred {
  color: #1ed760;
}
.cds-np-like.is-starred:hover {
  color: #3be477;
}
.cds-np-like:disabled {
  opacity: 0.35;
  cursor: default;
  transform: none;
}
.cds-np-like.is-pending {
  opacity: 0.6;
  pointer-events: none;
}

/* Navidrome Login Modal */
.cds-auth-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.cds-auth-card {
  width: min(400px, 100%);
  background: rgba(24, 22, 20, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 26px 24px 22px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cds-auth-card h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.cds-auth-card p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}
.cds-auth-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cds-auth-field label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}
.cds-auth-field input {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  outline: none;
}
.cds-auth-field input:focus {
  border-color: #1ed760;
}
.cds-auth-error {
  color: #ff6b6b;
  font-size: 12.5px;
  background: rgba(255, 80, 80, 0.12);
  padding: 8px 10px;
  border-radius: 8px;
}
.cds-auth-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}
`;

  // Line icons for the player bar (stroke = currentColor; filled shapes set their own fill).
  const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const NP_ICONS = {
    shuffle: svg(
      '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>'
    ),
    prev: svg('<path d="M19 20 9 12l10-8z" fill="currentColor"/><path d="M5 19V5"/>'),
    next: svg('<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 5v14"/>'),
    play: svg('<path d="M8 4.8v14.4a.8.8 0 0 0 1.2.7l11.5-7.2a.8.8 0 0 0 0-1.4L9.2 4.1A.8.8 0 0 0 8 4.8z" fill="currentColor" stroke="none"/>'),
    pause: svg(
      '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>'
    ),
    repeat: svg(
      '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'
    ),
    repeatOne: svg(
      '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><path d="M11 10h1v4"/>'
    ),
    volHigh: svg(
      '<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>'
    ),
    volLow: svg('<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>'),
    volMute: svg(
      '<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>'
    ),
    heart: svg(
      '<path d="M12 20.2s-7.6-4.6-9.5-9.3C1.2 7.6 3.3 4.3 6.8 4.3c2.1 0 3.6 1.1 5.2 3.1 1.6-2 3.1-3.1 5.2-3.1 3.5 0 5.6 3.3 4.3 6.6-1.9 4.7-9.5 9.3-9.5 9.3z"/>'
    ),
    heartFilled: svg(
      '<path d="M12 20.2s-7.6-4.6-9.5-9.3C1.2 7.6 3.3 4.3 6.8 4.3c2.1 0 3.6 1.1 5.2 3.1 1.6-2 3.1-3.1 5.2-3.1 3.5 0 5.6 3.3 4.3 6.6-1.9 4.7-9.5 9.3-9.5 9.3z" fill="currentColor"/>'
    ),
  };
  const setIcon = (el, name) => {
    if (el && el.dataset.icon !== name) {
      el.dataset.icon = name;
      el.innerHTML = NP_ICONS[name];
    }
  };
  const volIconName = (v) => (v <= 0.001 ? "volMute" : v < 0.5 ? "volLow" : "volHigh");

  function fmtTime(ms) {
    const s = Math.max(0, Math.floor((ms || 0) / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  let npElements = null;
  function ensureLayout() {
    if (npElements) return;
    let top = document.querySelector(".Root__top-container");
    if (!top) {
      top = document.createElement("div");
      top.className = "Root__top-container";
      document.body.appendChild(top);
    }
    let main = top.querySelector(".Root__main-view");
    if (!main) {
      main = document.createElement("main");
      main.className = "Root__main-view";
      top.appendChild(main);
    }
    let bar = top.querySelector(".Root__now-playing-bar");
    if (!bar) {
      bar = document.createElement("footer");
      bar.className = "Root__now-playing-bar";
      bar.setAttribute("data-testid", "now-playing-bar");
      bar.innerHTML = `
        <div class="cds-np-left">
          <button type="button" class="cds-np-cover-btn main-nowPlayingWidget-coverArt" data-testid="cover-art-button" title="Abrir caja del CD en el estante">
            <span class="cover-art">
              <img id="cds-np-img" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            </span>
          </button>
          <div class="cds-np-meta">
            <div class="cds-np-title" id="cds-np-title">Selecciona un disco del estante</div>
            <div class="cds-np-artist" id="cds-np-artist">${
              authState ? `Conectado a ${authState.serverUrl}` : "Sin conectar a Navidrome"
            }</div>
          </div>
          <button type="button" class="cds-np-btn cds-np-like" id="cds-np-like" title="Agregar a favoritos" aria-label="Agregar a favoritos" aria-pressed="false" data-icon="heart" disabled>${NP_ICONS.heart}</button>
        </div>
        <div class="cds-np-center">
          <div class="cds-np-btns">
            <button type="button" class="cds-np-btn" id="cds-np-shuffle" title="Aleatorio" aria-label="Aleatorio">${NP_ICONS.shuffle}</button>
            <button type="button" class="cds-np-btn" id="cds-np-prev" title="Anterior" aria-label="Anterior">${NP_ICONS.prev}</button>
            <button type="button" class="cds-np-btn is-play" id="cds-np-play" title="Reproducir / Pausar" aria-label="Reproducir / Pausar" data-icon="play">${NP_ICONS.play}</button>
            <button type="button" class="cds-np-btn" id="cds-np-next" title="Siguiente" aria-label="Siguiente">${NP_ICONS.next}</button>
            <button type="button" class="cds-np-btn" id="cds-np-repeat" title="Repetir" aria-label="Repetir" data-icon="repeat">${NP_ICONS.repeat}</button>
          </div>
          <div class="cds-np-bar-row">
            <span id="cds-np-cur">0:00</span>
            <input type="range" class="cds-np-range" id="cds-np-seek" min="0" max="1000" value="0" />
            <span id="cds-np-dur">0:00</span>
          </div>
        </div>
        <div class="cds-np-right">
          <span class="cds-np-volicon" id="cds-np-volicon" data-icon="${volIconName(audio.volume)}">${NP_ICONS[volIconName(audio.volume)]}</span>
          <input type="range" class="cds-np-vol" id="cds-np-vol" min="0" max="1" step="0.02" value="${audio.volume}" />
          <button type="button" class="cds-nd-badge" id="cds-nd-btn" title="Configurar servidor Navidrome">
            <span class="cds-nd-dot ${authState ? "" : "is-off"}" id="cds-nd-dot"></span>
            <span id="cds-nd-user">${authState ? authState.username : "Conectar Navidrome"}</span>
          </button>
        </div>
      `;
      top.appendChild(bar);
    }
    npElements = {
      img: document.getElementById("cds-np-img"),
      title: document.getElementById("cds-np-title"),
      artist: document.getElementById("cds-np-artist"),
      like: document.getElementById("cds-np-like"),
      shuffle: document.getElementById("cds-np-shuffle"),
      prev: document.getElementById("cds-np-prev"),
      play: document.getElementById("cds-np-play"),
      next: document.getElementById("cds-np-next"),
      repeat: document.getElementById("cds-np-repeat"),
      cur: document.getElementById("cds-np-cur"),
      seek: document.getElementById("cds-np-seek"),
      dur: document.getElementById("cds-np-dur"),
      vol: document.getElementById("cds-np-vol"),
      volIcon: document.getElementById("cds-np-volicon"),
      ndBtn: document.getElementById("cds-nd-btn"),
      ndDot: document.getElementById("cds-nd-dot"),
      ndUser: document.getElementById("cds-nd-user"),
    };

    npElements.play.addEventListener("click", () => Spicetify.Player.togglePlay());
    npElements.prev.addEventListener("click", () => Spicetify.Player.back());
    npElements.next.addEventListener("click", () => Spicetify.Player.next());
    npElements.shuffle.addEventListener("click", () =>
      Spicetify.Player.setShuffle(!Spicetify.Player.getShuffle())
    );
    npElements.repeat.addEventListener("click", () =>
      Spicetify.Player.setRepeat((Spicetify.Player.getRepeat() + 1) % 3)
    );
    let skipNextSeekChange = false;
    const commitSeekFromSlider = () => {
      const dur = Spicetify.Player.getDuration();
      if (dur > 0) {
        Spicetify.Player.seek((Number(npElements.seek.value) / 1000) * dur);
      }
    };
    npElements.seek.addEventListener("pointerdown", () => {
      isSeekingDrag = true;
      dragSeekDirty = false;
      skipNextSeekChange = false;
    });
    npElements.seek.addEventListener("input", () => {
      if (isSeekingDrag) {
        dragSeekDirty = true;
        const dur = Spicetify.Player.getDuration();
        if (dur > 0) {
          npElements.cur.textContent = fmtTime((Number(npElements.seek.value) / 1000) * dur);
        }
      } else {
        commitSeekFromSlider();
      }
    });
    const endSeekDrag = () => {
      if (!isSeekingDrag) return;
      isSeekingDrag = false;
      if (dragSeekDirty) {
        dragSeekDirty = false;
        skipNextSeekChange = true;
        commitSeekFromSlider();
      }
    };
    npElements.seek.addEventListener("change", () => {
      isSeekingDrag = false;
      if (skipNextSeekChange && !dragSeekDirty) {
        skipNextSeekChange = false;
        return;
      }
      dragSeekDirty = false;
      skipNextSeekChange = false;
      commitSeekFromSlider();
    });
    npElements.seek.addEventListener("blur", endSeekDrag);
    window.addEventListener("pointerup", endSeekDrag);
    window.addEventListener("pointercancel", endSeekDrag);
    npElements.vol.addEventListener("input", (e) => {
      Spicetify.Player.setVolume(Number(e.target.value));
    });
    npElements.ndBtn.addEventListener("click", () => openLoginModal());
    npElements.like.addEventListener("click", () => toggleCurrentStar());
    npElements.title.addEventListener("click", () => {
      const cur = currentTrackObj();
      if (!cur) return;
      const albumUri =
        Spicetify.Player.data?.item?.album?.uri ||
        (cur.albumId ? `spotify:album:${cur.albumId}` : null);
      const contextUri = Spicetify.Player.data?.context?.uri || albumUri;
      const targetUri = albumUri || contextUri;
      if (targetUri) {
        Spicetify.Platform.History.push(y, {
          cdsLocate: targetUri,
          cdsLocateFallback: contextUri,
          at: Date.now(),
        });
      }
    });
    npElements.artist.addEventListener("click", () => {
      const cur = currentTrackObj();
      const artist = cur?.artist?.trim();
      if (artist) {
        Spicetify.Platform.History.push(y, {
          cdsArtist: artist,
          at: Date.now(),
        });
      }
    });
  }

  function updateProgressBarOnly(overridePosMs) {
    if (!npElements) return;
    const pos =
      typeof overridePosMs === "number"
        ? overridePosMs
        : pendingSeekMs !== null
        ? pendingSeekMs
        : Spicetify.Player.getProgress();
    const dur = Spicetify.Player.getDuration();
    npElements.dur.textContent = fmtTime(dur);
    if (isSeekingDrag) return;
    npElements.cur.textContent = fmtTime(pos);
    npElements.seek.value =
      dur > 0 ? String(Math.max(0, Math.min(1000, Math.round((pos / dur) * 1000)))) : "0";
  }

  function updateNowPlayingBar() {
    if (!npElements) return;
    const cur = currentTrackObj();
    const playing = Spicetify.Player.isPlaying();
    if (cur) {
      npElements.title.textContent = cur.name;
      npElements.title.classList.add("is-clickable");
      npElements.title.title = "Ir a la ubicación del disco en el estante";
      npElements.artist.textContent = `${cur.artist}${cur.album ? ` · ${cur.album}` : ""}`;
      npElements.artist.classList.add("is-clickable");
      npElements.artist.title = `Filtrar discos de ${cur.artist} en el estante`;
      const thumb = coverArtUrl(cur.coverArt || cur.albumId, 300);
      if (thumb && npElements.img.src !== thumb) {
        npElements.img.src = thumb;
      }
    } else {
      npElements.title.textContent = "Selecciona un disco del estante";
      npElements.title.classList.remove("is-clickable");
      npElements.title.removeAttribute("title");
      npElements.artist.textContent = authState
        ? `Navidrome · ${authState.username}`
        : "Sin conectar a Navidrome";
      npElements.artist.classList.remove("is-clickable");
      npElements.artist.removeAttribute("title");
    }
    setIcon(npElements.play, playing ? "pause" : "play");
    npElements.shuffle.classList.toggle("is-active", Spicetify.Player.getShuffle());
    const rep = Spicetify.Player.getRepeat();
    npElements.repeat.classList.toggle("is-active", rep > 0);
    setIcon(npElements.repeat, rep === 2 ? "repeatOne" : "repeat");
    npElements.repeat.title = rep === 2 ? "Repetir una" : rep === 1 ? "Repetir todo" : "Repetir";
    const vol = Spicetify.Player.getVolume();
    npElements.vol.value = String(vol);
    setIcon(npElements.volIcon, volIconName(vol));
    npElements.ndDot.classList.toggle("is-off", !authState);
    npElements.ndUser.textContent = authState ? authState.username : "Conectar Navidrome";
    updateStarButton();
    updateProgressBarOnly();
  }

  // 9. Login / Server Configuration Modal
  let modalEl = null;
  function openLoginModal(errorMsg = "") {
    if (modalEl) {
      if (errorMsg) {
        const errBox = modalEl.querySelector(".cds-auth-error");
        if (errBox) {
          errBox.style.display = "block";
          errBox.textContent = errorMsg;
        }
      }
      return;
    }
    modalEl = document.createElement("div");
    modalEl.className = "cds-auth-backdrop";
    const defaultUrl = authState?.serverUrl || DEFAULT_SERVER_URL;
    const defaultUser = authState?.username || "";
    modalEl.innerHTML = `
      <form class="cds-auth-card" id="cds-auth-form">
        <h2>Conectar a Navidrome</h2>
        <p>Introduce la dirección de tu servidor Navidrome y tus credenciales. Tu sesión quedará guardada automáticamente en este navegador.</p>
        <div class="cds-auth-error" style="display:${errorMsg ? "block" : "none"}">${errorMsg}</div>
        <div class="cds-auth-field">
          <label for="cds-auth-url">URL del servidor Navidrome</label>
          <input id="cds-auth-url" type="url" required placeholder="https://tu-servidor-navidrome.com" value="${defaultUrl}" />
        </div>
        <div class="cds-auth-field">
          <label for="cds-auth-user">Usuario</label>
          <input id="cds-auth-user" type="text" required autocomplete="username" placeholder="usuario" value="${defaultUser}" />
        </div>
        <div class="cds-auth-field">
          <label for="cds-auth-pass">Contraseña</label>
          <input id="cds-auth-pass" type="password" required autocomplete="current-password" placeholder="••••••••" />
        </div>
        <div class="cds-auth-actions">
          ${
            authState
              ? '<button type="button" class="cds-chip" id="cds-auth-logout" style="margin-right:auto;color:#ff8080">Cerrar sesión</button><button type="button" class="cds-chip" id="cds-auth-cancel">Cancelar</button>'
              : ""
          }
          <button type="submit" class="cds-chip is-play" id="cds-auth-submit">Conectar estante</button>
        </div>
      </form>
    `;
    document.body.appendChild(modalEl);

    const cancelBtn = modalEl.querySelector("#cds-auth-cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        modalEl.remove();
        modalEl = null;
      });
    }
    const logoutBtn = modalEl.querySelector("#cds-auth-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(AUTH_KEY);
        authState = null;
        audio.pause();
        audio.removeAttribute("src");
        albumCache.clear();
        playlistCache.clear();
        trackMetaCache.clear();
        starredMeta.albumDates.clear();
        starredMeta.songCounts.clear();
        playerState.queueSeq++;
        playerState.refillingRandom = false;
        playerState.libraryShuffle = false;
        playerState.tracks = [];
        playerState.queue = [];
        playerState.index = -1;
        syncSpicetifyPlayerData();
        emitPlayer("songchange");
        emitPlayer("onplaypause");
        modalEl.remove();
        modalEl = null;
        openLoginModal();
      });
    }

    const form = modalEl.querySelector("#cds-auth-form");
    const errBox = modalEl.querySelector(".cds-auth-error");
    const submitBtn = modalEl.querySelector("#cds-auth-submit");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errBox.style.display = "none";
      submitBtn.disabled = true;
      submitBtn.textContent = "Conectando…";
      const serverUrl = modalEl.querySelector("#cds-auth-url").value.trim().replace(/\/+$/, "");
      const username = modalEl.querySelector("#cds-auth-user").value.trim();
      const password = modalEl.querySelector("#cds-auth-pass").value;

      try {
        let newAuth = null;
        // Try Navidrome /auth/login first
        try {
          const r = await fetch(`${serverUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          if (r.ok) {
            const d = await r.json();
            if (d.subsonicToken && d.subsonicSalt) {
              newAuth = {
                serverUrl,
                username: d.username || username,
                name: d.name || d.username || username,
                subsonicSalt: d.subsonicSalt,
                subsonicToken: d.subsonicToken,
                jwt: d.token || "",
              };
            }
          }
        } catch {}

        // Fallback to standard Subsonic MD5(password + salt) + /rest/ping.view
        if (!newAuth) {
          const salt = Math.random().toString(36).slice(2, 10);
          const token = md5(password + salt);
          const params = new URLSearchParams({
            u: username,
            t: token,
            s: salt,
            v: "1.16.1",
            c: "cd-shelf",
            f: "json",
          });
          const pingRes = await fetch(`${serverUrl}/rest/ping.view?${params.toString()}`);
          if (!pingRes.ok) throw new Error(`No se pudo conectar con ${serverUrl} (HTTP ${pingRes.status})`);
          const pingData = await pingRes.json();
          const sr = pingData?.["subsonic-response"];
          if (!sr || sr.status !== "ok") {
            throw new Error(sr?.error?.message || "Usuario o contraseña incorrectos");
          }
          newAuth = {
            serverUrl,
            username,
            name: username,
            subsonicSalt: salt,
            subsonicToken: token,
            jwt: "",
          };
        }

        authState = newAuth;
        localStorage.setItem(AUTH_KEY, JSON.stringify(newAuth));
        albumCache.clear();
        playlistCache.clear();
        trackMetaCache.clear();
        starredMeta.albumDates.clear();
        starredMeta.songCounts.clear();
        modalEl.remove();
        modalEl = null;
        updateNowPlayingBar();
        emitLibraryUpdate();
      } catch (err) {
        errBox.style.display = "block";
        errBox.textContent = String(err?.message || err);
        submitBtn.disabled = false;
        submitBtn.textContent = "Conectar estante";
      }
    });
  }
  window.__cdsOpenNavidromeModal = openLoginModal;

  // 10. Original extension.js initialization & mounting
  var s = {
    home: true,
    hideSidebar: true,
    discCover: true,
    tvCorner: true,
    dividers: true,
    pins: [],
    sort: "recent",
    shuffleScope: "disc",
    autoNextDisc: false,
    dust: true,
    sway: true,
    cursorLight: true,
    glints: true,
    daylight: false,
    wall: "",
    glass: "classic",
    lyrics: "write",
    size: "normal",
    speed: "normal",
    theme: "walnut",
    lang: "auto",
  };
  var S = "cd-shelf:settings",
    u = "cd-shelf:settings";
  function f() {
    try {
      return { ...s, ...JSON.parse(localStorage.getItem(S) || "{}") };
    } catch {
      return { ...s };
    }
  }
  function m(e) {
    let r = (t) => e({ ...s, ...t.detail });
    window.addEventListener(u, r);
    return () => window.removeEventListener(u, r);
  }
  var y = "/cd-shelf";
  function h(e) {
    if (
      window.Spicetify?.Player?.addEventListener &&
      window.Spicetify?.Platform?.History &&
      window.React &&
      window.ReactDOM &&
      window.cdshelf
    ) {
      e();
    } else {
      setTimeout(() => h(e), 100);
    }
  }
  h(() => {
    let e = Spicetify.Platform.History,
      r = document.createElement("style");
    r.id = "cd-shelf-ext-style";
    r.textContent = p;
    document.head.appendChild(r);
    ensureLayout();
    updateNowPlayingBar();

    let t = f(),
      c = () => {
        document.body.classList.toggle("cds-hide-sidebar", t.hideSidebar);
        document.body.classList.toggle("cds-disc", t.discCover);
      };
    currentShuffleScope = t.shuffleScope === "library" ? "library" : "disc";
    c();
    m((n) => {
      const prevScope = currentShuffleScope;
      t = n;
      currentShuffleScope = t.shuffleScope === "library" ? "library" : "disc";
      c();
      if (currentShuffleScope !== prevScope && playerState.shuffle) {
        rebuildQueueForCurrent();
      }
    });

    let d = (n) => {
      if (t.home && n?.pathname === "/" && !n.state?.cdsHome) e.replace(y);
    };
    d(e.location);
    e.listen(d);

    document.addEventListener(
      "click",
      (n) => {
        let l = n.target.closest?.('[data-testid="cover-art-button"]');
        if (
          !l ||
          n.shiftKey ||
          !l.closest('.Root__now-playing-bar, footer, [data-testid="now-playing-bar"]')
        )
          return;
        let g = Spicetify.Player.data?.context?.uri || Spicetify.Player.data?.item?.album?.uri;
        if (g) {
          n.preventDefault();
          n.stopPropagation();
          e.push(y, { cdsOpen: g, at: Date.now() });
        }
      },
      true
    );

    let i = () => {
      let n = false;
      try {
        n = !!Spicetify.Player.isPlaying();
      } catch {}
      document.body.classList.toggle("cds-playing", n);
    };
    Spicetify.Player.addEventListener("onplaypause", i);
    Spicetify.Player.addEventListener("songchange", i);
    i();

    // Mount CD Shelf React app
    const mountNode = document.getElementById("cds-mount") || (() => {
      const el = document.createElement("div");
      el.id = "cds-mount";
      document.body.appendChild(el);
      return el;
    })();
    if (window.ReactDOM.createRoot) {
      window.ReactDOM.createRoot(mountNode).render(window.cdshelf.default());
    } else if (window.ReactDOM.render) {
      window.ReactDOM.render(window.cdshelf.default(), mountNode);
    }

    if (!authState) {
      openLoginModal();
    }
  });
})();
