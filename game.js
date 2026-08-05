(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const hpBar = document.getElementById("hp-bar");
  const powerBar = document.getElementById("power-bar");
  const powerReady = document.getElementById("power-ready");
  const scoreEl = document.getElementById("score");
  const waveEl = document.getElementById("wave");
  const killsEl = document.getElementById("kills");
  const charNameEl = document.getElementById("char-name");
  const mapNameEl = document.getElementById("map-name");
  const modeNameEl = document.getElementById("mode-name");
  const objectiveEl = document.getElementById("objective");
  const buffsEl = document.getElementById("buffs");
  const hud = document.getElementById("hud");
  const overlay = document.getElementById("overlay");
  const charSelect = document.getElementById("char-select");
  const mapSelect = document.getElementById("map-select");
  const modeSelect = document.getElementById("mode-select");
  const charGrid = document.getElementById("char-grid");
  const mapGrid = document.getElementById("map-grid");
  const modeGrid = document.getElementById("mode-grid");
  const gameover = document.getElementById("gameover");
  const endTitle = document.getElementById("end-title");
  const endMsg = document.getElementById("end-msg");
  const startBtn = document.getElementById("start-btn");
  const toMapBtn = document.getElementById("to-map-btn");
  const toModeBtn = document.getElementById("to-mode-btn");
  const playBtn = document.getElementById("play-btn");
  const backBtn = document.getElementById("back-btn");
  const mapBackBtn = document.getElementById("map-back-btn");
  const modeBackBtn = document.getElementById("mode-back-btn");
  const retryBtn = document.getElementById("retry-btn");
  const reselectBtn = document.getElementById("reselect-btn");
  const finalScore = document.getElementById("final-score");
  const finalKills = document.getElementById("final-kills");
  const finalWave = document.getElementById("final-wave");

  const CHARACTERS = [
    {
      id: "minjun",
      name: "민준",
      role: "돌격병",
      skill: "빠른 연사",
      powerSkill: "기관총 난사",
      powerDesc: "전방 탄막을 쏟아냅니다",
      skillIcon: "🔫",
      skillColor: "#e35a3c",
      colors: { body: "#3d6ea8", skin: "#e8c39a", accent: "#7eb6ff" },
      stats: { hp: 110, speed: 230, damage: 30, fireRate: 0.11, ammo: 16, reload: 1.0, spread: 0.07 },
      bars: { hp: 55, speed: 70, damage: 50, fire: 90 },
    },
    {
      id: "seoyeon",
      name: "서연",
      role: "저격수",
      skill: "강한 화력",
      powerSkill: "연쇄 처형",
      powerDesc: "가까운 좀비들을 차례로 처형합니다",
      skillIcon: "🎯",
      skillColor: "#7b4fd6",
      colors: { body: "#6b3fa0", skin: "#f0c9a8", accent: "#c9a6ff" },
      stats: { hp: 90, speed: 200, damage: 55, fireRate: 0.28, ammo: 8, reload: 1.3, spread: 0.02 },
      bars: { hp: 40, speed: 50, damage: 95, fire: 35 },
    },
    {
      id: "hyunwoo",
      name: "현우",
      role: "수비대",
      skill: "높은 생존",
      powerSkill: "충격파",
      powerDesc: "주변 좀비를 밀쳐내고 피해를 줍니다",
      skillIcon: "🛡",
      skillColor: "#2f8f4e",
      colors: { body: "#2f5c3a", skin: "#d9b08c", accent: "#8fd9a2" },
      stats: { hp: 170, speed: 170, damage: 26, fireRate: 0.18, ammo: 12, reload: 1.2, spread: 0.08 },
      bars: { hp: 95, speed: 30, damage: 40, fire: 50 },
    },
  ];

  const MAPS = [
    {
      id: "ruins",
      name: "폐허 거리",
      difficulty: "easy",
      diffLabel: "쉬움",
      desc: "넓은 도로. 엄폐물이 적어 이동이 자유롭습니다.",
      obstacleCount: 6,
      zombieSpeedMul: 0.9,
      zombieHpMul: 0.9,
      spawnMul: 0.9,
      itemRate: 0.28,
      palette: { ground: "#121a14", wall: "#3a4638", accent: "#6b7a55" },
    },
    {
      id: "factory",
      name: "공장 지대",
      difficulty: "normal",
      diffLabel: "보통",
      desc: "기계와 컨테이너가 배치된 중간 난이도 맵입니다.",
      obstacleCount: 12,
      zombieSpeedMul: 1.0,
      zombieHpMul: 1.1,
      spawnMul: 1.05,
      itemRate: 0.34,
      palette: { ground: "#141820", wall: "#4a5560", accent: "#7a8794" },
    },
    {
      id: "bunker",
      name: "미로 벙커",
      difficulty: "hard",
      diffLabel: "어려움",
      desc: "좁은 통로와 많은 장애물. 좀비가 강하고 빠릅니다.",
      obstacleCount: 18,
      zombieSpeedMul: 1.2,
      zombieHpMul: 1.35,
      spawnMul: 1.25,
      itemRate: 0.4,
      palette: { ground: "#100e14", wall: "#5a3d3d", accent: "#8a5a5a" },
    },
  ];

  const ITEM_TYPES = {
    double: { label: "더블샷", color: "#ffb347", duration: 8, icon: "x2" },
    haste: { label: "이속 증가", color: "#5ad1ff", duration: 7, icon: ">>" },
    rapid: { label: "연사 강화", color: "#ff6b8a", duration: 7, icon: "!!" },
    heal: { label: "체력 회복", color: "#7dff9a", duration: 0, icon: "+" },
  };

  const MODES = [
    {
      id: "classic",
      name: "클래식",
      icon: "∞",
      goal: "죽지 않고 최대한 버틴다",
      desc: "웨이브가 계속 올라가는 기본 서바이벌 모드입니다.",
      timeLimit: 0,
      killGoal: 0,
      spawnMul: 1,
    },
    {
      id: "timeattack",
      name: "타임어택",
      icon: "⏱",
      goal: "90초 동안 최고 점수",
      desc: "제한 시간 안에 점수를 최대한 쌓으세요. 시간이 끝나면 클리어!",
      timeLimit: 90,
      killGoal: 0,
      spawnMul: 1.25,
    },
    {
      id: "killhunt",
      name: "킬 챌린지",
      icon: "☠",
      goal: "좀비 50마리 처치",
      desc: "목표 처치 수에 도달하면 승리합니다.",
      timeLimit: 0,
      killGoal: 50,
      spawnMul: 1.15,
    },
    {
      id: "survive",
      name: "타임 서바이벌",
      icon: "🛡",
      goal: "120초 동안 생존",
      desc: "제한 시간 동안 살아남으면 클리어입니다.",
      timeLimit: 120,
      killGoal: 0,
      spawnMul: 1.1,
    },
  ];

  const keys = new Set();
  const mouse = { x: 0, y: 0, down: false };

  let W = 0;
  let H = 0;
  let running = false;
  let lastTime = 0;
  let selectedId = CHARACTERS[0].id;
  let selectedMapId = MAPS[0].id;
  let selectedModeId = MODES[0].id;

  const state = {
    score: 0,
    kills: 0,
    wave: 1,
    shake: 0,
    spawnTimer: 0,
    waveClearTimer: 0,
    zombiesToSpawn: 0,
    itemTimer: 0,
    timeLeft: 0,
    particles: [],
    bullets: [],
    zombies: [],
    obstacles: [],
    items: [],
    effects: [],
    muzzleFlash: 0,
    skillTargets: [],
  };

  // 좀비 우회용 내비게이션 그리드
  const NAV = {
    cell: 36,
    cols: 0,
    rows: 0,
    blocked: null,
    dist: null,
    timer: 0,
  };

  const POWER_MAX = 100;

  const player = {
    x: 0,
    y: 0,
    r: 40,
    baseSpeed: 220,
    speed: 220,
    hp: 100,
    maxHp: 100,
    angle: 0,
    fireCooldown: 0,
    ammo: 12,
    maxAmmo: 12,
    reloadTimer: 0,
    reloadTime: 1.1,
    reloading: false,
    invuln: 0,
    damage: 28,
    baseFireRate: 0.14,
    fireRate: 0.14,
    spread: 0.06,
    colors: CHARACTERS[0].colors,
    name: CHARACTERS[0].name,
    charId: CHARACTERS[0].id,
    power: 0,
    skillTimer: 0,
    skillBurst: 0,
    buffs: { double: 0, haste: 0, rapid: 0 },
  };

  function getSelectedChar() {
    return CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];
  }

  function getSelectedMap() {
    return MAPS.find((m) => m.id === selectedMapId) || MAPS[0];
  }

  function getSelectedMode() {
    return MODES.find((m) => m.id === selectedModeId) || MODES[0];
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  }

  function getObjectiveText() {
    const mode = getSelectedMode();
    if (mode.id === "timeattack") return `남은 ${formatTime(state.timeLeft)}`;
    if (mode.id === "survive") return `생존 ${formatTime(state.timeLeft)}`;
    if (mode.id === "killhunt") return `${state.kills} / ${mode.killGoal}`;
    return "생존 중";
  }

  function applyCharacter(char) {
    const s = char.stats;
    player.maxHp = s.hp;
    player.hp = s.hp;
    player.baseSpeed = s.speed;
    player.speed = s.speed;
    player.damage = s.damage;
    player.baseFireRate = s.fireRate;
    player.fireRate = s.fireRate;
    player.maxAmmo = s.ammo;
    player.ammo = s.ammo;
    player.reloadTime = s.reload;
    player.spread = s.spread;
    player.colors = char.colors;
    player.name = char.name;
    player.charId = char.id;
    player.r = 40;
    player.power = 0;
    player.skillTimer = 0;
    player.skillBurst = 0;
    player.buffs = { double: 0, haste: 0, rapid: 0 };
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function dist(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function circleRectCollision(cx, cy, cr, rect) {
    const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    return dist(cx, cy, nearestX, nearestY) < cr;
  }

  function resolveCircleRect(cx, cy, cr, rect) {
    const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    let dx = cx - nearestX;
    let dy = cy - nearestY;
    let d = Math.hypot(dx, dy);

    if (d === 0) {
      const left = cx - rect.x;
      const right = rect.x + rect.w - cx;
      const top = cy - rect.y;
      const bottom = rect.y + rect.h - cy;
      const m = Math.min(left, right, top, bottom);
      if (m === left) return { x: rect.x - cr, y: cy };
      if (m === right) return { x: rect.x + rect.w + cr, y: cy };
      if (m === top) return { x: cx, y: rect.y - cr };
      return { x: cx, y: rect.y + rect.h + cr };
    }

    if (d < cr) {
      const push = (cr - d) / d;
      return { x: cx + dx * push, y: cy + dy * push };
    }
    return { x: cx, y: cy };
  }

  function collidesAny(cx, cy, cr) {
    for (const o of state.obstacles) {
      if (circleRectCollision(cx, cy, cr, o)) return true;
    }
    return false;
  }

  function buildObstacles(map) {
    const list = [];
    const pad = 100;
    const centerClear = 160;
    const gap = 90; // 좀비가 지나갈 통로 확보
    let tries = 0;

    while (list.length < map.obstacleCount && tries < 400) {
      tries += 1;
      const long = Math.random() < 0.5;
      const w = long ? rand(60, 140) : rand(36, 60);
      const h = long ? rand(32, 56) : rand(60, 140);
      const x = rand(pad, W - pad - w);
      const y = rand(pad, H - pad - h);
      const cx = x + w / 2;
      const cy = y + h / 2;

      if (dist(cx, cy, W / 2, H / 2) < centerClear + Math.max(w, h) * 0.3) continue;

      let overlaps = false;
      for (const o of list) {
        if (x < o.x + o.w + gap && x + w + gap > o.x && y < o.y + o.h + gap && y + h + gap > o.y) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      list.push({
        x,
        y,
        w,
        h,
        kind: Math.random() < 0.35 ? "crate" : "wall",
      });
    }

    // Hard map: add corridor walls with wide openings
    if (map.id === "bunker") {
      const midX = W * 0.5 - 16;
      const gapH = 150;
      const topH = Math.max(80, H * 0.5 - gapH / 2 - 80);
      const botY = H * 0.5 + gapH / 2;
      const botH = Math.max(80, H - 80 - botY);
      list.push({ x: midX, y: 80, w: 32, h: topH, kind: "wall" });
      list.push({ x: midX, y: botY, w: 32, h: botH, kind: "wall" });

      const gapW = 160;
      const leftW = Math.max(80, W * 0.5 - gapW / 2 - 80);
      const rightX = W * 0.5 + gapW / 2;
      const rightW = Math.max(80, W - 80 - rightX);
      list.push({ x: 80, y: H * 0.5 - 16, w: leftW, h: 32, kind: "wall" });
      list.push({ x: rightX, y: H * 0.5 - 16, w: rightW, h: 32, kind: "wall" });
    }

    return list;
  }

  function rebuildNavGrid() {
    NAV.cols = Math.max(1, Math.ceil(W / NAV.cell));
    NAV.rows = Math.max(1, Math.ceil(H / NAV.cell));
    const n = NAV.cols * NAV.rows;
    NAV.blocked = new Uint8Array(n);
    const clearR = 20;
    for (let gy = 0; gy < NAV.rows; gy++) {
      for (let gx = 0; gx < NAV.cols; gx++) {
        const x = gx * NAV.cell + NAV.cell * 0.5;
        const y = gy * NAV.cell + NAV.cell * 0.5;
        let blocked = x < clearR || y < clearR || x > W - clearR || y > H - clearR;
        if (!blocked) blocked = collidesAny(x, y, clearR);
        NAV.blocked[gy * NAV.cols + gx] = blocked ? 1 : 0;
      }
    }
    updateFlowField();
  }

  function clampCell(gx, gy) {
    return {
      gx: Math.max(0, Math.min(NAV.cols - 1, gx)),
      gy: Math.max(0, Math.min(NAV.rows - 1, gy)),
    };
  }

  function nearestOpenCell(gx, gy) {
    const start = clampCell(gx, gy);
    if (!NAV.blocked[start.gy * NAV.cols + start.gx]) return start;
    for (let r = 1; r < 12; r++) {
      for (let oy = -r; oy <= r; oy++) {
        for (let ox = -r; ox <= r; ox++) {
          const c = clampCell(start.gx + ox, start.gy + oy);
          if (!NAV.blocked[c.gy * NAV.cols + c.gx]) return c;
        }
      }
    }
    return start;
  }

  function updateFlowField() {
    if (!NAV.blocked || !NAV.cols) return;
    const n = NAV.cols * NAV.rows;
    NAV.dist = new Int16Array(n);
    NAV.dist.fill(32767);

    const qx = new Int16Array(n);
    const qy = new Int16Array(n);
    let qh = 0;
    let qt = 0;

    let sgx = Math.floor(player.x / NAV.cell);
    let sgy = Math.floor(player.y / NAV.cell);
    ({ gx: sgx, gy: sgy } = nearestOpenCell(sgx, sgy));

    const startI = sgy * NAV.cols + sgx;
    NAV.dist[startI] = 0;
    qx[qt] = sgx;
    qy[qt] = sgy;
    qt += 1;

    const dirs = [
      [1, 0, 10],
      [-1, 0, 10],
      [0, 1, 10],
      [0, -1, 10],
      [1, 1, 14],
      [1, -1, 14],
      [-1, 1, 14],
      [-1, -1, 14],
    ];

    while (qh < qt) {
      const cx = qx[qh];
      const cy = qy[qh];
      qh += 1;
      const cd = NAV.dist[cy * NAV.cols + cx];

      for (let d = 0; d < dirs.length; d++) {
        const nx = cx + dirs[d][0];
        const ny = cy + dirs[d][1];
        if (nx < 0 || ny < 0 || nx >= NAV.cols || ny >= NAV.rows) continue;
        const i = ny * NAV.cols + nx;
        if (NAV.blocked[i]) continue;
        // 대각선 이동 시 모서리 끼임 방지
        if (dirs[d][0] !== 0 && dirs[d][1] !== 0) {
          if (NAV.blocked[cy * NAV.cols + nx] || NAV.blocked[ny * NAV.cols + cx]) continue;
        }
        const nd = cd + dirs[d][2];
        if (nd < NAV.dist[i]) {
          NAV.dist[i] = nd;
          qx[qt] = nx;
          qy[qt] = ny;
          qt += 1;
        }
      }
    }
  }

  function unstickEntity(entity) {
    if (!collidesAny(entity.x, entity.y, entity.r * 0.85)) return;
    for (const o of state.obstacles) {
      if (circleRectCollision(entity.x, entity.y, entity.r, o)) {
        const fixed = resolveCircleRect(entity.x, entity.y, entity.r + 2, o);
        entity.x = fixed.x;
        entity.y = fixed.y;
      }
    }
    if (collidesAny(entity.x, entity.y, entity.r * 0.85) && NAV.dist) {
      const c = nearestOpenCell(Math.floor(entity.x / NAV.cell), Math.floor(entity.y / NAV.cell));
      entity.x = c.gx * NAV.cell + NAV.cell * 0.5;
      entity.y = c.gy * NAV.cell + NAV.cell * 0.5;
    }
    entity.x = Math.max(entity.r, Math.min(W - entity.r, entity.x));
    entity.y = Math.max(entity.r, Math.min(H - entity.r, entity.y));
  }

  function flowSteer(entity, speed, dt) {
    if (!NAV.dist) {
      steerToward(entity, player.x, player.y, speed, dt);
      return;
    }

    const gx = Math.floor(entity.x / NAV.cell);
    const gy = Math.floor(entity.y / NAV.cell);
    const cur = clampCell(gx, gy);
    let bestD = NAV.dist[cur.gy * NAV.cols + cur.gx];
    let bestX = player.x;
    let bestY = player.y;
    let found = bestD < 32767;

    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (ox === 0 && oy === 0) continue;
        const nx = cur.gx + ox;
        const ny = cur.gy + oy;
        if (nx < 0 || ny < 0 || nx >= NAV.cols || ny >= NAV.rows) continue;
        const i = ny * NAV.cols + nx;
        if (NAV.blocked[i]) continue;
        const d = NAV.dist[i];
        if (d < bestD) {
          bestD = d;
          bestX = nx * NAV.cell + NAV.cell * 0.5;
          bestY = ny * NAV.cell + NAV.cell * 0.5;
          found = true;
        }
      }
    }

    if (!found || bestD >= 32767) {
      steerToward(entity, player.x, player.y, speed, dt);
      unstickEntity(entity);
      return;
    }

    // 목표 셀에 거의 도착하면 플레이어를 직접 추적
    if (bestD <= 18) {
      bestX = player.x;
      bestY = player.y;
    }

    const step = speed * dt;
    const ang = Math.atan2(bestY - entity.y, bestX - entity.x);
    const nx = entity.x + Math.cos(ang) * step;
    const ny = entity.y + Math.sin(ang) * step;
    const bodyR = Math.min(entity.r * 0.72, 26);

    if (isWalkable(nx, ny, bodyR)) {
      entity.x = nx;
      entity.y = ny;
    } else {
      // 미끄러지며 우회
      if (isWalkable(nx, entity.y, bodyR)) entity.x = nx;
      else if (isWalkable(entity.x, ny, bodyR)) entity.y = ny;
      else {
        moveWithCollision(entity, nx, ny);
        steerToward(entity, bestX, bestY, speed, dt);
      }
    }

    unstickEntity(entity);
  }

  function drawMapPreview(canvasEl, map) {
    const pctx = canvasEl.getContext("2d");
    const pw = canvasEl.width;
    const ph = canvasEl.height;
    pctx.fillStyle = map.palette.ground;
    pctx.fillRect(0, 0, pw, ph);

    const count = map.obstacleCount;
    for (let i = 0; i < count; i++) {
      const ww = 10 + ((i * 17) % 28);
      const hh = 8 + ((i * 13) % 22);
      const xx = 8 + ((i * 37) % (pw - ww - 16));
      const yy = 8 + ((i * 29) % (ph - hh - 16));
      if (Math.hypot(xx + ww / 2 - pw / 2, yy + hh / 2 - ph / 2) < 28) continue;
      pctx.fillStyle = i % 3 === 0 ? map.palette.accent : map.palette.wall;
      pctx.fillRect(xx, yy, ww, hh);
    }

    pctx.fillStyle = "#c4f04a";
    pctx.beginPath();
    pctx.arc(pw / 2, ph / 2, 5, 0, Math.PI * 2);
    pctx.fill();
  }

  function renderCharacterCards() {
    charGrid.innerHTML = "";
    CHARACTERS.forEach((char) => {
      const card = document.createElement("article");
      card.className = `char-card${char.id === selectedId ? " selected" : ""}`;
      card.innerHTML = `
        <h2>${char.name}</h2>
        <div class="char-portrait" style="background:${char.colors.accent}55">
          <div class="char-face" style="background:${char.colors.body}">
            <canvas class="preview" width="78" height="78"></canvas>
          </div>
        </div>
        <div class="char-role">${char.role}</div>
        <div class="char-stats">
          <div class="stat-row"><span>체력</span><div class="stat-bar"><i style="width:${char.bars.hp}%"></i></div><span>${char.stats.hp}</span></div>
          <div class="stat-row"><span>속도</span><div class="stat-bar"><i style="width:${char.bars.speed}%"></i></div><span>${char.stats.speed}</span></div>
          <div class="stat-row"><span>화력</span><div class="stat-bar"><i style="width:${char.bars.damage}%"></i></div><span>${char.stats.damage}</span></div>
          <div class="stat-row"><span>연사</span><div class="stat-bar"><i style="width:${char.bars.fire}%"></i></div><span>${Math.round(1 / char.stats.fireRate)}</span></div>
        </div>
        <div class="char-skill">
          <span class="skill-icon" style="background:${char.skillColor}">${char.skillIcon}</span>
          <span>${char.powerSkill}</span>
        </div>
        <div class="char-role">Q · ${char.powerDesc}</div>
        <button class="char-select-btn ${char.id === selectedId ? "selected-btn" : "select"}" type="button">
          ${char.id === selectedId ? "선택됨 ✓" : "선택하기"}
        </button>
      `;
      drawPortrait(card.querySelector(".preview").getContext("2d"), char);
      card.addEventListener("click", () => {
        selectedId = char.id;
        toMapBtn.disabled = false;
        renderCharacterCards();
      });
      charGrid.appendChild(card);
    });
    toMapBtn.disabled = !selectedId;
  }

  function renderMapCards() {
    mapGrid.innerHTML = "";
    MAPS.forEach((map) => {
      const card = document.createElement("article");
      card.className = `map-card${map.id === selectedMapId ? " selected" : ""}`;
      card.innerHTML = `
        <canvas class="map-preview" width="240" height="110"></canvas>
        <h2>${map.name}</h2>
        <div class="map-meta">
          <span>장애물 ${map.obstacleCount}+</span>
          <span class="diff ${map.difficulty}">${map.diffLabel}</span>
        </div>
        <p class="map-desc">${map.desc}</p>
        <button class="map-select-btn" type="button">${map.id === selectedMapId ? "선택됨 ✓" : "선택하기"}</button>
      `;
      drawMapPreview(card.querySelector(".map-preview"), map);
      card.addEventListener("click", () => {
        selectedMapId = map.id;
        toModeBtn.disabled = false;
        renderMapCards();
      });
      mapGrid.appendChild(card);
    });
    toModeBtn.disabled = !selectedMapId;
  }

  function renderModeCards() {
    modeGrid.innerHTML = "";
    MODES.forEach((mode) => {
      const card = document.createElement("article");
      card.className = `mode-card${mode.id === selectedModeId ? " selected" : ""}`;
      card.innerHTML = `
        <div class="mode-icon">${mode.icon}</div>
        <h2>${mode.name}</h2>
        <div class="mode-goal">${mode.goal}</div>
        <p class="mode-desc">${mode.desc}</p>
        <button class="mode-select-btn" type="button">${mode.id === selectedModeId ? "선택됨 ✓" : "선택하기"}</button>
      `;
      card.addEventListener("click", () => {
        selectedModeId = mode.id;
        playBtn.disabled = false;
        renderModeCards();
      });
      modeGrid.appendChild(card);
    });
    playBtn.disabled = !selectedModeId;
  }

  function drawPortrait(pctx, char) {
    pctx.clearRect(0, 0, 78, 78);
    pctx.fillStyle = char.colors.body;
    pctx.beginPath();
    pctx.arc(39, 42, 28, 0, Math.PI * 2);
    pctx.fill();
    pctx.fillStyle = char.colors.skin;
    pctx.beginPath();
    pctx.arc(39, 30, 14, 0, Math.PI * 2);
    pctx.fill();
    pctx.fillStyle = "#222";
    pctx.beginPath();
    pctx.arc(34, 28, 2, 0, Math.PI * 2);
    pctx.arc(44, 28, 2, 0, Math.PI * 2);
    pctx.fill();
    pctx.fillStyle = "#333";
    pctx.fillRect(50, 38, 18, 6);
  }

  function resetGame() {
    applyCharacter(getSelectedChar());
    const map = getSelectedMap();
    const mode = getSelectedMode();

    state.score = 0;
    state.kills = 0;
    state.wave = 1;
    state.shake = 0;
    state.spawnTimer = 0.5;
    state.waveClearTimer = 0;
    state.zombiesToSpawn = Math.round(6 * map.spawnMul * mode.spawnMul);
    state.itemTimer = 4;
    state.timeLeft = mode.timeLimit;
    state.particles = [];
    state.bullets = [];
    state.zombies = [];
    state.items = [];
    state.effects = [];
    state.muzzleFlash = 0;
    state.obstacles = buildObstacles(map);
    state.skillTargets = [];
    rebuildNavGrid();
    NAV.timer = 0;

    player.x = W / 2;
    player.y = H / 2;
    player.angle = 0;
    player.fireCooldown = 0;
    player.reloadTimer = 0;
    player.reloading = false;
    player.invuln = 0;
    player.power = 0;
    player.skillTimer = 0;
    player.skillBurst = 0;

    updateHud();
  }

  function updateBuffHud() {
    const chips = [];
    for (const key of ["double", "haste", "rapid"]) {
      if (player.buffs[key] > 0) {
        const t = ITEM_TYPES[key];
        chips.push(`<span class="buff-chip" style="color:${t.color}">${t.label} ${Math.ceil(player.buffs[key])}s</span>`);
      }
    }
    if (chips.length) {
      buffsEl.classList.remove("hidden");
      buffsEl.innerHTML = chips.join("");
    } else {
      buffsEl.classList.add("hidden");
      buffsEl.innerHTML = "";
    }
  }

  function updatePowerHud() {
    const pct = Math.min(100, (player.power / POWER_MAX) * 100);
    powerBar.style.width = `${pct}%`;
    const ready = player.power >= POWER_MAX;
    powerBar.classList.toggle("ready", ready);
    powerReady.classList.toggle("hidden", !ready);
  }

  function addPower(amount) {
    if (player.skillTimer > 0) return;
    player.power = Math.min(POWER_MAX, player.power + amount);
    updatePowerHud();
  }

  function updateHud() {
    hpBar.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
    scoreEl.textContent = String(state.score);
    waveEl.textContent = String(state.wave);
    killsEl.textContent = String(state.kills);
    charNameEl.textContent = player.name;
    mapNameEl.textContent = getSelectedMap().name;
    modeNameEl.textContent = getSelectedMode().name;
    objectiveEl.textContent = getObjectiveText();
    updateBuffHud();
    updatePowerHud();
  }

  function checkModeClear() {
    if (!running) return;
    const mode = getSelectedMode();
    if (mode.id === "killhunt" && state.kills >= mode.killGoal) {
      winGame("목표 처치 수를 달성했습니다!");
    }
  }

  function killZombieAt(index, bonusScore = 0) {
    const z = state.zombies[index];
    if (!z) return;
    state.score += z.score + bonusScore;
    state.kills += 1;
    spawnParticles(z.x, z.y, z.color, 20, 220);
    if (Math.random() < getSelectedMap().itemRate * 0.35) spawnItem(z.x, z.y);
    state.zombies.splice(index, 1);
    addPower(18);
    updateHud();
    checkModeClear();
  }

  function damageZombie(z, amount) {
    z.hp -= amount;
    z.hitFlash = 0.12;
    addPower(Math.min(6, amount * 0.12));
    return z.hp <= 0;
  }

  function activatePowerSkill() {
    if (!running || player.power < POWER_MAX || player.skillTimer > 0) return;

    player.power = 0;
    updatePowerHud();
    state.shake = Math.max(state.shake, 14);

    const char = getSelectedChar();
    state.effects.push({
      type: "banner",
      text: char.powerSkill,
      life: 1.2,
      maxLife: 1.2,
    });

    if (player.charId === "minjun") {
      // Barrage: temporary hyper fire + ammo refill
      player.skillTimer = 3.2;
      player.skillBurst = 0.04;
      player.ammo = player.maxAmmo;
      player.reloading = false;
      player.buffs.rapid = Math.max(player.buffs.rapid, 3.2);
      spawnParticles(player.x, player.y, "#7eb6ff", 24, 220);
    } else if (player.charId === "seoyeon") {
      // 연쇄 처형: 가까운 좀비를 순서대로 처형
      const ranked = state.zombies
        .map((z, idx) => ({ z, idx, d: dist(player.x, player.y, z.x, z.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 7);

      state.skillTargets = ranked.map((t) => t.z);
      player.skillTimer = Math.max(0.8, state.skillTargets.length * 0.22);
      player.skillBurst = 0.05;

      for (const t of ranked) {
        state.effects.push({
          type: "mark",
          x: t.z.x,
          y: t.z.y,
          target: t.z,
          life: player.skillTimer + 0.2,
          maxLife: player.skillTimer + 0.2,
          color: "#c9a6ff",
        });
      }
      spawnParticles(player.x, player.y, "#c9a6ff", 22, 180);
    } else {
      // Shockwave AOE
      player.skillTimer = 0.45;
      player.invuln = Math.max(player.invuln, 1.4);
      player.hp = Math.min(player.maxHp, player.hp + 25);
      const radius = 210;
      state.effects.push({
        type: "shockwave",
        x: player.x,
        y: player.y,
        radius: 20,
        maxRadius: radius,
        life: 0.45,
        maxLife: 0.45,
        color: "#8fd9a2",
      });

      for (let j = state.zombies.length - 1; j >= 0; j--) {
        const z = state.zombies[j];
        const d = dist(player.x, player.y, z.x, z.y);
        if (d < radius + z.r) {
          const ang = Math.atan2(z.y - player.y, z.x - player.x);
          z.x += Math.cos(ang) * 90;
          z.y += Math.sin(ang) * 90;
          spawnParticles(z.x, z.y, "#8fd9a2", 10, 160);
          if (damageZombie(z, 90)) killZombieAt(j, 30);
        }
      }
      updateHud();
    }
  }

  function pointNearSegment(px, py, x1, y1, x2, y2, threshold) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const nx = x1 + dx * t;
    const ny = y1 + dy * t;
    return dist(px, py, nx, ny) <= threshold;
  }

  function spawnZombie() {
    const map = getSelectedMap();
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const margin = 70;

    if (edge === 0) {
      x = rand(-margin, W + margin);
      y = -margin;
    } else if (edge === 1) {
      x = W + margin;
      y = rand(-margin, H + margin);
    } else if (edge === 2) {
      x = rand(-margin, W + margin);
      y = H + margin;
    } else {
      x = -margin;
      y = rand(-margin, H + margin);
    }

    const tier = Math.min(3, Math.floor((state.wave - 1) / 3));
    const types = [
      { r: 28, speed: 72, hp: 40, color: "#6b8f3c", score: 100 },
      { r: 34, speed: 56, hp: 80, color: "#4a6b2a", score: 150 },
      { r: 24, speed: 110, hp: 28, color: "#8fb84a", score: 120 },
      { r: 40, speed: 42, hp: 160, color: "#3d5220", score: 250 },
    ];
    const t = types[Math.min(tier, types.length - 1)];
    const variant = Math.random() < 0.25 ? types[2] : t;
    const hp = (variant.hp + state.wave * 5) * map.zombieHpMul;

    state.zombies.push({
      x,
      y,
      r: variant.r + rand(-2, 2),
      speed: (variant.speed * (0.9 + Math.random() * 0.25) + state.wave * 3) * map.zombieSpeedMul,
      hp,
      maxHp: hp,
      color: variant.color,
      score: variant.score,
      hitFlash: 0,
      wobble: Math.random() * Math.PI * 2,
      preferSide: Math.random() < 0.5 ? 1 : -1,
      stuckTime: 0,
    });
  }

  function spawnItem(x = null, y = null) {
    const types = ["double", "haste", "rapid", "heal"];
    const type = types[Math.floor(Math.random() * types.length)];
    let ix = x;
    let iy = y;
    let tries = 0;

    while ((ix == null || collidesAny(ix, iy, 18) || dist(ix, iy, player.x, player.y) < 80) && tries < 40) {
      ix = rand(80, W - 80);
      iy = rand(80, H - 80);
      tries += 1;
    }

    state.items.push({
      x: ix,
      y: iy,
      r: 16,
      type,
      life: 16,
      bob: Math.random() * Math.PI * 2,
    });
  }

  function spawnParticles(x, y, color, count, speed = 160) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(speed * 0.3, speed);
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: rand(0.25, 0.7),
        maxLife: 0.7,
        size: rand(3, 7),
        color,
      });
    }
  }

  function pickupItem(item) {
    const def = ITEM_TYPES[item.type];
    if (item.type === "heal") {
      player.hp = Math.min(player.maxHp, player.hp + 40);
      spawnParticles(item.x, item.y, def.color, 14, 140);
    } else {
      player.buffs[item.type] = Math.max(player.buffs[item.type], def.duration);
      spawnParticles(item.x, item.y, def.color, 16, 170);
    }
    state.score += 25;
    updateHud();
  }

  function startReload() {
    if (player.reloading || player.ammo === player.maxAmmo) return;
    player.reloading = true;
    player.reloadTimer = player.reloadTime;
  }

  function fireBullet(angle) {
    const muzzleDist = player.r + 18;
    const muzzleX = player.x + Math.cos(angle) * muzzleDist;
    const muzzleY = player.y + Math.sin(angle) * muzzleDist;
    const spread = (Math.random() - 0.5) * player.spread;
    state.bullets.push({
      x: muzzleX,
      y: muzzleY,
      vx: Math.cos(angle + spread) * 760,
      vy: Math.sin(angle + spread) * 760,
      life: 0.9,
      r: 4,
      damage: player.damage,
      pierce: false,
    });
    return { muzzleX, muzzleY };
  }

  function shoot() {
    if (!running || player.reloading || player.fireCooldown > 0 || player.ammo <= 0) {
      if (player.ammo <= 0 && !player.reloading) startReload();
      return;
    }

    player.ammo -= 1;
    player.fireCooldown = player.fireRate;
    state.muzzleFlash = 0.06;
    state.shake = Math.max(state.shake, 4);

    if (player.buffs.double > 0) {
      const a = fireBullet(player.angle - 0.1);
      fireBullet(player.angle + 0.1);
      spawnParticles(a.muzzleX, a.muzzleY, "#ffe27a", 6, 100);
    } else {
      const a = fireBullet(player.angle);
      spawnParticles(a.muzzleX, a.muzzleY, "#ffe27a", 5, 90);
    }

    if (player.ammo <= 0) startReload();
  }

  function damagePlayer(amount) {
    if (player.invuln > 0) return;
    player.hp -= amount;
    player.invuln = 0.55;
    state.shake = 12;
    spawnParticles(player.x, player.y, "#e23b3b", 12, 150);
    updateHud();
    if (player.hp <= 0) {
      player.hp = 0;
      endGame();
    }
  }

  function showResult(won, title, msg) {
    running = false;
    hud.classList.add("hidden");
    gameover.classList.toggle("win", won);
    endTitle.textContent = title;
    endMsg.textContent = msg;
    finalScore.textContent = String(state.score);
    finalKills.textContent = String(state.kills);
    finalWave.textContent = String(state.wave);
    gameover.classList.remove("hidden");
  }

  function endGame() {
    showResult(false, "사망", "당신은 좀비에게 당했습니다");
  }

  function winGame(msg) {
    showResult(true, "클리어!", msg);
  }

  function moveWithCollision(entity, nx, ny) {
    let x = nx;
    let y = entity.y;
    if (collidesAny(x, y, entity.r)) {
      for (const o of state.obstacles) {
        if (circleRectCollision(x, y, entity.r, o)) {
          const fixed = resolveCircleRect(x, y, entity.r, o);
          x = fixed.x;
          y = fixed.y;
        }
      }
    }

    let fx = x;
    let fy = ny;
    if (collidesAny(fx, fy, entity.r)) {
      for (const o of state.obstacles) {
        if (circleRectCollision(fx, fy, entity.r, o)) {
          const fixed = resolveCircleRect(fx, fy, entity.r, o);
          fx = fixed.x;
          fy = fixed.y;
        }
      }
    }

    entity.x = Math.max(entity.r, Math.min(W - entity.r, fx));
    entity.y = Math.max(entity.r, Math.min(H - entity.r, fy));
  }

  function isWalkable(x, y, r) {
    if (x < r || y < r || x > W - r || y > H - r) return false;
    return !collidesAny(x, y, r);
  }

  // 장애물을 피해 목표로 이동 (좀비 AI)
  function steerToward(entity, tx, ty, speed, dt) {
    const step = speed * dt;
    const base = Math.atan2(ty - entity.y, tx - entity.x);
    if (entity.preferSide == null) entity.preferSide = Math.random() < 0.5 ? 1 : -1;
    if (entity.stuckTime == null) entity.stuckTime = 0;

    const side = entity.preferSide;
    const offsets = [
      0,
      0.4 * side,
      -0.4 * side,
      0.85 * side,
      -0.85 * side,
      1.35 * side,
      -1.35 * side,
      Math.PI * 0.5 * side,
      -Math.PI * 0.5 * side,
      Math.PI * 0.75 * side,
      Math.PI,
    ];

    let best = null;
    let bestScore = -Infinity;
    const look = Math.max(28, step * 3);

    for (const off of offsets) {
      const a = base + off;
      const nx = entity.x + Math.cos(a) * step;
      const ny = entity.y + Math.sin(a) * step;
      if (!isWalkable(nx, ny, entity.r * 0.92)) continue;

      // 앞쪽이 막혀 있으면 감점
      const fx = entity.x + Math.cos(a) * look;
      const fy = entity.y + Math.sin(a) * look;
      const clearBonus = isWalkable(fx, fy, entity.r * 0.7) ? 40 : -80;
      const closer = -dist(nx, ny, tx, ty);
      const turnPenalty = Math.abs(off) * 12;
      const score = closer + clearBonus - turnPenalty;
      if (score > bestScore) {
        bestScore = score;
        best = { x: nx, y: ny, a };
      }
    }

    const prevX = entity.x;
    const prevY = entity.y;

    if (best) {
      entity.x = best.x;
      entity.y = best.y;
    } else {
      // 완전히 막히면 벽에 붙어서라도 미끄러짐
      moveWithCollision(
        entity,
        entity.x + Math.cos(base + side * 1.2) * step,
        entity.y + Math.sin(base + side * 1.2) * step
      );
    }

    const moved = dist(prevX, prevY, entity.x, entity.y);
    if (moved < step * 0.15) {
      entity.stuckTime += dt;
      if (entity.stuckTime > 0.35) {
        entity.preferSide *= -1;
        entity.stuckTime = 0;
      }
    } else {
      entity.stuckTime = Math.max(0, entity.stuckTime - dt * 0.5);
    }
  }

  function update(dt) {
    const map = getSelectedMap();
    const mode = getSelectedMode();

    if (mode.timeLimit > 0) {
      state.timeLeft -= dt;
      objectiveEl.textContent = getObjectiveText();
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        if (mode.id === "timeattack") {
          winGame(`타임어택 종료! 점수 ${state.score}`);
          return;
        }
        if (mode.id === "survive") {
          winGame("제한 시간 동안 생존했습니다!");
          return;
        }
      }
    }

    if (player.invuln > 0) player.invuln -= dt;
    if (player.fireCooldown > 0) player.fireCooldown -= dt;
    if (state.muzzleFlash > 0) state.muzzleFlash -= dt;
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 28);

    for (const key of Object.keys(player.buffs)) {
      if (player.buffs[key] > 0) {
        player.buffs[key] -= dt;
        if (player.buffs[key] < 0) player.buffs[key] = 0;
      }
    }

    player.speed = player.baseSpeed * (player.buffs.haste > 0 ? 1.55 : 1);
    player.fireRate = player.baseFireRate * (player.buffs.rapid > 0 ? 0.55 : 1);
    updateBuffHud();

    if (player.reloading) {
      player.reloadTimer -= dt;
      if (player.reloadTimer <= 0) {
        player.reloading = false;
        player.ammo = player.maxAmmo;
      }
    }

    player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);

    let mx = 0;
    let my = 0;
    if (keys.has("w") || keys.has("arrowup")) my -= 1;
    if (keys.has("s") || keys.has("arrowdown")) my += 1;
    if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
    if (keys.has("d") || keys.has("arrowright")) mx += 1;

    if (mx || my) {
      const len = Math.hypot(mx, my);
      const nx = player.x + (mx / len) * player.speed * dt;
      const ny = player.y + (my / len) * player.speed * dt;
      moveWithCollision(player, nx, ny);
    }

    player.x = Math.max(player.r, Math.min(W - player.r, player.x));
    player.y = Math.max(player.r, Math.min(H - player.r, player.y));

    if (mouse.down) shoot();

    // 내비게이션 필드 갱신
    NAV.timer -= dt;
    if (NAV.timer <= 0) {
      updateFlowField();
      NAV.timer = 0.18;
    }

    // Power skill upkeep
    if (player.skillTimer > 0) {
      player.skillTimer -= dt;
      player.skillBurst -= dt;

      if (player.charId === "minjun" && player.skillBurst <= 0) {
        player.skillBurst = 0.05;
        const spreadAngles = [-0.22, -0.11, 0, 0.11, 0.22];
        for (const off of spreadAngles) {
          const a = player.angle + off + rand(-0.03, 0.03);
          const muzzleDist = player.r + 18;
          state.bullets.push({
            x: player.x + Math.cos(a) * muzzleDist,
            y: player.y + Math.sin(a) * muzzleDist,
            vx: Math.cos(a) * 820,
            vy: Math.sin(a) * 820,
            life: 0.7,
            r: 4,
            damage: player.damage * 0.75,
            pierce: true,
          });
        }
        state.muzzleFlash = 0.05;
      }

      if (player.charId === "seoyeon" && player.skillBurst <= 0) {
        player.skillBurst = 0.2;
        while (state.skillTargets.length && !state.zombies.includes(state.skillTargets[0])) {
          state.skillTargets.shift();
        }
        const target = state.skillTargets.shift();
        if (target) {
          const idx = state.zombies.indexOf(target);
          state.effects.push({
            type: "beam",
            x1: player.x,
            y1: player.y,
            x2: target.x,
            y2: target.y,
            life: 0.22,
            maxLife: 0.22,
            color: "#e0b0ff",
          });
          state.effects.push({
            type: "shockwave",
            x: target.x,
            y: target.y,
            radius: 8,
            maxRadius: 56,
            life: 0.28,
            maxLife: 0.28,
            color: "#c9a6ff",
          });
          state.shake = Math.max(state.shake, 8);
          if (idx >= 0) {
            spawnParticles(target.x, target.y, "#c9a6ff", 18, 220);
            killZombieAt(idx, 80);
          }
        }
      }

      if (player.skillTimer <= 0) {
        player.skillTimer = 0;
        player.skillBurst = 0;
        state.skillTargets = [];
      }
    }

    for (let i = state.effects.length - 1; i >= 0; i--) {
      const fx = state.effects[i];
      fx.life -= dt;
      if (fx.type === "shockwave") {
        const t = 1 - fx.life / fx.maxLife;
        fx.radius = fx.maxRadius * t;
      }
      if (fx.type === "mark" && fx.target && state.zombies.includes(fx.target)) {
        fx.x = fx.target.x;
        fx.y = fx.target.y;
      } else if (fx.type === "mark" && fx.target && !state.zombies.includes(fx.target)) {
        fx.life = 0;
      }
      if (fx.life <= 0) state.effects.splice(i, 1);
    }

    // Items spawn
    state.itemTimer -= dt;
    if (state.itemTimer <= 0) {
      if (state.items.length < 3 && Math.random() < map.itemRate + 0.35) spawnItem();
      state.itemTimer = rand(5.5, 9);
    }

    for (let i = state.items.length - 1; i >= 0; i--) {
      const item = state.items[i];
      item.life -= dt;
      item.bob += dt * 4;
      if (item.life <= 0) {
        state.items.splice(i, 1);
        continue;
      }
      if (dist(player.x, player.y, item.x, item.y) < player.r + item.r) {
        pickupItem(item);
        state.items.splice(i, 1);
      }
    }

    if (state.zombiesToSpawn > 0) {
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        spawnZombie();
        state.zombiesToSpawn -= 1;
        state.spawnTimer = Math.max(0.18, (0.85 - state.wave * 0.04) / (map.spawnMul * mode.spawnMul));
      }
    } else if (state.zombies.length === 0) {
      state.waveClearTimer += dt;
      if (state.waveClearTimer > 1.4) {
        state.wave += 1;
        state.waveClearTimer = 0;
        state.zombiesToSpawn = Math.round((5 + state.wave * 2) * map.spawnMul * mode.spawnMul);
        state.spawnTimer = 0.35;
        state.score += state.wave * 50;
        if (Math.random() < map.itemRate) spawnItem();
        updateHud();
      }
    }

    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const b = state.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      let hitWall = false;
      if (!b.pierce) {
        for (const o of state.obstacles) {
          if (circleRectCollision(b.x, b.y, b.r, o)) {
            hitWall = true;
            spawnParticles(b.x, b.y, "#ccc", 4, 80);
            break;
          }
        }
      }

      if (hitWall || b.life <= 0 || b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) {
        state.bullets.splice(i, 1);
        continue;
      }

      for (let j = state.zombies.length - 1; j >= 0; j--) {
        const z = state.zombies[j];
        if (dist(b.x, b.y, z.x, z.y) < z.r + b.r) {
          spawnParticles(b.x, b.y, "#9ecf5a", 8, 140);
          state.bullets.splice(i, 1);
          if (damageZombie(z, b.damage)) killZombieAt(j);
          break;
        }
      }
    }

    for (const z of state.zombies) {
      z.wobble += dt * 6;
      if (z.hitFlash > 0) z.hitFlash -= dt;

      const d = dist(player.x, player.y, z.x, z.y) || 1;
      flowSteer(z, z.speed, dt);

      for (const other of state.zombies) {
        if (other === z) continue;
        const od = dist(z.x, z.y, other.x, other.y);
        const minD = (z.r + other.r) * 0.75;
        if (od > 0 && od < minD) {
          const push = (minD - od) * 0.4;
          const ox = ((z.x - other.x) / od) * push;
          const oy = ((z.y - other.y) / od) * push;
          const bodyR = Math.min(z.r * 0.65, 24);
          if (isWalkable(z.x + ox, z.y + oy, bodyR)) {
            z.x += ox;
            z.y += oy;
          }
        }
      }

      if (d < player.r + z.r - 6) damagePlayer(12);
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
      if (p.life <= 0) state.particles.splice(i, 1);
    }
  }

  function drawGround() {
    const map = getSelectedMap();
    ctx.fillStyle = map.palette.ground;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(80, 110, 70, 0.08)";
    ctx.lineWidth = 1;
    const step = 56;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    for (const o of state.obstacles) {
      ctx.fillStyle = o.kind === "crate" ? map.palette.accent : map.palette.wall;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
      if (o.kind === "crate") {
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(o.x + 6, o.y + 6);
        ctx.lineTo(o.x + o.w - 6, o.y + o.h - 6);
        ctx.moveTo(o.x + o.w - 6, o.y + 6);
        ctx.lineTo(o.x + 6, o.y + o.h - 6);
        ctx.stroke();
      }
    }

    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawEffects() {
    for (const fx of state.effects) {
      const alpha = Math.max(0, fx.life / fx.maxLife);
      if (fx.type === "beam") {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 14 * alpha + 4;
        ctx.shadowColor = fx.color;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.moveTo(fx.x1, fx.y1);
        ctx.lineTo(fx.x2, fx.y2);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(fx.x1, fx.y1);
        ctx.lineTo(fx.x2, fx.y2);
        ctx.stroke();
        ctx.restore();
      } else if (fx.type === "shockwave") {
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 6;
        ctx.shadowColor = fx.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.2;
        ctx.fillStyle = fx.color;
        ctx.fill();
        ctx.restore();
      } else if (fx.type === "banner") {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffe27a";
        ctx.font = "bold 34px Black Han Sans, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(fx.text, W / 2, H * 0.22);
        ctx.font = "14px Noto Sans KR, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText("파워 스킬!", W / 2, H * 0.22 + 28);
        ctx.restore();
      } else if (fx.type === "mark") {
        ctx.save();
        ctx.globalAlpha = 0.4 + alpha * 0.6;
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = fx.color;
        ctx.shadowBlur = 12;
        const r = 22 + Math.sin(performance.now() / 80) * 3;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(fx.x - r - 6, fx.y);
        ctx.lineTo(fx.x - r + 6, fx.y);
        ctx.moveTo(fx.x + r - 6, fx.y);
        ctx.lineTo(fx.x + r + 6, fx.y);
        ctx.moveTo(fx.x, fx.y - r - 6);
        ctx.lineTo(fx.x, fx.y - r + 6);
        ctx.moveTo(fx.x, fx.y + r - 6);
        ctx.lineTo(fx.x, fx.y + r + 6);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawItem(item) {
    const def = ITEM_TYPES[item.type];
    const y = item.y + Math.sin(item.bob) * 4;
    ctx.save();
    ctx.translate(item.x, y);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = def.color;
    ctx.beginPath();
    ctx.arc(0, 0, item.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 12px Black Han Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.icon, 0, 1);

    if (item.life < 4) {
      ctx.globalAlpha = 0.5 + Math.sin(item.bob * 8) * 0.5;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, item.r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer() {
    const c = player.colors;
    const r = player.r;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);

    if (player.invuln > 0 && Math.floor(player.invuln * 20) % 2 === 0) ctx.globalAlpha = 0.45;

    if (player.buffs.haste > 0 || player.buffs.double > 0 || player.buffs.rapid > 0) {
      ctx.strokeStyle = player.buffs.double > 0 ? "#ffb347" : player.buffs.haste > 0 ? "#5ad1ff" : "#ff6b8a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(2, 8, r * 0.9, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d8e2d9";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(-r * 0.12, -r * 0.55, r * 0.28, 0, Math.PI * 2);
    ctx.arc(-r * 0.12, r * 0.55, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.skin;
    ctx.beginPath();
    ctx.arc(r * 0.12, 0, r * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(r * 0.28, -r * 0.14, r * 0.07, 0, Math.PI * 2);
    ctx.arc(r * 0.28, r * 0.14, r * 0.07, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(r * 0.45, -r * 0.16, r * 1.05, r * 0.32);
    ctx.fillStyle = "#444";
    ctx.fillRect(r * 0.4, -r * 0.26, r * 0.38, r * 0.52);
    ctx.fillStyle = "#666";
    ctx.fillRect(r * 1.35, -r * 0.1, r * 0.3, r * 0.2);

    if (state.muzzleFlash > 0) {
      const tip = r * 1.7;
      ctx.fillStyle = "#ffe27a";
      ctx.beginPath();
      ctx.moveTo(tip, 0);
      ctx.lineTo(tip + r * 0.5, -r * 0.28);
      ctx.lineTo(tip + r * 0.35, 0);
      ctx.lineTo(tip + r * 0.5, r * 0.28);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // 캐릭터 위 HP / 파워 게이지
    drawPlayerStatusBars();

    const barW = Math.max(56, player.maxAmmo * 5);
    ctx.save();
    ctx.translate(player.x, player.y + player.r + 16);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(-barW / 2, -7, barW, 12);

    if (player.reloading) {
      const p = 1 - player.reloadTimer / player.reloadTime;
      ctx.fillStyle = "#ffe27a";
      ctx.fillRect(-barW / 2, -7, barW * p, 12);
      ctx.fillStyle = "#fff";
      ctx.font = "12px Noto Sans KR";
      ctx.textAlign = "center";
      ctx.fillText("재장전", 0, -12);
    } else {
      const slot = (barW - 8) / player.maxAmmo;
      for (let i = 0; i < player.maxAmmo; i++) {
        ctx.fillStyle = i < player.ammo ? "#c4f04a" : "rgba(255,255,255,0.15)";
        ctx.fillRect(-barW / 2 + 4 + i * slot, -4, Math.max(2, slot - 1.5), 6);
      }
    }
    ctx.restore();
  }

  function drawPlayerStatusBars() {
    const barW = 72;
    const barH = 8;
    const gap = 4;
    const x = player.x - barW / 2;
    let y = player.y - player.r - 28;

    ctx.save();
    ctx.font = "bold 11px Noto Sans KR, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // HP
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x - 1, y - 1, barW + 2, barH + 2);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x, y, barW, barH);
    const hpRatio = Math.max(0, player.hp / player.maxHp);
    const hpGrad = ctx.createLinearGradient(x, y, x + barW, y);
    hpGrad.addColorStop(0, "#e23b3b");
    hpGrad.addColorStop(1, "#c4f04a");
    ctx.fillStyle = hpGrad;
    ctx.fillRect(x, y, barW * hpRatio, barH);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText("HP", x - 22, y + barH / 2);

    // Power / skill gauge
    y += barH + gap;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x - 1, y - 1, barW + 2, barH + 2);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x, y, barW, barH);
    const powerRatio = Math.max(0, Math.min(1, player.power / POWER_MAX));
    const ready = player.power >= POWER_MAX;
    const powGrad = ctx.createLinearGradient(x, y, x + barW, y);
    if (ready) {
      powGrad.addColorStop(0, "#ff6b2a");
      powGrad.addColorStop(0.5, "#ffe27a");
      powGrad.addColorStop(1, "#ffffff");
    } else {
      powGrad.addColorStop(0, "#f0a020");
      powGrad.addColorStop(1, "#ffe27a");
    }
    ctx.fillStyle = powGrad;
    ctx.fillRect(x, y, barW * powerRatio, barH);
    if (ready) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 1, y - 1, barW + 2, barH + 2);
    }
    ctx.fillStyle = ready ? "#ffe27a" : "rgba(255,255,255,0.9)";
    ctx.fillText(ready ? "Q!" : "SK", x - 22, y + barH / 2);

    // 스킬 사용 중이면 남은 시간 표시
    if (player.skillTimer > 0) {
      y += barH + gap + 2;
      ctx.fillStyle = "rgba(201,166,255,0.95)";
      ctx.font = "bold 12px Black Han Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`스킬 ${player.skillTimer.toFixed(1)}s`, player.x, y + 4);
    }

    ctx.restore();
  }

  function drawZombie(z) {
    ctx.save();
    ctx.translate(z.x, z.y + Math.sin(z.wobble) * 2.5);
    const angle = Math.atan2(player.y - z.y, player.x - z.x);
    ctx.rotate(angle);

    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(2, 10, z.r * 0.85, z.r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = z.hitFlash > 0 ? "#f5f5f5" : z.color;
    ctx.beginPath();
    ctx.arc(0, 0, z.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = z.hitFlash > 0 ? "#ddd" : "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(-2, 2, z.r * 0.45, z.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    const eye = Math.max(3, z.r * 0.12);
    ctx.fillStyle = "#ff2d2d";
    ctx.beginPath();
    ctx.arc(z.r * 0.28, -z.r * 0.28, eye, 0, Math.PI * 2);
    ctx.arc(z.r * 0.28, z.r * 0.28, eye, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = z.hitFlash > 0 ? "#eee" : "#567a34";
    ctx.lineWidth = Math.max(5, z.r * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(6, -z.r * 0.7);
    ctx.lineTo(z.r + 12, -z.r * 0.35 + Math.sin(z.wobble * 2) * 5);
    ctx.moveTo(6, z.r * 0.7);
    ctx.lineTo(z.r + 12, z.r * 0.35 + Math.cos(z.wobble * 2) * 5);
    ctx.stroke();
    ctx.restore();

    if (z.hp < z.maxHp) {
      const bw = z.r * 2.2;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(z.x - bw / 2, z.y - z.r - 14, bw, 5);
      ctx.fillStyle = "#e23b3b";
      ctx.fillRect(z.x - bw / 2, z.y - z.r - 14, bw * (z.hp / z.maxHp), 5);
    }
  }

  function draw() {
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }

    drawGround();

    for (const item of state.items) drawItem(item);
    drawEffects();

    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const b of state.bullets) {
      const col = b.pierce ? "#7ecbff" : "#ffe27a";
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = b.pierce ? 14 : 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (const z of state.zombies) drawZombie(z);
    if (running) drawPlayer();

    ctx.strokeStyle = "rgba(196, 240, 74, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouse.x - 12, mouse.y);
    ctx.lineTo(mouse.x + 12, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 12);
    ctx.lineTo(mouse.x, mouse.y + 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
    ctx.stroke();

    if (state.zombiesToSpawn === 0 && state.zombies.length === 0 && running) {
      ctx.fillStyle = "rgba(196, 240, 74, 0.9)";
      ctx.font = "bold 36px Black Han Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`웨이브 ${state.wave + 1}`, W / 2, H / 2 - 20);
      ctx.font = "16px Noto Sans KR, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("곧 시작됩니다...", W / 2, H / 2 + 16);
    }

    ctx.restore();
  }

  function loop(ts) {
    if (!running) return;
    const dt = Math.min(0.033, (ts - lastTime) / 1000 || 0.016);
    lastTime = ts;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function hideAllPanels() {
    overlay.classList.add("hidden");
    charSelect.classList.add("hidden");
    mapSelect.classList.add("hidden");
    modeSelect.classList.add("hidden");
    gameover.classList.add("hidden");
  }

  function showTitle() {
    running = false;
    hideAllPanels();
    hud.classList.add("hidden");
    overlay.classList.remove("hidden");
  }

  function showCharSelect() {
    running = false;
    hideAllPanels();
    hud.classList.add("hidden");
    charSelect.classList.remove("hidden");
    renderCharacterCards();
  }

  function showMapSelect() {
    running = false;
    hideAllPanels();
    hud.classList.add("hidden");
    mapSelect.classList.remove("hidden");
    renderMapCards();
  }

  function showModeSelect() {
    running = false;
    hideAllPanels();
    hud.classList.add("hidden");
    modeSelect.classList.remove("hidden");
    renderModeCards();
  }

  function start() {
    if (!selectedId || !selectedMapId || !selectedModeId) return;
    hideAllPanels();
    hud.classList.remove("hidden");
    resetGame();
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    const px = player.x / (W || 1);
    const py = player.y / (H || 1);
    resize();
    if (running) {
      player.x = px * W;
      player.y = py * H;
      state.obstacles = buildObstacles(getSelectedMap());
      rebuildNavGrid();
    }
  });

  window.addEventListener("keydown", (e) => {
    keys.add(e.key.toLowerCase());
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (running) startReload();
    }
    if (e.key.toLowerCase() === "q") {
      if (running) activatePowerSkill();
    }
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key.toLowerCase());
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * W;
    mouse.y = ((e.clientY - rect.top) / rect.height) * H;
  });

  canvas.addEventListener("mousedown", () => {
    mouse.down = true;
    if (running) shoot();
  });

  window.addEventListener("mouseup", () => {
    mouse.down = false;
  });

  startBtn.addEventListener("click", showCharSelect);
  backBtn.addEventListener("click", showTitle);
  toMapBtn.addEventListener("click", showMapSelect);
  mapBackBtn.addEventListener("click", showCharSelect);
  toModeBtn.addEventListener("click", showModeSelect);
  modeBackBtn.addEventListener("click", showMapSelect);
  playBtn.addEventListener("click", start);
  retryBtn.addEventListener("click", start);
  reselectBtn.addEventListener("click", showCharSelect);

  resize();
  drawGround();
  player.x = W / 2;
  player.y = H / 2;
  draw();
})();
