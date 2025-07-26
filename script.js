// 🎵 音乐播放逻辑：默认静音，点击后随机播放并顺序循环
const musicList = [
  "assets/music/happy1.mp3",
  "assets/music/happy2.mp3",
  "assets/music/happy3.mp3"
];

const audio = document.getElementById("birthdayMusic");
const muteBtn = document.getElementById("muteToggle");

let currentIndex = Math.floor(Math.random() * musicList.length); // 随机起始
audio.src = musicList[currentIndex];
audio.muted = true; // 默认静音
audio.loop = false; // 关闭单曲循环

let hasStarted = false; // 控制首次播放逻辑

// 用户点击后开始播放，并切换图标
muteBtn.addEventListener("click", () => {
  if (!hasStarted) {
    // 第一次点击：播放音乐
    audio.muted = false;
    audio.play().catch(() => {
      console.log("浏览器阻止了播放");
    });
    muteBtn.textContent = "🔊";
    hasStarted = true;
  } else {
    // 后续点击：切换静音状态
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  }
});

// 当前音乐播放完后播放下一首
audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % musicList.length;
  audio.src = musicList[currentIndex];
  audio.play().catch(() => {
    console.log("播放失败，可能需要再次用户交互");
  });
});

// 🎁 抽奖逻辑：点击按钮抽取奖品，抽完后显示SP神秘大奖视频
const prizePool = {
  A: ['assets/prizes/A/prize1.png'],
  B: ['assets/prizes/B/prize1.png', 'assets/prizes/B/prize2.png'],
  C: ['assets/prizes/C/prize1.png', 'assets/prizes/C/prize2.png', 'assets/prizes/C/prize3.png'],
  D: ['assets/prizes/D/prize1.png', 'assets/prizes/D/prize2.png', 'assets/prizes/D/prize3.png', 'assets/prizes/D/prize4.png'],
  E: ['assets/prizes/E/prize1.png', 'assets/prizes/E/prize2.png', 'assets/prizes/E/prize3.png', 'assets/prizes/E/prize4.png', 'assets/prizes/E/prize5.png']
};

const remaining = JSON.parse(JSON.stringify(prizePool));

const modal = document.getElementById("modal");
const prizeImage = document.getElementById("prizeImage");

// 监听抽奖按钮点击事件
document.querySelectorAll(".prize-btn").forEach(button => {
  button.addEventListener("click", () => {
    const rank = button.getAttribute("data-rank");
    if (!remaining[rank] || remaining[rank].length === 0) return;

    if (confirm(`确定要抽取 ${rank} 赏的奖品吗？`)) {
      const index = Math.floor(Math.random() * remaining[rank].length);
      const prize = remaining[rank][index];

      prizeImage.src = prize;
      modal.classList.remove("hidden");

      remaining[rank].splice(index, 1);

      if (remaining[rank].length === 0) {
        button.disabled = true;
      }

      checkAllDrawn();
    }
  });
});

// 监听模态框关闭按钮点击事件
function closeModal() {
  modal.classList.add("hidden");
}

// 检查是否所有奖品都已抽完
// 如果所有奖品都已抽完，显示SP神秘大奖视频
function checkAllDrawn() {
  const allEmpty = Object.values(remaining).every(arr => arr.length === 0);
  if (allEmpty) {
    // 显示 SP赏按钮
    alert("🎁 恭喜你解锁了SP赏，快点击右下角的彩蛋查看吧！");
    const spBtn = document.getElementById("spButton");
    spBtn.classList.remove("hidden");
  }
}

const spBtn = document.getElementById("spButton");

// 监听 SP 彩蛋按钮点击事件
spBtn.addEventListener("click", () => {
  audio.muted = true; // 点击 SP 彩蛋时静音音乐
  audio.pause(); // 暂停音乐
  muteBtn.textContent = "🔇";
  playSPVideo(); // 播放隐藏视频
});

// 🎥 SP神秘大奖视频播放逻辑
function playSPVideo() {
  const videoOverlay = document.createElement('div');
  videoOverlay.className = "fixed inset-0 bg-black z-50 flex items-center justify-center";

  const video = document.createElement('video');
  video.src = "assets/sp_video.mp4";
  video.controls = true;
  video.autoplay = true;
  video.className = "w-full max-w-2xl rounded";

  const backBtn = document.createElement("button");
  backBtn.textContent = "返回活动页面";
  backBtn.className = "mt-4 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-200";

  backBtn.addEventListener("click", () => {
    document.body.removeChild(videoOverlay);
    if (audio.muted && hasStarted) {
      audio.play().catch(() => {});
    }
  });

  videoOverlay.appendChild(video);
  videoOverlay.appendChild(backBtn);
  document.body.appendChild(videoOverlay);

  /*videoOverlay.appendChild(video);
  document.body.appendChild(videoOverlay);

  video.addEventListener("ended", () => {
    document.body.removeChild(videoOverlay);
  });*/
}
