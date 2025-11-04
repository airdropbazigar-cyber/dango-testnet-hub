let current = 0, score = 0;
const quiz = [
  { q: "Dango uses which trading model?", o: ["AMM", "CLOB", "Hybrid", "Oracle"], a: 1 },
  { q: "Gas fees in?", o: ["ETH", "USDC", "DNG", "BTC"], a: 1 },
  { q: "OAT volume goal?", o: ["$1M", "$6.9M", "$10M", "$100K"], a: 1 },
  { q: "Native BTC deposit?", o: ["No", "Yes via bridge", "Only wrapped", "Solana"], a: 1 },
  { q: "Block time?", o: ["1s", "0.5s", "10s", "400ms"], a: 1 }
];

// Search Function (Triggers Volume + NFT)
async function searchAddress() {
  const addr = document.getElementById('search-input').value.trim();
  if (!addr) return alert('Enter address!');
  document.getElementById('results-section').style.display = 'flex';
  await fetchRealVolume(addr);
  await checkNFT(addr);
}

// Real Volume (Dango Celo Testnet RPC)
async function fetchRealVolume(addr) {
  document.getElementById('volume-loading').style.display = 'block';
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const block = await provider.getBlockNumber();
    const txs = await provider.getHistory(addr, 0, block, 100); // Last 100 txs
    const estimatedVolume = txs.length * 1000; // Avg $1K/trade estimate
    const progress = (estimatedVolume / 6900000 * 100).toFixed(1);
    document.getElementById('volume-result').innerHTML = `Real Volume: $${(estimatedVolume / 1000000).toFixed(2)}M<br>Progress: ${progress}% to $6.9M<br>Txs: ${txs.length}`;
  } catch (e) {
    document.getElementById('volume-result').innerHTML = `Error: ${e.message}`;
  }
  document.getElementById('volume-loading').style.display = 'none';
}

// Real NFT Check (Galxe OAT Polygon)
async function checkNFT(addr) {
  document.getElementById('nft-loading').style.display = 'block';
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY'); // Replace key
    const contract = new ethers.Contract('0x5D666F215a85B87Cb042D59662A7ecd2C8Cc44e6', ['function balanceOf(address) view returns (uint256)'], provider);
    const balance = await contract.balanceOf(addr);
    const status = balance > 0 ? '✅ Claimed!' : '❌ Not Claimed – Trade more!';
    document.getElementById('nft-result').innerHTML = `${status}<br>Balance: ${balance}`;
  } catch (e) {
    document.getElementById('nft-result').innerHTML = `Error: ${e.message} (Check Infura key)`;
  }
  document.getElementById('nft-loading').style.display = 'none';
}

// Bottom Buttons (Mock Actions)
function tradeAction() { alert('Trade: Open CLOB DEX'); }
function convertAction() { alert('Convert: Swap tokens'); }
function transferAction() { alert('Transfer: Send assets'); }
function subaccountAction() { alert('Subaccount: Manage accounts'); }
function settingsAction() { alert('Settings: UX options'); }
function addAction() { alert('Add: New applet'); }

// Quiz Functions
function openQuiz() { document.getElementById('quiz-modal').style.display = 'flex'; showQuestion(); }
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
  [...document.querySelectorAll('#options button')].forEach(b => b.disabled = true);
  if (i === correct) score++; else btn.classList.add('wrong');
  if (i === correct) btn.classList.add('correct');
  document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
  current++;
  if (current < quiz.length) showQuestion();
  else {
    document.getElementById('question').innerHTML = 'Complete!';
    document.getElementById('options').innerHTML = '';
    const res = document.getElementById('result');
    res.innerHTML = `Score: ${score}/5`;
    if (score === 5) {
      res.innerHTML += '<br>Perfect! Badge generated.';
      generateBadge();
    }
    document.getElementById('next-btn').style.display = 'none';
  }
};

function generateBadge() {
  const canvas = document.getElementById('badge-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 300, 150);
  ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'center';
  ctx.fillText('Dango Master', 150, 50);
  ctx.font = '16px Inter'; ctx.fillText('5/5 Quiz | 🍡', 150, 80);
  canvas.style.display = 'block';
  document.getElementById('download-badge').style.display = 'block';
}

function downloadBadge() {
  const canvas = document.getElementById('badge-canvas');
  const link = document.createElement('a');
  link.download = 'dango-badge.png';
  link.href = canvas.toDataURL();
  link.click();
}
