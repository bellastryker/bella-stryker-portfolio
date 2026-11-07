/* bellastryker.com — small, dependency-free behaviours */

/* Safe storage (private windows can throw) */
var store = {
  get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
};

/* Announcement bar — dismiss for the session */
(function () {
  var bar = document.querySelector(".announce");
  if (!bar) return;
  if (store.get("bs-announce") === "hidden") bar.classList.add("is-hidden");
  var close = bar.querySelector(".announce__close");
  if (close) close.addEventListener("click", function () {
    bar.classList.add("is-hidden");
    store.set("bs-announce", "hidden");
  });
})();

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
