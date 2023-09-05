class Game {
  winFlatArr

  puzzle = []
  winFlatArr = []

  constructor(size = 4, sizeBlock = 100, marginBlock = 100) {
    this.size = size;
    this.sizeBlock = sizeBlock;
    this.marginBlock = marginBlock
  }

  sizeAllBlock(num1, num2) {
    let gameContainer = document.querySelector('.game-container');
    this.sizeBlock = num1
    this.marginBlock = num1

    this.puzzleBlock = document.querySelectorAll('.puzzle_block').forEach(item => {
      item.style.width = this.sizeBlock + "px", item.style.height = this.sizeBlock + "px"
    })

    this.gameContainer = document.querySelector('.game-container').style.width = num2 + 'px'
    this.gameContainer = document.querySelector('.game-container').style.height = num2 + 'px'
  }

  turnSound = true

  sound() {
    let audio = new Audio();
    audio.src = './sound/whoosh-grainy_gkoaqyn_.mp3';
    audio.autoplay = this.turnSound;

  }

  getRow(pos) {
    return Math.ceil(pos / this.size)
  }

  getCol(pos) {
    const col = pos % this.size

    if (col === 0) {
      return this.size
    }
    return col
  }

  generatePuzzle() {
    for (let i = 1; i <= this.size * this.size; i++) {
      this.puzzle.push({
        value: i,
        position: i,
        x: (this.getCol(i) - 1) * this.sizeBlock,
        y: (this.getRow(i) - 1) * this.sizeBlock,
        disabled: false,
      })
    }
  }

  getRandomValues() {
    const values = []
    for (let i = 1; i <= this.size * this.size; i++) {
      values.push(i)
      this.winFlatArr.push(i)
    }
    const randomValues = values.sort(() => Math.random() - 0.5)
    return randomValues
  }

  randomizePuzzle() {
    const randomValues = this.getRandomValues()
    /* console.log(randomValues) */
    let i = 0;

    for (let puzzleItem of this.puzzle) {
      puzzleItem.value = randomValues[i]
      i++
    }

    const removeHightNum = this.puzzle.find((item) => item.value === this.size * this.size)
    removeHightNum.disabled = true
    return this
  }

  coordEmpty = {}
  coordCurClick = {}

  getEmptyPuzzle() {
    this.coordEmpty = (this.puzzle.find((item) => item.disabled));
    return (this.coordEmpty)
  }

  getPuzzleByPos(pos) {
    this.getEmptyPuzzle();
    let curPos = pos + "";

    for (let i = 0; i < this.puzzle.length; i++) {

      if (this.puzzle[i].value == curPos) {
        this.coordCurClick = (this.puzzle[i])
        return (this.coordCurClick)
      }
    }
  }

  isValidForSwap(coord1, coord2, ) {
    const diffX = Math.abs(coord1.x - coord2.x);
    const diffY = Math.abs(coord1.y - coord2.y);
    return (diffX === this.marginBlock || diffY === this.marginBlock) && (coord1.x === coord2.x || coord1.y === coord2.y);
  }

  div = document.createElement('div');
  frameSize = document.createElement('div')

  renderPuzzle() {

    this.div.className = "game-container";
    this.div.innerHTML = "";
    for (let puzzleItem of this.puzzle) {
      if (puzzleItem.disabled) continue
      this.div.innerHTML += `<div class="puzzle_block" style="left: ${puzzleItem.x}px;
                         top: ${puzzleItem.y}px;
                         "
                         id="${puzzleItem.value}"
                         >
                         ${puzzleItem.value}</div>
    `
    }
    this.puzzleBlock = document.querySelectorAll('.puzzle_block').forEach(item => {
      item.style.width = this.sizeBlock + "px", item.style.height = this.sizeBlock + "px"
    })

    this.frameSize.className = 'frame-size'
    this.frameSize.innerHTML = `Frame size: 4x4`
    document.body.append(this.div)
    document.body.append(this.frameSize)

    console.log(this.puzzle)
  }

  clickSwap = 0

  movesInfo = document.querySelector('.moves')
  clockTime = document.querySelector('.time')

  seconds = 0;
  ss = 0;
  mm = 0;
  interval = null;


  timer() {

    this.seconds++

    let hours = Math.floor(this.seconds / 3600)
    let secs = this.seconds % 60;
    let mins = Math.floor((this.seconds - (hours * 3600)) / 60)

    if (secs < 10) secs = '0' + secs
    if (mins < 10) mins = '0' + mins

    this.ss = secs
    this.mm = mins

    this.clockTime.innerHTML = `Time: ${mins}:${secs}`
  }

  winnerList = []

  generateWinnersList(move, clock) {
    if (this.winnerList.length !== 10) {
      this.winnerList.push({
        swap: move,
        time: clock
      })
      this.winnerList = (this.winnerList.sort((a, b) => a.time > b.time ? 1 : -1))
    } else if (this.winnerList.length === 10) {
      this.winnerList[9] = {
        swap: move,
        time: clock
      }
      this.winnerList = (this.winnerList.sort((a, b) => a.time > b.time ? 1 : -1))
    }
  }


  createWinnersList() {
    let div = document.createElement('div')
    div.className = 'winnerList'
    let num =0
    for(let item of this.winnerList){
      ++num
      let ss = 0
      let mm = 0
      let hours = Math.floor(item.time / 3600)
      let secs = item.time % 60;
      let mins = Math.floor((item.time - (hours * 3600)) / 60)

      if (secs < 10) secs = '0' + secs
      if (mins < 10) mins = '0' + mins

      ss = secs
      mm = mins


     div.innerHTML +=`<div class="winnerItem">${num}) Moves:${item.swap}  Time:${mm}:${ss}</div>`

    }
    document.body.append(div)
  }

  swap(coord1, coord2) {
    let buttonStop = document.querySelector('.Stop')
    /*  console.log(coord1.position, " ", coord2.position, )
     console.log(coord1.x, coord1.y, " ", coord2.x, coord2.y) */

    buttonStop.classList.remove('buttonsToggle')

    if (this.isValidForSwap(coord1, coord2)) {

      let temp = coord1.x
      coord1.x = coord2.x
      coord2.x = temp

      temp = coord1.y
      coord1.y = coord2.y
      coord2.y = temp


      temp = coord1.position
      coord1.position = coord2.position
      coord2.position = temp

      this.movesInfo.innerHTML = `Moves: ${++this.clickSwap}`
      this.sound()
      this.renderPuzzle()

      console.log(this.puzzle.every((item) => item.position == item.value))
      if (this.puzzle.every((item) => item.position == item.value)) {

        this.generateWinnersList(this.clickSwap,this.seconds )

        setTimeout(() => {
          alert(`«Hooray! You solved the puzzle in ${this.mm}:${this.ss} and N ${this.clickSwap}!»`)
          clearInterval(this.interval)
          this.interval = null
          this.seconds = 0
          this.mm = 0
          this.ss = 0
          this.clockTime.innerHTML = `Time: 00:00`
          this.clickSwap = 0
          this.movesInfo.innerHTML = `Moves: 0`
          buttonStop.classList.remove('buttonsToggle')
        }, 100)
      }


      if (this.interval) {
        return
      }
      this.interval = setInterval(() => {
        this.timer()
      }, 1000)
    }
  }

  findPos() {

    this.gameContainer = document.querySelector('.game-container');
    this.gameContainer.addEventListener('click', (e) => {
      if (e.target.className !== "puzzle_block") {
        return
      } else {
        this.getPuzzleByPos(e.target.id);
        this.swap(this.coordEmpty, this.coordCurClick)
      }
    })
  }

  triggerButtons() {
    let seconds = 0
    let containerButtons = document.querySelector('.container-buttons')
    let sound = document.querySelector('.Sound')
    containerButtons.addEventListener('click', (e) => {

      if (e.target.getAttribute('data-name') === 'Sound') {
        e.target.classList.toggle('buttonsToggle')

        if (this.turnSound) {
          this.turnSound = false

        } else this.turnSound = true
      }

      if (e.target.getAttribute('data-name') === 'Shuffle') {
        clearInterval(this.interval)
        this.interval = null
        this.seconds = 0
        this.mm = 0
        this.ss = 0
        this.clockTime.innerHTML = `Time: 00:00`
        this.clickSwap = 0
        this.movesInfo.innerHTML = `Moves: 0`
        this.puzzle = []
        this.div.innerHTML = "";
        this.generatePuzzle()
        this.randomizePuzzle()
        this.renderPuzzle()
        this.frameSize.innerHTML = this.sizeFrame
        buttonStop.classList.remove('buttonsToggle')
      }

      if (e.target.getAttribute('data-name') === 'Stop') {

        if (e.target.classList.contains('buttonsToggle')) {
          e.target.classList.remove('buttonsToggle')
          if (this.interval) {
            return
          }
          if (this.mm !== 0 || this.ss !== 0) {
            this.interval = setInterval(() => {
              this.timer()
            }, 1000)
          }

        } else {
          e.target.classList.add('buttonsToggle')
          clearInterval(this.interval)
          this.interval = null
        }
      }
      if (e.target.getAttribute('data-name') === 'Results') {
        this.createWinnersList()
      }


      console.log(e.target.getAttribute('data-name'))
    })
  }

  sizeFrame = 'Frame size: 4x4';

  init() {
    let screenWidth = window.screen.width;
    const screenHeight = window.screen.height;


    let renderFunction = () => {
      this.puzzle = []
      this.div.innerHTML = "";
      this.generatePuzzle()
      this.randomizePuzzle()
      this.renderPuzzle()
    }

    let renderFrame = (str) => {
      this.frameSize.innerHTML = `Frame size: ${str}`
      this.sizeFrame = `Frame size: ${str}`
    }

    this.generatePuzzle()
    this.randomizePuzzle()
    this.renderPuzzle()
    this.triggerButtons()

    let resizeContainer = (num1, num2, num3) => {
      if (320 <= screenWidth && screenWidth < 768) {
        this.gameContainer = document.querySelector('.game-container').style.width = num1 + 'px'
        this.gameContainer = document.querySelector('.game-container').style.height = num1 + 'px'

      } else if (768 <= screenWidth && screenWidth < 1280) {
        this.gameContainer = document.querySelector('.game-container').style.width = num2 + 'px'
        this.gameContainer = document.querySelector('.game-container').style.height = num2 + 'px'

      } else {
        this.gameContainer = document.querySelector('.game-container').style.width = num3 + 'px'
        this.gameContainer = document.querySelector('.game-container').style.height = num3 + 'px'
      }
    }

    let frameSize = document.querySelector('.frame-size')
    let containerSize = document.querySelector('.container-size')

    if (this.size == 4) {
      if (320 <= screenWidth && screenWidth < 768) {

        this.sizeAllBlock(35, 142)
      } else if (768 <= screenWidth && screenWidth < 1280) {

        this.sizeAllBlock(80, 322)
      } else {

        this.sizeAllBlock(100, 402)
      }
    }


    containerSize.addEventListener('click', (e) => {
      let buttonStop = document.querySelector('.Stop')
      this.clickSwap = 0
      this.movesInfo.innerHTML = `Moves: 0`
      this.clockTime.innerHTML = `Time: 00:00`
      clearInterval(this.interval)
      this.interval = null
      this.seconds = 0
      this.mm = 0
      this.ss = 0
      buttonStop.classList.remove('buttonsToggle')

      if (e.target.getAttribute('data-size') === '3x3') {
        this.size = 3
        resizeContainer(107, 242, 302)
        renderFunction()
        renderFrame('3x3')

      } else if (e.target.getAttribute('data-size') === '4x4') {
        this.size = 4
        resizeContainer(142, 322, 402)
        renderFunction()
        renderFrame('4x4')

      } else if (e.target.getAttribute('data-size') === '5x5') {
        this.size = 5
        resizeContainer(177, 402, 502)
        renderFunction()
        renderFrame('5x5')

      } else if (e.target.getAttribute('data-size') === '6x6') {
        this.size = 6
        resizeContainer(212, 483, 602)
        renderFunction()
        renderFrame('6x6')

      } else if (e.target.getAttribute('data-size') === '7x7') {
        this.size = 7
        resizeContainer(247, 562, 702)
        renderFunction()
        renderFrame('7x7')

      } else if (e.target.getAttribute('data-size') === '8x8') {
        this.size = 8
        resizeContainer(282, 642, 802)
        renderFunction()
        renderFrame('8x8')
      }
    })
  }
}


window.addEventListener('DOMContentLoaded', function () {
  let game = new Game(4)



  let screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  let buttonsClass = ['Shuffle and start', 'Stop', 'Save', 'Results', 'Sound off/on']
  let containerButton = document.createElement('div')
  containerButton.className = 'container-buttons'


  for (let item of buttonsClass) {
    containerButton.innerHTML += `<button class = "buttons ${item}" data-name = ${item}>${item}</button>`
  }

  document.body.append(containerButton)

  let containerInfo = document.createElement('div')
  containerInfo.className = 'container-info'

  containerInfo.innerHTML += `<div class = "info moves" data-info = moves">Moves: 0</div>`
  containerInfo.innerHTML += `<div class = "info time" data-info = time">Time: 00:00</div>`

  document.body.append(containerInfo)

  let otherSize = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8']
  let containerSize = document.createElement('div')
  containerSize.className = 'container-size'
  containerSize.innerHTML = 'Other sizes:'

  for (let item of otherSize) {
    containerSize.innerHTML += `<div class = "size" data-size = ${item}>${item}</div>`
  }
  document.body.append(containerSize)


  let resizeBlock = (num, num11, num22, num33) => {

    if (320 <= screenWidth && screenWidth < 768) {
      game = new Game(num, num11, num11)

    } else if (768 <= screenWidth && screenWidth < 1280) {
      game = new Game(num, num22, num22)

    } else {
      game = new Game(num, num33, num33)

    }
  }


  let gameContainer = document.querySelector('.game-container')

  if (game.size === 3) {
    resizeBlock(3, 35, 80, 100)

  } else if (game.size === 4) {
    resizeBlock(4, 35, 80, 100)

  } else if (game.size === 5) {
    resizeBlock(5, 35, 80, 100)

  } else if (game.size === 6) {
    resizeBlock(6, 35, 80, 100)

  } else if (game.size === 7) {
    resizeBlock(7, 35, 80, 100)

  } else if (game.size === 8) {
    resizeBlock(8, 35, 80, 100)
  }

  game.init();
  game.findPos()

  /*   console.log('win', game.winFlatArr) */

});