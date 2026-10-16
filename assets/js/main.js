/* Shared interactions — no libraries. Active nav set via body[data-page]. */
(function(){
  var page = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('data-nav') === page){ a.classList.add('active'); a.setAttribute('aria-current','page'); }
  });
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if(burger && menu){ burger.addEventListener('click', function(){ menu.classList.toggle('open'); }); }

  // Brand marquee (progressive enhancement; static fallback text stays if JS off)
  var brands = ["Generali \u2726","YSL \u2726","La Roche-Posay \u2726","Vichy \u2726","Techcombank \u2726","Anua \u2726","Medicube \u2726","Nha Nam \u2726","UNDP \u2726","SheCodes \u2726"];
  var mq = document.getElementById('mq');
  if(mq){
    var half = brands.map(function(b,i){ return '<span class="'+(i%2?'l':'o')+'">'+b+'</span>'; }).join('');
    mq.innerHTML = '<div class="track" aria-hidden="true">'+half+half+'</div>';
  }

  // Rotating role words (home hero only)
  var words = ["content that converts","stories that travel","brands people love","social that sells","ideas worth sharing"];
  var wi = 0; var roleEl = document.getElementById('roles');
  if(roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    roleEl.style.transition = "opacity .2s";
    setInterval(function(){
      wi = (wi+1)%words.length; roleEl.style.opacity = 0;
      setTimeout(function(){ roleEl.textContent = words[wi]; roleEl.style.opacity = 1; }, 200);
    }, 2200);
  }

  // HCMC clock
  function tick(){
    var el = document.getElementById('clock'); if(!el) return;
    try{ el.textContent = "HCMC " + new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit'}).format(new Date()); }catch(e){}
  }
  tick(); setInterval(tick, 30000);

  // Experience accordion: single-open (clicking one closes the others).
  // Native <details> keeps keyboard support (Enter/Space on summary).
  var accs = Array.prototype.slice.call(document.querySelectorAll('details.exp'));
  if(accs.length){
    accs.forEach(function(d){
      d.querySelector('summary').addEventListener('click', function(){
        if(d.open) return; // letting it close naturally
        accs.forEach(function(o){ if(o !== d && o.open) o.removeAttribute('open'); });
      });
    });
    // IMP expanded by default on desktop
    if(window.matchMedia('(min-width: 961px)').matches){
      var imp = document.getElementById('exp-imp');
      if(imp && !accs.some(function(d){ return d.open; })){ imp.setAttribute('open',''); }
    }
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // Footer year
  var y = document.getElementById('yr'); if(y){ y.textContent = new Date().getFullYear(); }

  // Sliding image banner: arrows + dots + touch swipe (no autoplay)
  document.querySelectorAll('[data-banner]').forEach(function(ban){
    var track = ban.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(track.children);
    var dotsBox = ban.querySelector('[data-dots]');
    var i = 0;
    var dots = slides.map(function(_, k){
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to slide ' + (k+1));
      b.addEventListener('click', function(){ go(k); });
      dotsBox.appendChild(b);
      return b;
    });
    function go(k){
      i = (k + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
      dots.forEach(function(d, j){ d.classList.toggle('on', j === i); });
    }
    ban.querySelector('[data-prev]').addEventListener('click', function(){ go(i-1); });
    ban.querySelector('[data-next]').addEventListener('click', function(){ go(i+1); });
    var sx = null;
    track.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive: true});
    track.addEventListener('touchend', function(e){
      if(sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if(Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      sx = null;
    }, {passive: true});
    go(0);
  });
})();
