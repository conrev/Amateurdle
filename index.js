const COLUMN_SIZE = 5;
const ROW_SIZE = 6;

const wordRows = document.querySelectorAll('.board-row');
let rowPointer = 0;
let columnPointer = 0;
let rowWord = '';

const updateCellValue = (rowPointer, columnPointer, keys) => {
  wordRows[rowPointer].children[columnPointer].innerHTML = keys;
};

const updateCellStatus = (rowPointer, columnPointer, status) => {
  const cell = wordRows[rowPointer].children[columnPointer];
  if (status === 'CORRECT') {
    console.log('correct');
    cell.classList.add('green-bg');
  } else if (status === 'PARTIAL') {
    cell.classList.add('yellow-bg');
  }
};

const isValidKey = (keys) => /^[a-zA-Z]$/.test(keys);

const isWithinBoundary = (x, lowerBound, upperBound) => {
  return x >= lowerBound && x <= upperBound;
};

const updateWord = (op, key) => {
  if (op === 'DELETE')
    rowWord = rowWord.substring(0, rowWord.length - 1);
  else {
    rowWord += key;
  }
  console.log(rowWord);
};

const wordTest = (rowWord, targetWord) => {
  for (let i = 0; i < targetWord.length; i++) {
    if (rowWord[i] === targetWord[i])
      updateCellStatus(rowPointer, i, 'CORRECT');
    else if (targetWord.includes(rowWord[i]))
      updateCellStatus(rowPointer, i, 'PARTIAL');
  }
  console.log(rowWord, targetWord);
  return rowWord === targetWord;
};

const registerKeyboardInput () => {
    document.addEventListener('keyup', (evt) => {
        if (evt.key === 'Backspace' && rowWord != '') {
          updateCellValue(rowPointer, rowWord.length - 1, '');
          updateWord('DELETE', '');
        } else if (evt.key === 'Enter') {
          if (rowWord.length !== COLUMN_SIZE) return;
    
          if (wordTest(rowWord.toUpperCase(), 'ASDFG')) alert('tada!');
          if (rowPointer < ROW_SIZE - 1) {
            rowWord = '';
            rowPointer++;
          }
        } else if (isValidKey(evt.key) && rowWord.length < ROW_SIZE - 1) {
          updateWord('UPDATE', evt.key);
          updateCellValue(rowPointer, rowWord.length - 1, evt.key);
        }
      });
}

const init = () => {
    registerKeyboardInput();
};

init();
