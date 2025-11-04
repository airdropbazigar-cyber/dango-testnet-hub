// Quiz Data (4 Questions on Dango)
const quiz = [
  {
    q: "Dango uses which trading model instead of AMM?",
    o: ["Liquidity Pools", "CLOB (Order Book)", "Hybrid AMM", "Oracle-Based"],
    a: 1
  },
  {
    q: "With $100 BTC, how much leverage can you get on Dango margin account?",
    o: ["1.7x (Aave style)", "3x+ (spot trading)", "10x (perps only)", "No leverage"],
    a: 1
  },
  {
    q: "What do you pay gas fees in on Dango?",
    o: ["ETH", "USDC", "DNG Token", "BTC"],
    a: 1
  },
  {
    q: "How much testnet volume is needed to claim the Galxe OAT?",
    o: ["$1 Million", "$6.9 Million", "$10 Million", "$100K"],
    a: 1
  },
  {
    q: "Which chain can deposit native BTC directly to Dango?",
    o: ["Only Ethereum", "Bitcoin (via bridge)", "Solana", "Cosmos only"],
    a: 1
  }
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
    if (score === 4) {
      resultEl.innerHTML += "Perfect! You're a Dango Expert 🏆<br>Generating badge...";
      generateBadge();
    } else {
      resultEl.innerHTML += `<br>Close! Retry for badge.<br>Share: <a href="https://x.com/intent/tweet?text=I scored ${score}/4 on Dango Quiz! @dango_zone 🍡" target="_blank">Tweet Result</a>`;
    }
    document.getElementById("next-btn").style.display = "none";
  }
};

// Badge Generator (Perfect Score pe)
function generateBadge() {
  const canvas = document.getElementById("badge-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFD700"; ctx.fillRect(0, 0, 300, 150);
  ctx.fillStyle = "#FF6B35"; ctx.font = "bold 24px Arial"; ctx.textAlign = "center";
  ctx.fillText("Dango Expert Badge", 150, 50);
  ctx.font = "16px Arial"; ctx.fillText("Perfect Quiz Score! 🍡", 150, 80);
  ctx.fillText("Testnet Warrior", 150, 110);
  document.getElementById("badge-section").style.display = "block";
}

function downloadBadge() {
  const canvas = document.getElementById("badge-canvas");
  const link = document.createElement("a");
  link.download = "dango-expert-badge.png";
  link.href = canvas.toDataURL();
  link.click();
}

// NFT Checker (Mock – real wallet check ke liye)
function checkNFT() {
  const addr = document.getElementById("wallet").value;
  if (!addr) return alert("Enter wallet!");
  document.getElementById("nft-status").innerHTML = "Checking...";
  setTimeout(() => {
    document.getElementById("nft-status").innerHTML = `Wallet: <code>${addr.slice(0,6)}...${addr.slice(-4)}</code><br><strong>✅ OAT Eligible!</strong> (Hit $6.9M? Claim now!)`;
  }, 1000);
}

// Feedback (Simple alert)
function sendFeedback() {
  const msg = document.getElementById("feedback-text").value;
  if (!msg) return;
  document.getElementById("feedback-msg").innerHTML = "Thanks! Shared with Dango community.";
  document.getElementById("feedback-text").value = "";
}

// Tabs Switch
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "quiz") { current = 0; score = 0; showQuestion(); }
  };
});

// Start Quiz
showQuestion();
