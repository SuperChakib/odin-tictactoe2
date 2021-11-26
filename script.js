//// add _ for private

////global game data
const GameData = (() => {
  let array = new Array(9);
  const getArray = () => array;
  const update = (index, value) => (array[index] = value);
  const reset = () => (array = new Array(9));
  return { getArray, update, reset };
})();

////game flow
const GameFlow = (() => {
  let computerMode = true;
  const toggleGameMode = () => (computerMode = !computerMode);
  const players = {
    player1: Player("Player 1", "X"),
    player2: Player("Player 2", "O"),
  };
  let round = 1;
  function tickBox(e) {
    let index = Number(e.target.id);
    if (!e.target.textContent)
      !computerMode ? vsHuman(index) : vsComputer(index);
  }
  function vsHuman(index) {
    let currentPlayer = round % 2 !== 0 ? players.player1 : players.player2;
    currentPlayer.addMark(index);
    GameData.update(index, currentPlayer.getMark());
    Display.value(index, currentPlayer.getMark());
    round++;
    if (won(currentPlayer.getPastMarks())) Display.end("win", currentPlayer);
    else if (currentPlayer.getPastMarks().length === 5)
      Display.end("tie", currentPlayer);
  }
  function vsComputer(index) {
    let currentPlayer = round % 2 !== 0 ? players.player1 : players.player2;
    let PCPlayer = round % 2 === 0 ? players.player1 : players.player2;
    currentPlayer.addMark(index);
    GameData.update(index, currentPlayer.getMark());
    Display.value(index, currentPlayer.getMark());
    console.log(won(currentPlayer.getPastMarks()));
    if (won(currentPlayer.getPastMarks())) Display.end("win", currentPlayer);
    else if (currentPlayer.getPastMarks().length === 5)
      Display.end("tie", currentPlayer);
    let index2 = 0;
    while (
      currentPlayer.getPastMarks().length < 5 &&
      GameData.getArray()[index2]
    ) {
      index2 = Math.floor(Math.random() * 9);
    }
    PCPlayer.addMark(index2);
    GameData.update(index2, PCPlayer.getMark());
    Display.value(index2, PCPlayer.getMark());
    round += 2;
    if (won(PCPlayer.getPastMarks())) Display.end("win", PCPlayer);
    else if (PCPlayer.getPastMarks().length === 5) Display.end("tie", PCPlayer);
  }
  function won(pastMarks) {
    let solutions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < 8; i++) {
      let triplet = solutions[i];
      if (triplet.every((digit) => pastMarks.includes(digit))) return true;
    }
    return false;
  }
  function resetAll() {
    GameData.reset();
    players.player1.reset();
    players.player2.reset();
    Display.reset();
  }
  function newName(e) {
    let newName = e.target.value;
    let oldName = e.target.id;
    if (!newName) newName = `${stdName(oldName)}`;
    players[oldName].setName(newName);
  }
  const stdName = (badName) =>
    badName[0].toUpperCase() + badName.slice(1, 6) + " " + badName[6];
  return { tickBox, resetAll, newName, toggleGameMode };
})();

////display DOM
const Display = (() => {
  let gameBoard = document.querySelector("#gameBoard");
  for (let i = 0; i < 9; i++) {
    let box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("id", i);
    box.addEventListener("click", GameFlow.tickBox); /* 1 link */
    gameBoard.appendChild(box);
  }
  let boxes = document.querySelectorAll(".box");
  let resetBtn = document.querySelector("#reset");
  resetBtn.addEventListener("click", GameFlow.resetAll); /* 1 link */
  let results = document.querySelector("#results");
  function value(index, mark) {
    let box = document.getElementById(`${index}`);
    box.textContent = mark;
  }
  function reset() {
    boxes.forEach((box) => {
      box.textContent = "";
      box.addEventListener("click", GameFlow.tickBox); /* 1 link */
      results.textContent = "";
    });
  }
  function end(outcome, player) {
    outcome === "win"
      ? (results.textContent = `${player.getName()} won!`)
      : (results.textContent = "It's a tie!");
    boxes.forEach((box) =>
      box.removeEventListener("click", GameFlow.tickBox)
    ); /* 1 link */
  }
  let players = document.querySelectorAll("input");
  players.forEach((player) =>
    player.addEventListener("change", GameFlow.newName)
  );
  return { value, reset, end };
})();

////players
function Player(name, mark) {
  let pastMarks = [];
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const getMark = () => mark;
  const addMark = (index) => pastMarks.push(index);
  const getPastMarks = () => pastMarks;
  const reset = () => (pastMarks = []);
  return { getName, setName, getMark, addMark, getPastMarks, reset };
}
