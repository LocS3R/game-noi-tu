const currentText = document.getElementById("wordDisplay");
const gameContainer = document.getElementById("game");
const btn_new = document.getElementById("btn-AccNew");
var notify = document.querySelector(".modal");
var notifyTime = document.querySelector(".modal-time");
let currentWord = "sức khỏe";
const texts = [];
const haveTexts = [];
const input = document.getElementById("wordInput");
const tryAgain = document.getElementById("btn-ok");
const tryAgainTime = document.getElementById("btn-ok-time");
// Lấy tham chiếu đến phần tử thông báo
const notification = document.getElementById("notification");
const notificationSound = document.getElementById("notificationSound");
const countdownDisplay = document.getElementById("countdown");
const pauseResumeButton = document.getElementById("btn-pauseResumeButton");
// const backgroundMusic = document.getElementById("backgroundMusic");
// let musicStarted = false;

// // Phát nhạc nền khi người dùng tương tác với trang
// document.addEventListener("click", () => {
//   if (!musicStarted) {
//     backgroundMusic.play();
//     musicStarted = true;
//   }
// });
let timeLeft = 20; // Thời gian đếm ngược ban đầu (300 giây = 5 phút)
let countdownInterval;
let noti = "";
let isPaused = false;
// Hiển thị thông báo
fetch("./tudien.txt")
  .then((response) => response.text())
  .then((data) => {
    const lines = data.split("\n");
    for (const line of lines) {
      try {
        const parsedLine = JSON.parse(line);
        const text = parsedLine.text;

        let str = text;
        let spaceCount = str.split(" ").length - 1;
        if (spaceCount == 1) {
          // console.log(text + " " + text.length);
          texts.push(text);
        }
      } catch (error) {
        console.error("Lỗi khi phân tích dòng:", error);
      }
    }
  })
  .catch((error) => {
    console.error("Lỗi khi gọi API:", error);
  });
function startCountdown() {
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  countdownDisplay.textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (timeLeft <= 0) {
    clearInterval(countdownInterval);
    notifyTime.style.display = "flex";
    timeLeft = 20;
  }
  if (isPaused == false) {
    timeLeft--;
  }
}
function init() {
  let randomIndex = Math.floor(Math.random() * texts.length);

  // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
  let randomString = texts[randomIndex];
  currentWord = randomString;
  updateWordDisplay();
}
window.onload = function () {
  startCountdown();
  init();
};
pauseResumeButton.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    pauseResumeButton.innerHTML = `<i class="icon fa-solid fa-pause"></i>`;
  } else {
    isPaused = true;
    pauseResumeButton.innerHTML = ` <i class="icon fa-solid fa-play"></i>`;
  }
});
function showNotification() {
  notification.textContent = noti;
  notification.classList.add("show");
  notification.classList.remove("hide");

  setTimeout(hideNotification, 2000); // Sau 5 giây gọi hàm ẩn thông báo
}

// Ẩn thông báo
function hideNotification() {
  notification.classList.remove("show");
  notification.classList.add("hide");
}

// Gọi hàm hiển thị thông báo sau khi trang tải xong

function submitWord() {
  const newWord = input.value.toLowerCase();
  let Clone = currentWord;
  let lastWordOfCurrentWord = Clone.split(" ").pop();
  let spaceCountOfNew = newWord.split(" ").length - 1;
  if (spaceCountOfNew < 1) {
    noti = "Câu trả lời phải có 2 từ";
    showNotification();
  } else {
    let havedText = haveTexts.some((str) => str === newWord);
    if (havedText) {
      noti = `${newWord} đã nhập rồi`;
      showNotification();
    } else {
      if (newWord.startsWith(lastWordOfCurrentWord)) {
        let isWordInArray = texts.some((element) => element === newWord);
        if (isWordInArray) {
          timeLeft = 20;
          haveTexts.push(newWord);
          let pos = newWord.split(" ").pop();
          let strRes = texts.filter((str) => str.startsWith(pos + " "));
          console.log(strRes);
          if (strRes && strRes.length != 0) {
            console.log("show");
            let randomIndex = Math.floor(Math.random() * strRes.length);
            // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
            let randomString = strRes[randomIndex];
            currentWord = randomString;
            // updateWordDisplay();
            currentText.textContent = `Từ hiện tại: ${currentWord}`;
          } else {
            notificationSound.play();
            console.log("Tôi thua rồi. Bạn giỏi trò này thật");
            notify.style.display = "flex";
          }
          // currentWord = strRes[randomIndex];
          // updateWordDisplay();
        } else {
          //   console.log(currentWord + "==" + newWord);
          noti = `\"${newWord}\" không có trong từ điển.`;
          showNotification();
          // alert(`${newWord} không có trong từ điển.`);
        }
      } else {
        console.log(currentWord);
        noti = `"Từ mới phải bắt đầu bằng chữ cái cuối cùng của từ hiện tại!"`;
        showNotification();
        // alert(
        //   "Từ mới phải bắt đầu bằng chữ cái cuối cùng của từ hiện tại!"
        // );
      }
    }
  }
  input.value = ""; // Xoá nội dung ô nhập
}
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    submitWord();
  }
});
tryAgain.addEventListener("click", () => {
  notify.style.display = "none";
  let randomIndex = Math.floor(Math.random() * texts.length);

  // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
  let randomString = texts[randomIndex];
  currentWord = randomString;
  updateWordDisplay();
});
tryAgainTime.addEventListener("click", () => {
  notifyTime.style.display = "none";
  timeLeft = 20;
  console.log("time out");
  let randomIndex = Math.floor(Math.random() * texts.length);
  // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
  let randomString = texts[randomIndex];
  currentWord = randomString;
  updateWordDisplay();
});
btn_new.addEventListener("click", () => {
  let randomIndex = Math.floor(Math.random() * texts.length);

  // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
  let randomString = texts[randomIndex];
  currentWord = randomString;
  updateWordDisplay();
});
function updateWordDisplay() {
  timeLeft = 20;
  clearInterval(countdownInterval);
  startCountdown();
  currentText.textContent = `Từ hiện tại: ${currentWord}`;
}
