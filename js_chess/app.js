const gameboard = document.querySelector('#gameboard')
const player = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')
const width = 8

//array containing starting pieces
const startPieces = [
    rook, knight, bishop, queen, knight, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn,  pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn,  pawn, pawn,
    rook, knight, bishop, queen, knight, bishop, knight, rook
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
    console.log(e.target)
}

function dragDrop(e){
    e.stopPropagation()

    e.target.parentNode.append(draggedElement)
    e.target.append(draggedElement)
}