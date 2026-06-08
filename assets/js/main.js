(function(){

  // ── Mobile nav overlay ─────────────────────────────
  var burger   = document.getElementById('burger');
  var overlay  = document.getElementById('mob-nav');
  var closeBtn = document.getElementById('mob-nav-close');

  function openNav() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mob-nav-open');
  }
  function closeNav() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mob-nav-open');
    // Collapse open groups
    overlay.querySelectorAll('.mob-nav-group.open').forEach(function(g){ g.classList.remove('open'); });
  }

  if (burger && overlay) {
    burger.addEventListener('click', function(){
      overlay.classList.contains('open') ? closeNav() : openNav();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    // Accordion groups
    overlay.querySelectorAll('.mob-nav-parent').forEach(function(btn){
      btn.addEventListener('click', function(){
        var group = btn.closest('.mob-nav-group');
        var isOpen = group.classList.contains('open');
        overlay.querySelectorAll('.mob-nav-group.open').forEach(function(g){ g.classList.remove('open'); });
        if (!isOpen) group.classList.add('open');
      });
    });

    // Close on any nav link tap
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeNav);
    });
  }

  // ── FAQ accordion ───────────────────────────────────
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var ans  = item.querySelector('.faq-answer');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      if (ans) ans.classList.toggle('open', open);
    });
  });

  // ── Coverage tab switcher ───────────────────────────
  window.switchTab = function(btn, tabId){
    document.querySelectorAll('.cov-tab').forEach(function(b){
      b.style.background = '#fff'; b.style.color = 'var(--navy)';
    });
    btn.style.background = 'var(--navy)'; btn.style.color = '#fff';
    document.querySelectorAll('.cov-tab-panel').forEach(function(p){ p.style.display = 'none'; });
    var panel = document.getElementById(tabId);
    if (panel) panel.style.display = 'block';
  };

  // ── Scroll reveal ────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  function inView(el){ var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; }
  function showEl(el){ el.style.opacity='1'; el.style.transform='none'; }
  reveals.forEach(function(el){
    el.style.opacity='0'; el.style.transform='translateY(20px)';
    el.style.transition='opacity 0.6s ease, transform 0.6s ease';
  });
  function revealVisible(){ reveals.forEach(function(el){ if(inView(el)) showEl(el); }); }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ showEl(e.target); io.unobserve(e.target); } });
    },{threshold:0.05,rootMargin:'0px 0px -20px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
    setTimeout(revealVisible,50); setTimeout(revealVisible,200);
  } else { reveals.forEach(showEl); }
  setTimeout(function(){ reveals.forEach(showEl); },800);

  // ── Formspree AJAX ───────────────────────────────────
  document.querySelectorAll('form[data-fid]').forEach(function(form){
    var fid=form.getAttribute('data-fid');
    var btn=form.querySelector('button[type="submit"]');
    var ok=form.querySelector('.form-success');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(btn){btn.disabled=true;btn.textContent='Sending\u2026';}
      fetch('https://formspree.io/f/'+fid,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){form.reset();if(ok)ok.style.display='block';if(btn)btn.style.display='none';}
          else{if(btn){btn.disabled=false;btn.textContent='Error \u2014 call (905) 668-5823';}}
        }).catch(function(){if(btn){btn.disabled=false;btn.textContent='Error \u2014 call (905) 668-5823';}});
    });
  });

  // ── Hero type selector ───────────────────────────────
  window.setHeroType=function(btn,type){
    document.querySelectorAll('.hero-type-btn').forEach(function(b){b.classList.remove('selected');});
    if(btn) btn.classList.add('selected');
    var inp=document.getElementById('hero-type');
    if(inp) inp.value=type;
  };

})();
