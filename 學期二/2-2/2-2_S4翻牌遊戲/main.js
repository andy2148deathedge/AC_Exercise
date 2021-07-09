const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatch: 'CardsMatch',
  GameFinished: 'GameFinished'
}


const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]


const view = {
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]

    return `
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>
    `
  },

  getCardElement(index) {

    return `
    <div data-index="${index}" class="card back">
    </div>
    `
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  displayCards(indexes) {
    const rootElement = document.querySelector('#cards');
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join(' ')
  },


  // flipCards(cards)
  // flipCards(1, 2, 3, 4, 5)
  // cards = [1, 2, 3, 4, 5]
  flipCards(...cards) {//...會依序將串進去的複數參數轉成陣列cards
    cards.map(card => {
      if (card.classList.contains('back')) {
        // 回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }

      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },

  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => 
      event.target.classList.remove('wrong'), { once: true })//讓監聽器效果只觸發一次，減少瀏覽器負擔
    })
  },

  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}


const model = {
  revealedCards: [],

  isRevealedCardsMatched() {
    //檢查已翻開兩張牌的陣列dataset內index數字是否相同
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,

  triedTimes: 0
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52)) //讓controller去摳view秀卡片
  },

  //依照不同遊戲狀態，分配工作作不同行為
  dispatchCardAction(card) {
    if(!card.classList.contains('back')) {//先檢查，若牌背沒有back class 的話
      return //由於已翻到正面，什麼都不做就return
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break

      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)

        view.flipCards (card)
        model.revealedCards.push(card)

        if (model.isRevealedCardsMatched()) { 
          //配對正確
          view.renderScore((model.score += 10))
          this.currentState = GAME_STATE.CardsMatch
          view.pairCards(...model.revealedCards)//用展開運算子...將model.revealedCards陣列展開成複數參數傳進view.pairCards(...cards)
          model.revealedCards = []
          //End Game完成判斷
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 加在這裡
            return
          }
          //狀態重新調回初始等待第一張牌
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000) //這邊call 135行的resetCards，注意是call函式本身，若call resetCards()，會變成call其return的結果
        }
        break
    }

    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },

  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits //這邊不能用this.currentState
    //是因為會被line126 setTimeout call，若用this被call時this不是指controller而是變成指setTimeout本身
  }
}

const utility = {
  getRandomNumberArray(count) {

    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }

    return number
  }
}


//Main
controller.generateCards()

//事件監聽
// NodeList  這邊用forEach因為map()只適用於Array，而 NodeList 為 array-like 非 Array實體
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})
