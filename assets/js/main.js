(function(){
  // Mobile burger
  var burger=document.getElementById('burger');
  var menu=document.getElementById('nav-menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',open);
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded',false);
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.faq-item');
      var ans=item.querySelector('.faq-answer');
      var open=item.classList.toggle('open');
      btn.setAttribute('aria-expanded',open);
      if(ans)ans.classList.toggle('open',open);
    });
  });

  // Scroll reveal — graceful degradation for file:// and slow connections
  var reveals=document.querySelectorAll('.reveal');
  if(!reveals.length) return;

  // Helper: is element in viewport right now?
  function inView(el){
    var r=el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function showEl(el){
    el.style.opacity='1';
    el.style.transform='none';
  }

  // Set up — start hidden
  reveals.forEach(function(el){
    el.style.opacity='0';
    el.style.transform='translateY(20px)';
    el.style.transition='opacity 0.6s ease, transform 0.6s ease';
  });

  // Immediately reveal anything already in viewport (handles file:// and fast loads)
  function revealVisible(){
    reveals.forEach(function(el){
      if(inView(el)) showEl(el);
    });
  }

  // Use IntersectionObserver if available, with fallback
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          showEl(e.target);
          io.unobserve(e.target);
        }
      });
    },{threshold:0.05,rootMargin:'0px 0px -20px 0px'});

    reveals.forEach(function(el){ io.observe(el); });

    // Catch elements already visible at load (IO may miss these on file://)
    setTimeout(revealVisible, 50);
    setTimeout(revealVisible, 200);
  } else {
    // Fallback: just show everything
    reveals.forEach(showEl);
  }

  // Safety net: reveal all after 800ms regardless (prevents hidden-forever bug)
  setTimeout(function(){
    reveals.forEach(showEl);
  }, 800);

  // Form submit (Formspree AJAX)
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

  // Hero quote type selector
  window.setHeroType=function(btn,type){
    document.querySelectorAll('.hero-type-btn').forEach(function(b){
      b.classList.remove('selected');
    });
    if(btn) btn.classList.add('selected');
    var inp=document.getElementById('hero-type');
    if(inp) inp.value=type;
  };
})();
