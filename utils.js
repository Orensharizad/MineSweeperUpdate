function setTime() {

    ++gTotalSeconds;
    gSecondsLabel.innerHTML = pad(gTotalSeconds % 60);
    gMinutesLabel.innerText = pad(parseInt(gTotalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function renderCell(i, j, value) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}



function getEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine)
                emptyCells.push({ i: i, j: j })
        }
    }
    //* CHOOSE A RANDOM INDEX FROM THAT ARRAY AND RETURN THE CELL ON THAT INDEX
    const randomIdx = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[randomIdx]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function findEmptyCells() {
    const emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine) {
                emptyCells.push({ i: i, j: j })
            }
        }
    }
    return emptyCells
}
