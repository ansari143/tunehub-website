(function () {
  "use strict";
  const DATA = window.TUNEHUB;
  const SONGS = DATA.songs.map((s, i) => Object.assign({ order: i }, s));
  const byId = Object.fromEntries(SONGS.map(s => [s.id, s]));
  const $ = sel => document.querySelector(sel);

  const MOODS = {
    all:      { label: "All songs" },
    romantic: { label: "Romantic" },
    sad:      { label: "Sad & Heartbreak" },
    rain:     { label: "Rain & Lofi" },
    healing:  { label: "Healing" },
    fav:      { label: "My favourites" },
    recent:   { label: "Recently played" }
  };
  const MOOD_TAG = { romantic: "Romantic", sad: "Sad", rain: "Rain & Lofi", healing: "Healing" };

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("tunehub." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("tunehub." + k, JSON.stringify(v)); } catch (e) {} }
  };
  let favs = new Set(store.get("favs", []).filter(id => byId[id]));
  let recent = store.get("recent", []).filter(id => byId[id]);

  /* ---------- state ---------- */
  const state = {
    mood: "all",
    query: "",
    sort: "new",
    current: SONGS[0],
    queue: [],          // ids in play order
    shuffle: store.get("shuffle", false),
    repeat: false,
    autoplay: store.get("autoplay", true),
    playing: false
  };

  const thumb = (id, q = "hqdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const ytUrl = id => `https://www.youtube.com/watch?v=${id}`;
  const subUrl = DATA.channel.url + "?sub_confirmation=1";
  const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>';
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20z"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- filtering ---------- */
  function filtered() {
    let list;
    if (state.mood === "fav") list = SONGS.filter(s => favs.has(s.id));
    else if (state.mood === "recent") list = recent.map(id => byId[id]);
    else if (state.mood === "all") list = SONGS.slice();
    else list = SONGS.filter(s => s.moods.includes(state.mood));

    const q = state.query.trim().toLowerCase();
    if (q) list = list.filter(s => (s.name + " " + s.line + " " + s.moods.join(" ")).toLowerCase().includes(q));

    if (state.mood !== "recent") {
      if (state.sort === "top") list.sort((a, b) => b.views - a.views);
      else if (state.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
      else list.sort((a, b) => a.order - b.order);
    }
    return list;
  }

  function countFor(m) {
    if (m === "all") return SONGS.length;
    if (m === "fav") return favs.size;
    if (m === "recent") return recent.length;
    return SONGS.filter(s => s.moods.includes(m)).length;
  }

  /* ---------- render ---------- */
  function renderChips() {
    $("#chips").innerHTML = Object.keys(MOODS).map(m =>
      `<button class="chip" role="tab" type="button" data-mood="${m}" aria-selected="${m === state.mood}">${MOODS[m].label} <small>${countFor(m)}</small></button>`
    ).join("");
  }

  function tagsHtml(s) {
    return (s.isNew ? '<span class="tag new">New</span>' : "") + s.moods.map(m => `<span class="tag">${MOOD_TAG[m]}</span>`).join("");
  }

  function renderGrid() {
    const list = filtered();
    const empty = $("#empty");
    if (!list.length) {
      empty.hidden = false;
      empty.textContent =
        state.query ? `No song matches “${state.query}”. Try another word, or pick “All songs”.` :
        state.mood === "fav" ? "Tap the heart on any song to save it here." :
        state.mood === "recent" ? "Songs you play will show up here." : "No songs here yet.";
    } else empty.hidden = true;

    $("#grid").innerHTML = list.map(s => `
      <li class="card${state.started && s.id === state.current.id ? " playing" + (state.playing ? "" : " paused") : ""}" data-id="${s.id}">
        <button class="card-play" type="button" data-play="${s.id}" aria-label="Play ${esc(s.name)}">
          <div class="thumb">
            <img src="${thumb(s.id, "mqdefault")}" alt="" loading="lazy" width="320" height="180">
            <div class="hover"><span><svg viewBox="0 0 24 24">${ICON_PLAY}</svg></span></div>
            <div class="eq" aria-hidden="true"><i></i><i></i><i></i></div>
          </div>
        </button>
        <div class="card-meta">
          <div>
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.line)}</p>
            <div class="card-tags">${tagsHtml(s)}</div>
          </div>
          <button class="fav" type="button" data-fav="${s.id}" aria-pressed="${favs.has(s.id)}" aria-label="${favs.has(s.id) ? "Remove from" : "Add to"} favourites">${HEART}</button>
        </div>
      </li>`).join("");
  }

  function renderNow() {
    const s = state.current;
    $("#nowLabel").textContent = s.isNew ? "New release" : state.started ? "Now playing" : "Featured song";
    $("#nowTitle").textContent = s.name;
    $("#nowLine").textContent = s.line;
    $("#nowTags").innerHTML = tagsHtml(s);
    $("#ytNow").href = ytUrl(s.id);
    $("#posterImg").src = thumb(s.id, "maxresdefault");
    $("#posterImg").onerror = function () { this.onerror = null; this.src = thumb(s.id, "hqdefault"); };
    setFavButtons();
    $("#barImg").src = thumb(s.id, "mqdefault");
    $("#barTitle").textContent = s.name;
    renderUpNext();
  }

  function renderUpNext() {
    const next = upcoming(4);
    $("#upNext").innerHTML = next.map(s => `
      <li><button class="row" type="button" data-play="${s.id}">
        <img src="${thumb(s.id, "mqdefault")}" alt="" loading="lazy">
        <span><b>${esc(s.name)}</b><small>${esc(s.line)}</small></span>
      </button></li>`).join("");
  }

  function setFavButtons() {
    const on = favs.has(state.current.id);
    ["#favNow", "#favBar"].forEach(sel => {
      const b = $(sel);
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? "Remove from favourites" : "Add to favourites");
    });
  }

  function markPlaying() {
    document.querySelectorAll(".card").forEach(c => {
      const me = !!state.started && c.dataset.id === state.current.id;
      c.classList.toggle("playing", me);
      c.classList.toggle("paused", me && !state.playing);
    });
    $("#playIcon").innerHTML = state.playing ? ICON_PAUSE : ICON_PLAY;
    $("#playBtn").setAttribute("aria-label", state.playing ? "Pause" : "Play");
    $("#bigPlay span").textContent = state.playing ? "Pause" : "Play song";
    $("#bigPlay svg").innerHTML = state.playing ? ICON_PAUSE : ICON_PLAY;
  }

  /* ---------- queue ---------- */
  function buildQueue(list, startId) {
    let ids = list.map(s => s.id);
    if (state.shuffle) {
      ids = ids.filter(id => id !== startId);
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      ids.unshift(startId);
    } else if (!ids.includes(startId)) ids.unshift(startId);
    state.queue = ids;
  }
  function idx() { return state.queue.indexOf(state.current.id); }
  function upcoming(n) {
    if (!state.queue.length) buildQueue(filtered().length ? filtered() : SONGS, state.current.id);
    const out = [];
    let i = idx();
    for (let k = 1; k <= Math.min(n, state.queue.length - 1); k++) out.push(byId[state.queue[(i + k) % state.queue.length]]);
    return out;
  }

  /* ---------- YouTube player ---------- */
  let player = null, ytReady = false, pending = null;
  function loadYT() {
    if (window.YT && window.YT.Player) return onYTReady();
    if (loadYT.started) return;
    loadYT.started = true;
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = () => toast("Could not load the player. Opening YouTube instead.");
    document.head.appendChild(s);
  }
  window.onYouTubeIframeAPIReady = onYTReady;
  function onYTReady() {
    if (player) return;
    player = new YT.Player("player", {
      videoId: (pending || state.current).id,
      playerVars: { autoplay: 1, rel: 0, playsinline: 1, modestbranding: 1 },
      events: {
        onReady: e => { ytReady = true; e.target.playVideo(); $("#poster").hidden = true; },
        onStateChange: onPlayerState,
        onError: () => { toast("This video can’t play here. Skipping to the next song."); setTimeout(next, 1200); }
      }
    });
  }
  function onPlayerState(e) {
    const S = YT.PlayerState;
    if (e.data === S.PLAYING) { state.playing = true; $("#poster").hidden = true; }
    else if (e.data === S.PAUSED || e.data === S.ENDED) state.playing = false;
    if (e.data === S.ENDED) {
      if (state.repeat) { player.seekTo(0); player.playVideo(); }
      else if (state.autoplay) next();
    }
    markPlaying();
  }

  function play(id, opts = {}) {
    const s = byId[id];
    if (!s) return;
    if (opts.list) buildQueue(opts.list, id);
    else if (!state.queue.includes(id)) buildQueue(filtered(), id);
    state.current = s;
    state.started = true;
    remember(id);
    renderNow();
    $("#bar").hidden = false;
    if (ytReady && player) player.loadVideoById(id);
    else { pending = s; loadYT(); }
    state.playing = true;
    markPlaying();
    try { history.replaceState(null, "", "?v=" + id); } catch (e) {}
    document.title = s.name + " – Tune Hub";
    if (opts.scroll !== false && window.innerWidth < 960) $(".stage").scrollIntoView({ behavior: "smooth" });
    else if (opts.scroll !== false && $(".stage").getBoundingClientRect().bottom < 120) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function togglePlay() {
    if (!player || !ytReady) return play(state.current.id, { scroll: false });
    if (state.playing) player.pauseVideo(); else player.playVideo();
  }
  function next() {
    const i = idx();
    if (i === -1 || !state.queue.length) return;
    play(state.queue[(i + 1) % state.queue.length], { scroll: false });
  }
  function prev() {
    if (player && ytReady && player.getCurrentTime() > 5) return player.seekTo(0);
    const i = idx();
    play(state.queue[(i - 1 + state.queue.length) % state.queue.length], { scroll: false });
  }

  function remember(id) {
    recent = [id].concat(recent.filter(x => x !== id)).slice(0, 20);
    store.set("recent", recent);
    if (state.mood === "recent") renderGrid();
    renderChips();
  }

  function toggleFav(id) {
    const s = byId[id];
    if (favs.has(id)) { favs.delete(id); toast(`Removed “${s.name}” from favourites`); }
    else { favs.add(id); toast(`Saved “${s.name}” to favourites`); }
    store.set("favs", [...favs]);
    setFavButtons();
    renderChips();
    if (state.mood === "fav") renderGrid();
    else document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
      b.setAttribute("aria-pressed", favs.has(id));
      b.setAttribute("aria-label", (favs.has(id) ? "Remove from" : "Add to") + " favourites");
    });
  }

  async function share(s) {
    const url = location.origin + location.pathname + "?v=" + s.id;
    const text = `Listen to “${s.name}” on Tune Hub`;
    if (navigator.share) { try { await navigator.share({ title: s.name, text, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(url); toast("Link copied. Paste it to share."); }
    catch (e) { window.prompt && window.prompt("Copy this link:", url); }
  }

  /* ---------- progress ---------- */
  const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };
  setInterval(() => {
    if (!player || !ytReady || !player.getDuration) return;
    const d = player.getDuration() || 0, c = player.getCurrentTime() || 0;
    const pct = d ? (c / d) * 100 : 0;
    $("#progressFill").style.width = pct + "%";
    $("#progress").setAttribute("aria-valuenow", Math.round(pct));
    $("#barTime").textContent = fmt(c) + " / " + fmt(d);
  }, 500);
  function seekTo(pct) {
    if (!player || !ytReady) return;
    player.seekTo((player.getDuration() || 0) * Math.min(1, Math.max(0, pct)), true);
  }

  /* ---------- sleep timer ---------- */
  const SLEEP = [0, 15, 30, 60];
  let sleepI = 0, sleepEnd = 0, sleepT;
  function cycleSleep() {
    sleepI = (sleepI + 1) % SLEEP.length;
    clearInterval(sleepT);
    const mins = SLEEP[sleepI];
    const btn = $("#sleepBtn");
    btn.classList.toggle("on", !!mins);
    if (!mins) { $("#sleepLabel").textContent = ""; btn.setAttribute("aria-label", "Sleep timer off"); return toast("Sleep timer off"); }
    sleepEnd = Date.now() + mins * 60000;
    toast(`Music will stop in ${mins} minutes`);
    const tick = () => {
      const left = sleepEnd - Date.now();
      if (left <= 0) {
        clearInterval(sleepT); sleepI = 0; btn.classList.remove("on"); $("#sleepLabel").textContent = "";
        if (player && ytReady) player.pauseVideo();
        return toast("Sleep timer finished. Good night.");
      }
      $("#sleepLabel").textContent = Math.ceil(left / 60000) + "m";
      btn.setAttribute("aria-label", `Sleep timer: ${Math.ceil(left / 60000)} minutes left`);
    };
    tick();
    sleepT = setInterval(tick, 15000);
  }

  /* ---------- week ---------- */
  function renderWeek() {
    const today = new Date().getDay();
    const t = DATA.schedule[today];
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $("#todayName").textContent = names[today];
    $("#todayMood").textContent = t.label;
    // Monday first
    const order = [1, 2, 3, 4, 5, 6, 0];
    $("#days").innerHTML = order.map(d => {
      const s = DATA.schedule[d];
      return `<li><button class="day${d === today ? " today" : ""}" type="button" data-day="${d}" aria-label="Play ${s.label} songs (${names[d]})"${d === today ? ' aria-current="date"' : ""}><b>${s.day}</b><small>${s.label}</small></button></li>`;
    }).join("");
  }
  function playDay(d) {
    const s = DATA.schedule[d];
    const list = SONGS.filter(x => x.moods.some(m => s.moods.includes(m)));
    const shuffled = list.slice().sort(() => Math.random() - .5);
    play(shuffled[0].id, { list: shuffled });
    toast(`Playing ${list.length} ${s.label} songs`);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const p = e.target.closest("[data-play]");
    if (p) return play(p.dataset.play, p.closest("#upNext") ? {} : { list: filtered() });
    const f = e.target.closest("[data-fav]");
    if (f) return toggleFav(f.dataset.fav);
    const c = e.target.closest("[data-mood]");
    if (c) { state.mood = c.dataset.mood; renderChips(); renderGrid(); return; }
    const d = e.target.closest("[data-day]");
    if (d) return playDay(+d.dataset.day);
  });

  $("#poster").addEventListener("click", () => play(state.current.id, { scroll: false }));
  $("#bigPlay").addEventListener("click", togglePlay);
  $("#playBtn").addEventListener("click", togglePlay);
  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);
  $("#favNow").addEventListener("click", () => toggleFav(state.current.id));
  $("#favBar").addEventListener("click", () => toggleFav(state.current.id));
  $("#shareNow").addEventListener("click", () => share(state.current));
  $("#sleepBtn").addEventListener("click", cycleSleep);
  $("#barSong").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#playToday").addEventListener("click", () => playDay(new Date().getDay()));
  $("#shuffleAll").addEventListener("click", () => {
    const list = filtered();
    if (!list.length) return;
    state.shuffle = true; syncToggles();
    const pick = list[Math.floor(Math.random() * list.length)];
    play(pick.id, { list });
  });

  function syncToggles() {
    $("#shuffleBtn").setAttribute("aria-pressed", state.shuffle);
    $("#repeatBtn").setAttribute("aria-pressed", state.repeat);
    $("#autoplay").checked = state.autoplay;
    store.set("shuffle", state.shuffle);
  }
  $("#shuffleBtn").addEventListener("click", () => {
    state.shuffle = !state.shuffle; syncToggles();
    buildQueue(state.queue.map(id => byId[id]), state.current.id); renderUpNext();
    toast(state.shuffle ? "Shuffle on" : "Shuffle off");
  });
  $("#repeatBtn").addEventListener("click", () => {
    state.repeat = !state.repeat; syncToggles();
    toast(state.repeat ? "Repeating this song" : "Repeat off");
  });
  $("#autoplay").addEventListener("change", e => { state.autoplay = e.target.checked; store.set("autoplay", state.autoplay); });

  let qT;
  $("#q").addEventListener("input", e => {
    clearTimeout(qT);
    qT = setTimeout(() => {
      state.query = e.target.value;
      if (state.query && (state.mood === "fav" || state.mood === "recent")) { state.mood = "all"; renderChips(); }
      renderGrid();
    }, 120);
  });
  $("#q").addEventListener("keydown", e => {
    if (e.key === "Enter") { const first = filtered()[0]; if (first) { play(first.id, { list: filtered() }); e.target.blur(); } }
    if (e.key === "Escape") { e.target.value = ""; state.query = ""; renderGrid(); e.target.blur(); }
  });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; renderGrid(); });

  const prog = $("#progress");
  prog.addEventListener("click", e => { const r = prog.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); });
  prog.addEventListener("keydown", e => {
    if (!player || !ytReady) return;
    if (e.key === "ArrowRight") player.seekTo(player.getCurrentTime() + 10, true);
    if (e.key === "ArrowLeft") player.seekTo(player.getCurrentTime() - 10, true);
  });

  document.addEventListener("keydown", e => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "/") { e.preventDefault(); $("#q").focus(); }
    else if (k === " " && tag !== "button") { e.preventDefault(); togglePlay(); }
    else if (k === "n") next();
    else if (k === "p") prev();
    else if (k === "l") toggleFav(state.current.id);
  });

  /* ---------- init ---------- */
  const ch = DATA.channel;
  ["#subTop", "#subBottom"].forEach(s => $(s).href = subUrl);
  $("#allLink").href = ch.url + "/videos";
  $("#vidCount").textContent = ch.videos;
  $("#subCount").textContent = ch.subscribers;
  $("#year").textContent = new Date().getFullYear();
  $("#allFrame").src = "https://www.youtube.com/embed/videoseries?list=UU" + ch.id.slice(2) + "&rel=0";

  const params = new URLSearchParams(location.search);
  const shared = params.get("v");
  if (shared && byId[shared]) state.current = byId[shared];
  syncToggles();
  renderChips();
  renderGrid();
  renderNow();
  renderWeek();
  markPlaying();
})();
