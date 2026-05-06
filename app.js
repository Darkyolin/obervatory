/* ══════════════════════════════════════════════════════
   CALCULUS — app.js
   ══════════════════════════════════════════════════════ */

/* ─── CURSOR TRAIL ───────────────────────────────────── */
const trail = document.getElementById('cursorTrail');
document.addEventListener('mousemove', e => {
  trail.style.left = e.clientX + 'px';
  trail.style.top  = e.clientY + 'px';
});
document.addEventListener('mousedown', () => {
  trail.style.width = '12px'; trail.style.height = '12px';
});
document.addEventListener('mouseup', () => {
  trail.style.width = '18px'; trail.style.height = '18px';
});

/* ─── TAB NAV ─────────────────────────────────────────── */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ─── TOAST ───────────────────────────────────────────── */
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ══════════════════════════════════════════════════════
   CALCULATOR
   ══════════════════════════════════════════════════════ */
const exprEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const historyEl = document.getElementById('historyStrip');

let calc = {
  current: '0',
  operator: null,
  prev: null,
  justCalc: false,
  history: []
};

function opSymToReal(op) {
  return { '÷': '/', '×': '*', '−': '-', '+': '+' }[op] ?? op;
}

function evaluate(a, op, b) {
  a = parseFloat(a); b = parseFloat(b);
  switch(op) {
    case '÷': return b === 0 ? 'Error' : a / b;
    case '×': return a * b;
    case '−': return a - b;
    case '+': return a + b;
  }
}

function formatNum(n) {
  if (n === 'Error') return n;
  const num = parseFloat(n);
  if (isNaN(num)) return n;
  if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-7 && num !== 0)) {
    return num.toExponential(4);
  }
  const str = num.toPrecision(10).replace(/\.?0+$/, '');
  return str;
}

function updateDisplay() {
  let txt = calc.current;
  if (txt.length > 14) { exprEl.style.fontSize = '1.8rem'; }
  else if (txt.length > 10) { exprEl.style.fontSize = '2.2rem'; }
  else { exprEl.style.fontSize = ''; }
  exprEl.textContent = calc.current;
  if (calc.prev && calc.operator) {
    resultEl.textContent = calc.prev + ' ' + calc.operator;
  } else {
    resultEl.textContent = '';
  }
}

function pushHistory(expr) {
  calc.history.unshift(expr);
  if (calc.history.length > 4) calc.history.pop();
  historyEl.innerHTML = calc.history.map(h =>
    `<span class="history-chip">${h}</span>`
  ).join('');
}

function ripple(btn) {
  btn.style.transition = 'background 0.05s';
  const orig = btn.style.background;
  setTimeout(() => { btn.style.background = ''; }, 100);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const val = btn.dataset.val;
    ripple(btn);

    if (action === 'clear') {
      calc = { current: '0', operator: null, prev: null, justCalc: false, history: calc.history };
      updateDisplay();
      return;
    }
    if (action === 'sign') {
      if (calc.current !== '0') {
        calc.current = String(parseFloat(calc.current) * -1);
        updateDisplay();
      }
      return;
    }
    if (action === 'percent') {
      calc.current = String(parseFloat(calc.current) / 100);
      updateDisplay();
      return;
    }
    if (action === 'decimal') {
      if (!calc.current.includes('.')) {
        calc.current += '.';
        updateDisplay();
      }
      return;
    }
    if (action === 'num') {
      if (calc.justCalc) { calc.current = val; calc.justCalc = false; }
      else if (calc.current === '0') { calc.current = val; }
      else { calc.current += val; }
      updateDisplay();
      return;
    }
    if (action === 'op') {
      if (calc.prev && calc.operator && !calc.justCalc) {
        const res = evaluate(calc.prev, calc.operator, calc.current);
        calc.current = formatNum(res);
        calc.prev = null;
      }
      calc.operator = val;
      calc.prev = calc.current;
      calc.justCalc = true;
      updateDisplay();
      return;
    }
    if (action === 'equals') {
      if (!calc.operator || !calc.prev) return;
      const res = evaluate(calc.prev, calc.operator, calc.current);
      const expr = `${calc.prev} ${calc.operator} ${calc.current} = ${formatNum(res)}`;
      pushHistory(expr);
      if (res === 'Error') { showToast('Cannot divide by zero!'); }
      calc.current = formatNum(res);
      calc.prev = null;
      calc.operator = null;
      calc.justCalc = true;
      updateDisplay();
      return;
    }
  });
});

/* keyboard support */
document.addEventListener('keydown', e => {
  const map = {
    '0':'0','1':'1','2':'2','3':'3','4':'4',
    '5':'5','6':'6','7':'7','8':'8','9':'9',
    '.':'.', 'Enter':'=', '=':'=', 'Backspace':'DEL',
    '+':'+', '-':'−', '*':'×', '/':'÷', '%':'%',
    'Escape':'AC'
  };
  const k = map[e.key];
  if (!k) return;
  e.preventDefault();
  const sel = [...document.querySelectorAll('.btn')].find(b =>
    b.textContent.trim() === k ||
    (k === '=' && b.dataset.action === 'equals') ||
    (k === 'AC' && b.dataset.action === 'clear')
  );
  if (sel) sel.click();
});

updateDisplay();

/* ══════════════════════════════════════════════════════
   TIP SPLITTER
   ══════════════════════════════════════════════════════ */
let tipPct = 18;
let people = 2;

document.querySelectorAll('.tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tipPct = parseInt(btn.dataset.tip);
    calcTip();
  });
});

document.getElementById('stepDown').addEventListener('click', () => {
  if (people > 1) { people--; document.getElementById('peopleCount').textContent = people; calcTip(); }
});
document.getElementById('stepUp').addEventListener('click', () => {
  people++; document.getElementById('peopleCount').textContent = people; calcTip();
});
document.getElementById('billAmt').addEventListener('input', calcTip);

function calcTip() {
  const bill = parseFloat(document.getElementById('billAmt').value) || 0;
  const tip = bill * tipPct / 100;
  const total = bill + tip;
  const tpp = tip / people;
  const totpp = total / people;
  document.getElementById('tipPerPerson').textContent  = '$' + tpp.toFixed(2);
  document.getElementById('totalPerPerson').textContent = '$' + totpp.toFixed(2);
  document.getElementById('grandTotal').textContent    = '$' + total.toFixed(2);
}
calcTip();

/* ══════════════════════════════════════════════════════
   BMI METER
   ══════════════════════════════════════════════════════ */
let isMetric = true;

document.getElementById('unitMetric').addEventListener('click', () => {
  isMetric = true;
  document.getElementById('unitMetric').classList.add('active');
  document.getElementById('unitImperial').classList.remove('active');
  document.getElementById('metricInputs').style.display = '';
  document.getElementById('imperialInputs').style.display = 'none';
  document.getElementById('bmiResult').style.display = 'none';
});
document.getElementById('unitImperial').addEventListener('click', () => {
  isMetric = false;
  document.getElementById('unitImperial').classList.add('active');
  document.getElementById('unitMetric').classList.remove('active');
  document.getElementById('metricInputs').style.display = 'none';
  document.getElementById('imperialInputs').style.display = '';
  document.getElementById('bmiResult').style.display = 'none';
});

document.getElementById('calcBmi').addEventListener('click', () => {
  let bmi;
  if (isMetric) {
    const h = parseFloat(document.getElementById('heightCm').value);
    const w = parseFloat(document.getElementById('weightKg').value);
    if (!h || !w || h <= 0 || w <= 0) { showToast('Enter valid values!'); return; }
    bmi = w / Math.pow(h / 100, 2);
  } else {
    const ft = parseFloat(document.getElementById('heightFt').value) || 0;
    const inch = parseFloat(document.getElementById('heightIn').value) || 0;
    const lbs = parseFloat(document.getElementById('weightLbs').value);
    const totalIn = ft * 12 + inch;
    if (!totalIn || !lbs) { showToast('Enter valid values!'); return; }
    bmi = (lbs / Math.pow(totalIn, 2)) * 703;
  }

  let label, emoji;
  if (bmi < 18.5)       { label = 'Underweight'; emoji = '🌱'; }
  else if (bmi < 25)    { label = 'Normal weight'; emoji = '✅'; }
  else if (bmi < 30)    { label = 'Overweight'; emoji = '⚠️'; }
  else                  { label = 'Obese'; emoji = '🔴'; }

  document.getElementById('bmiNum').textContent = bmi.toFixed(1);
  document.getElementById('bmiLabel').textContent = emoji + ' ' + label;

  // position marker: scale 16–40
  const clampedBmi = Math.min(Math.max(bmi, 16), 40);
  const pct = ((clampedBmi - 16) / (40 - 16)) * 100;
  document.getElementById('bmiMarker').style.left = `calc(${pct}% - 2px)`;

  document.getElementById('bmiResult').style.display = '';
});

/* ══════════════════════════════════════════════════════
   COIN FLIP
   ══════════════════════════════════════════════════════ */
let heads = 0, tails = 0;
const coin = document.getElementById('coin');
const coinResult = document.getElementById('coinResult');

document.getElementById('flipBtn').addEventListener('click', () => {
  if (coin.classList.contains('flipping')) return;

  coin.classList.remove('flipping');
  coinResult.textContent = '🪙 Flipping...';

  // Determine outcome
  const isHeads = Math.random() < 0.5;

  // Clone trick to restart animation
  void coin.offsetWidth;
  coin.classList.add('flipping');

  coin.addEventListener('animationend', function handler() {
    coin.removeEventListener('animationend', handler);
    coin.classList.remove('flipping');

    // Set final rotation to show correct face
    coin.style.transform = isHeads ? 'rotateY(0deg)' : 'rotateY(180deg)';

    if (isHeads) {
      heads++;
      document.getElementById('headsCount').textContent = heads;
      coinResult.textContent = '🥇 Heads!';
      showToast('Heads!');
    } else {
      tails++;
      document.getElementById('tailsCount').textContent = tails;
      coinResult.textContent = '🌕 Tails!';
      showToast('Tails!');
    }
  });
});

document.getElementById('resetCoin').addEventListener('click', () => {
  heads = 0; tails = 0;
  document.getElementById('headsCount').textContent = 0;
  document.getElementById('tailsCount').textContent = 0;
  coinResult.textContent = '';
  coin.style.transform = '';
  showToast('Stats reset!');
});
