/* ==========================================================================
   Smaulu — portfolio behaviour
   Theme switching, mobile navigation, scroll reveal, scrollspy,
   reading progress and copy-to-clipboard. No dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.getElementById("header");
  var progress = document.getElementById("progress");
  var themeToggle = document.getElementById("theme-toggle");
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- Theme */
  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function syncThemeUI() {
    var isDark = currentTheme() === "dark";
    var label = isDark ? "Switch to light theme" : "Switch to dark theme";

    if (themeToggle) {
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#0b0d0b" : "#fbfaf7");
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      /* Storage can be unavailable in private modes — the theme still works. */
    }

    syncThemeUI();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  syncThemeUI();

  /* ------------------------------------------------------- Mobile menu */
  function setMenu(open) {
    if (!header || !menuBtn) return;

    header.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(!header.classList.contains("nav-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setMenu(false);
    });
  }

  /* ------------------------------------------------ Scroll + progress */
  var scrollQueued = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }

    scrollQueued = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollQueued) {
        scrollQueued = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------- Reveals */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("in-view");
    });
  }

  /* --------------------------------------------------------- Scrollspy */
  var sectionIds = ["about", "projects", "skills", "contact"];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var linksById = {};

  navLinks.forEach(function (link) {
    linksById[link.getAttribute("href").slice(1)] = link;
  });

  function activateLink(id) {
    var target = linksById[id];
    if (!target) return;

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });

    target.classList.add("is-active");
    target.setAttribute("aria-current", "true");
  }

  if ("IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activateLink(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spyObserver.observe(section);
    });
  }

  /* -------------------------------------------------- Copy to clipboard */
  var copyBtn = document.querySelector(".copy-btn");

  function fallbackCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    try {
      document.execCommand("copy");
    } catch (error) {
      /* Nothing else we can do — the address is visible on screen. */
    }

    document.body.removeChild(field);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy") || "";
      var done = function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("is-copied");

        window.setTimeout(function () {
          copyBtn.textContent = original;
          copyBtn.classList.remove("is-copied");
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  }

  /* ------------------------------------------------------ Small details */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var avatarImage = document.querySelector(".avatar img");
  if (avatarImage) {
    avatarImage.addEventListener("error", function () {
      avatarImage.classList.add("is-broken");
    });

    if (avatarImage.complete && avatarImage.naturalWidth === 0) {
      avatarImage.classList.add("is-broken");
    }
  }
})();
