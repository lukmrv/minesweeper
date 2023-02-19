const GRID_SIZE = 9;
const CELL_SIZE = 40;
const BOMBS_NUMBER = 10;
const BOMB = "💣";
const FLAG = "🚩";

let gameState = "idle"; // idle / ongoing / lose / win

const gridContainer = document.getElementById("container");

const createGridLayout = () => {
  gridContainer.style.setProperty("--grid-width", GRID_SIZE);
  gridContainer.style.setProperty("--grid-height", GRID_SIZE);
  gridContainer.style.setProperty("--cell-size", `${CELL_SIZE}px`);
};

const rowHelpers = {
  isSameRow(originalIndex, comparingIndex) {
    return (
      Math.floor(originalIndex / GRID_SIZE) -
        Math.floor(comparingIndex / GRID_SIZE) ===
      0
    );
  },
  isRowAbove(originalIndex, comparingIndex) {
    return (
      Math.floor(originalIndex / GRID_SIZE) -
        Math.floor(comparingIndex / GRID_SIZE) ===
      1
    );
  },
  isRowBelow(originalIndex, comparingIndex) {
    return (
      Math.floor(originalIndex / GRID_SIZE) -
        Math.floor(comparingIndex / GRID_SIZE) ===
      -1
    );
  },
};

const generateEmptyArray = () =>
  Array(GRID_SIZE * GRID_SIZE).fill({ revealed: false, value: null });

const fillArrayWithBombs = (initialArray) => {
  const generateBombPosition = () =>
    Math.floor(Math.random() * initialArray.length);

  for (let i = 0; i < BOMBS_NUMBER; i++) {
    let bombPosition = generateBombPosition();
    while (initialArray[bombPosition].value) {
      bombPosition = generateBombPosition();
    }
    initialArray[bombPosition] = { ...initialArray[bombPosition], value: BOMB };
  }

  return initialArray;
};

const calculateCellNumbers = (array) =>
  array.map((cell, idx, arr) => {
    let cellCount = 0;

    const isBombRight =
      arr[idx + 1]?.value && rowHelpers.isSameRow(idx, idx + 1);
    const isBobmLeft =
      arr[idx - 1]?.value && rowHelpers.isSameRow(idx, idx - 1);

    const isBombTopLeft =
      arr[idx - (GRID_SIZE + 1)]?.value &&
      rowHelpers.isRowAbove(idx, idx - (GRID_SIZE + 1));
    const isBombTop =
      arr[idx - GRID_SIZE]?.value &&
      rowHelpers.isRowAbove(idx, idx - GRID_SIZE);
    const isBombTopRight =
      arr[idx - (GRID_SIZE - 1)]?.value &&
      rowHelpers.isRowAbove(idx, idx - (GRID_SIZE - 1));

    const isBombBottomLeft =
      arr[idx + (GRID_SIZE - 1)]?.value &&
      rowHelpers.isRowBelow(idx, idx + (GRID_SIZE - 1));
    const isBombBottom =
      arr[idx + GRID_SIZE]?.value &&
      rowHelpers.isRowBelow(idx, idx + GRID_SIZE);
    const isBombBottomRight =
      arr[idx + (GRID_SIZE + 1)]?.value &&
      rowHelpers.isRowBelow(idx, idx + (GRID_SIZE + 1));

    if (isBombRight) cellCount += 1;
    if (isBobmLeft) cellCount += 1;

    if (isBombTopLeft) cellCount += 1;
    if (isBombTop) cellCount += 1;
    if (isBombTopRight) cellCount += 1;

    if (isBombBottomRight) cellCount += 1;
    if (isBombBottom) cellCount += 1;
    if (isBombBottomLeft) cellCount += 1;

    if (!cell.value) return { ...cell, value: cellCount };

    return cell;
  });

const drawCells = (cellsArray) =>
  cellsArray.map((cell) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    gridContainer.appendChild(cellDiv);

    if (cell.revealed && cell.value) cellDiv.innerText = cell.value;

    if (cell.value === 1) cellDiv.style.color = "blue";
    if (cell.value === 2) cellDiv.style.color = "green";
    if (cell.value === 3) cellDiv.style.color = "red";
    if (cell.value === 4) cellDiv.style.color = "purple";
    if (cell.value === 5) cellDiv.style.color = "orange";
    if (cell.value === 6) cellDiv.style.color = "orange";
    if (cell.value === 7) cellDiv.style.color = "orange";
    if (cell.value === 8) cellDiv.style.color = "orange";

    return cell;
  });

const revealCells = (cellsArray, cellIndex) => {
  const cell = cellsArray[cellIndex];
  if (cell?.revealed) return cellsArray;

  cell.revealed = true;

  const cellDiv = gridContainer.childNodes[cellIndex];
  cellDiv.classList.add("revealed");
  cellDiv.innerText = cell.value || "";

  if (cell.value === 0) {
    const isRightCell =
      cellsArray[cellIndex + 1] &&
      rowHelpers.isSameRow(cellIndex, cellIndex + 1);
    const isLeftCell =
      cellsArray[cellIndex - 1] &&
      rowHelpers.isSameRow(cellIndex, cellIndex - 1);

    const isTopLeftCell =
      cellsArray[cellIndex - (GRID_SIZE + 1)] &&
      rowHelpers.isRowAbove(cellIndex, cellIndex - (GRID_SIZE + 1));
    const isTopCell =
      cellsArray[cellIndex - GRID_SIZE] &&
      rowHelpers.isRowAbove(cellIndex, cellIndex - GRID_SIZE);
    const isTopRightCell =
      cellsArray[cellIndex - (GRID_SIZE - 1)] &&
      rowHelpers.isRowAbove(cellIndex, cellIndex - (GRID_SIZE - 1));

    const isBottomRightCell =
      cellsArray[cellIndex + (GRID_SIZE + 1)] &&
      rowHelpers.isRowBelow(cellIndex, cellIndex + (GRID_SIZE + 1));
    const isBottomCell =
      cellsArray[cellIndex + GRID_SIZE] &&
      rowHelpers.isRowBelow(cellIndex, cellIndex + GRID_SIZE);
    const isBottomLeftCell =
      cellsArray[cellIndex + (GRID_SIZE - 1)] &&
      rowHelpers.isRowBelow(cellIndex, cellIndex + (GRID_SIZE - 1));

    if (isRightCell) cellsArray = revealCells(cellsArray, cellIndex + 1);
    if (isLeftCell) cellsArray = revealCells(cellsArray, cellIndex - 1);
    if (isTopLeftCell)
      cellsArray = revealCells(cellsArray, cellIndex - (GRID_SIZE + 1));
    if (isTopCell) cellsArray = revealCells(cellsArray, cellIndex - GRID_SIZE);
    if (isTopRightCell)
      cellsArray = revealCells(cellsArray, cellIndex - (GRID_SIZE - 1));
    if (isBottomRightCell)
      cellsArray = revealCells(cellsArray, cellIndex + (GRID_SIZE + 1));
    if (isBottomCell)
      cellsArray = revealCells(cellsArray, cellIndex + GRID_SIZE);
    if (isBottomLeftCell)
      cellsArray = revealCells(cellsArray, cellIndex + (GRID_SIZE - 1));
  }

  return cellsArray;
};

const revealBombs = (cellsArray) => {
  cellsArray.forEach((cell, idx) => {
    const cellDiv = gridContainer.children[idx];
    if (cellDiv.innerText === FLAG && cell.value !== BOMB) {
      cellDiv.classList.add("wrong-flag");
    }
    if (cell.value === BOMB) {
      cellDiv.classList.add("revealed");
      if (cellDiv.innerText !== FLAG) cellDiv.innerText = cell.value;
    }
  });
};

const attachListener = (cellsArray) => {
  const handleClick = (e) => {
    const cellIndex = [...gridContainer.children].indexOf(e.target);
    const isCellFlagged = e.target.innerText === FLAG;
    if (isCellFlagged) return;
    if (cellsArray[cellIndex].value === BOMB) {
      gameState = "lose";
      revealBombs(cellsArray, cellIndex);
    }
    revealCells(cellsArray, cellIndex);
  };

  const handleContextClick = (e) => {
    e.preventDefault();
    if (e.target.innerText === FLAG) {
      e.target.innerText = "";
    } else {
      e.target.innerText = FLAG;
    }
  };

  gridContainer.oncontextmenu = function () {
    if (gameState === "lose") {
      gridContainer.removeEventListener("contextmenu", handleContextClick);
    }
  };
  gridContainer.onclick = function () {
    if (gameState === "lose") {
      gridContainer.removeEventListener("click", handleClick);
    }
  };
  if (gameState === "ongoing" || gameState === "idle") {
    gridContainer.addEventListener("click", handleClick);
    gridContainer.addEventListener("contextmenu", handleContextClick);
  }
};

// init sequence
createGridLayout();
attachListener(
  drawCells(calculateCellNumbers(fillArrayWithBombs(generateEmptyArray())))
);
