/* Reveal-on-scroll — no dependencies. */
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
})();

/* Polaroid stack — auto-rotate */
(function () {
  const stack = document.querySelector(".polaroid-stack");
  if (!stack) return;
  const cards = stack.querySelectorAll(".polaroid");
  if (cards.length < 2) return;
  let current = 0;

  function rotate() {
    cards.forEach((c) => c.classList.remove("is-active", "is-prev"));
    const prev = current;
    current = (current + 1) % cards.length;
    cards[prev].classList.add("is-prev");
    cards[current].classList.add("is-active");
  }

  setInterval(rotate, 3200);
})();
