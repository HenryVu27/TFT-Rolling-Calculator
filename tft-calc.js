// TFT Data (from tft_data.json) 
const tftData = {
  costs: [
    { cost: 1, poolSize: 30 },
    { cost: 2, poolSize: 25 },
    { cost: 3, poolSize: 18 },
    { cost: 4, poolSize: 10 },
    { cost: 5, poolSize: 9 }
  ],
  odds: [
    { level: 1, costOdds: { "1": 100, "2": 0, "3": 0, "4": 0, "5": 0 } },
    { level: 2, costOdds: { "1": 100, "2": 0, "3": 0, "4": 0, "5": 0 } },
    { level: 3, costOdds: { "1": 75, "2": 25, "3": 0, "4": 0, "5": 0 } },
    { level: 4, costOdds: { "1": 55, "2": 30, "3": 15, "4": 0, "5": 0 } },
    { level: 5, costOdds: { "1": 45, "2": 33, "3": 20, "4": 2, "5": 0 } },
    { level: 6, costOdds: { "1": 30, "2": 40, "3": 25, "4": 5, "5": 0 } },
    { level: 7, costOdds: { "1": 19, "2": 30, "3": 40, "4": 10, "5": 1 } },
    { level: 8, costOdds: { "1": 17, "2": 24, "3": 32, "4": 24, "5": 3 } },
    { level: 9, costOdds: { "1": 15, "2": 18, "3": 25, "4": 30, "5": 12 } },
    { level: 10, costOdds: { "1": 5, "2": 10, "3": 20, "4": 40, "5": 25 } },
    { level: 11, costOdds: { "1": 1, "2": 2, "3": 12, "4": 50, "5": 35 } }
  ],
  units: [
    { name: "Alistar", cost: 1 },
    { name: "Dr. Mundo", cost: 1 },
    { name: "Jax", cost: 1 },
    { name: "Kindred", cost: 1 },
    { name: "Kog'Maw", cost: 1 },
    { name: "Morgana", cost: 1 },
    { name: "Nidalee", cost: 1 },
    { name: "Poppy", cost: 1 },
    { name: "Seraphine", cost: 1 },
    { name: "Shaco", cost: 1 },
    { name: "Sylas", cost: 1 },
    { name: "Vi", cost: 1 },
    { name: "Zyra", cost: 1 },
    { name: "Darius", cost: 2 },
    { name: "Ekko", cost: 2 },
    { name: "Graves", cost: 2 },
    { name: "Illaoi", cost: 2 },
    { name: "Jhin", cost: 2 },
    { name: "LeBlanc", cost: 2 },
    { name: "Naafiri", cost: 2 },
    { name: "Rhaast", cost: 2 },
    { name: "Shyvana", cost: 2 },
    { name: "Skarner", cost: 2 },
    { name: "Twisted Fate", cost: 2 },
    { name: "Vayne", cost: 2 },
    { name: "Veigar", cost: 2 },
    { name: "Braum", cost: 3 },
    { name: "Draven", cost: 3 },
    { name: "Elise", cost: 3 },
    { name: "Fiddlesticks", cost: 3 },
    { name: "Galio", cost: 3 },
    { name: "Gragas", cost: 3 },
    { name: "Jarvan IV", cost: 3 },
    { name: "Jinx", cost: 3 },
    { name: "Mordekaiser", cost: 3 },
    { name: "Rengar", cost: 3 },
    { name: "Senna", cost: 3 },
    { name: "Varus", cost: 3 },
    { name: "Yuumi", cost: 3 },
    { name: "Annie", cost: 4 },
    { name: "Aphelios", cost: 4 },
    { name: "Brand", cost: 4 },
    { name: "Cho'Gath", cost: 4 },
    { name: "Leona", cost: 4 },
    { name: "Miss Fortune", cost: 4 },
    { name: "Neeko", cost: 4 },
    { name: "Sejuani", cost: 4 },
    { name: "Vex", cost: 4 },
    { name: "Xayah", cost: 4 },
    { name: "Zed", cost: 4 },
    { name: "Zeri", cost: 4 },
    { name: "Ziggs", cost: 4 },
    { name: "Aurora", cost: 5 },
    { name: "Garen", cost: 5 },
    { name: "Kobuko", cost: 5 },
    { name: "Renekton", cost: 5 },
    { name: "Samira", cost: 5 },
    { name: "Urgot", cost: 5 },
    { name: "Viego", cost: 5 },
    { name: "Zac", cost: 5 }
  ]
};

// Icon URL helper 
function getIconUrl(name) {
  const specialCases = {
    'Nidalee': 'nidaleecougar',
    'Jarvan IV': 'jarvan'
  };
  if (specialCases[name]) {
    return `https://ap.tft.tools/img/cd14/face/TFT14_${specialCases[name]}.jpg`;
  }
  let urlName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://ap.tft.tools/img/cd14/face/TFT14_${urlName}.jpg`;
}

// Level drop down with search   
const levelSearch = document.getElementById('level-search');
const levelDropdown = document.getElementById('level-dropdown');
const unitInputs = document.getElementById('unit-inputs');

const LEVELS = Array.from({length: 11}, (_, i) => (i+1).toString());
let selectedLevel = null;

function renderLevelDropdown(filter = "") {
  levelDropdown.innerHTML = "";
  const regex = new RegExp(filter, 'i');
  const filtered = LEVELS.filter(lvl => regex.test(lvl));
  filtered.forEach(lvl => {
    const div = document.createElement('div');
    div.className = 'level-option' + (selectedLevel === lvl ? ' selected' : '');
    div.textContent = lvl;
    div.onclick = () => {
      selectedLevel = lvl;
      levelSearch.value = lvl;
      levelDropdown.innerHTML = "";
      updateChart();
    };
    levelDropdown.appendChild(div);
  });
  if (filtered.length === 0) {
    const div = document.createElement('div');
    div.className = 'level-option';
    div.textContent = 'No results';
    levelDropdown.appendChild(div);
  }
}

levelSearch.addEventListener('input', function() {
  renderLevelDropdown(this.value);
});
levelSearch.addEventListener('focus', function() {
  // Select all text and show full list
  this.select();
  renderLevelDropdown("");
});
levelSearch.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const regex = new RegExp(this.value, 'i');
    const filtered = LEVELS.filter(lvl => regex.test(lvl));
    if (filtered.length > 0) {
      selectedLevel = filtered[0];
      levelSearch.value = selectedLevel;
      levelDropdown.innerHTML = "";
      updateChart();
    }
  }
});

levelSearch.addEventListener('mousedown', function(e) {
  // Prevent default focus so we can toggle
  if (levelDropdownOpen) {
    e.preventDefault();
    closeLevelDropdown();
    this.blur();
  }
});

// Unit drop down with search   
const unitSearch = document.getElementById('unit-search');
const unitDropdown = document.getElementById('unit-dropdown');
const costLabel = document.getElementById('cost-label');
const selectedUnitDisplay = document.getElementById('selected-unit-display');
const unitNameLabel = document.getElementById('unit-name-label');

let selectedUnit = null;

unitSearch.value = "";

function renderUnitDropdown(filter = "") {
  unitDropdown.innerHTML = "";
  const regex = new RegExp(filter, 'i');
  const filtered = tftData.units.filter(u => regex.test(u.name));
  filtered.forEach(unit => {
    const div = document.createElement('div');
    div.className = 'unit-option' + (selectedUnit && unit.name === selectedUnit.name ? ' selected' : '');
    div.innerHTML = `<img src="${getIconUrl(unit.name)}">${unit.name}`;
    div.onclick = () => {
      selectedUnit = unit;
      unitSearch.value = unit.name;
      unitDropdown.innerHTML = "";
      updateUnitInputsDisplay();
      updateChart();
    };
    unitDropdown.appendChild(div);
  });
  if (filtered.length === 0) {
    const div = document.createElement('div');
    div.className = 'unit-option';
    div.innerHTML = 'No results';
    unitDropdown.appendChild(div);
  }
}

unitSearch.addEventListener('input', function() {
  renderUnitDropdown(this.value);
});
unitSearch.addEventListener('focus', function() {
  // Select all text and show full list
  this.select();
  renderUnitDropdown("");
});
unitSearch.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const regex = new RegExp(this.value, 'i');
    const filtered = tftData.units.filter(u => regex.test(u.name));
    if (filtered.length > 0) {
      selectedUnit = filtered[0];
      unitSearch.value = selectedUnit.name;
      unitDropdown.innerHTML = "";
      updateUnitInputsDisplay();
      updateChart();
    }
  }
});

unitSearch.addEventListener('mousedown', function(e) {
  if (unitDropdownOpen) {
    e.preventDefault();
    closeUnitDropdown();
    this.blur();
  }
});

function updateUnitInputsDisplay() {
  if (!selectedUnit) {
    unitInputs.style.display = 'none';
    selectedUnitDisplay.innerHTML = "";
    unitNameLabel.textContent = "this unit";
    costLabel.textContent = "";
    return;
  }
  unitInputs.style.display = '';
  selectedUnitDisplay.innerHTML = `<img src="${getIconUrl(selectedUnit.name)}"><span>${selectedUnit.name}</span>`;
  unitNameLabel.textContent = selectedUnit.name;
  costLabel.textContent = selectedUnit.cost;
}

// Set default selected unit and level to none
updateUnitInputsDisplay();

// --- Dropdown collapse on outside click ---
document.addEventListener('click', function(e) {
  if (!unitDropdown.contains(e.target) && e.target !== unitSearch) {
    closeUnitDropdown();
  }
  if (!levelDropdown.contains(e.target) && e.target !== levelSearch) {
    closeLevelDropdown();
  }
});

// Chart.js setup 
const ctx = document.getElementById('prob-chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets: [{
      label: "Probability of getting at least x units",
      data: [0,0,0,0,0,0,0,0,0],
      backgroundColor: '#7ec7e6',
      borderRadius: 6
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) { return (value*100).toFixed(0) + '%'; }
        },
        grid: { color: '#2e3347' }
      },
      x: {
        grid: { color: '#2e3347' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return (context.parsed.y*100).toFixed(2) + '%';
          }
        },
        bodyFont: { size: 16 }
      }
    },
    animation: {
      duration: 700,
      easing: 'easeOutQuart'
    }
  }
});

// Markov Chain calc
function getCostProb(level, cost) {
  const odds = tftData.odds.find(o => o.level === Number(level));
  if (!odds) return 0;
  return (odds.costOdds[String(cost)] || 0) / 100;
}

function getPoolSize(cost) {
  const c = tftData.costs.find(x => x.cost === Number(cost));
  return c ? c.poolSize : 0;
}

function getDistinctChamps(cost) {
  return tftData.units.filter(u => u.cost === Number(cost)).length;
}

function getTransitionProb(cost, level, a, b) {
  const poolSize = getPoolSize(cost);
  const distinct = getDistinctChamps(cost);
  const howManyLeft = Math.max(0, poolSize - a);
  const totalPool = poolSize * distinct - b;
  return getCostProb(level, cost) * (howManyLeft / totalPool);
}

function getTransitionMatrix(cost, level, a, b) {
  const mat = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      if (i === 9 && j === 9) {
        row.push(1);
        continue;
      }
      const p = getTransitionProb(cost, level, a + i, b + i);
      if (j === i) row.push(1 - p);
      else if (j === i + 1) row.push(p);
      else row.push(0);
    }
    mat.push(row);
  }
  return mat;
}

function multiply(a, b) {
  const aRows = a.length, aCols = a[0].length, bCols = b[0].length;
  const m = Array.from({length: aRows}, () => Array(bCols).fill(0));
  for (let r = 0; r < aRows; ++r) {
    for (let c = 0; c < bCols; ++c) {
      for (let i = 0; i < aCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function power(mat, n) {
  let result = mat;
  for (let i = 1; i < n; i++) {
    result = multiply(result, mat);
  }
  return result;
}

function getProbs(cost, level, a, b, gold) {
  if (gold === 0) return Array(2).fill(Array(10).fill(0));
  const mat = power(getTransitionMatrix(cost, level, a, b), 5 * Math.floor(gold / 2));
  const pprob = mat[0];
  let cprob = [1];
  for (let i = 1; i < 10; i++) {
    let p = 1;
    for (let j = 0; j < i; j++) {
      p -= pprob[j];
    }
    cprob.push(Number(p.toFixed(4)));
  }
  return [pprob, cprob];
}

// UI update logic 
function updateChart() {
  if (!selectedUnit || !selectedLevel) {
    chart.data.datasets[0].data = [0,0,0,0,0,0,0,0,0];
    chart.update();
    document.getElementById('gold-2star-info').textContent = '';
    return;
  }
  const level = Number(selectedLevel);
  const cost = selectedUnit.cost;
  const a = Number(document.getElementById('copies-out').value);
  const b = Number(document.getElementById('pool-out').value);
  const gold = Number(document.getElementById('gold').value);
  const cprob = getProbs(cost, level, a, b, gold)[1].slice(1, 10);
  chart.data.datasets[0].data = cprob;
  chart.update();

  // Compute minimum gold for >=3 copies with >=80% probability (2-star)
  let minGold2 = null;
  for (let g = 0; g <= 200; g += 1) {
    const prob = getProbs(cost, level, a, b, g)[1][3];
    if (prob >= 0.8) {
      minGold2 = g;
      break;
    }
  }
  // Compute minimum gold for >=9 copies with >=80% probability (3-star)
  let minGold3 = null;
  for (let g = 0; g <= 200; g += 1) {
    const prob = getProbs(cost, level, a, b, g)[1][9];
    if (prob >= 0.8) {
      minGold3 = g;
      break;
    }
  }
  const infoDiv = document.getElementById('gold-2star-info');
  let infoText = '';
  if (minGold2 !== null) {
    infoText += `<span>Gold required for 80% chance of 2-star (3+ copies): ${minGold2}</span>`;
  } else {
    infoText += `<span>Gold required for 80% chance of 2-star (3+ copies): \u2265200</span>`;
  }
  if (minGold3 !== null) {
    infoText += `<span>Gold required for 80% chance of 3-star (9+ copies): ${minGold3}</span>`;
  } else {
    infoText += `<span>Gold required for 80% chance of 3-star (9+ copies): \u2265200</span>`;
  }
  infoDiv.innerHTML = infoText;
}

// Debounce utility
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedUpdateChart = debounce(updateChart, 250);

['copies-out', 'pool-out', 'gold'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('focus', function() {
    this.select();
  });
  el.addEventListener('input', debouncedUpdateChart);
});

// Initial chart
updateChart();

let levelDropdownOpen = false;
let unitDropdownOpen = false;

function openLevelDropdown() {
  renderLevelDropdown("");
  levelSearch.classList.add('open');
  levelDropdownOpen = true;
}
function closeLevelDropdown() {
  levelDropdown.innerHTML = "";
  levelSearch.classList.remove('open');
  levelDropdownOpen = false;
}
function openUnitDropdown() {
  renderUnitDropdown("");
  unitSearch.classList.add('open');
  unitDropdownOpen = true;
}
function closeUnitDropdown() {
  unitDropdown.innerHTML = "";
  unitSearch.classList.remove('open');
  unitDropdownOpen = false;
}

levelSearch.addEventListener('focus', function() {
  this.select();
  openLevelDropdown();
});
levelSearch.addEventListener('blur', function() {
  setTimeout(closeLevelDropdown, 150);
});
unitSearch.addEventListener('focus', function() {
  this.select();
  openUnitDropdown();
});
unitSearch.addEventListener('blur', function() {
  setTimeout(closeUnitDropdown, 150);
}); 