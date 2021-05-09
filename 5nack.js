const grid = document.querySelector(".grid")
const scoreDisplay = document.getElementById("score")
const lengthDisplay = document.getElementById("length")
const startBtn = document.getElementById("start")
const notice = document.querySelector(".notice")
const gameOver = document.getElementById("game-over")
const endRestartBtn = document.getElementById("end-restart")
const endGame = document.querySelector(".end")
const lastScore = document.getElementById("last-result-score")
const lastLength = document.getElementById("last-result-length")
const questionMark = document.getElementById("question-mark")
const closeInstructionBtn = document.getElementById("close-btn")
const volumeOn = document.querySelector(".soundOn")
const volumeOff = document.querySelector(".mute")

let squares = [] 
let currentSnake = [2,1,0]
let direction = 1
const width = 25
let timerID = 0
let appleIndex = 0
let blockIndex = 0
let score = 0
let intervalTime = 500
let speed = 0.9
let length = 1

function hitSound(){
    if (volumeOn.style.display === "block"){
        let audio = document.createElement("audio")
        audio.src="hit.mp3"
        audio.play()
    } 
}

function eatSound(){
    if (volumeOn.style.display === "block"){
        let audio = document.createElement("audio")
        audio.src="eat.mp3"
        audio.play()
    } 
}

function TurnOffVolume(){
   volumeOn.addEventListener("click", function(){
       volumeOn.style.display = "none"
       volumeOff.style.display = "block"
       TurnOnVolume()
   })
}

function TurnOnVolume(){
   volumeOff.addEventListener("click", function(){
       volumeOff.style.display = "none"
       volumeOn.style.display = "block"
   })
}

TurnOffVolume()

function createGrid() {
    for(let i = 0 ; i < width * width ; i++){  
        const square = document.createElement("div")
        square.classList.add("square")
        grid.appendChild(square)
        squares.push(square)
    } 
}

createGrid()

currentSnake.forEach(index => squares[index].classList.add("snake"))

function startGame(){
    //重置
    currentSnake.forEach(index => squares[index].classList.remove("snake"))
    squares[appleIndex].classList.remove("apple")
    clearInterval(timerID)
    currentSnake = [2,1,0]
    direction = 1
    score = 0
    scoreDisplay.textContent = score
    length = 1
    lengthDisplay.textContent = length
    intervalTime = 500
    generateApples()
    currentSnake.forEach(index => squares[index].classList.add("snake"))
    timerID = setInterval(move, intervalTime)
    endGame.style.display = "none"
    volumeOff.style.display = "none"
    volumeOn.style.display = "block"
}

function over(){
    //遊戲結束
    endGame.style.display = "block"
    startBtn.style.display = "none"
    endRestartBtn.style.display = "block"
    lastScore.textContent = score
    lastLength.textContent = length
    volumeOff.style.display = "none"
    volumeOn.style.display = "none"
}

function move(){
    //蛇碰到邊框或block
    
    if(
        (currentSnake[0] >= 600) && direction === +width || //bottom
        (currentSnake[0] % width === 0) && direction === -1 || //left
        (currentSnake[0] < width && direction === -width) || //top
        ((currentSnake[0] + 1) % width === 0 && direction === 1)|| //right
        squares[currentSnake[0] + direction].classList.contains("snake")||//self
        squares[currentSnake[0] + direction].classList.contains("block")//block
    ){
        hitSound()
        over()
        return clearInterval(timerID)
    }
    
    
    //蛇移動
    const tail = currentSnake.pop()
    squares[tail].classList.remove("snake")
    currentSnake.unshift(currentSnake[0] + direction)
    squares[currentSnake[0]].classList.add("snake")

    //蛇吃果實
    if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple")
        squares[tail].classList.add("snake") 
        currentSnake.push(tail) //改變蛇的array
        generateApples()
        score++
        scoreDisplay.textContent = score
        length += 1.5
        lengthDisplay.textContent = length
        clearInterval(timerID)
        intervalTime = intervalTime * speed
        timerID = setInterval(move, intervalTime)
        eatSound()
    }

}

move()

function generateApples(){

    do{
        appleIndex = Math.floor((Math.random() * squares.length ) + 1)
    }while (squares[appleIndex].classList.contains("snake"))
    squares[appleIndex].classList.add("apple")
    
    generateBlock()
}

generateApples()

function generateBlock(){
    squares[blockIndex].classList.remove("block")
    
    do{
        blockIndex = Math.floor((Math.random() * squares.length ) + 1)
    } while (squares[blockIndex].classList.contains("snake"))
    squares[blockIndex].classList.add("block")
}

function control(e) {
    if (e.keyCode === 39 || e.keyCode === 68) {
        console.log("right pressed")
        direction = 1

    } else if (e.keyCode === 38 || e.keyCode === 87) {
        console.log("up pressed")
        direction = -width

    } else if (e.keyCode === 37 || e.keyCode === 65) {
        console.log("left pressed")
        direction = -1

    } else if (e.keyCode === 40 || e.keyCode === 83) {
        console.log("down pressed")
        direction = +width
    }
}


function instruction(){
    notice.style.display = "block"
    
}

function closeInstruction(){
    notice.style.display = "none"
}

document.addEventListener("keyup", control)
startBtn.addEventListener("click", startGame)
endRestartBtn.addEventListener("click", startGame)
questionMark.addEventListener("click", instruction)
closeInstructionBtn.addEventListener("click", closeInstruction)