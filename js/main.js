// Navbar scroll effect + Back to top
  const navbar = document.getElementById('navbar');
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Modal open / close
  function openModal(id) {
    const m = document.getElementById('modal-' + id);
    m.classList.add('open');
    m.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById('modal-' + id).classList.remove('open');
    document.body.style.overflow = '';
  }
  // Close on overlay click & ESC
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id.replace('modal-','')); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    if (e.key === 'Escape') document.body.style.overflow = '';
  });

  // Mobile menu toggle
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  function closeMob() {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }


  // Generate floating particles
  (function() {
    var container = document.getElementById('particles');
    for (var i = 0; i < 28; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = [
        'left:' + (Math.random() * 100) + '%',
        'bottom:' + (Math.random() * 20) + '%',
        '--dur:' + (4 + Math.random() * 8) + 's',
        '--delay:' + (Math.random() * 6) + 's',
        'width:' + (1 + Math.random() * 3) + 'px',
        'height:' + (1 + Math.random() * 3) + 'px',
        'opacity:0'
      ].join(';');
      container.appendChild(p);
    }
  })();

  // Scroll reveal
  const reveals = document.querySelectorAll('.r');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));

  // Claim counter animation
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countersDone = false;
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.claim-num[data-count]').forEach(animateCount);
    }
  }, { threshold: 0.5 }).observe(document.getElementById('claim'));

  // Active nav link on scroll
  var sections = ['hero','about','services','buch','contact'].map(function(id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function(sec) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navAs.forEach(function(a) {
          a.style.color = a.getAttribute('href') === '#' + sec.id
            ? 'rgba(255,255,255,1)' : '';
        });
      }
    });
  }, { passive: true });

  // ── Shared audio helpers (global scope) ──────────
  function playTyping() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx(); var t = ctx.currentTime;
      var len  = Math.floor(ctx.sampleRate * 0.028);
      var buf  = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
      var src = ctx.createBufferSource();
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      src.buffer = buf;
      filter.type = 'highpass';
      filter.frequency.value = 3200;
      gain.gain.setValueAtTime(0.055, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.start(t);
      setTimeout(function(){ try{ ctx.close(); }catch(e){} }, 300);
    } catch(e) {}
  }

  function playPop(isOut) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx(); var t = ctx.currentTime;
      if (isOut) {
        var osc = ctx.createOscillator(); var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(1040, t + 0.12);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.2);
      } else {
        [1047, 1319, 1568].forEach(function(freq, i) {
          var osc = ctx.createOscillator(); var gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          var s = t + i * 0.072;
          gain.gain.setValueAtTime(0, s);
          gain.gain.linearRampToValueAtTime(0.082, s + 0.009);
          gain.gain.exponentialRampToValueAtTime(0.001, s + 0.22);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(s); osc.stop(s + 0.25);
        });
      }
      setTimeout(function(){ try{ ctx.close(); }catch(e){} }, 900);
    } catch(e) {}
  }

  // ── Badge: iMessage typing sequence + sound ──────
  (function() {
    var words   = ['hbbW1','hbbW2','hbbW3','hbbW4','hbbW5'];
    var typing  = document.getElementById('hbbTyping');
    var status  = document.getElementById('hbbStatus');
    var startMs = 2800;   // after badge fade-in
    var typeMs  = 1100;   // typing dots visible (slower)
    var gapMs   = 1600;   // gap between each message

    words.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var isOut = el.classList.contains('hbb-bubble-out');

      // Show typing dots + soft keyboard sound
      setTimeout(function() {
        if (typing) { typing.style.display = 'flex'; }
        if (status) { status.textContent = 'schreibt\u2026'; }
        playTyping();
      }, startMs + i * gapMs);

      // Pop in bubble + sound
      setTimeout(function() {
        if (typing) { typing.style.display = 'none'; }
        el.style.animation = 'bubbleIn 0.45s cubic-bezier(0.34,1.52,0.64,1) forwards';
        playPop(isOut);
        if (i === words.length - 1 && status) {
          setTimeout(function() {
            status.innerHTML = 'schreibt: <em>Demnächst</em>';
          }, 600);
          // Fade out hero badge after sequence
          var heroBadge = document.querySelector('.hero-book-badge');
          if (heroBadge) {
            setTimeout(function() {
              heroBadge.dataset.dismissed = '1';
              heroBadge.style.animation  = 'none';   // kill fill-mode lock
              heroBadge.style.opacity    = '1';       // snapshot visible
              heroBadge.getBoundingClientRect();      // force reflow
              heroBadge.style.transition = 'opacity 1.4s ease, transform 1.4s ease';
              heroBadge.getBoundingClientRect();      // commit transition
              heroBadge.style.opacity    = '0';
              heroBadge.style.transform  = 'translateY(22px)';
              heroBadge.style.pointerEvents = 'none';
            }, 3000);
          }
        }
      }, startMs + i * gapMs + typeMs);
    });
  }());

  // ── Shop badge iMessage animation ─────────────────
  (function() {
    var badge   = document.getElementById('shopBadge');
    var typing  = document.getElementById('shbTyping');
    var status  = document.getElementById('shbStatus');
    var words   = ['shbW1','shbW2','shbW3','shbW4'];
    if (!badge) return;
    var played  = false;
    var typeMs  = 1000; var gapMs = 1700;

    function runSeq() {
      if (played) return;
      played = true;
      badge.classList.add('shb-visible');
      words.forEach(function(id, i) {
        var el = document.getElementById(id);
        setTimeout(function() {
          typing.style.display = 'flex';
          status.innerHTML = 'schreibt\u2026';
          playTyping();
        }, i * gapMs);
        setTimeout(function() {
          typing.style.display = 'none';
          el.style.animation = 'bubbleIn 0.42s cubic-bezier(0.34,1.52,0.64,1) forwards';
          playPop(false);
          if (i === words.length - 1) {
            setTimeout(function() {
              status.innerHTML = 'schreibt: <em>Shop</em>';
            }, 500);
            // Fade out shop badge after sequence
            setTimeout(function() {
              badge.dataset.dismissed = '1';
              badge.style.transition = 'opacity 1.4s ease, transform 1.4s ease';
              badge.getBoundingClientRect(); // force reflow
              badge.style.opacity = '0';
              badge.style.transform = 'translateY(22px)';
              badge.style.pointerEvents = 'none';
            }, 3200);
          }
        }, i * gapMs + typeMs);
      });
    }

    // Trigger only on first hover over any product row
    document.querySelectorAll('.shf').forEach(function(row) {
      row.addEventListener('mouseenter', function() {
        setTimeout(runSeq, 200);
      }, { once: true });
    });
  }());

  // ── Badge fades out on scroll ─────────────────────
  (function() {
    var badge = document.querySelector('.hero-book-badge');
    if (!badge) return;
    badge.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    window.addEventListener('scroll', function() {
      var s = window.scrollY;
      if (s > 80) {
        badge.style.opacity = '0';
        badge.style.pointerEvents = 'none';
        badge.style.transform = 'translateY(12px)';
      } else if (!badge.dataset.dismissed) {
        badge.style.opacity = '1';
        badge.style.pointerEvents = 'auto';
        badge.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }());

// ── Shop handwritten note ─────────────────────
  (function() {
    var note  = document.getElementById('shopNote');
    if (!note) return;
    var inner = note.querySelector('.shop-note-inner');
    var io = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        note.classList.add('sn-active');
        setTimeout(function() { if (inner) inner.classList.add('sn-done'); }, 2800);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(note);
  }());

  // ── La Linea section separators ───────────────
  (function() {
    ['swSep4','swSep5','swSep6'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          el.classList.add('sws-on');
        }
      }, { threshold: 0.5 }).observe(el);
    });
  }());
