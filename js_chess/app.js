const gameboard = document.querySelector('#gameboard')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')
const width = 8
let playerTurn = 'black'
playerDisplay.textContent = 'black'


//array containing starting pieces
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn,  pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn,  pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')

        //add 64 squares and the starting pieces on each square
        square.classList.add('square')
        square.innerHTML = startPiece

        //if there is a piece on the square make it draggable
        square.firstChild?.setAttribute('draggable', true)
        
        //making alternate squares opposite colors
        square.setAttribute('square-id', i)
        const row = Math.floor((63-i) / 8) + 1
        if (row%2 === 0){
            square.classList.add(i % 2 === 0 ? "beige" : "blue")
        }else{
            square.classList.add(i % 2 === 0 ? "blue" : "beige")
        }

        //setting opposite sides' pieces to correct color
        if (i <= 15){
            square.firstChild.firstChild.classList.add('black')
        }

        if (i >= 48){
            square.firstChild.firstChild.classList.add('white')
        }
        gameboard.append(square)
    })
}

createBoard()

const allSquares = document.querySelectorAll("#gameboard .square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId 
let draggedElement

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e){
    e.preventDefault()
    //console.log(e.target)
}

function dragDrop(e){
    e.stopPropagation()

    //make sure only correct color can go
    const correctTurn = draggedElement.firstChild.classList.contains(playerTurn)
    const taken = e.target.classList.contains('piece')

    const valid = checkIfValid(e.target)

    const opponentTurn = playerTurn === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentTurn)
    //console.log(e.target)

    if (correctTurn){

        if (takenByOpponent && valid){
            console.log("replacing opponent")
            //replace existing opponents piece
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }
        if (taken && !takenByOpponent){
            console.log("invalid move")
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)

            return
        }

        if (valid){
            //move piece into empty square
            console.log("into empty")
            e.target.append(draggedElement)
            changePlayer()

            return
        }
    }

}

function changePlayer(){
    if (playerTurn === "black"){
        reverseIds()
        playerTurn = "white"
        playerDisplay.textContent = 'white'
    }
    else{
        resetIds()
        playerTurn = "black"
        playerDisplay.textContent = "black"
    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width*width - 1)-i))
}

function resetIds(){
    const allSquares =  document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
} 

function checkIfValid(target){

    console.log(target)
    console.log(draggedElement.id)
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id


    switch(piece){
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            console.log(target)
        
            if(
                starterRow.includes(startId) && startId + width * 2 === targetId || //pawn move from starting row
                startId + width === targetId || // one step forward
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
            ){
                return true
            }
            break;

        case 'knight':
            if(
                startId + width * 2 - 1 === targetId ||
                startId + width * 2 + 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 - 1 === targetId || //backwards
                startId - width * 2 + 1 === targetId //backwards

            ){
                return true
            }
            break;
        
        case 'bishop':
            console.log("bishop")
            
            if(
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) || // check path is clear
                startId + width * 3 + 3 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)||
                startId + width * 4 + 4 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)||
                startId + width * 5 + 5 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*4 +4}"]`.firstChild)||
                startId + width * 6 + 6 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 + 5}"]`.firstChild)||
                startId + width * 7 + 7 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 + 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*6 + 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild))
                return true
            }
            if (
                // next direction
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) || // check path is clear
                startId - width * 3 - 3 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)||
                startId - width * 4 - 4 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)||
                startId - width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)||
                startId - width * 6 - 6 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 - 5}"]`.firstChild)||
                startId - width * 7 - 7 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 - 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*6 - 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild))

                return true
            }
            if (

                // backwards
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) || // check path is clear
                startId - width * 3 + 3 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)||
                startId - width * 4 + 4 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)||
                startId - width * 5 + 5 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)||
                startId - width * 6 + 6 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 + 5}"]`.firstChild)||
                startId - width * 7 + 7 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 + 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*6 + 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild))

                return true
            }
            if(
                //backwards other diagonal
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) || // check path is clear
                startId + width * 3 - 3 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)||
                startId + width * 4 - 4 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)||
                startId + width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)||
                startId + width * 6 - 6 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 - 5}"]`.firstChild)||
                startId + width * 7 - 7 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 - 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*6 - 6}"]`.firstChild)

            ){
                console.log(!document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild))

                return true
            }

            break;
        
        case 'rook':
            //forwards
            if(
                startId + width == targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild||
                startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild||
                startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild||
                startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild
            ){
                return true
            }
            //backwards
            if(
                startId - width == targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild||
                startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild||
                startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild||
                startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild
            ){
                return true
            }

            //left
            if(
                startId - 1 == targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ){
                return true
            }
            //right
            if(
                startId + 1 == targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild

            ){
                return true
            }

            break;

        case 'queen':
            //combine bishop and rook's valid moves

            if(
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) || // check path is clear
                startId + width * 3 + 3 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)||
                startId + width * 4 + 4 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)||
                startId + width * 5 + 5 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*4 +4}"]`.firstChild)||
                startId + width * 6 + 6 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 + 5}"]`.firstChild)||
                startId + width * 7 + 7 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 + 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*6 + 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId + width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`.firstChild))
                return true
            }
            if (
                // next direction
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) || // check path is clear
                startId - width * 3 - 3 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)||
                startId - width * 4 - 4 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)||
                startId - width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)||
                startId - width * 6 - 6 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 - 5}"]`.firstChild)||
                startId - width * 7 - 7 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 - 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*6 - 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId - width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`.firstChild))

                return true
            }
            if (

                // backwards
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) || // check path is clear
                startId - width * 3 + 3 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)||
                startId - width * 4 + 4 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)||
                startId - width * 5 + 5 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)||
                startId - width * 6 + 6 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 + 5}"]`.firstChild)||
                startId - width * 7 + 7 === targetId&& !document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*3 + 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*4 + 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*5 + 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId - width*6 + 6}"]`.firstChild)
            ){
                console.log(!document.querySelector(`[square-id="${startId - width + 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`.firstChild))

                return true
            }
            if(
                //backwards other diagonal
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) || // check path is clear
                startId + width * 3 - 3 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)||
                startId + width * 4 - 4 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)||
                startId + width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)||
                startId + width * 6 - 6 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 - 5}"]`.firstChild)||
                startId + width * 7 - 7 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*3 - 3}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*4 - 4}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*5 - 5}"]`.firstChild)&& !document.querySelector(`[square-id="${startId + width*6 - 6}"]`.firstChild)

            ){
                console.log(!document.querySelector(`[square-id="${startId + width - 1}"]`.firstChild)  && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`.firstChild))

                return true
            }

            //forwards
            if(
                startId + width == targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild||
                startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild||
                startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild||
                startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild
            ){
                return true
            }
            //backwards
            if(
                startId - width == targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild||
                startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild||
                startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild||
                startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild
            ){
                return true
            }

            //left
            if(
                startId - 1 == targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ){
                return true
            }
            //right
            if(
                startId + 1 == targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild

            ){
                return true
            }

            break;

        case 'king':
            if(
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width + 1 === targetId ||
                startId - width - 1 === targetId
            ){
                return true
            }

        

    }
    
}

