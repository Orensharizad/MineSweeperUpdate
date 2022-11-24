'use strict'
var gBoard
var gInterval
var gLevelGame = 4
var gOpenCells = 0
var gTotalSeconds = 0;
var gIsFlag = false
var gLivesLeft

const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'

var gSecondsLabel = document.querySelector(".seconds");
var gMinutesLabel = document.querySelector(".minutes");

var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {

    gBoard = createBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    var emoji = document.querySelector('.emoji')
    emoji.innerText = '😀'
    if (gLevel.size === 4) gLivesLeft = 2
    else gLivesLeft = 3
    setRandomMines()

}

function renderBoard(board) {

    var strHTML = ''
    var cellClass
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell = EMPTY
            // var cellClass = (currCell.isMine) ? 'open mine' : 'open '
            if (currCell.isMine) {
                cellClass = 'open mine'
            } else {
                cellClass = 'open'
            }
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            strHTML += `
    <td onmousedown="setFlag(${i},${j},event)" class="cell cell-${i}-${j} ${cellClass}"${cellData}
     onclick="onCellClick(this,${i},${j})">
    ${currCell}
    </td>
    `
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}
function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var eachCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = eachCell
        }
    }

    return board
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                count++

            }
        }
    }

    return count
}


function onCellClick(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (gGame.isOn === false) return
    if (currCell.isShown) return
    if (currCell.isMarked) return
    if (gOpenCells <= 0) {
        setMinesNegsCount(gBoard, i, j)
        gInterval = setInterval(setTime, 1000)
        if (currCell.isMine === true) {
            onInit()
            var classCell = document.querySelector(`.cell-${i}-${j}`)
            classCell.style.backgroundColor = 'white'

        }
    }
    renderNextClick(elCell, i, j)
    gOpenCells++
    renderLivesLeft()
    checkWin()
    console.log(currCell)


}
function renderNextClick(elCell, i, j) {
    var currCell = gBoard[i][j]
    var setElCell
    currCell.isShown = true
    elCell.style.backgroundColor = '#fff'
    currCell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
    setElCell = (currCell.isMine) ? MINE : currCell.minesAroundCount
    if (currCell === 0) currCell = EMPTY
    if (!currCell.minesAroundCount && !currCell.isMine) expandCells(gBoard, i, j)
    if (setElCell === MINE) {
        elCell.style.backgroundColor = 'red'
        gLivesLeft--
        gOpenCells--
        if (gLivesLeft === 0) gameOver()

    }
    renderCell(i, j, setElCell)
}

function setRandomMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        var randIdxs = getEmptyCell(gBoard)
        gBoard[randIdxs.i][randIdxs.j].isMine = true
        console.log(randIdxs)
    }
}

function resetGame() {
    onInit()
    clearInterval(gInterval)
    gSecondsLabel.innerHTML = '00'
    gMinutesLabel.innerText = '00'
    gTotalSeconds = 0;
    gOpenCells = 0
    renderLivesLeft()
}

function levelCheck(size, mines) {

    gLevel.size = size
    gLevel.mines = mines
    renderLivesLeft()
    resetGame()
}

function checkWin() {
    var emoji = document.querySelector('.emoji')
    var numForWin = gLevel.size ** 2 - gLevel.mines
    if (gOpenCells === numForWin) {
        emoji.innerText = '🏆'
        gGame.isOn = false
        clearInterval(gInterval)
    }
}

function gameOver() {
    var emoji = document.querySelector('.emoji')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                renderCell(i, j, MINE)
                var classCell = document.querySelector(`.cell-${i}-${j}`)
                classCell.style.backgroundColor = 'red'

            }
        }
    }
    clearInterval(gInterval)
    gGame.isOn = false
    emoji.innerText = '😡'
}

function setFlag(i, j, event) {
    if (gGame.isOn) {
        if (gBoard[i][j].isShown) return
        if (event.button === 2 && !gIsFlag) {
            renderCell(i, j, FLAG)
            gBoard[i][j].isMarked = true
            gIsFlag = true
        }
        else if (gIsFlag && event.button === 2) {
            renderCell(i, j, EMPTY)
            gBoard[i][j].isMarked = false
            gIsFlag = false
        }
    }

}


function renderLivesLeft() {
    var livesLeft = document.querySelector('h2 span')
    livesLeft.innerText = gLivesLeft
}



function expandCells(gBoard, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) continue
            if (currCell.isShown) continue
            if (currCell.isMarked) continue
            currCell.isShown = true
            var classCell = document.querySelector(`.cell-${i}-${j}`)
            classCell.style.backgroundColor = 'white'
            classCell.innerText = setMinesNegsCount(gBoard, i, j)
            gOpenCells++

        }
    }

}