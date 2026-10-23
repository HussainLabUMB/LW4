/* Hussain Lab — site behaviour: nav, scroll reveal, publication filter, back-to-top. */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Header shadow + back-to-top -------------------------------------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Publication filter ----------------------------------------------- */
  var filterBar = document.querySelector('.pubfilter');
  if (filterBar) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.publist > li'));
    var count = document.getElementById('pub-count');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.pubfilter__btn');
      if (!btn) return;

      filterBar.querySelectorAll('.pubfilter__btn').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      var topic = btn.dataset.filter;
      var shown = 0;
      items.forEach(function (li) {
        var match = topic === 'all' || (li.dataset.topics || '').split(' ').indexOf(topic) !== -1;
        li.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (count) {
        count.textContent = shown + (shown === 1 ? ' publication' : ' publications');
      }
    });
  }

  /* ---- PI headshot fallback --------------------------------------------- */
  var headshot = document.querySelector('[data-headshot]');
  if (headshot) {
    headshot.addEventListener('error', function () {
      headshot.style.display = 'none';
    });
  }
})();
