/* bellastryker.com — small, dependency-free behaviours */

/* Safe storage (private windows can throw) */
var store = {
  get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
};

/* Header hairline once the page scrolls */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* Mobile drawer */
(function () {
  var drawer = document.querySelector(".drawer");
  var openBtn = document.querySelector(".menu-btn");
  if (!drawer || !openBtn) return;
  var closeEls = drawer.querySelectorAll("[data-close]");
  function open() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }
  function close() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    openBtn.focus();
  }
  openBtn.addEventListener("click", open);
  closeEls.forEach(function (el) { el.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
})();

/* Tabs */
(function () {
  document.querySelectorAll("[role='tablist']").forEach(function (list) {
    var tabs = list.querySelectorAll("[role='tab']");
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      document.dispatchEvent(new CustomEvent("carousel:refresh"));
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  });
})();

/* Reveal on scroll */
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  items.forEach(function (el) { io.observe(el); });
})();

/* Footer year in Roman numerals */
(function () {
  var el = document.querySelector("[data-year]");
  if (!el) return;
  var n = new Date().getFullYear(), r = "",
      map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  map.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
  el.textContent = r;
})();

/* Respect reduced-motion: hold looping videos on their first frame */
(function () {
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (!mq) return;
  function apply() {
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      if (mq.matches) { v.pause(); try { v.currentTime = 0; } catch (e) {} }
      else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply);
})();

/* Card carousels: arrows, progress line, swipe/trackpad via native scroll-snap */
(function () {
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel__track");
    var prev = root.querySelector(".carousel__btn--prev");
    var next = root.querySelector(".carousel__btn--next");
    var thumb = root.querySelector(".carousel__progress i");
    var bar = root.querySelector(".carousel__progress");
    if (!track) return;
    function step() {
      var card = track.querySelector(".card");
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      root.classList.toggle("is-static", max <= 2);
      if (prev) prev.disabled = x <= 2;
      if (next) next.disabled = x >= max - 2;
      if (thumb && track.scrollWidth) {
        var frac = track.clientWidth / track.scrollWidth;
        thumb.style.setProperty("--thumb", (frac * 100) + "%");
        var p = max > 0 ? (x / max) * ((1 - frac) / frac) * 100 : 0;
        thumb.style.setProperty("--pos", p + "%");
      }
      if (bar) bar.setAttribute("aria-valuenow", max > 0 ? Math.round((x / max) * 100) : 0);
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("carousel:refresh", function () { requestAnimationFrame(update); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step(), behavior: "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step(), behavior: "smooth" }); }
    });

    /* The progress line doubles as a slider: drag the thumb, or click/drag anywhere on the line */
    if (bar && thumb) {
      bar.setAttribute("role", "slider");
      bar.setAttribute("aria-label", "Scroll through the cards");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");
      bar.tabIndex = 0;
      var dragging = false, grab = 0;
      var geom = function () {
        var r = bar.getBoundingClientRect();
        var f = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
        return { left: r.left, width: r.width, f: f, travel: (1 - f) * r.width, max: track.scrollWidth - track.clientWidth };
      };
      var moveTo = function (clientX) {
        var g = geom();
        if (g.travel <= 0) return;
        var pos = Math.min(Math.max(clientX - g.left - grab, 0), g.travel);
        track.scrollLeft = (pos / g.travel) * g.max;
      };
      var end = function () {
        if (!dragging) return;
        dragging = false;
        root.classList.remove("is-dragging");
        track.style.scrollSnapType = "";
        track.style.scrollBehavior = "";
        var s = step();
        track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: "smooth" });
      };
      bar.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        var g = geom();
        var thumbW = g.f * g.width;
        var thumbLeft = g.max > 0 ? (track.scrollLeft / g.max) * g.travel : 0;
        var px = e.clientX - g.left;
        grab = (px >= thumbLeft && px <= thumbLeft + thumbW) ? px - thumbLeft : thumbW / 2;
        dragging = true;
        root.classList.add("is-dragging");
        track.style.scrollSnapType = "none";
        track.style.scrollBehavior = "auto";
        if (bar.setPointerCapture) bar.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
        e.preventDefault();
      });
      bar.addEventListener("pointermove", function (e) { if (dragging) moveTo(e.clientX); });
      bar.addEventListener("pointerup", end);
      bar.addEventListener("pointercancel", end);
      bar.addEventListener("lostpointercapture", end);
      bar.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); track.scrollBy({ left: step(), behavior: "smooth" }); }
        if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); track.scrollBy({ left: -step(), behavior: "smooth" }); }
        if (k === "Home") { e.preventDefault(); track.scrollTo({ left: 0, behavior: "smooth" }); }
        if (k === "End") { e.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }); }
      });
    }
    update();
  });
})();
