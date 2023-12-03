const COLUMN_SIZE = 5;
const ROW_SIZE = 6;

const wordRows = document.querySelectorAll('.board-row');
const modalPopup = document.querySelector('.modal-container');
const infoContent = document.querySelector('.info-content');
let rowPointer = 0;
let columnPointer = 0;
let rowWord = '';
let wordOfTheDay = '';

const updateCellValue = (rowPointer, columnPointer, keys) => {
  wordRows[rowPointer].children[columnPointer].innerHTML = keys;
};

const updateCellStatus = (rowPointer, columnPointer, status) => {
  const cell = wordRows[rowPointer].children[columnPointer];
  if (status === 'CORRECT') {
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
    if (rowWord.length == COLUMN_SIZE) updateWord('DELETE', '');
    rowWord += key;
  }
};

const wordTest = (rowWord, targetWord) => {
  for (let i = 0; i < targetWord.length; i++) {
    if (rowWord[i] === targetWord[i])
      updateCellStatus(rowPointer, i, 'CORRECT');
    else if (targetWord.includes(rowWord[i]))
      updateCellStatus(rowPointer, i, 'PARTIAL');
  }
  return rowWord === targetWord;
};

const commitAnswer = async () => {
  if (wordTest(rowWord.toLowerCase(), wordOfTheDay));
  if (rowPointer < ROW_SIZE - 1) {
    rowWord = '';
    rowPointer++;
  }
};

const validateAnswer = async () => {
  if (rowWord.length !== COLUMN_SIZE) return false;

  infoContent.classList.add('show');

  let validationResponse = await fetch(
    'https://words.dev-apis.com/validate-word',
    {
      method: 'POST',
      body: JSON.stringify({
        word: rowWord,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  let jsonified = await validationResponse.json();

  infoContent.classList.remove('show');

  if (!jsonified.validWord) {
    modalPopup.classList.add('show');
    setTimeout(() => modalPopup.classList.remove('show'), 2000);
    return false;
  }

  return true;
};

const getDailyWord = async () => {
  const response = await fetch(
    'https://words.dev-apis.com/word-of-the-day'
  );
  const wordInfo = await response.json();

  return wordInfo.word;
};

const registerKeyboardInput = async () => {
  document.addEventListener('keyup', async (evt) => {
    if (evt.key === 'Backspace' && rowWord != '') {
      updateCellValue(rowPointer, rowWord.length - 1, '');
      updateWord('DELETE', '');
    } else if (evt.key === 'Enter') {
      validAnswer = await validateAnswer();
      if (validAnswer) commitAnswer();
    } else if (isValidKey(evt.key)) {
      updateWord('UPDATE', evt.key);
      updateCellValue(rowPointer, rowWord.length - 1, evt.key);
    }
  });
};

const init = async () => {
  wordOfTheDay = await getDailyWord();
  registerKeyboardInput();
};

init();
