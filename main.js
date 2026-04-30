import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TOTAL_ROUNDS = 8;
const STORAGE_KEY = 'guessVN-best-score';
const BASE_URL = import.meta.env.BASE_URL;

function asset(path) {
  return `${BASE_URL}${path}`.replace(/\/+/g, '/');
}

const locations = [
  {
    name: 'Sa Pa',
    region: 'Miền Bắc',
    hint: 'Ruộng bậc thang, núi cao và không khí mát lạnh.',
    fact: 'Vùng núi nổi tiếng của Lào Cai, nhìn vào ảnh rất dễ thấy chất cao nguyên.',
    lat: 22.3364,
    lng: 103.8438,
    difficulty: 'Khó',
    photoUrl: asset('locations/sa-pa.jpg'),
    photoTitle: 'Rice Terraces in Sa Pa, Vietnam',
    photoCredit: 'Christopher Crouzet',
    photoLicense: 'CC BY 2.0',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Vịnh Hạ Long',
    region: 'Miền Bắc',
    hint: 'Biển xanh, đảo đá vôi và cảnh quan vịnh đặc trưng.',
    fact: 'Một trong những hình ảnh biểu tượng nhất của miền Bắc ven biển.',
    lat: 20.9101,
    lng: 107.1839,
    difficulty: 'Khó',
    photoUrl: asset('locations/ha-long.jpg'),
    photoTitle: 'Fishermen at Ha Long Bay, Vietnam',
    photoCredit: 'fotopamas',
    photoLicense: 'CC BY 2.0',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Hội An',
    region: 'Miền Trung',
    hint: 'Phố cổ, mái ngói thấp và không khí rất riêng của miền di sản.',
    fact: 'Thành phố cổ ven sông với nét du lịch và dân sinh đan xen rõ rệt.',
    lat: 15.8801,
    lng: 108.338,
    difficulty: 'Khó',
    photoUrl: asset('locations/hoi-an.jpg'),
    photoTitle: 'Rice Farmer in Hoi An, Vietnam',
    photoCredit: 'Christopher Crouzet',
    photoLicense: 'CC BY 2.0',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Huế',
    region: 'Miền Trung',
    hint: 'Sông nước, kiến trúc cổ và nhịp điệu chậm hơn các đô thị lớn.',
    fact: 'Kinh đô cũ với lớp cảnh quan lịch sử rất rõ trong ảnh tư liệu.',
    lat: 16.4637,
    lng: 107.5909,
    difficulty: 'Trung bình',
    photoUrl: asset('locations/hue.jpg'),
    photoTitle: 'Hue, Vietnam 2017',
    photoCredit: 'Eric Seneca Kim',
    photoLicense: 'Public Domain',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Đà Nẵng',
    region: 'Miền Trung',
    hint: 'Một thành phố biển lớn, hiện đại nhưng vẫn gần mặt nước và cảng biển.',
    fact: 'Dấu vết đô thị, hàng hải và ven biển tạo ra cảm giác rất khác.',
    lat: 16.0544,
    lng: 108.2022,
    difficulty: 'Dễ',
    photoUrl: asset('locations/da-nang.jpg'),
    photoTitle: 'Marine in Da Nang, Vietnam, August 1965',
    photoCredit: 'Unknown Photographer / NARA',
    photoLicense: 'Public Domain',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Nha Trang',
    region: 'Miền Trung',
    hint: 'Đường bờ biển rõ, ánh sáng mạnh và vibe du lịch biển rất dễ nhận ra.',
    fact: 'Thành phố ven biển miền Trung Nam có mật độ du lịch và bờ biển cao.',
    lat: 12.2388,
    lng: 109.1967,
    difficulty: 'Dễ',
    photoUrl: asset('locations/nha-trang.jpg'),
    photoTitle: 'Nha Trang, Vietnam',
    photoCredit: 'cloud.shepherd',
    photoLicense: 'CC BY 2.0',
    photoSource: 'Flickr/Openverse'
  },
  {
    name: 'Cần Thơ',
    region: 'Miền Nam',
    hint: 'Mặt nước, cầu, nhịp sống đô thị miền Tây và không gian thấp.',
    fact: 'Trung tâm vùng đồng bằng sông Cửu Long với dấu ấn sông nước rất rõ.',
    lat: 10.0452,
    lng: 105.7469,
    difficulty: 'Trung bình',
    photoUrl: asset('locations/can-tho.jpg'),
    photoTitle: 'Cau quang Trung, Quan Ninh kieu Can tho, Vietnam',
    photoCredit: 'trungydang',
    photoLicense: 'CC BY 3.0',
    photoSource: 'Wikimedia Commons'
  },
  {
    name: 'Phú Quốc',
    region: 'Miền Nam',
    hint: 'Đảo lớn, khí hậu biển và không gian nghỉ dưỡng tách biệt.',
    fact: 'Ảnh trên đảo thường có cảm giác rất khác đất liền, không gian xanh và thoáng.',
    lat: 10.2899,
    lng: 103.984,
    difficulty: 'Khó',
    photoUrl: asset('locations/phu-quoc.jpg'),
    photoTitle: 'Retraite à Phu Quoc Vietnam',
    photoCredit: 'dancingqueen27',
    photoLicense: 'CC BY 2.0',
    photoSource: 'Flickr/Openverse'
  }
];

const state = {
  deck: [],
  roundIndex: 0,
  totalScore: 0,
  currentLocation: null,
  guessMarker: null,
  actualMarker: null,
  line: null,
  guessPoint: null,
  hintLevel: 0,
  guessed: false,
  bestScore: Number(localStorage.getItem(STORAGE_KEY) || 0)
};

const roundLabel = document.getElementById('round-label');
const scoreLabel = document.getElementById('score-label');
const bestLabel = document.getElementById('best-label');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const clueTitle = document.getElementById('clue-title');
const clueText = document.getElementById('clue-text');
const regionChip = document.getElementById('region-chip');
const difficultyChip = document.getElementById('difficulty-chip');
const statusPill = document.getElementById('status-pill');
const hintBtn = document.getElementById('hint-btn');
const clearBtn = document.getElementById('clear-btn');
const guessBtn = document.getElementById('guess-btn');
const nextBtn = document.getElementById('next-btn');
const replayBtn = document.getElementById('replay-btn');
const backdrop = document.getElementById('modal-backdrop');
const resultBadge = document.getElementById('result-badge');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const distanceResult = document.getElementById('distance-result');
const roundScoreResult = document.getElementById('round-score-result');
const totalScoreResult = document.getElementById('total-score-result');
const photoPane = document.getElementById('mystery-photo');
const photoCredit = document.getElementById('photo-credit');

bestLabel.textContent = formatNumber(state.bestScore);

const guessMap = L.map('guess-map', {
  zoomControl: true,
  attributionControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true,
  tap: true,
  touchZoom: true
}).setView([16.3, 107.7], 5.4);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 18,
  detectRetina: true,
  attribution: 'Tiles &copy; Esri, Earthstar Geographics, CNES/Airbus, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
}).addTo(guessMap);

guessMap.on('click', (event) => {
  if (state.guessed) {
    return;
  }

  setGuess(event.latlng);
});

hintBtn.addEventListener('click', () => {
  if (!state.currentLocation || state.guessed) {
    return;
  }

  state.hintLevel = Math.min(2, state.hintLevel + 1);
  renderClue();
});

clearBtn.addEventListener('click', clearGuess);
guessBtn.addEventListener('click', submitGuess);
nextBtn.addEventListener('click', handleNextAction);
replayBtn.addEventListener('click', restartGame);

window.addEventListener('resize', () => {
  guessMap.invalidateSize();
});

restartGame();

function restartGame() {
  state.deck = shuffle(locations.slice());
  state.roundIndex = 0;
  state.totalScore = 0;
  state.guessPoint = null;
  state.currentLocation = null;
  state.guessMarker = null;
  state.actualMarker = null;
  state.line = null;
  state.hintLevel = 0;
  state.guessed = false;

  resetMapArtifacts();
  hideModal();
  updateHud();
  startRound();
}

function startRound() {
  const location = state.deck[state.roundIndex];

  state.currentLocation = location;
  state.hintLevel = 0;
  state.guessed = false;
  state.guessPoint = null;

  resetGuess();
  resetMapArtifacts();

  clueTitle.textContent = `Vòng ${state.roundIndex + 1}: ${location.region}`;
  regionChip.textContent = 'Khu vực: đang ẩn';
  difficultyChip.textContent = `Độ khó: ${location.difficulty}`;
  statusPill.textContent = 'Quan sát';
  progressText.textContent = `Đoán vị trí của ảnh thật thuộc ${location.region}. Càng gần, điểm càng cao.`;

  photoPane.style.backgroundImage = `linear-gradient(180deg, rgba(5, 8, 15, 0.1), rgba(5, 8, 15, 0.4)), url('${location.photoUrl}')`;
  photoCredit.textContent = 'Ảnh thật được tải từ nguồn mở. Ghi nguồn đầy đủ sẽ hiện sau khi chấm vòng.';

  renderClue();
  updateHud();
}

function renderClue() {
  if (!state.currentLocation) {
    return;
  }

  if (state.hintLevel === 0) {
    clueText.textContent = 'Quan sát ảnh thật ở bên trái, rồi đặt ghim trên bản đồ bên phải để đoán vị trí.';
    regionChip.textContent = 'Khu vực: đang ẩn';
  } else if (state.hintLevel === 1) {
    clueText.textContent = state.currentLocation.hint;
    regionChip.textContent = `Khu vực: ${state.currentLocation.region}`;
  } else {
    clueText.textContent = `${state.currentLocation.hint} ${state.currentLocation.fact}`;
    regionChip.textContent = `Khu vực: ${state.currentLocation.region}`;
  }
}

function setGuess(latlng) {
  state.guessPoint = latlng;

  if (state.guessMarker) {
    state.guessMarker.setLatLng(latlng);
  } else {
    state.guessMarker = L.marker(latlng, {
      draggable: true,
      icon: makePin('pin-guess')
    }).addTo(guessMap);

    state.guessMarker.on('drag', (event) => {
      state.guessPoint = event.latlng;
    });
  }

  guessBtn.disabled = false;
  statusPill.textContent = 'Đã đặt ghim';
  pulseScore('+ ghim', '#7da2ff');
}

function clearGuess() {
  if (state.guessMarker) {
    guessMap.removeLayer(state.guessMarker);
    state.guessMarker = null;
  }

  state.guessPoint = null;
  guessBtn.disabled = true;

  if (!state.guessed) {
    statusPill.textContent = 'Sẵn sàng';
  }
}

function submitGuess() {
  if (!state.guessPoint || state.guessed || !state.currentLocation) {
    return;
  }

  state.guessed = true;
  guessBtn.disabled = true;
  hintBtn.disabled = true;
  clearBtn.disabled = true;
  statusPill.textContent = 'Đang chấm';

  const actual = L.latLng(state.currentLocation.lat, state.currentLocation.lng);
  const guess = L.latLng(state.guessPoint.lat, state.guessPoint.lng);
  const distanceKm = haversineKm(actual.lat, actual.lng, guess.lat, guess.lng);
  const roundScore = scoreFromDistance(distanceKm);

  state.totalScore += roundScore;
  animateScore(roundScore);
  updateHud();

  if (state.actualMarker) {
    guessMap.removeLayer(state.actualMarker);
  }

  state.actualMarker = L.marker(actual, {
    icon: makePin('pin-actual')
  }).addTo(guessMap);

  if (state.line) {
    guessMap.removeLayer(state.line);
  }

  state.line = L.polyline([guess, actual], {
    color: '#7af0c6',
    weight: 3,
    opacity: 0.9,
    dashArray: '10 10'
  }).addTo(guessMap);

  const bounds = L.latLngBounds([guess, actual]).pad(0.25);
  guessMap.fitBounds(bounds, { animate: true, maxZoom: 8.5 });

  distanceResult.textContent = `${distanceKm.toFixed(1)} km`;
  roundScoreResult.textContent = formatNumber(roundScore);
  totalScoreResult.textContent = formatNumber(state.totalScore);
  resultBadge.textContent = `Vòng ${state.roundIndex + 1}`;
  resultTitle.textContent = roundScore >= 4300 ? 'Rất sát!' : roundScore >= 2500 ? 'Ổn áp' : 'Còn xa một chút';
  resultText.textContent = `${state.currentLocation.name} nằm ở ${state.currentLocation.region}. ${state.currentLocation.fact}`;

  photoCredit.textContent = `Ảnh: ${state.currentLocation.photoTitle} — ${state.currentLocation.photoCredit} (${state.currentLocation.photoLicense})`;
  showModal();
  nextBtn.textContent = state.roundIndex === TOTAL_ROUNDS - 1 ? 'Xem tổng kết' : 'Tiếp tục';

  const prefix = distanceKm < 3 ? 'Perfect' : distanceKm < 25 ? 'Great' : 'Chưa gần';
  pulseScore(`${prefix} +${formatNumber(roundScore)}`, roundScore >= 3500 ? '#7af0c6' : '#ffcd6d');
}

function advanceRound() {
  hideModal();
  state.roundIndex += 1;

  if (state.roundIndex >= TOTAL_ROUNDS) {
    finishGame();
    return;
  }

  hintBtn.disabled = false;
  clearBtn.disabled = false;
  startRound();
}

function handleNextAction() {
  if (state.roundIndex >= TOTAL_ROUNDS) {
    restartGame();
    return;
  }

  advanceRound();
}

function finishGame() {
  const best = Math.max(state.bestScore, state.totalScore);
  if (best !== state.bestScore) {
    state.bestScore = best;
    localStorage.setItem(STORAGE_KEY, String(best));
  }

  bestLabel.textContent = formatNumber(state.bestScore);
  resultBadge.textContent = 'Tổng kết';
  resultTitle.textContent = pickFinalTitle(state.totalScore);
  resultText.textContent = `Bạn đã hoàn thành ${TOTAL_ROUNDS} vòng với tổng ${formatNumber(state.totalScore)} điểm. Kỷ lục cá nhân hiện tại là ${formatNumber(state.bestScore)} điểm.`;
  distanceResult.textContent = '—';
  roundScoreResult.textContent = '—';
  totalScoreResult.textContent = formatNumber(state.totalScore);
  nextBtn.textContent = 'Chơi lại';
  photoCredit.textContent = 'Ảnh nguồn mở, đầy đủ attribution được hiển thị trong từng vòng bên dưới.';
  showModal();
}

function updateHud() {
  roundLabel.textContent = `${Math.min(state.roundIndex + 1, TOTAL_ROUNDS)} / ${TOTAL_ROUNDS}`;
  scoreLabel.textContent = formatNumber(state.totalScore);
  progressFill.style.width = `${(state.roundIndex / TOTAL_ROUNDS) * 100}%`;
  bestLabel.textContent = formatNumber(state.bestScore);
}

function animateScore(points) {
  const start = Number(scoreLabel.textContent.replace(/\D/g, '')) || 0;
  const end = state.totalScore;
  const duration = 420;
  const startedAt = performance.now();

  function frame(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const value = Math.round(start + (end - start) * easeOutCubic(progress));
    scoreLabel.textContent = formatNumber(value);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
  pulseScore(`+${formatNumber(points)}`, points > 4000 ? '#7af0c6' : '#7da2ff');
}

function showModal() {
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  backdrop.classList.add('hidden');
  backdrop.setAttribute('aria-hidden', 'true');
  hintBtn.disabled = false;
  clearBtn.disabled = false;
}

function resetMapArtifacts() {
  if (state.guessMarker) {
    guessMap.removeLayer(state.guessMarker);
    state.guessMarker = null;
  }

  if (state.actualMarker) {
    guessMap.removeLayer(state.actualMarker);
    state.actualMarker = null;
  }

  if (state.line) {
    guessMap.removeLayer(state.line);
    state.line = null;
  }

  guessMap.setView([16.3, 107.7], 5.4, { animate: false });
  guessBtn.disabled = true;
  clearBtn.disabled = false;
  hintBtn.disabled = false;
  statusPill.textContent = 'Sẵn sàng';
}

function resetGuess() {
  state.guessPoint = null;
  clearGuess();
}

function makePin(type) {
  return L.divIcon({
    className: '',
    html: `<div class="pin-icon ${type}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function pulseScore(text, color) {
  const burst = document.createElement('div');
  burst.className = 'score-burst';
  burst.textContent = text;
  burst.style.color = color;
  burst.style.left = `${Math.max(16, window.innerWidth / 2 - 40)}px`;
  burst.style.top = `${Math.max(16, window.innerHeight * 0.18)}px`;
  document.body.appendChild(burst);

  window.setTimeout(() => burst.remove(), 900);
}

function scoreFromDistance(distanceKm) {
  const closeness = Math.max(0, 1 - distanceKm / 2400);
  return Math.round(5000 * Math.pow(closeness, 1.45));
}

function pickFinalTitle(score) {
  if (score >= 22000) {
    return 'Bậc thầy bản đồ Việt Nam';
  }

  if (score >= 15000) {
    return 'Nhìn phát là biết vùng';
  }

  if (score >= 9000) {
    return 'Ổn, có cảm giác địa lý tốt';
  }

  return 'Còn nhiều map để luyện';
}

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function shuffle(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[randomIndex]] = [list[randomIndex], list[index]];
  }

  return list;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}