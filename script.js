let current = 0, score = 0;
const quiz = [
  { q: "Dango uses CLOB, not AMM?", o: ["True", "False"], a: 0 },
  { q: "Gas paid in USDC?", o: ["Yes", "No"], a: 0 },
  { q: "OAT needs $6.9M volume?", o: ["Yes", "No"], a: 0 },
  { q: "Native BTC deposit?", o: ["Yes", "No"], a: 0 },
  { q: "Block time 0.5s?", o: ["Yes", "No"], a: 0 }
];

async function searchAddress() {
  const addr = document.getElementById('search-input').value.trim();
  if (!addr) return alert("Enter address!");
  document.getElementById('results').style.display = 'flex';
  await fetchVolume(addr);
  await checkNFT(addr);
}

async function fetchVolume(addr) {
  document.getElementById('volume-loading').style.display = 'block';
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const txs = await provider.getHistory(addr, 0, 'latest', 50);
    const volume = txs.length * 1000;
    document.getElementById('volume-result').innerHTML = 
      `<strong>$${volume.toLocaleString()}</strong> (est. ${txs.length} trades)`;
  } catch (e) {
    document.getElementById('volume-result').innerHTML = "Error: " + e.message;
  }
  document.getElementById('volume-loading').style.display = 'none';
}

async function checkNFT(addr) {
  document.getElementById('nft-loading').style.display = 'block';
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY');
    const contract = new ethers.Contract('0x5D666F215a85B87Cb042D59662A7ecd2C8Cc44e6', 
      ['function balanceOf(address) view returns (uint256)'], provider);
    const balance = await contract.balanceOf(addr);
    document.getElementById('nft-result').innerHTML = balance > 0 ? "Claimed! 🎖️" : "Not claimed";
  } catch (e) {
    document.getElementById('nft-result').innerHTML = "Error (check key)";
  }
  document.getElementById('nft-loading').style.display = 'none';
}

function openQuiz() {
  document.getElementById('quiz-modal').style.display = 'flex';
  current = 0; score = 0;
  showQuestion();
}
function closeQuiz() { document.getElementById('quiz-modal').style.display = 'none'; }

function showQuestion() {
  const q = quiz[current];
  document.getElementById('question').innerHTML = `<strong>Q${current+1}:</strong> ${q.q}`;
  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, btn);
    opts.appendChild(btn);
  });
  document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(i, btn) {
  const correct = quiz[current].a;
  document.querySelectorAll('#options button').forEach(b => b.disabled = true);
  if (i === correct) { score++; btn.classList.add('correct'); }
  else btn.classList.add('wrong');
  document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
  current++;
  if (current < quiz.length) showQuestion();
  else {
    document.getElementById('question').innerHTML = 'Done!';
    document.getElementById('options').innerHTML = '';
    const res = document.getElementById('result');
    res.innerHTML = `Score: ${score}/5`;
    if (score === 5) {
      res.innerHTML += '<br>Master Badge!';
      generateBadge();
    }
    document.getElementById('next-btn').style.display = 'none';
  }
};

function generateBadge() {
  const canvas = document.getElementById('badge-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, 0, 300, 150);
  ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'center';
  ctx.fillText('Dango Master', 150, 50);
  ctx.font = '16px Inter'; ctx.fillText('5/5 Quiz | 🍡', 150, 80);
  canvas.style.display = 'block';
  document.getElementById('download-badge').style.display = 'block';
}

function downloadBadge() {
  const canvas = document.getElementById('badge-canvas');
  const link = document.createElement('a');
  link.download = 'dango-master.png';
  link.href = canvas.toDataURL();
  link.click();
}

function openFeedback() { document.getElementById('feedback-modal').style.display = 'flex'; }
function closeFeedback() { document.getElementById('feedback-modal').style.display = 'none'; }

function sendFeedback() {
  const msg = document.getElementById('feedback-text').value;
  if (!msg) return alert("Write feedback!");
  const tweet = encodeURIComponent(`${msg} @dango_zone @Dropnigma #DangoTestnet`);
  window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  closeFeedback();
}
