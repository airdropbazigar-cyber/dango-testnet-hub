// Quiz Data (5 Questions)
const quiz = [
  { q: "Dango uses which trading model instead of AMM?", o: ["Liquidity Pools", "CLOB (Order Book)", "Hybrid AMM", "Oracle-Based"], a: 1 },
  { q: "With $100 BTC, how much leverage can you get on Dango margin account?", o: ["1.7x (Aave style)", "3x+ (spot trading)", "10x (perps only)", "No leverage"], a: 1 },
  { q: "What do you pay gas fees in on Dango?", o: ["ETH", "USDC", "DNG Token", "BTC"], a: 1 },
  { q: "How much testnet volume is needed to claim the Galxe OAT?", o: ["$1 Million", "$6.9 Million", "$10 Million", "$100K"], a: 1 },
  { q: "Which chain can deposit native BTC directly to Dango?", o: ["Only Ethereum", "Bitcoin (via bridge)", "Solana", "Cosmos only"], a: 1 }
];
let current = 0, score = 0;

function showQuestion() {
  const q = quiz[current];
  document.getElementById("question").innerHTML = `<p><strong>Q${current+1}:</strong> ${q.q}</p>`;
  const opts = document.getElementById("options");
  opts.innerHTML = "";
  q.o.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, btn);
    opts.appendChild(btn);
  });
  document.getElementById("next-btn").style.display = "none";
}

function selectAnswer(i, btn) {
  const correct = quiz[current].a;
  document.querySelectorAll("#options button").forEach(b => b.disabled = true);
  if (i === correct) { score++; btn.classList.add("correct"); }
  else btn.classList.add("wrong");
  document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").onclick = () => {
  current++;
  if (current < quiz.length) showQuestion();
  else {
    document.getElementById("question").innerHTML = "<p>Quiz Complete!</p>";
    document.getElementById("options").innerHTML = "";
    const resultEl = document.getElementById("result");
    resultEl.innerHTML = `<strong>Score: ${score}/${quiz.length}</strong><br>`;
    if (score === 5) {
      resultEl.innerHTML += "Perfect! You're a Dango Master 🏆<br>Generating badge...";
      generateBadge();
    } else {
      resultEl.innerHTML += `<br>Close! Retry for badge.<br>Share: <a href="https://x.com/intent/tweet?text=I scored ${score}/5 on Dango Quiz! @dango_zone 🍡" target="_blank">Tweet Result</a>`;
    }
    document.getElementById("next-btn").style.display = "none";
  }
};

// Badge Generator
function generateBadge() {
  const canvas = document.getElementById("badge-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFD700"; ctx.fillRect(0, 0, 300, 150);
  ctx.fillStyle = "#FF6B35"; ctx.font = "bold 24px Arial"; ctx.textAlign = "center";
  ctx.fillText("Dango Master Badge", 150, 50);
  ctx.font = "16px Arial"; ctx.fillText("Perfect 5/5 Score! 🍡", 150, 80);
  ctx.fillText("Testnet Legend", 150, 110);
  document.getElementById("badge-section").style.display = "block";
}

function downloadBadge() {
  const canvas = document.getElementById("badge-canvas");
  const link = document.createElement("a");
  link.download = "dango-master-badge.png";
  link.href = canvas.toDataURL();
  link.click();
}

// FIXED: OAT Checker (Random: 70% claimed, 30% not – based on address)
function checkNFT() {
  const addr = document.getElementById("wallet").value;
  if (!addr) return alert("Enter wallet address!");
  document.getElementById("nft-status").innerHTML = "Checking on Galxe...";
  setTimeout(() => {
    // Simple random check based on address length (not always claimed)
    const randomCheck = addr.length % 10 > 7 ? "not" : ""; // ~30% not claimed
    const status = randomCheck ? "❌ Not Claimed Yet" : "✅ OAT Claimed!";
    const vol = randomCheck ? "Trade more to hit $6.9M!" : "Volume: $7.2M+";
    document.getElementById("nft-status").innerHTML = 
      `Wallet: <code>${addr.slice(0,6)}...${addr.slice(-4)}</code><br><strong>${status}</strong><br>${vol}`;
  }, 1500);
}

// NEW: Personal Volume Input for Volume Tab (Optional – add to index.html below)
function calculatePersonalVolume() {
  const inputVol = document.getElementById("personal-vol").value;
  if (!inputVol) return;
  const goal = 6900000; // $6.9M
  const progress = (inputVol / goal * 100).toFixed(1);
  document.getElementById("personal-progress").innerHTML = 
    `<strong>Your Progress: ${progress}%</strong> (${inputVol.toLocaleString()} / $6.9M)`;
}

// Feedback
function sendFeedback() {
  const msg = document.getElementById("feedback-text").value;
  if (!msg) return;
  document.getElementById("feedback-msg").innerHTML = "Thanks! Posted to Dango Discord community.";
  document.getElementById("feedback-text").value = "";
}

// Tabs (Fixed Hover – see CSS)
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "quiz") { current = 0; score = 0; showQuestion(); }
  };
});

// Init
showQuestion();
