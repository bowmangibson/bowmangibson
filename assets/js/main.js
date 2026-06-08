(function(){

  // ── Mobile nav: detach menu from nav stacking context ──
  var burger  = document.getElementById('burger');
  var menu    = document.getElementById('nav-menu');
  var closeBtn = document.getElementById('nav-close');

  // Where the menu lives in the DOM when closed
  var menuParent   = menu ? menu.parentNode : null;
  var menuNextSibling = menu ? menu.nextSibling : null;

  function openMenu() {
    if (!menu) return;
    // Move menu to body so it escapes nav stacking context
    document.body.appendChild(menu);
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    // Collapse all open sub-menus
    menu.querySelectorAll('.dd-wrap.mob-open').forEach(function(li) {
      li.classList.remove('mob-open');
    });
    // Move menu back into nav
    if (menuParent) {
      if (menuNextSibling) {
        menuParent.insertBefore(menu, menuNextSibling);
      } else {
        menuParent.appendChild(menu);
      }
    }
  }

  if (burger && menu) {
    burger.addEventListener('click', function() {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on any leaf link tap
    menu.addEventListener('click', function(e) {
      var link = e.target.closest('a:not(.dd-parent-link)');
      if (link) closeMenu();
    });

    // Close on backdrop tap (click outside menu)
    document.addEventListener('click', function(e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== burger) {
        closeMenu();
      }
    });
  }

  // ── Accordion: tap parent link to expand/collapse sub-menu ──
  document.addEventListener('click', function(e) {
    var parentLink = e.target.closest('.dd-parent-link');
    if (!parentLink || !menu || !menu.classList.contains('open')) return;
    e.preventDefault();
    var wrap = parentLink.closest('.dd-wrap');
    var isOpen = wrap.classList.contains('mob-open');
    menu.querySelectorAll('.dd-wrap.mob-open').forEach(function(li) { li.classList.remove('mob-open'); });
    if (!isOpen) wrap.classList.add('mob-open');
  });

  // ── FAQ accordion ──────────────────────────────────
  document.querySelectorAll('.faq-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var ans  = item.querySelector('.faq-answer');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      if (ans) ans.classList.toggle('open', open);
    });
  });

  // ── Coverage tab switcher ───────────────────────────
  window.switchTab = function(btn, tabId) {
    document.querySelectorAll('.cov-tab').forEach(function(b) {
      b.style.background = '#fff'; b.style.color = 'var(--navy)';
    });
    btn.style.background = 'var(--navy)'; btn.style.color = '#fff';
    document.querySelectorAll('.cov-tab-panel').forEach(function(p) { p.style.display = 'none'; });
    var panel = document.getElementById(tabId);
    if (panel) panel.style.display = 'block';
  };

  // ── Scroll reveal ───────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  function inView(el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; }
  function showEl(el) { el.style.opacity = '1'; el.style.transform = 'none'; }

  reveals.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  function revealVisible() { reveals.forEach(function(el) { if (inView(el)) showEl(el); }); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) { showEl(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(function(el) { io.observe(el); });
    setTimeout(revealVisible, 50);
    setTimeout(revealVisible, 200);
  } else {
    reveals.forEach(showEl);
  }
  setTimeout(function() { reveals.forEach(showEl); }, 800);

  // ── Formspree AJAX ──────────────────────────────────
  document.querySelectorAll('form[data-fid]').forEach(function(form) {
    var fid = form.getAttribute('data-fid');
    var btn = form.querySelector('button[type="submit"]');
    var ok  = form.querySelector('.form-success');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      fetch('https://formspree.io/f/' + fid, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function(r) {
          if (r.ok) { form.reset(); if (ok) ok.style.display = 'block'; if (btn) btn.style.display = 'none'; }
          else { if (btn) { btn.disabled = false; btn.textContent = 'Error \u2014 call (905) 668-5823'; } }
        }).catch(function() { if (btn) { btn.disabled = false; btn.textContent = 'Error \u2014 call (905) 668-5823'; } });
    });
  });

  // ── Hero type selector ──────────────────────────────
  window.setHeroType = function(btn, type) {
    document.querySelectorAll('.hero-type-btn').forEach(function(b) { b.classList.remove('selected'); });
    if (btn) btn.classList.add('selected');
    var inp = document.getElementById('hero-type');
    if (inp) inp.value = type;
  };

})();
