  document.documentElement.classList.add('js');

  // 광주 현재 시각
  const clock = document.getElementById('clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
  tick(); setInterval(tick, 10000);

  // 스크롤 시 부드럽게 등장
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // 방문자 수 (첫 페이지 TODAY · TOTAL, 한 번 방문에 한 번만 셉니다)
  const vToday = document.getElementById('v-today');
  if (vToday) {
    const api = 'https://abacus.jasoncameron.dev';
    const ns = 'xormrjjin-debug-minihome';
    const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    let counted = false;
    try { counted = sessionStorage.getItem('counted') === '1'; } catch (e) {}
    const op = counted ? 'get' : 'hit';
    const count = key => fetch(`${api}/${op}/${ns}/${key}`)
      .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);
    Promise.all([count('d' + day), count('total')]).then(([today, total]) => {
      if (total === null) return;
      vToday.textContent = (today || 0).toLocaleString();
      document.getElementById('v-total').textContent = total.toLocaleString();
      try { sessionStorage.setItem('counted', '1'); } catch (e) {}
    });
  }

  // 사진첩 크게 보기 (사진 · 영상)
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img'), vid = lb.querySelector('video'), cap = lb.querySelector('figcaption');
    const close = () => {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); }
    };
    document.querySelectorAll('.shot button').forEach(b => b.addEventListener('click', () => {
      const v = b.dataset.video;
      img.hidden = !!v; if (vid) vid.hidden = !v;
      if (v && vid) { vid.src = v; vid.play().catch(() => {}); } else { img.src = b.dataset.src; }
      const fc = b.parentElement.querySelector('figcaption');
      cap.textContent = fc ? (fc.lastChild.textContent || fc.textContent).trim() : '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    }));
    lb.addEventListener('click', e => { if (e.target !== img && e.target !== vid) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }


  // 랜덤 TMI
  const tmiBtn = document.getElementById('tmi-btn');
  if (tmiBtn) {
    const tmis = [
      '사람 괴롭히기를 잘합니다. 친한 사람한테만 합니다.',
      '요즘은 여행에 빠져 있습니다. 다녀오면 바로 다음 갈 곳을 찾습니다.',
      '커피 중독입니다. 사실 다들 압니다.',
      '알람은 다섯 개 이상 맞춥니다. 첫 번째 알람에 일어난 적은 없습니다.',
      'ESTJ입니다. 몇 번을 검사해도 안 바뀝니다.',
      'ESTJ인데 계획보다 즉흥을 고릅니다. 저도 이유는 모릅니다.',
      '별명은 벌꿀오소리입니다. 성격이 비슷해서 생겼습니다.',
      '이름 뜻은 "진리를 펼쳐라"입니다. 명령형이라 조금 부담스럽습니다.',
      '고향은 익산입니다. 사투리는 안 쓴다고 생각합니다.',
      'A형입니다. 급하게 A형 피가 필요하면 연락 주세요.',
      '주량은 3병입니다. 알아서 믿으십쇼.',
      '취하면 집에 갑니다. 집 주소는 안 까먹습니다.',
      '영화는 거의 안 봅니다. 그냥 손이 잘 안 갑니다.',
      '먹는 것만 먹습니다. 메뉴 고민할 시간이 줄어듭니다.',
      '봄과 가을을 좋아합니다. 선선해서요.',
      '여름보다는 겨울이 낫습니다.',
      '전화도 문자도 싫습니다. 그래도 답장은 빠릅니다.',
      '강아지도 고양이도 무섭습니다. 귀여운 건 압니다.',
      '짬뽕보다 짜장입니다.',
      '탕수육은 찍먹입니다.',
      '산보다 바다입니다.',
      '집보다 밖입니다.',
      '약속 시간보다 5분 일찍 도착합니다. 20분까지는 기다려 드립니다.',
      '테니스를 배우고 싶습니다. 장비는 아직 안 샀습니다.',
      '스트레스를 받으면 티가 납니다. 숨기려고 해 봤는데 잘 안 됐습니다.',
      '자면 회복됩니다. 많이 자면 완전히 회복됩니다.',
      '밥은 천천히 먹습니다.',
      '목표는 적당히 벌고 재밌게 살기입니다.',
    ];
    const no = document.getElementById('tmi-no'), text = document.getElementById('tmi-text');
    document.getElementById('tmi-total').textContent = String(tmis.length).padStart(2, '0');
    let order = [], pos = 0;
    const shuffle = () => { order = tmis.map((_, i) => i).sort(() => Math.random() - .5); pos = 0; };
    const show = () => {
      if (pos >= order.length) shuffle();
      const i = order[pos++];
      text.classList.add('fade');
      setTimeout(() => {
        text.textContent = tmis[i];
        no.textContent = String(i + 1).padStart(2, '0');
        text.classList.remove('fade');
      }, 200);
    };
    shuffle(); show();
    tmiBtn.addEventListener('click', show);
  }

  // 챕터 탭
  const tabBtns = document.querySelectorAll('.tabs button');
  const openTab = id => {
    tabBtns.forEach(b => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', on);
      document.getElementById('p-' + b.dataset.tab).hidden = !on;
    });
  };
  tabBtns.forEach(b => b.addEventListener('click', () => openTab(b.dataset.tab)));
  document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    openTab(a.dataset.tab);
    const box = document.getElementById('about');
    if (box.getBoundingClientRect().top < 0 || window.innerWidth <= 820) box.scrollIntoView();
  }));
  const fromHash = location.hash.slice(1);
  if (document.getElementById('p-' + fromHash)) { openTab(fromHash); }

  // 질문함 (구글 폼으로 전송)
  // 구글 폼을 연결하면 아래 세 값을 채웁니다.
  const GFORM = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScLmgt32PxkWkS45eZfbR4Ofhi3tz7xVRiOgccMDhrDgmYOjw/formResponse',
    question: 'entry.2147061591',
    name: 'entry.1213908891',
  };
  const ask = document.getElementById('ask-form');
  if (ask) {
    const msg = document.getElementById('ask-msg');
    const btn = ask.querySelector('button');
    if (!GFORM.action) {
      btn.disabled = true;
      msg.textContent = '질문함은 준비 중입니다. 급하면 메일로 보내 주세요.';
    }
    ask.addEventListener('submit', e => {
      e.preventDefault();
      if (!GFORM.action) return;
      const data = new FormData(ask);
      const body = new URLSearchParams();
      body.append(GFORM.question, data.get('question'));
      if (GFORM.name) body.append(GFORM.name, data.get('name') || '익명');
      btn.disabled = true; msg.textContent = '보내는 중입니다.';
      fetch(GFORM.action, { method: 'POST', mode: 'no-cors', body })
        .then(() => { ask.reset(); msg.textContent = '잘 받았습니다. 대체로 답합니다.'; })
        .catch(() => { msg.textContent = '전송이 안 됐습니다. 잠시 후 다시 해 보시거나 메일로 보내 주세요.'; })
        .finally(() => { btn.disabled = false; });
    });
  }

  // ================= Play =================
  const kst = () => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date());
    const h = +p.find(x => x.type === 'hour').value % 24, m = +p.find(x => x.type === 'minute').value;
    return { h, m, mins: h * 60 + m, label: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') };
  };
  const shared = (op, key) => fetch(`https://abacus.jasoncameron.dev/${op}/xormrjjin-debug-jinseo-v2/${key}`)
    .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  // ---------- 닉네임 + 랭킹 (구글 폼으로 기록, 구글 시트에서 읽기) ----------
  // 구글 폼/시트를 연결하면 아래 값을 채웁니다.
  const RANK = {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSd5qr5nD6pihf5517LR0J1dw0stGdS0Y7tWyNcoOslPQCgGjw/formResponse',
    game: 'entry.2141413772', nick: 'entry.1196657411', count: 'entry.1620336347',
    sheet: '1zwIkZ0RHeh96o-uEM--CgqvEsRhBJmHxbx4W5ITTAC8',
  };
  const rankReady = () => RANK.form && RANK.sheet;
  let nickname = ''; try { nickname = localStorage.getItem('play-nick') || ''; } catch (e) {}
  const players = [];
  let sheetRows = null, sheetAt = 0;
  const parseCSV = t => {
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      if (q) { if (ch === '"' && t[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (ch !== '\r') cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  };
  const loadSheet = (force) => {
    if (!rankReady()) return Promise.resolve(null);
    if (!force && sheetRows && Date.now() - sheetAt < 15000) return Promise.resolve(sheetRows);
    return fetch(`https://docs.google.com/spreadsheets/d/${RANK.sheet}/gviz/tq?tqx=out:csv&t=${Date.now()}`)
      .then(r => r.text()).then(t => {
        const rows = parseCSV(t); const h = rows.shift() || [];
        const gi = h.findIndex(x => /게임/.test(x)), ni = h.findIndex(x => /닉네임/.test(x)), ci = h.findIndex(x => /횟수/.test(x));
        sheetRows = rows.map(r => ({ g: r[gi], n: (r[ni] || '').trim(), c: parseInt(r[ci], 10) || 0 })).filter(r => r.n);
        sheetAt = Date.now(); return sheetRows;
      }).catch(() => null);
  };
  const makePlayer = (pfx, game, box) => {
    const $ = id => document.getElementById(id);
    const gateEl = $(pfx + '-gate'), who = $(pfx + '-who'), input = gateEl.querySelector('input');
    let pending = 0, sent = 0, timer = 0;
    const p = { game, pending: () => pending };
    const lock = on => { box.classList.toggle('locked', on); gateEl.hidden = !on; who.hidden = on; };
    const mine = () => {
      const base = (sheetRows || []).filter(r => r.g === game && r.n === nickname).reduce((a, r) => a + r.c, 0);
      return Math.max(base, sent) + pending;
    };
    const render = () => {
      who.querySelector('b').textContent = nickname;
      who.querySelector('.pl-mine').textContent = nickname ? mine() : 0;
      const list = $(pfx + '-rank'), me = $(pfx + '-me');
      if (!rankReady()) { list.innerHTML = '<li class="rank-empty">랭킹은 곧 열립니다.</li>'; me.textContent = ''; return; }
      if (!sheetRows) { list.innerHTML = '<li class="rank-empty">랭킹을 못 불러왔습니다. 잠시 후 다시 봐 주세요.</li>'; return; }
      const tot = {};
      sheetRows.filter(r => r.g === game).forEach(r => { tot[r.n] = (tot[r.n] || 0) + r.c; });
      if (nickname) tot[nickname] = mine();
      const sorted = Object.entries(tot).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
      if (!sorted.length) { list.innerHTML = '<li class="rank-empty">아직 아무도 없습니다. 1등 자리가 비어 있습니다.</li>'; me.textContent = ''; return; }
      const esc = t => t.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
      list.innerHTML = sorted.slice(0, 5).map(([n, v]) => `<li class="${n === nickname ? 'me' : ''}"><b>${esc(n)}</b><span>${v.toLocaleString()}번</span></li>`).join('');
      const pos = sorted.findIndex(([n]) => n === nickname);
      me.textContent = nickname && pos >= 0 ? `내 순위 ${pos + 1}위` : '';
    };
    const flush = keep => {
      clearTimeout(timer);
      if (!pending || !rankReady() || !nickname) return;
      const n = pending; pending = 0; sent += n;
      const body = new URLSearchParams();
      body.append(RANK.game, game); body.append(RANK.nick, nickname); body.append(RANK.count, String(n));
      fetch(RANK.form, { method: 'POST', mode: 'no-cors', body, keepalive: !!keep }).catch(() => { pending += n; sent -= n; });
    };
    p.add = () => {
      pending++; render();
      clearTimeout(timer); timer = setTimeout(() => flush(), pending >= 20 ? 0 : 2500);
    };
    p.flush = flush;
    p.refresh = force => loadSheet(force).then(() => { sent = 0; render(); });
    p.render = render;
    gateEl.querySelector('button').addEventListener('click', () => {
      const v = input.value.trim().replace(/\s+/g, ' ');
      if (!v) { input.focus(); input.placeholder = '닉네임을 먼저 적어 주십시오'; return; }
      flush(); nickname = v.slice(0, 10);
      try { localStorage.setItem('play-nick', nickname); } catch (e) {}
      players.forEach(x => x.start());
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') gateEl.querySelector('button').click(); });
    who.querySelector('.pl-change').addEventListener('click', () => {
      players.forEach(x => x.flush());
      nickname = ''; try { localStorage.removeItem('play-nick'); } catch (e) {}
      players.forEach(x => x.stop());
      input.focus();
    });
    p.start = () => { lock(false); render(); };
    p.stop = () => { input.value = ''; lock(true); render(); };
    nickname ? p.start() : lock(true);
    players.push(p);
    return p;
  };
  addEventListener('pagehide', () => players.forEach(x => x.flush(true)));
  setInterval(() => { if (players.length && !document.hidden) loadSheet(true).then(() => players.forEach(x => x.render())); }, 20000);

  // 1. 지금 진서는? (A Day 기준)
  const nowText = document.getElementById('now-text');
  if (nowText) {
    const plan = [
      [0, '아까 그 생각을 아직 하는 중입니다. 대체로 내일 해도 되는 일입니다.'],
      [120, '자는 중입니다. 많이 자면 12시간도 잡니다.'],
      [440, '첫 번째 알람을 듣는 중입니다. 듣기만 합니다.'],
      [460, '이제 막 일어났습니다. 알람 다섯 개를 다 듣고 나서요.'],
      [540, '하루를 시작하는 중입니다. 커피부터 마십니다.'],
      [720, '점심 메뉴를 고민하는 중입니다. 결론은 늘 비슷합니다.'],
      [780, '먹던 거 먹는 중입니다. 천천히 먹습니다.'],
      [900, '커피를 하나 더 마시는 중입니다. 효과는 미미합니다.'],
      [960, '오후를 버티는 중입니다. 대체로 버팁니다.'],
      [1080, '저녁을 보내는 중입니다. 하루 중 제일 자유로운 시간입니다.'],
      [1380, '이제 자야지, 하고 휴대폰을 보는 중입니다.'],
    ];
    const tick = () => {
      const t = kst();
      let msg = plan[0][1];
      for (const [from, text] of plan) if (t.mins >= from) msg = text;
      nowText.textContent = msg;
      document.getElementById('now-time').textContent = t.label;
    };
    tick(); setInterval(tick, 30000);
  }

  // ---------- 벌꿀오소리 그림 (Play와 미니룸이 같이 씀) ----------
  const D = '#24211f', S = '#e9e5dc', H = '#f2b134', HD = '#c97f12';
  const BADGER_ART = [
      // 0. 아기오소리 — 동글동글 앉아 있는 새끼
      `<svg viewBox="0 0 200 200">
        <ellipse cx="100" cy="190" rx="52" ry="7" fill="rgba(0,0,0,.12)"/>
        <ellipse cx="100" cy="144" rx="52" ry="44" fill="${D}"/>
        <ellipse cx="100" cy="152" rx="30" ry="26" fill="#3a3532"/>
        <ellipse cx="74" cy="184" rx="16" ry="8" fill="${D}"/><ellipse cx="126" cy="184" rx="16" ry="8" fill="${D}"/>
        <circle cx="62" cy="50" r="13" fill="${D}"/><circle cx="138" cy="50" r="13" fill="${D}"/>
        <circle cx="62" cy="50" r="6" fill="#ff9aa8"/><circle cx="138" cy="50" r="6" fill="#ff9aa8"/>
        <circle cx="100" cy="86" r="48" fill="${D}"/>
        <path d="M56 76 Q100 20 144 76 Q124 58 100 58 Q76 58 56 76Z" fill="${S}"/>
        <circle cx="81" cy="90" r="11" fill="#fff"/><circle cx="82" cy="91" r="8" fill="#111"/><circle cx="85" cy="87" r="3" fill="#fff"/>
        <circle cx="119" cy="90" r="11" fill="#fff"/><circle cx="118" cy="91" r="8" fill="#111"/><circle cx="121" cy="87" r="3" fill="#fff"/>
        <ellipse cx="66" cy="108" rx="9" ry="5" fill="#ff9aa8" opacity=".75"/><ellipse cx="134" cy="108" rx="9" ry="5" fill="#ff9aa8" opacity=".75"/>
        <ellipse cx="100" cy="104" rx="6" ry="4" fill="#111"/>
        <path d="M91 111 Q95.5 116 100 111 Q104.5 116 109 111" stroke="${S}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M100 126 q-9 13 0 20 q9 -7 0 -20Z" fill="${H}"/>
        <ellipse cx="88" cy="140" rx="9" ry="7" fill="${D}"/><ellipse cx="112" cy="140" rx="9" ry="7" fill="${D}"/>
      </svg>`,
      // 1. 벌꿀오소리 — 네 발로 걷는 진짜 벌꿀오소리 + 꿀단지
      `<svg viewBox="0 0 200 200">
        <ellipse cx="105" cy="176" rx="82" ry="7" fill="rgba(0,0,0,.12)"/>
        <path d="M166 112 Q192 104 188 130" stroke="${D}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <rect x="52" y="126" width="18" height="46" rx="7" fill="${D}"/><rect x="74" y="128" width="18" height="44" rx="7" fill="${D}"/>
        <rect x="130" y="128" width="18" height="44" rx="7" fill="${D}"/><rect x="152" y="126" width="18" height="46" rx="7" fill="${D}"/>
        <path d="M52 172 l3 5 M58 172 l2 6 M64 172 l2 5 M152 172 l3 5 M158 172 l2 6 M164 172 l2 5" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M40 112 Q40 78 90 76 L150 78 Q180 82 178 114 Q176 144 140 144 L70 144 Q40 142 40 112Z" fill="${D}"/>
        <path d="M60 102 Q62 86 44 84 Q20 84 12 106 Q8 120 22 124 L50 124 Q64 118 60 102Z" fill="${D}"/>
        <path d="M26 94 Q46 68 92 70 L150 72 Q176 76 180 106 Q162 92 140 94 L86 96 Q56 96 32 106Z" fill="${S}"/>
        <circle cx="50" cy="86" r="7" fill="${D}"/>
        <circle cx="34" cy="102" r="4.5" fill="#fff"/><circle cx="33" cy="102" r="2.8" fill="#111"/>
        <circle cx="12" cy="110" r="4.5" fill="#111"/>
        <path d="M16 118 Q24 123 31 118" stroke="${S}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M15 122 q-3 12 2 15 q4 -4 -2 -15Z" fill="${H}"/>
        <path d="M2 156 Q2 136 20 136 Q38 136 38 156 Q38 176 20 176 Q2 176 2 156Z" fill="${HD}"/>
        <rect x="6" y="129" width="28" height="9" rx="3" fill="${H}"/>
        <path d="M8 138 q4 11 8 0 q4 15 9 0 q4 9 7 0Z" fill="${H}"/>
        <text x="20" y="162" text-anchor="middle" font-size="9" font-weight="800" fill="#fff4d0">HONEY</text>
      </svg>`,
      // 2. 사나운꿀오소리 — 일어서서 발톱 세우고 포효
      `<svg viewBox="0 0 200 200">
        <ellipse cx="100" cy="192" rx="56" ry="7" fill="rgba(0,0,0,.14)"/>
        <path d="M70 158 L62 188 L88 188 L90 158Z" fill="${D}"/><path d="M130 158 L138 188 L112 188 L110 158Z" fill="${D}"/>
        <path d="M64 188 l-4 5 M72 188 l-2 6 M80 188 l0 6 M136 188 l4 5 M128 188 l2 6 M120 188 l0 6" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
        <path d="M60 112 Q32 96 28 60" stroke="${D}" stroke-width="19" fill="none" stroke-linecap="round"/>
        <path d="M140 112 Q168 96 172 60" stroke="${D}" stroke-width="19" fill="none" stroke-linecap="round"/>
        <path d="M18 56 q-5 -11 2 -18 M27 50 q-3 -13 4 -18 M36 54 q1 -12 9 -15" stroke="${S}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M182 56 q5 -11 -2 -18 M173 50 q3 -13 -4 -18 M164 54 q-1 -12 -9 -15" stroke="${S}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="100" cy="128" rx="47" ry="49" fill="${D}"/>
        <path d="M54 102 L60 84 L69 97 L77 79 L86 95 L94 76 L100 92 L106 76 L114 95 L123 79 L131 97 L140 84 L146 102 Q100 90 54 102Z" fill="${S}"/>
        <circle cx="72" cy="38" r="9" fill="${D}"/><circle cx="128" cy="38" r="9" fill="${D}"/>
        <circle cx="100" cy="66" r="35" fill="${D}"/>
        <path d="M65 60 Q100 12 135 60 Q118 45 100 45 Q82 45 65 60Z" fill="${S}"/>
        <circle cx="87" cy="73" r="10" fill="#ff3b2f" opacity=".25"/><circle cx="113" cy="73" r="10" fill="#ff3b2f" opacity=".25"/>
        <circle cx="87" cy="73" r="5" fill="#ff3b2f"/><circle cx="113" cy="73" r="5" fill="#ff3b2f"/>
        <path d="M74 60 L95 69" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M126 60 L105 69" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
        <path d="M118 56 L127 84" stroke="#ff9aa8" stroke-width="3" stroke-linecap="round"/>
        <path d="M118 66 l8 -2 M120 74 l8 -2" stroke="#ff9aa8" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="100" cy="81" rx="6" ry="4" fill="#111"/>
        <path d="M84 88 Q100 114 116 88Z" fill="#7a1010"/>
        <path d="M85 88 L89 95 L93 88 L97 95 L100 88 L103 95 L107 88 L111 95 L115 88Z" fill="#fff"/>
        <text x="146" y="40" font-size="28">💢</text>
      </svg>`,
      // 3. 메가 벌꿀오소리 — 황금 갑옷, 망토, 왕관, 빛나는 눈
      `<svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="mg-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a6"/><stop offset=".5" stop-color="#f5c542"/><stop offset="1" stop-color="#b8761a"/></linearGradient>
          <linearGradient id="mg-cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8413f"/><stop offset="1" stop-color="#6e0d1a"/></linearGradient>
          <filter id="mg-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M58 92 Q30 150 22 196 L178 196 Q170 150 142 92Z" fill="url(#mg-cape)"/>
        <path d="M72 158 L66 186 L92 186 L92 158Z" fill="${D}"/><path d="M128 158 L134 186 L108 186 L108 158Z" fill="${D}"/>
        <rect x="62" y="178" width="34" height="14" rx="5" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="1.5"/>
        <rect x="104" y="178" width="34" height="14" rx="5" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="1.5"/>
        <path d="M56 112 Q42 138 50 158" stroke="${D}" stroke-width="17" stroke-linecap="round" fill="none"/>
        <path d="M144 112 Q158 138 150 158" stroke="${D}" stroke-width="17" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="160" r="11" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="1.5"/>
        <circle cx="150" cy="160" r="11" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="1.5"/>
        <ellipse cx="100" cy="130" rx="45" ry="47" fill="${D}"/>
        <path d="M64 108 Q100 94 136 108 L130 150 Q100 168 70 150Z" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="2"/>
        <path d="M100 116 L112 130 L100 146 L88 130Z" fill="#ff8a00" stroke="#fff3a6" stroke-width="2" filter="url(#mg-glow)"/>
        <ellipse cx="58" cy="104" rx="20" ry="13" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="2"/>
        <ellipse cx="142" cy="104" rx="20" ry="13" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="2"/>
        <circle cx="72" cy="40" r="9" fill="${D}"/><circle cx="128" cy="40" r="9" fill="${D}"/>
        <circle cx="100" cy="68" r="33" fill="${D}"/>
        <path d="M67 62 Q100 18 133 62 Q118 48 100 48 Q82 48 67 62Z" fill="url(#mg-gold)"/>
        <path d="M74 36 L80 12 L91 28 L100 4 L109 28 L120 12 L126 36Z" fill="url(#mg-gold)" stroke="#8a5a10" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="100" cy="22" r="4" fill="#e8413f"/><circle cx="84" cy="27" r="2.5" fill="#4fc3f7"/><circle cx="116" cy="27" r="2.5" fill="#4fc3f7"/>
        <path d="M78 64 L95 70 M122 64 L105 70" stroke="#f5c542" stroke-width="5" stroke-linecap="round"/>
        <g filter="url(#mg-glow)"><ellipse cx="88" cy="75" rx="7" ry="5" fill="#fff6b0"/><ellipse cx="112" cy="75" rx="7" ry="5" fill="#fff6b0"/></g>
        <ellipse cx="100" cy="84" rx="6" ry="4" fill="#111"/>
        <path d="M90 92 Q100 98 112 89" stroke="${S}" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>`,
    ];

  // 2. 다 같이 키우는 벌꿀오소리 (25번 1차 진화 · 70번 2차 진화 · 200번 메가진화)
  const bdBtn = document.getElementById('bd-btn');
  if (bdBtn) {
    const KEY = 'honeybadger';
    const ADMIN = '22e196eb-5d67-445f-8622-add243a7de51';   // 초기화용 키
    // (그림은 위쪽 BADGER_ART)
    const forms = [
      { at: 0,   name: '아기오소리',      w: 120, a: '',   b: '' },
      { at: 25,  name: '벌꿀오소리',      w: 190, a: '',   b: '' },
      { at: 70,  name: '사나운꿀오소리',  w: 190, a: '⚡', b: '⚡' },
      { at: 200, name: '메가 벌꿀오소리', w: 240, a: '🔥', b: '🔥' },
    ];
    const moods = [['배고픔', '졸림', '해맑음', '꿀 찾는 중', '낮잠'], ['배고픔', '예민함', '만족함', '꿀 찾는 중', '졸림'],
      ['사나움', '매우 사나움', '포효 중', '예민함', '배고픔'], ['전설']];
    const lines = [
      ['먹었습니다. 아직 아기라 흘렸습니다.', '먹고 바로 잡니다.', '꿀 한 방울에 신났습니다.'],
      ['먹었습니다. 고맙다는 말은 안 합니다.', '꿀만 골라 먹었습니다.', '먹었습니다. 더 달라는 눈빛입니다.'],
      ['먹다가 물 뻔했습니다. 친해졌다는 뜻입니다.', '먹고 포효합니다. 맛있다는 뜻입니다.', '그릇까지 먹을 기세입니다.'],
      ['메가 벌꿀오소리가 식사를 하사했습니다.', '먹었습니다. 왕관이 조금 더 빛납니다.', '전설은 배가 고프지 않습니다. 그래도 먹습니다.'],
    ];
    const $ = id => document.getElementById(id);
    const stage = $('bd-stage'), pet = $('bd-pet'), msg = $('bd-msg');
    const formOf = n => forms.reduce((f, x, i) => (n >= x.at ? i : f), 0);
    let shown = -1, busy = false;

    const draw = n => {
      const fi = formOf(n), f = forms[fi], next = forms[fi + 1];
      if (shown !== fi) pet.innerHTML = BADGER_ART[fi];
      stage.dataset.form = fi;
      pet.style.width = f.w + 'px';
      $('bd-acc-a').textContent = f.a; $('bd-acc-b').textContent = f.b;
      $('bd-form-name').textContent = f.name;
      $('bd-count').textContent = n.toLocaleString();
      $('bd-lv').textContent = Math.floor(Math.sqrt(n / 2)) + 1;
      $('bd-mood').textContent = moods[fi][n % moods[fi].length];
      if (next) {
        $('bd-next-fill').style.width = ((n - f.at) / (next.at - f.at) * 100) + '%';
        $('bd-next-txt').textContent = `다음 진화까지 밥 ${next.at - n}번 → ${next.name}`;
      } else {
        $('bd-next-fill').style.width = '100%';
        $('bd-next-txt').textContent = '최종 진화 완료. 더 줘도 먹긴 합니다.';
      }
      shown = fi;
    };

    const evolve = n => new Promise(done => {
      busy = true;
      const prev = forms[shown].name;
      msg.textContent = `어라…? ${prev}의 상태가…!`;
      stage.classList.add('evolving');
      setTimeout(() => {
        stage.classList.remove('evolving');
        stage.classList.add('flash');
        draw(n);
        const f = forms[formOf(n)];
        msg.textContent = formOf(n) === 3
          ? `축하합니다! ${prev}는 ${f.name}로 메가진화했습니다!`
          : `축하합니다! ${prev}는 ${f.name}로 진화했습니다!`;
        setTimeout(() => { stage.classList.remove('flash'); busy = false; done(); }, 900);
      }, 1800);
    });

    const api = (op, opts) => fetch(`https://abacus.jasoncameron.dev/${op}/xormrjjin-debug-jinseo-v2/${KEY}`, opts)
      .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);

    draw(0);
    api('get').then(n => { if (n !== null) draw(n); });

    bdBtn.addEventListener('click', () => {
      if (busy) return;
      bdBtn.disabled = true;
      api('hit').then(n => {
        if (n === null) { msg.textContent = '지금은 밥을 못 받습니다. 잠시 후에 다시 주세요.'; bdBtn.disabled = false; return; }
        const before = shown;
        pet.classList.add('bump'); setTimeout(() => pet.classList.remove('bump'), 160);
        if (formOf(n) > before) {
          evolve(n).then(() => { bdBtn.disabled = false; });
        } else {
          draw(n); msg.textContent = pick(lines[formOf(n)]);
          setTimeout(() => { bdBtn.disabled = false; }, 300);
        }
      });
    });

    $('bd-reset').addEventListener('click', () => {
      if (busy) return;
      if (!confirm('정말 초기화할까요? 모두가 준 밥이 0번으로 돌아갑니다.')) return;
      api('reset', { method: 'POST', headers: { Authorization: 'Bearer ' + ADMIN } }).then(n => {
        if (n === null) { msg.textContent = '초기화가 안 됐습니다. 잠시 후에 다시 해 주세요.'; return; }
        draw(0);
        msg.textContent = '처음부터 다시 키웁니다. 기억은 못 합니다.';
      });
    });
  }

  // 3. 진서 카페인 충전 (모두가 같이, 매일 0%)
  const cfBox = document.getElementById('coffee');
  if (cfBox) {
    const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    const drinks = {
      americano: { pct: 5, name: '아메리카노', say: ['아메리카노입니다. 기본입니다.', '한 잔 더 마셨습니다. 몇 번째인지는 세지 않습니다.', '아이스입니다. 겨울에도 아이스입니다.'] },
      shot: { pct: 10, name: '샷 추가', say: ['샷 추가입니다. 눈이 조금 커졌습니다.', '샷이 들어가니 말이 빨라집니다.', '투샷입니다. 심장이 대답합니다.'] },
      latte: { pct: 4, name: '바닐라라떼', say: ['바닐라라떼입니다. 달아서 기분이 좋아졌습니다.', '라떼입니다. 오늘은 봐줍니다.', '단 걸 먹으니 말투가 0.5% 부드러워졌습니다.'] },
      decaf: { pct: 0, name: '디카페인', say: ['디카페인입니다. 의미는 없지만 마십니다.', '디카페인입니다. 마음만 받겠습니다.', '디카페인입니다. 이건 그냥 물입니다.'] },
    };
    const tiers = [
      [0, '😴 아직 부팅 중입니다. 말 걸지 마십시오.'],
      [1, '😪 눈은 떴습니다. 대답은 아직입니다.'],
      [30, '🙂 대화 가능합니다. 단답 위주입니다.'],
      [60, '😀 말이 많아지기 시작합니다. TMI 주의.'],
      [100, '🤩 완충입니다. 오늘은 충분합니다. 그래도 주시면 마십니다.'],
      [150, '⚡ 손이 떨립니다. 타자 속도가 빨라졌습니다.'],
      [200, '🫨 과충전입니다. 오늘 밤 12시간은 못 잡니다.'],
      [300, '🚀 대기권을 돌파했습니다. 내일 다시 비워집니다.'],
    ];
    const counts = { americano: 0, shot: 0, latte: 0, decaf: 0 };
    const $ = id => document.getElementById(id);
    const cup = $('cf-cup');
    const draw = () => {
      const pct = Object.keys(counts).reduce((a, k) => a + counts[k] * drinks[k].pct, 0);
      const cups = Object.values(counts).reduce((a, b) => a + b, 0);
      $('cf-pct').textContent = pct;
      $('cf-cups').textContent = cups;
      let st = tiers[0][1]; for (const [at, t] of tiers) if (pct >= at && (at > 0 || pct === 0)) st = t;
      if (pct > 0 && pct < 30) st = tiers[1][1];
      $('cf-state').textContent = st;
      const level = Math.min(pct, 100) / 100, y = 116 - 80 * level;
      $('cf-liquid').setAttribute('y', y); $('cf-liquid').setAttribute('height', 116 - y);
      $('cf-crema').setAttribute('y', y);
      cup.classList.toggle('warm', pct > 0);
      cup.classList.toggle('full', pct >= 100);
      cup.classList.toggle('jitter', pct >= 150);
    };
    const key = k => `cf-${k}-d${day}`;
    const cfPlayer = makePlayer('cf', '카페인', cfBox);
    cfPlayer.refresh();
    Promise.all(Object.keys(counts).map(k => shared('get', key(k)).then(n => { counts[k] = n || 0; }))).then(draw);
    draw();
    cfBox.querySelectorAll('.cf-menu button').forEach(b => b.addEventListener('click', () => {
      if (!nickname) return;
      const k = b.dataset.drink;
      cfBox.querySelectorAll('.cf-menu button').forEach(x => { x.disabled = true; });
      shared('hit', key(k)).then(n => {
        if (n === null) $('cf-msg').textContent = '지금은 커피를 못 받습니다. 잠시 후에 다시 주세요.';
        else { counts[k] = n; draw(); $('cf-msg').textContent = pick(drinks[k].say); cfPlayer.add(); }
        setTimeout(() => cfBox.querySelectorAll('.cf-menu button').forEach(x => { x.disabled = false; }), 300);
      });
    }));
  }

  // 4. 진서 깨우기
  const wkBox = document.getElementById('wake');
  if (wkBox) {
    const $ = id => document.getElementById(id);
    const acts = {
      alarm: { d: -15, say: ['5분만…', '진짜 5분만…', '알람 하나 남았습니다. 아직 괜찮습니다.', '……(못 들은 척)'],
               miss: 0.25, missD: +8, missSay: ['알람을 끄고 다시 잡니다. 손이 먼저 일어났습니다.', '알람을 껐습니다. 기억은 없습니다.'] },
      call:  { d: +12, say: ['전화는 싫습니다. 더 깊이 잠듭니다.', '받지 않습니다. 문자도 안 받습니다.', '진동이 자장가가 됐습니다.'] },
      coffee:{ d: -28, say: ['커피 냄새에 코가 먼저 일어났습니다.', '"…아메리카노?" 하고 잠꼬대합니다.', '코가 씰룩거립니다. 거의 다 왔습니다.'] },
      food:  { d: -22, say: ['"밥"이라는 단어에 귀가 움직입니다.', '"…먹던 거로" 하고 잠꼬대합니다.', '배에서 대답이 먼저 나왔습니다.'] },
      shake: { d: -8, say: ['흔들어도 잡니다. 대체로 잡니다.', '이불을 더 당깁니다.'],
               miss: 0.3, missD: +5, missSay: ['벌꿀오소리처럼 사납게 뒤척입니다. 물 뻔했습니다.', '"건드리지 마십시오" 하고 다시 잡니다.'] },
    };
    const wakeSay = {
      alarm: '일어났습니다. 정확히 20분 지났습니다.',
      call: '일어났습니다. 전화 때문은 아닙니다.',
      coffee: '일어났습니다. 커피 덕분입니다. 효과가 미미하다던 말은 취소합니다.',
      food: '일어났습니다. 밥 먹으러 갑니다. 먹던 거로요.',
      shake: '일어났습니다. 기분은 별로입니다.',
    };
    let depth, tries, t0, idx, done;
    const wkPlayer = makePlayer('wk', '깨우기', wkBox);
    wkPlayer.refresh();
    let best = null; try { best = JSON.parse(localStorage.getItem('wake-best')); } catch (e) {}
    const showBest = () => { $('wk-best').textContent = best ? `최고 기록 ${best.tries}번 · ${best.sec}초` : '최고 기록 -'; };
    const face = () => depth > 110 ? '😪💤' : depth > 80 ? '😴' : depth > 55 ? '😪' : depth > 30 ? '🥱' : '😑';
    const draw = () => {
      $('wk-depth').textContent = Math.max(0, Math.round(depth));
      $('wk-tries').textContent = tries;
      $('wk-fill').style.width = Math.min(100, Math.max(0, depth)) + '%';
      $('wk-stage').dataset.state = done ? 'awake' : depth > 110 ? 'deep' : 'sleep';
      $('wk-face').textContent = done === 'up' ? '😐' : done === '12h' ? '🛌' : face();
    };
    const reset = () => {
      depth = 100; tries = 0; t0 = 0; idx = {}; done = false;
      $('wk-text').textContent = '진서가 자고 있습니다. 많이 자면 12시간도 잡니다. 깨워 보세요.';
      $('wk-reset').hidden = true;
      wkBox.querySelectorAll('.wk-acts button').forEach(b => { b.disabled = false; });
      draw(); showBest();
    };
    const finish = (kind, text) => {
      done = kind; $('wk-text').textContent = text; $('wk-reset').hidden = false;
      wkBox.querySelectorAll('.wk-acts button').forEach(b => { b.disabled = true; });
      draw();
    };
    wkBox.querySelectorAll('.wk-acts button').forEach(b => b.addEventListener('click', () => {
      if (done || !nickname) return;
      wkPlayer.add();
      if (!t0) t0 = Date.now();
      const k = b.dataset.act, a = acts[k];
      tries++;
      let text;
      if (a.miss && Math.random() < a.miss) { depth += a.missD; text = pick(a.missSay); }
      else {
        depth += a.d * (0.8 + Math.random() * 0.4);
        idx[k] = (idx[k] || 0); text = a.say[idx[k] % a.say.length]; idx[k]++;
      }
      depth = Math.min(depth, 150);
      const f = $('wk-face'); f.classList.add('hit'); setTimeout(() => f.classList.remove('hit'), 180);
      if (depth >= 140) return finish('12h', '12시간 모드에 들어갔습니다. 전화를 너무 많이 하셨습니다. 오늘은 포기하십시오.');
      if (depth <= 0) {
        const sec = Math.max(1, Math.round((Date.now() - t0) / 1000));
        let rec = '';
        if (!best || tries < best.tries || (tries === best.tries && sec < best.sec)) {
          best = { tries, sec }; rec = ' 🏆 최고 기록입니다.';
          try { localStorage.setItem('wake-best', JSON.stringify(best)); } catch (e) {}
        }
        finish('up', `${wakeSay[k]} (깨우는 데 ${tries}번 · ${sec}초)${rec}`);
        showBest(); return;
      }
      $('wk-text').textContent = text;
      draw();
    }));
    $('wk-reset').addEventListener('click', reset);
    reset();
  }

  // 5. 진서 말투 번역기
  const trForm = document.getElementById('tr-form');
  if (trForm) {
    const $ = id => document.getElementById(id);
    const jong = ch => { const c = (ch || '').charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : -1; };
    // 문장 끝 바꾸기 (긴 것부터)
    const ends = [
      ['집 가고 싶어', '집에 가고 싶습니다'], ['집가고싶어', '집에 가고 싶습니다'], ['하기 싫어', '하기 싫습니다'], ['하기싫어', '하기 싫습니다'],
      ['보고 싶어', '보고 싶습니다'], ['보고싶어', '보고 싶습니다'], ['자고 싶어', '자고 싶습니다'], ['배고파', '배가 고픕니다'],
      ['배불러', '배가 부릅니다'], ['졸려', '졸립니다'], ['피곤해', '피곤합니다'], ['심심해', '심심합니다'], ['귀찮아', '귀찮습니다'],
      ['힘들어', '힘듭니다'], ['재밌어', '재밌습니다'], ['재미없어', '재미없습니다'], ['짜증나', '짜증이 납니다'], ['화나', '화가 납니다'],
      ['몰라', '모르겠습니다'], ['괜찮아', '괜찮습니다'], ['사랑해', '사랑합니다'], ['미안해', '미안합니다'], ['고마워', '고맙습니다'],
      ['추워', '춥습니다'], ['더워', '덥습니다'], ['맛있어', '맛있습니다'], ['맛없어', '맛없습니다'], ['좋아해', '좋아합니다'],
      ['좋아', '좋습니다'], ['싫어', '싫습니다'], ['대박', '놀랍습니다'], ['헐', '놀랍습니다'], ['진짜', '진짜입니다'], ['뭐해', '뭐 하십니까'],
      ['어디야', '어디십니까'], ['할래', '하시겠습니까'], ['마실래', '마시겠습니까'], ['먹을래', '드시겠습니까'], ['갈래', '가시겠습니까'],
      ['가자', '갑시다'], ['먹자', '먹읍시다'], ['놀자', '놉시다'], ['하자', '합시다'], ['자자', '잡시다'], ['줘', '주십시오'], ['해줘', '해 주십시오'],
      ['잘자', '안녕히 주무십시오'], ['안녕', '안녕하십니까'], ['ㅇㅇ', '그렇습니다'], ['ㄴㄴ', '아닙니다'], ['응', '그렇습니다'], ['아니', '아닙니다'],
      ['했어', '했습니다'], ['었어', '었습니다'], ['았어', '았습니다'], ['겠어', '겠습니다'], ['싶어', '싶습니다'], ['없어', '없습니다'], ['있어', '있습니다'],
      ['같아', '같습니다'], ['거야', '겁니다'], ['이야', '입니다'], ['예요', '입니다'], ['이에요', '입니다'], ['해요', '합니다'], ['해', '합니다'], ['야', '입니다'],
    ];
    const qEnds = [['줄까', '드릴까요'], ['할까', '할까요'], ['갈까', '갈까요'], ['먹을까', '먹을까요'], ['뭐해', '뭐 하십니까'], ['뭐 해', '뭐 하십니까'], ['어디야', '어디십니까'], ['했어', '했습니까'], ['었어', '었습니까'], ['았어', '았습니까'], ['있어', '있습니까'], ['없어', '없습니까'], ['해', '합니까'], ['야', '입니까'], ['이야', '입니까']];
    const topics = [
      [/배고|밥|먹|치킨|피자|라면|점심|저녁|아침|간식/, ['메뉴는 이미 정해져 있습니다. 먹던 거입니다.', '모험은 하지 않습니다. 먹던 거 먹겠습니다.',
        '천천히 먹을 예정이니 먼저 일어나지 마십시오.', '메뉴 고민은 길었지만 결론은 늘 그거입니다.']],
      [/졸|잠|자고|피곤|잘자|눕/, ['12시간 예약했습니다.', '알람은 다섯 개 맞추겠습니다. 첫 번째는 장식입니다.',
        '자고 일어나면 해결돼 있을 겁니다. 문제는 그대로겠지만요.', '눕는 순간 끝입니다. 잠 안 오는 날은 없습니다.']],
      [/커피|카페|아메리카노|라떼|카페인/, ['몇 번째 잔인지는 묻지 마십시오.', '효과는 미미하지만 의식은 중요합니다.',
        '아이스로 부탁드립니다. 겨울에도요.', '사실 이미 한 잔 마셨습니다.']],
      [/과제|시험|공부|팀플|발표|레포트|마감/, ['마감은 내일의 제가 하겠습니다.', '시작이 반이라는데 아직 시작을 안 했습니다.',
        '끝은 납니다. 끝이 좋을지는 모르겠습니다.', '내일 해도 되는 일입니다. 알면서도 오늘 합니다.']],
      [/월요일|출근|등교|학교|수업|알바/, ['월요일은 매주 옵니다. 그래서 더 싫습니다.', '버티는 중입니다. 벌꿀오소리처럼 버팁니다.',
        '하루는 대체로 비슷하게 흘러갑니다. 오늘도 그렇습니다.']],
      [/사랑|보고 ?싶|좋아해|고마|설레/, ['티는 안 내지만 좋아합니다. 방금 낸 건 실수입니다.', '속으로 세 번 곱씹었습니다.',
        '겉으로는 "아 그래?" 하고 넘어가겠습니다.']],
      [/짜증|화나|싫|미워|열받/, ['한 번은 웃으면서 말합니다. 이건 두 번째입니다.', '티가 납니다. 숨기는 기능은 없습니다.',
        '정색까지 3초 남았습니다.']],
      [/여행|놀|바다|비행기|휴가|떠나/, ['다음 여행지는 이미 검색해 놨습니다.', '비행기표 가격만 확인하는 중입니다.',
        '산 말고 바다로 가겠습니다.', '여행 얘기가 나오면 좀 길어집니다. 미리 사과드립니다.']],
      [/술|소주|맥주|한잔|취|회식/, ['3병까지는 괜찮습니다. 알아서 믿으십쇼.', '취하면 집에 갑니다. 집 주소는 안 까먹습니다.',
        '주량은 비밀이 아닙니다. 믿음의 문제입니다.']],
      [/추워|더워|날씨|비 |비가|눈 |눈이|장마/, ['날씨 탓을 하겠습니다. 날씨는 반박을 못 합니다.', '봄, 가을만은 못합니다.', '여름보다는 겨울이 낫습니다.']],
      [/전화|문자|카톡|연락|답장/, ['전화도 문자도 싫습니다. 그래도 답장은 빠릅니다.', '읽고 안 읽은 척은 안 합니다. 진짜 바쁜 겁니다.']],
      [/강아지|고양이|댕댕|냥|동물/, ['둘 다 무섭습니다. 귀여운 건 압니다.', '멀리서 보면 귀엽습니다. 멀리서요.']],
      [/로또|돈|부자|월급|용돈/, ['일단 아무한테도 말 안 하겠습니다.', '적당히 버는 단계는 건너뛰겠습니다.']],
      [/운동|헬스|테니스|다이어트|살/, ['테니스를 배울 예정입니다. 장비는 아직 안 샀습니다.', '먹던 거 먹으면서 하겠습니다.', '마음은 이미 세 세트 했습니다.']],
      [/괴롭|놀리|장난/, ['괴롭힘을 당하고 있다면 친해졌다는 뜻입니다.', '친한 사람한테만 합니다. 축하드립니다.']],
      [/생일|선물|기프티콘/, ['커피 기프티콘이면 충분합니다. 아이스로요.', '선물은 마음입니다. 마음은 아이스 아메리카노 모양입니다.']],
      [/집|방콕|이불/, ['집도 좋지만 저는 밖파입니다.', '이불 밖은 위험하다고들 합니다. 저는 나가겠습니다.']],
      [/벌꿀오소리|오소리/, ['저를 부르셨습니까.', '성격이 비슷해서 생긴 별명입니다. 이해가 빠르시네요.']],
    ];
    const tails = ['대체로 그렇습니다.', '이유는 딱히 없습니다.', '알아서 믿으십쇼.', '본인은 괜찮다고 합니다. 대체로 안 괜찮습니다.',
      '미리 사과드립니다.', '사실 다들 압니다.', '아마도요.', '더 할 말은 있지만 아끼겠습니다.', '반박은 받지 않습니다. 사실 받긴 받습니다.',
      '적고 보니 별일 아닙니다.', '본인도 방금 알았습니다.', '이상입니다. 질문은 Ask로 받습니다.', '이 문장은 대체로 진심입니다.',
      '12시간 자고 다시 생각해 보겠습니다.', '벌꿀오소리도 동의했습니다.', '커피 한 잔이면 해결됩니다. 효과는 미미하지만요.',
      '그 이상도 이하도 아닙니다.', '여기까지 들으셨으면 꽤 친해진 겁니다.', '대체로 괜찮은 사람이 한 말입니다.'];
    const flatEnds = ['그렇습니다.', '이상.', '확인.', '다음.', '보고 끝.', '그뿐입니다.'];
    // ESTJ: 결론부터, 계획, 원칙, 체크리스트
    const plans = [
      [/배고|밥|먹|치킨|피자|라면|점심|저녁|아침|간식/, ['해결 방안: 먹던 거. 예상 소요 시간 15분.', '메뉴는 어제 정해 뒀습니다. 이견은 받지 않습니다.', '12시 정각에 출발합니다. 늦으면 먼저 시킵니다.']],
      [/졸|잠|자고|피곤|잘자|눕/, ['취침 시간 확정했습니다. 알람은 다섯 개로 이중 확인합니다.', '수면 계획: 12시간. 변경 불가.', '내일 일정에 지장 없도록 지금 자겠습니다.']],
      [/커피|카페|아메리카노|라떼|카페인/, ['오늘 할당량 기준 세 잔째입니다. 아직 여유 있습니다.', '주문은 제가 하겠습니다. 아이스 아메리카노로 통일합니다.', '카페인 섭취 계획에 반영했습니다.']],
      [/과제|시험|공부|팀플|발표|레포트|마감/, ['역산해 보니 오늘 시작해야 합니다. 바로 하겠습니다.', '할 일 목록 2번에 올렸습니다. 1번은 커피입니다.', '마감 이틀 전 완료가 원칙입니다. 원칙은 원칙입니다.', '팀플이면 역할 분담표부터 돌리겠습니다.']],
      [/월요일|출근|등교|학교|수업|알바/, ['주간 계획부터 세우겠습니다. 그래야 덜 싫습니다.', '월요일은 체크리스트로 버팁니다.']],
      [/사랑|보고 ?싶|좋아해|고마|설레/, ['감정은 접수했습니다. 표현은 다음 분기에 하겠습니다.', '좋은 건 좋은 겁니다. 회의는 필요 없습니다.']],
      [/짜증|화나|싫|미워|열받/, ['원인 파악 완료. 재발 방지책을 마련하겠습니다.', '감정은 접수했습니다. 처리 기한은 내일입니다.']],
      [/여행|놀|바다|비행기|휴가|떠나/, ['일정표는 시간 단위로 짜 두었습니다. 현장에선 즉흥입니다.', '숙소, 교통, 맛집 순서로 예약 완료했습니다.']],
      [/술|소주|맥주|한잔|취|회식/, ['귀가 시간은 미리 정해 두었습니다. 지킵니다.', '3병 기준으로 일정을 잡겠습니다.']],
      [/약속|만나|언제|몇 시|몇시/, ['5분 전 도착이 원칙입니다. 20분까지는 기다립니다.', '장소와 시간부터 확정하겠습니다. 나머지는 그다음입니다.']],
      [/전화|문자|카톡|연락|답장/, ['용건은 카톡으로 세 줄 요약 부탁드립니다.', '답장은 빠릅니다. 원칙입니다.']],
      [/로또|돈|부자|월급|용돈/, ['예산부터 짜겠습니다. 재밌게 사는 데도 계획이 필요합니다.']],
      [/운동|헬스|테니스|다이어트|살/, ['주 3회로 계획했습니다. 실행은 별개의 안건입니다.']],
    ];
    const frames = [
      b => `결론부터 말씀드리겠습니다. ${b}`, b => `${b} 이상, 보고 끝.`, b => `${b} 근거는 경험입니다.`,
      b => `${b} 일정표에 반영해 두겠습니다.`, b => `${b} 다음 안건으로 넘어가겠습니다.`, b => `요약하면 이렇습니다. ${b}`,
      b => `${b} 해결책은 세 가지입니다. 1) 커피 2) 잠 3) 먹던 거.`, b => `확인했습니다. ${b}`,
      b => `${b} 오늘 안에 처리하겠습니다.`, b => `원칙대로 말씀드리면, ${b}`, b => `${b} 체크리스트에 올렸습니다. ☑`,
    ];
    let mode = 'basic', last = '', lastOut = '';

    const formal = raw => {
      let s = raw.trim();
      const f = { laugh: /ㅋ|ㅎㅎ/.test(s), cry: /ㅠ|ㅜ/.test(s), angry: /ㅡㅡ|;;/.test(s), bang: /!/.test(s) };
      f.q = /\?/.test(s);
      s = s.replace(/ㅋ+|ㅎㅎ+|ㅠ+|ㅜ+|ㅡㅡ|;+/g, '').replace(/[~!?.…\s]+$/g, '').trim();
      if (!s) return { s: f.laugh ? '웃깁니다' : f.cry ? '슬픕니다' : '할 말이 없습니다', f, ok: true };
      let ok = false;
      for (const [a, b] of (f.q ? qEnds.concat(ends) : ends)) if (s.endsWith(a)) { s = s.slice(0, -a.length) + b; ok = true; break; }
      if (!ok && /[어아]$/.test(s) && jong(s[s.length - 2]) === 20) {          // 잤어 → 잤습니다
        s = s.slice(0, -1) + (f.q ? '습니까' : '습니다'); ok = true;
      }
      if (!ok && f.q && /까$/.test(s)) { s += '요'; ok = true; }
      if (!ok && f.q && s.length > 1 && jong(s[s.length - 1]) === 0) {        // 만나? → 만납니까?
        s = s.slice(0, -1) + String.fromCharCode(s.charCodeAt(s.length - 1) + 17) + '니까'; ok = true;
      }                // 볼까 → 볼까요
      if (!ok && /대$/.test(s)) { s = s.slice(0, -1) + '답니다'; ok = true; }   // 비 온대 → 비 온답니다
      if (!ok && /다$/.test(s) && s.length > 1) {                                // 웃기다 → 웃깁니다, 좋다 → 좋습니다
        ok = true;
        const p = s[s.length - 2], jj = jong(p), base = s.slice(0, -2);
        if (jj === 0) s = base + String.fromCharCode(p.charCodeAt(0) + 17) + '니다';
        else if (jj === 8) s = base + String.fromCharCode(p.charCodeAt(0) - 8 + 17) + '니다';
        else if (jj > 0) s = s.slice(0, -1) + '습니다';
      }
      if (!ok && !f.q && jong(s[s.length - 1]) >= 0 && !/[요어아지네게고며니냐까래대데걸]$/.test(s)) {
        s += jong(s[s.length - 1]) > 0 ? '입니다' : '입니다'; ok = true;     // 치킨 → 치킨입니다
      }
      return { s, f, ok };
    };
    const translate = raw => {
      if (/^[ㅋㅎ\s!~.]+$/.test(raw.trim())) return pick(['웃깁니다. 소리는 안 냈습니다.', '웃깁니다. 티는 안 냈습니다.', '웃었습니다. 대체로 속으로 웃습니다.']);
      const { s, f, ok } = formal(raw);
      const topic = topics.find(([re]) => re.test(raw));
      let body = ok ? s + (f.q ? '?' : '.') : s + ', 라고 합니다.';
      if (mode === 'flat') return body.replace(/[!]/g, '.') + ' ' + pick(flatEnds);
      if (f.laugh) return body + ' ' + pick(['웃기긴 합니다. 웃음은 3초로 제한합니다.', '웃었습니다. 티는 안 냈습니다.', '웃긴 건 인정합니다. 기록해 두겠습니다.']);
      if (f.cry) return body + ' ' + pick(['감정은 접수했습니다. 울 시간은 일정에 없습니다.', '조금 슬프긴 합니다. 내일 아침까지 정리하겠습니다.', '울진 않았습니다. 거의요.']);
      if (f.angry) return body + ' ' + pick(['정색한 겁니다. 진지합니다.', '원인 파악부터 하겠습니다.']);
      const plan = plans.find(([re]) => re.test(raw));
      const r = Math.random();
      let out;
      if (plan && r < .45) out = body + ' ' + pick(plan[1]);
      else if (r < .8) out = pick(frames)(body) + (Math.random() < .35 ? ' ' + (topic ? pick(topic[1]) : pick(tails)) : '');
      else out = body + ' ' + (topic ? pick(topic[1]) : pick(tails));
      return out + (f.bang ? pick([' 느낌표는 제가 붙인 게 아닙니다.', ' 오랜만에 목소리가 커졌습니다.', ' 흥분은 1분 안에 정리하겠습니다.']) : '');
    };
    const run = () => {
      const v = $('tr-in').value;
      let out, n = 0;
      do { out = translate(v); n++; } while (v === last && out === lastOut && n < 6);
      last = v; lastOut = out;
      $('tr-out').textContent = out;
    };
    trForm.addEventListener('submit', e => { e.preventDefault(); run(); });
    document.querySelectorAll('.tr-modes button').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      document.querySelectorAll('.tr-modes button').forEach(x => x.setAttribute('aria-pressed', x === b));
      if ($('tr-in').value.trim()) run();
    }));
    document.querySelectorAll('.tr-examples button').forEach(b => b.addEventListener('click', () => {
      $('tr-in').value = b.textContent; run();
    }));
  }

  // ================= 미니홈피 (첫 페이지) =================
  const HB = n => (n >= 200 ? 3 : n >= 70 ? 2 : n >= 25 ? 1 : 0);
  const HB_NAMES = ['아기오소리', '벌꿀오소리', '사나운꿀오소리', '메가 벌꿀오소리'];

  // 오늘의 기분 (오늘 카페인 % 기준)
  const moodEl = document.getElementById('mood');
  if (moodEl) {
    const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    const w = { americano: 5, shot: 10, latte: 4, decaf: 0 };
    Promise.all(Object.keys(w).map(k => shared('get', `cf-${k}-d${day}`).then(n => (n || 0) * w[k]))).then(v => {
      const p = v.reduce((a, b) => a + b, 0);
      const m = p >= 150 ? '⚡ 과충전. 말이 빨라졌습니다' : p >= 100 ? '🤩 완충. 오늘은 충분합니다' : p >= 60 ? '😀 TMI 주의'
        : p >= 30 ? '🙂 대화 가능. 단답 위주' : p > 0 ? '😪 눈만 떴습니다' : '😴 아직 부팅 중';
      moodEl.textContent = `${m} (카페인 ${p}%)`;
    });
  }

  // BGM: "계획대로 행진곡" (ESTJ March · 직접 만든 8비트 곡 · 저작권 걱정 없음)
  //   정박에 딱딱 떨어지는 행진곡. 4박 카운트로 정시에 시작하고, 16마디마다 정확히 반복합니다.
  const bgmBtn = document.getElementById('bgm-btn');
  if (bgmBtn) {
    const N = n => 440 * Math.pow(2, (n - 69) / 12);
    const nm = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const P = s => nm[s[0]] + (s[1] === '#' ? 1 : 0) + 12 * (+s.slice(-1) + 1);
    // [음, 16분음표 길이] · R = 쉼표
    const A = [
      ['G4',4],['B4',2],['D5',2],['G5',4],['D5',4],      ['E5',3],['D5',1],['C5',4],['B4',4],['A4',4],
      ['B4',4],['D5',2],['G5',2],['B5',4],['A5',4],      ['G5',8],['R',4],['D5',4],
      ['E5',4],['G5',2],['E5',2],['D5',4],['B4',4],      ['C5',3],['B4',1],['A4',4],['G4',4],['A4',4],
      ['B4',2],['D5',2],['G5',4],['F#5',2],['A5',2],['D5',4], ['G5',8],['G4',4],['R',4],
    ];
    const B = [   // 2절: 한 단계 더 각 잡힌 버전
      ['D5',2],['D5',2],['G5',4],['G5',2],['A5',2],['B5',4], ['C6',3],['B5',1],['A5',4],['G5',4],['F#5',4],
      ['E5',2],['E5',2],['A5',4],['A5',2],['B5',2],['C6',4], ['B5',8],['R',4],['D5',4],
      ['G5',4],['B5',2],['G5',2],['E5',4],['C5',4],      ['D5',3],['E5',1],['F#5',4],['A5',4],['F#5',4],
      ['G5',4],['D5',2],['B4',2],['G4',4],['A4',2],['F#4',2], ['G4',8],['R',8],
    ];
    const melody = A.concat(B);
    // 반 마디(8칸)마다 베이스 근음
    const roots = ['G2','G2','C3','D3','G2','G2','D3','D3','C3','G2','A2','D3','G2','D3','G2','G2',
                   'G2','G2','A2','D3','A2','A2','G2','D3','E3','C3','D3','D3','G2','D3','G2','G2'];
    const STEP = 60 / 120 / 4;            // 120BPM, 16분음표
    const BAR = 16, LOOP = 32 * 8;        // 32개 반 마디 = 16마디
    let ctx, master, noise, timer, on = false, next = 0, pos = 0, ev = [], ei = 0, countIn = 0;
    // 멜로디를 칸 단위 이벤트로 펼치기
    let at = 0; melody.forEach(([n, len]) => { if (n !== 'R') ev.push({ at, n: P(n), len }); at += len; });

    const env = (node, t, vol, len) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      node.connect(g); g.connect(master); return g;
    };
    const tone = (f, t, len, type, vol) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
      env(o, t, vol, len); o.start(t); o.stop(t + len + 0.02);
    };
    const kick = t => {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      env(o, t, 0.5, 0.16); o.start(t); o.stop(t + 0.2);
    };
    const snare = (t, vol = 0.16) => {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
      s.connect(f); env(f, t, vol, 0.11); s.start(t); s.stop(t + 0.13);
    };
    const tick = (t, hi) => tone(hi ? 1760 : 1320, t, 0.05, 'square', 0.07);

    const schedule = () => {
      while (next < ctx.currentTime + 0.2) {
        if (countIn < 4) {                                   // 원, 투, 쓰리, 포
          tick(next, countIn === 0); countIn++; next += STEP * 4; continue;
        }
        const s = pos % LOOP;
        if (s === 0) ei = 0;
        while (ei < ev.length && ev[ei].at === s) {
          const e = ev[ei]; tone(N(e.n), next, STEP * e.len * 0.85, 'square', 0.085); ei++;
        }
        const beat = s % BAR;
        if (beat % 4 === 0) {                                // 정박: 쿵 / 짝
          const r = P(roots[Math.floor(s / 8) % roots.length]);
          if (beat % 8 === 0) { kick(next); tone(N(r), next, STEP * 3, 'triangle', 0.28); }
          else { snare(next); tone(N(r + 7), next, STEP * 2, 'triangle', 0.18); }
        }
        if (beat === 14 && Math.floor(s / BAR) % 4 === 3) snare(next, 0.1);   // 4마디마다 작은 필인
        if (beat % 2 === 0) tone(6000, next, 0.02, 'square', 0.012);         // 하이햇
        next += STEP; pos++;
      }
    };
    const box = document.getElementById('bgm');
    bgmBtn.addEventListener('click', () => {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination);
        noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      on = !on;
      if (on) { ctx.resume(); pos = 0; ei = 0; countIn = 0; next = ctx.currentTime + 0.05; timer = setInterval(schedule, 40); }
      else { clearInterval(timer); ctx.suspend(); }
      bgmBtn.textContent = on ? '❚❚' : '▶';
      bgmBtn.setAttribute('aria-label', on ? 'BGM 정지' : 'BGM 재생');
      box.classList.toggle('on', on);
    });
  }

  // 미니룸 (벌꿀오소리 진화 단계 · 광주 시각에 따라 바뀜)
  const room = document.getElementById('room');
  if (room) {
    const talk = [
      ['밥은요?', '꿀 한 방울만요', '졸립니다', '안녕하세요.', '성장 중입니다'],
      ['밥 주세요', '꿀은 언제나 환영', '대체로 괜찮습니다', '알람 다섯 개 맞췄습니다', '오늘 할 일 체크 완료'],
      ['건드리지 마십시오', '배고프면 사나워집니다', '경고했습니다', '밥 70번 받았습니다', '꿀 내놔'],
      ['짐이 메가 벌꿀오소리다', '대체로 전설입니다', '왕관이 무겁습니다', '200번의 밥, 기억하겠습니다', '커피도 바칩시다'],
    ];
    // 사이트 톤: 밝은 종이색 + 가는 선 + 주황 한 점 (색은 style.css의 .room 변수, 다크 모드 자동)
    const LN = 'stroke:var(--rl);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round', NOF = 'fill:none';
    let stage = 0, bubbleTimer;
    const draw = n => {
      const fi = HB(n); stage = fi;
      const t = kst(), night = t.h >= 22 || t.h < 7;
      const hr = (t.h % 12) * 30 + t.m * 0.5, mn = t.m * 6;
      const cx = 430, cy = 70;
      const hx = cx + 10 * Math.sin(hr * Math.PI / 180), hy = cy - 10 * Math.cos(hr * Math.PI / 180);
      const mx = cx + 16 * Math.sin(mn * Math.PI / 180), my = cy - 16 * Math.cos(mn * Math.PI / 180);
      const pet = BADGER_ART[fi].replace('<svg viewBox="0 0 200 200">', '<svg x="222" y="128" width="156" height="156" viewBox="0 0 200 200">');
      const deco = [
        // 아기: 택배 상자
        `<g><path d="M486 240 H556 V284 H486Z" style="fill:var(--rkraft);${LN}"/><path d="M486 240 L494 230 H564 L556 240 M556 284 L564 274 V230" style="fill:var(--rkraft2);${LN}"/><rect x="500" y="250" width="42" height="26" style="fill:var(--rp)"/>
          <text x="521" y="259" text-anchor="middle" font-size="8" font-weight="800" style="fill:var(--rl)">아기 1</text>
          <text x="521" y="272" text-anchor="middle" font-size="7" font-weight="700" style="fill:var(--hot)">취급주의</text></g>`,
        // 벌꿀오소리: 꿀 병
        `<g><rect x="508" y="244" width="30" height="40" rx="3" style="fill:var(--rp);${LN}"/><rect x="510" y="238" width="26" height="7" style="fill:var(--rwood);${LN}"/>
          <rect x="508" y="258" width="30" height="26" rx="3" style="fill:var(--rhoney)"/><rect x="508" y="244" width="30" height="40" rx="3" style="${LN};${NOF}"/>
          <text x="523" y="257" text-anchor="middle" font-size="8" font-weight="800" style="fill:var(--rl)">꿀</text></g>`,
        // 사나운: 발톱 자국 + 주의 테이프
        `<g style="stroke:var(--rl);stroke-width:2;stroke-linecap:round"><path d="M472 28 l14 30 M481 26 l14 30 M490 24 l14 30"/></g>
         <g transform="rotate(-4 520 150)"><rect x="470" y="142" width="110" height="14" style="fill:var(--hot)"/>
          <text x="525" y="153" text-anchor="middle" font-size="8.5" font-weight="800" fill="#fff">출입 주의 · 물 수 있음</text></g>`,
        // 메가: 진화 증명서
        `<g><rect x="468" y="20" width="62" height="48" style="fill:var(--rwood);${LN}"/><rect x="472" y="24" width="54" height="40" style="fill:var(--rp)"/><rect x="472" y="24" width="54" height="40" style="${LN};${NOF};stroke-width:.8"/>
          <text x="499" y="38" text-anchor="middle" font-size="7" font-weight="800" style="fill:var(--rl)">진화 증명서</text>
          <path d="M484 46 H514 M488 52 H510" style="${LN};stroke-width:.8;opacity:.5"/><circle cx="516" cy="56" r="4" style="fill:var(--hot)"/></g>`,
      ][fi];
      room.innerHTML = `<svg viewBox="0 0 600 300" role="img" aria-label="미니룸: ${HB_NAMES[fi]}가 사는 방">
        <defs>
          <pattern id="rm-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0 V24 M0 24 H24" style="stroke:var(--rg);stroke-width:1;fill:none"/></pattern>
        </defs>
        <rect width="600" height="204" style="fill:var(--rw)"/>
        <rect width="600" height="204" fill="url(#rm-grid)"/>
        <rect y="204" width="600" height="96" style="fill:var(--rf)"/>
        <g style="stroke:var(--rm);stroke-width:1"><path d="M0 236 H600 M0 268 H600 M140 204 V236 M360 204 V236 M80 236 V268 M300 236 V268 M500 236 V268 M200 268 V300 M420 268 V300"/></g>
        <path d="M0 204 H600" style="${LN}"/>
        <rect x="40" y="44" width="116" height="92" style="fill:${night ? 'var(--rn)' : 'var(--rsky)'};${LN}"/>
        ${night ? '<circle cx="128" cy="68" r="9" style="fill:var(--rp)"/><circle cx="124" cy="65" r="8" style="fill:var(--rn)"/>'
                : '<circle cx="128" cy="68" r="10" style="fill:var(--hot)"/><path d="M52 120 q2 -9 12 -8 q4 -8 14 -5 q8 -1 10 7 q7 1 7 6Z" style="fill:var(--rp);opacity:.9"/>'}
        <path d="M98 44 V136 M40 90 H156" style="${LN}"/>
        <path d="M30 38 H166" style="stroke:var(--rwood2);stroke-width:4;stroke-linecap:round"/>
        <path d="M34 38 V146 H58 V38 M162 38 V146 H138 V38" style="fill:var(--rcur);${LN}"/>
        <path d="M42 40 V144 M50 40 V144 M146 40 V144 M154 40 V144" style="${LN};stroke-width:.8;opacity:.35"/>
        <g transform="rotate(-2 236 86)"><rect x="200" y="46" width="72" height="86" style="fill:var(--hot)"/>
          <text x="236" y="82" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">대체로</text>
          <text x="236" y="100" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">괜찮음*</text>
          <text x="236" y="120" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" opacity=".8">* 개인차 있음</text></g>
        <g transform="rotate(1.5 334 84)"><rect x="300" y="48" width="68" height="74" style="fill:var(--rnote);${LN}"/>
          <text x="307" y="64" font-size="8" font-weight="800" style="fill:var(--rm2)">TO DO</text>
          <g font-size="9" font-weight="700" style="fill:var(--rl)"><text x="307" y="80">☑ 커피</text><text x="307" y="93">☑ 알람 ×5</text><text x="307" y="106">☐ 테니스</text><text x="307" y="118" opacity=".45">☐ 놀고먹기</text></g></g>
        <circle cx="${cx}" cy="${cy}" r="22" style="fill:var(--rp);stroke:var(--rwood2);stroke-width:4"/>
        <path d="M${cx} ${cy - 19} v3 M${cx} ${cy + 19} v-3 M${cx - 19} ${cy} h3 M${cx + 19} ${cy} h-3" style="${LN};stroke-width:1"/>
        <path d="M${cx} ${cy} L${hx} ${hy}" style="${LN};stroke-width:2.5"/>
        <path d="M${cx} ${cy} L${mx} ${my}" style="stroke:var(--hot);stroke-width:1.5;stroke-linecap:round"/>
        ${deco}
        <g><path d="M18 212 H28 V266 H18Z M182 226 H190 V266 H182Z" style="fill:var(--rwood);${LN}"/>
          <rect x="20" y="226" width="166" height="30" style="fill:var(--rp);${LN}"/>
          <rect x="70" y="222" width="116" height="34" style="fill:var(--rbed);${LN}"/><path d="M70 230 H186" style="stroke:var(--rp);stroke-width:1.5;opacity:.5"/>
          <rect x="28" y="214" width="38" height="12" style="fill:var(--rp);${LN}"/></g>
        <path d="M184 288 L208 256 H392 L416 288Z" style="fill:var(--rr);stroke:var(--rrug);stroke-width:5;stroke-linejoin:round"/>
        <path d="M200 282 L218 260 H382 L400 282" style="stroke:${fi === 3 ? 'var(--hot)' : 'var(--rrug)'};stroke-width:${fi === 3 ? 2 : 1};fill:none"/>
        <g><path d="M442 214 V280 M574 214 V280" style="stroke:var(--rwood2);stroke-width:4"/><rect x="434" y="208" width="148" height="7" style="fill:var(--rwood);${LN}"/>
          <path d="M460 210 L466 186 H510 L506 210Z" style="fill:var(--rmetal);${LN}"/><path d="M454 211 H514" style="${LN}"/>
          <path d="M534 190 H554 L552 210 H536Z" style="fill:var(--rp);${LN}"/>
          <path d="M554 194 q7 0 6 6 q-1 5 -7 5" style="${LN};${NOF}"/>
          <path d="M573 200 q-9 -6 -7 -16 q8 3 7 16Z M573 200 q2 -14 10 -18 q2 10 -10 18Z" style="fill:var(--rplant);${LN};stroke-width:1"/>
          <path d="M566 200 H580 L578 210 H568Z" style="fill:var(--rpot);${LN}"/></g>
        <a href="play.html#badger"><g class="rm-pet">${pet}</g></a>
        <g id="rm-bubble" class="rm-bubble">
          <rect x="352" y="116" width="150" height="26" style="fill:var(--rp);${LN}"/>
          <path d="M366 142 L362 152 L376 142" style="fill:var(--rp);${LN}"/>
          <path d="M367 142 L375 142" style="stroke:var(--rp);stroke-width:2.5"/>
          <text id="rm-say" x="427" y="133" text-anchor="middle" font-size="11" font-weight="700" style="fill:var(--rl)"></text>
        </g>
      </svg>`;
      document.getElementById('room-cap').textContent =
        `현재 거주자: ${HB_NAMES[fi]} · 밥 ${n.toLocaleString()}번${night ? ' · 지금은 자는 시간입니다' : ''}`;
      say();
    };
    const say = () => {
      const el = document.getElementById('rm-say'); if (!el) return;
      const t = kst(), night = t.h >= 22 || t.h < 7;
      el.textContent = night ? pick(['취침 중입니다', '5분만 더 자겠습니다', '알람 다섯 개 맞췄습니다', '내일 연락 주십시오']) : pick(talk[stage]);
      const b = document.getElementById('rm-bubble'); b.classList.remove('pop'); void b.getBBox(); b.classList.add('pop');
    };
    draw(0);
    fetch('https://abacus.jasoncameron.dev/get/xormrjjin-debug-jinseo-v2/honeybadger')
      .then(r => r.ok ? r.json() : { value: 0 }).then(d => draw(d.value || 0)).catch(() => {});
    clearInterval(bubbleTimer); bubbleTimer = setInterval(say, 4000);
    room.addEventListener('mouseover', e => { if (e.target.closest('.rm-pet')) say(); });
  }

  // A Day: 지금 시각에 해당하는 장면 표시
  const tlItems = document.querySelectorAll('.tl-item');
  if (tlItems.length) {
    const mark = () => {
      const t = kst();
      const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
      const list = [...tlItems].map(el => ({ el, m: toMin(el.dataset.time) }));
      const first = list[0].m;
      const norm = x => (x < first ? x + 1440 : x);             // 새벽 1시는 '그날 밤'으로
      const now = norm(t.mins);
      let cur = list[list.length - 1];
      for (const it of list) if (norm(it.m) <= now) cur = it;
      list.forEach(it => it.el.classList.toggle('now', it === cur));
    };
    mark(); setInterval(mark, 60000);
  }

  // FAQ: 모두 펼치기 / 접기
  const qaAll = document.getElementById('qa-all');
  if (qaAll) {
    const qas = document.querySelectorAll('.qa');
    const sync = () => { qaAll.textContent = [...qas].every(q => q.open) ? '모두 접기' : '모두 펼치기'; };
    qaAll.addEventListener('click', () => { const open = ![...qas].every(q => q.open); qas.forEach(q => { q.open = open; }); sync(); });
    qas.forEach(q => q.addEventListener('toggle', sync));
  }
