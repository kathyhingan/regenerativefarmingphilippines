/* Regenerative Farming Philippines - homepage behaviour
   1. Mobile hamburger menu
   2. FAQ accordions (one open at a time, per faqlist group)
   3. Inline "Find Your Path" quiz, 5 steps, waitlist-only routing
   4. Waitlist form (front-end validation only; posts to Apps Script when wired)
   No em dashes anywhere in output strings. */

(function () {
  'use strict';

  /* ---------------- 1. FAQ accordions ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.faqlist'), function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('details.faqitem'));
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  /* ---------------- 2. Mobile hamburger menu ---------------- */
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');
  var navEl = document.querySelector('header.nav');
  if (burger && panel) {
    var setNavH = function () {
      var h = navEl ? navEl.getBoundingClientRect().height : 64;
      document.documentElement.style.setProperty('--mobile-nav-h', h + 'px');
    };
    setNavH();
    window.addEventListener('resize', setNavH);

    var closeMenu = function () {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
    };
    var openMenu = function () {
      setNavH();
      panel.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    };
    burger.addEventListener('click', function () {
      panel.classList.contains('open') ? closeMenu() : openMenu();
    });
    Array.prototype.forEach.call(panel.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------------- 3. Module grid rail sync (mobile scroll only) ---------------- */
  /* The module grid is a horizontal rail under 760px via CSS; nothing to wire. */

  /* ---------------- 4. Inline quiz: Find Your Path ---------------- */
  var STEPS = [
    {
      key: 'crop', label: 'What do you grow?',
      sub: 'Tap one to begin. This shapes which module your path starts with.',
      opts: [
        { v: 'Dragonfruit', d: 'Trellis and vine crops' },
        { v: 'Rice', d: 'Paddy and irrigated' },
        { v: 'Sugarcane', d: 'Cane and intercrops' },
        { v: 'Vegetables', d: 'Highland or lowland' },
        { v: 'Coconut', d: 'Coconut and intercrops' },
        { v: 'Fruit trees', d: 'Orchard and tree crops' },
        { v: 'Mixed', d: 'Several crops at once' }
      ]
    },
    {
      key: 'practice', label: 'How do you farm today?',
      sub: 'No wrong answer here. This only decides what we send you first.',
      opts: [
        { v: 'Mostly chemical inputs', d: 'Conventional fertilizer and sprays' },
        { v: 'Mostly organic by habit', d: 'You already avoid chemicals where you can' },
        { v: 'Already regenerative', d: 'No-till, cover crops, compost' }
      ]
    },
    {
      key: 'cost', label: 'What is your biggest cost?',
      sub: 'The honest answer to this one decides which module leads your path.',
      opts: [
        { v: 'Fertilizer', d: 'The bill that keeps climbing' },
        { v: 'Pesticides', d: 'Sprays and pest control' },
        { v: 'Seeds', d: 'Buying seed every season' },
        { v: 'Water', d: 'Irrigation and pumping' },
        { v: 'Labor', d: 'Hired hands and time' }
      ]
    },
    {
      key: 'size', label: 'How big is your farm?',
      sub: 'Scale changes the plan, not the principles.',
      opts: [
        { v: 'Under half a hectare', d: 'Backyard or small plot' },
        { v: 'Half to 2 hectares', d: 'A working family farm' },
        { v: '2 to 5 hectares', d: 'A larger family operation' },
        { v: '5 hectares and above', d: 'Commercial scale' }
      ]
    },
    {
      key: 'place', label: 'Where do you farm?',
      sub: 'We teach the method worldwide. The calendar is what changes.',
      unsure: 'Somewhere else',
      opts: [
        { v: 'Philippines', d: 'Wet and dry tropical seasons' },
        { v: 'Southeast Asia', d: 'Monsoon tropics' },
        { v: 'Africa', d: 'Tropical and subtropical' },
        { v: 'Americas', d: 'Temperate to tropical' },
        { v: 'Europe', d: 'Temperate seasons' }
      ]
    }
  ];

  /* Which module leads, based on the biggest-cost answer. num = position in the ten-module list. */
  var COST_TO_MODULE = {
    'Fertilizer': { name: 'Compost and Biofertilizers from What the Farm Already Produces', num: 3 },
    'Pesticides': { name: 'Pests Without Poisons', num: 6 },
    'Seeds': { name: 'Cover the Soil', num: 5 },
    'Water': { name: 'Water and Seasons', num: 7 },
    'Labor': { name: 'Stop Tilling', num: 4 }
  };

  var elStep = document.getElementById('qstep');
  var elLabel = document.getElementById('qlabel');
  var elFill = document.getElementById('qfill');
  var elContent = document.getElementById('qcontent');
  var elControls = document.getElementById('qcontrols');
  if (!elContent) return;

  var idx = 0;
  var answers = {};

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function pathLine() {
    var crop = answers.crop || 'farmer';
    var place = answers.place || '';
    var practice = answers.practice || '';
    var cost = answers.cost || '';
    var where = (place && place !== 'Somewhere else') ? ' in the ' + place : '';
    var moving = practice === 'Mostly chemical inputs' ? 'moving away from chemical inputs'
                : practice === 'Mostly organic by habit' ? 'already organic by habit'
                : practice === 'Already regenerative' ? 'already regenerative'
                : 'starting out';
    var costbit = cost ? ', biggest cost: ' + cost.toLowerCase() : '';
    return 'A ' + crop.toLowerCase() + ' farmer' + where + ', ' + moving + costbit;
  }

  function render() {
    if (idx >= STEPS.length) { renderResult(); return; }
    var s = STEPS[idx];
    var val = answers[s.key];

    elStep.textContent = 'Step ' + (idx + 1) + ' of ' + STEPS.length;
    elLabel.textContent = s.label;
    elFill.style.width = (((idx + 1) / STEPS.length) * 100).toFixed(1) + '%';

    var html = '<h3>' + esc(s.label) + '</h3>';
    html += '<p class="qsub">' + esc(s.sub) + '</p>';
    html += '<div class="qopts">';
    s.opts.forEach(function (o) {
      html += '<button class="qopt" type="button" data-v="' + esc(o.v) + '" aria-pressed="' + (val === o.v) + '">';
      html += '<span class="t">' + esc(o.v) + '</span><span class="d">' + esc(o.d) + '</span></button>';
    });
    html += '</div>';
    if (s.unsure) {
      html += '<button class="qchip" id="qunsure" type="button" aria-pressed="' + (val === s.unsure) + '">' + esc(s.unsure) + '</button>';
    }
    elContent.innerHTML = html;

    var ctrl = '';
    if (idx > 0) ctrl += '<button class="btn ghost" id="qback" type="button">Back</button>';
    var last = (idx === STEPS.length - 1);
    ctrl += '<button class="btn on-leaf" id="qnext" type="button"' + (val ? '' : ' disabled') + '>' +
            (last ? 'See my path' : 'Continue') + '</button>';
    ctrl += '<span class="qhint">' + (val ? 'Selected' : 'Pick one to continue') + '</span>';
    elControls.innerHTML = ctrl;

    Array.prototype.forEach.call(elContent.querySelectorAll('.qopt'), function (b) {
      b.addEventListener('click', function () {
        answers[s.key] = b.getAttribute('data-v');
        render();
      });
    });
    var unsure = document.getElementById('qunsure');
    if (unsure) unsure.addEventListener('click', function () {
      answers[s.key] = s.unsure;
      render();
    });
    var back = document.getElementById('qback');
    if (back) back.addEventListener('click', function () { idx--; render(); });
    document.getElementById('qnext').addEventListener('click', function () {
      idx++; render();
    });
  }

  function renderResult() {
    var scroller = document.getElementById('quiz');
    var lead = COST_TO_MODULE[answers.cost] || { name: 'Why Regenerative, Why Now', num: 1 };
    elStep.textContent = 'Your Regenerative Path';
    elLabel.textContent = '';
    elFill.style.width = '100%';

    var recap = [
      ['Crop', answers.crop], ['Practice', answers.practice], ['Biggest cost', answers.cost],
      ['Farm size', answers.size], ['Where', answers.place]
    ].map(function (r) {
      return '<div>' + esc(r[0]) + '<b>' + esc(r[1] || 'Any') + '</b></div>';
    }).join('');

    var body =
      '<span class="badge">Starts with module ' + lead.num + ' on your list</span>' +
      '<h3>Your path starts with: ' + esc(lead.name) + '</h3>' +
      '<p>That is the module we would open first for a farm like yours, based on the cost you named. The full method runs ten modules, and you can move through them in your own time.</p>' +
      '<ul>' +
      '<li><b>Free to start.</b> Join the movement and we send you the first guides for your crop while the course is being finished.</li>' +
      '<li><b>Built for your season.</b> The tropical calendar, not a temperate one, so the timing advice actually applies to your land.</li>' +
      '<li><b>No pressure, no cost.</b> One email when the course opens. Nothing else, and you can leave any time.</li>' +
      '</ul>' +
      '<a class="btn on-moss" href="#waitlist">Join the Movement</a>';

    elContent.innerHTML =
      '<div class="qresult">' +
      '<div class="pline">' +
      '<div class="kick">Your Regenerative Path</div>' +
      '<h3>' + esc(pathLine()) + '</h3>' +
      '<div class="recap">' + recap + '</div>' +
      '</div>' +
      '<div class="route">' + body +
      '<p style="margin-top:18px"><button class="qrestart" id="qrestart" type="button">Start again</button></p>' +
      '</div></div>';

    elControls.innerHTML = '';
    document.getElementById('qrestart').addEventListener('click', function () {
      idx = 0; answers = {}; render();
      if (scroller) scroller.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();

  /* ---------------- 5. Waitlist form ---------------- */
  var wlForm = document.getElementById('waitlist-form');
  if (wlForm) {
    var wlMsg = document.getElementById('wl-msg');
    wlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('wl-name');
      var email = document.getElementById('wl-email');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email.value || '').trim());
      if (!name.value.trim() || !emailOk) {
        if (wlMsg) {
          wlMsg.textContent = !name.value.trim() ? 'Please add your name.' : 'Please check your email address.';
          wlMsg.style.color = 'var(--clay)';
        }
        wlForm.reportValidity();
        return;
      }
      var endpoint = 'https://script.google.com/macros/s/AKfycbzlU_NxnxBqs9PMnS3lItGnytqyVjt9-7Hjm9e9f3dlZOhVoXlO4sTbZKWuEqNvRfZn/exec';
      /* The form's own fields win; quiz answers fill anything the visitor left untouched.
         A select with no empty option always has a value, so a straight-to-the-form
         visitor still records crop, size, journey, and place from these fields. */
      var fCrop = document.getElementById('wl-crop');
      var fPlace = document.getElementById('wl-place');
      var fSize = document.getElementById('wl-size');
      var fPractice = document.getElementById('wl-practice');
      var q = (typeof answers !== 'undefined') ? answers : {};
      var payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        crop: (fCrop && fCrop.value) || q.crop || '',
        farm_size: (fSize && fSize.value) || q.size || '',
        cost: q.cost || '',
        journey: (fPractice && fPractice.value) || q.practice || '',
        place: (fPlace && fPlace.value.trim()) || q.place || '',
        interest: 'course',
        page: window.location.pathname || '/'
      };
      var payloadJson = JSON.stringify(payload);

      wlForm.querySelector('button[type="submit"]').disabled = true;
      var onDone = function (okMsg) {
        if (wlMsg) {
          wlMsg.textContent = okMsg || 'You are on the list. Watch your inbox for the first guides.';
          wlMsg.style.color = okMsg ? okMsg.color || 'var(--forest)' : 'var(--forest)';
        }
        wlForm.reset();
        wlForm.querySelector('button[type="submit"]').disabled = false;
      };
      var onFail = function () {
        if (wlMsg) {
          wlMsg.textContent = 'Something went wrong. Please try again, or email me directly.';
          wlMsg.style.color = 'var(--clay)';
        }
        wlForm.querySelector('button[type="submit"]').disabled = false;
      };

      /* Send as text/plain so it survives the Apps Script 302 -> googleusercontent redirect. */
      fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payloadJson
      }).then(function (res) { return res.json(); })
        .then(function () { onDone('You are on the list. Watch your inbox for the first guides.'); })
        .catch(function () { onFail(); });
    });
  }
})();