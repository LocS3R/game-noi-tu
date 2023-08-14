const currentText = document.getElementById("wordDisplay");
const gameContainer = document.getElementById("game");
const btn = document.getElementById("btnAcc");
const btn_new = document.getElementById("btnAccNew");
let currentWord = "sức khỏe";
const texts = [];
btn.addEventListener("click", function submitWord() {
  const input = document.getElementById("wordInput");
  const newWord = input.value.toLowerCase();
  let Clone = currentWord;
  let lastWordOfCurrentWord = Clone.split(" ").pop();
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
            console.log(text + " " + text.length);
            texts.push(text);
          }
        } catch (error) {
          console.error("Lỗi khi phân tích dòng:", error);
        }
      }
      let spaceCountOfNew = newWord.split(" ").length - 1;
      if (spaceCountOfNew < 1) {
        alert("Câu trả lời phải có 2 từ");
      } else {
        let pos = newWord.split(" ").pop();
        let strRes = texts.filter((str) => str.startsWith(pos));
        let randomIndex = Math.floor(Math.random() * strRes.length);
        if (strRes.length == 0) {
          console.log("Tôi thua rồi. Bạn giỏi trò này thật");
          let randomIndex = Math.floor(Math.random() * texts.length);

          // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
          let randomString = texts[randomIndex];
          currentWord = randomString;
          updateWordDisplay();
        }
        if (newWord.startsWith(lastWordOfCurrentWord)) {
          let isWordInArray = texts.some((element) => element === newWord);
          if (isWordInArray) {
            currentWord = strRes[randomIndex];
            updateWordDisplay();
          } else {
            //   console.log(currentWord + "==" + newWord);
            alert(`${newWord} không có trong từ điển.`);
          }
        } else {
          console.log(currentWord);
          alert("Từ mới phải bắt đầu bằng chữ cái cuối cùng của từ hiện tại!");
        }
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
    });
  input.value = ""; // Xoá nội dung ô nhập
});
btn_new.addEventListener("click", () => {
  let randomIndex = Math.floor(Math.random() * texts.length);

  // Lấy phần tử tương ứng với chỉ số ngẫu nhiên
  let randomString = texts[randomIndex];
  currentWord = randomString;
  updateWordDisplay();
});
function updateWordDisplay() {
  currentText.textContent = `Từ hiện tại: ${currentWord}`;
}
