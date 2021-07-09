//定義
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_ROUTE = '/api/v1/users/'
//個人資料為 BASE_URL + INDEX_ROUTE + 'id'

//定義網頁區域選擇器
const dataPanel = document.querySelector('#data-panel')
// const heartLeft = document.querySelector('#heart-count')

//定義資料變數
let users = JSON.parse(localStorage.getItem('choices'))
// let heartCount = 3


//定義函式
//隨機產生興趣
function interested() {
  //3分之一機率對你有興趣
  let dice = Math.floor(Math.random() * 3)
  if (dice === 0) {
    isInterested = 'Y'
  } else {
    isInterested = 'N'
  } 
  return isInterested
}

//渲染heart剩餘數
function renderHeartLeft(heartCount) {
  heartLeft.innerText = `X ${heartCount}`
}

//渲染dataPanel
function renderUserList(data) {
  let usersHTML = ''
  
  data.forEach(item => {
    
    //引進區域變數isInterested存入dataset模擬該人對網頁使用者的興趣與否
    let isInterested = interested()//isInterested為隨機"Y" or "N"

    usersHTML += `<div class="col-sm-auto">
      <div class="mb-3">
        <div class="card" style="width: 18rem;">
          <img src="${item.avatar}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.name} ${item.surname}</h5>
          </div>
          <div class="card-body d-flex justify-content-between">
            <a href="#" class="card-link user-link" data-toggle="modal" data-target="#user-modal" data-isInterested="${isInterested}" data-id="
              ${item.id}
            ">確認對方心意...</a>
            
          </div>
        </div>
      </div>
    </div>`

    dataPanel.innerHTML = usersHTML
  })
}

//渲染正常Modal
function renderUserModal(id) { 
  const title = document.querySelector('#user-modal-title')
  const avatar = document.querySelector('#user-modal-image')
  const userInfo = document.querySelector('#user-modal-info')
  
  axios.get(BASE_URL + INDEX_ROUTE + id).then(response => {
    const data = response.data

    title.innerText = `${data.name} ${data.surname}`
    avatar.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid" style="height:100%;">`
    userInfo.innerHTML = `
      <p> gender: ${data.gender}</p>
      <p> age: ${data.age}</p>
      <p> birthday: ${data.birthday}</p>
      <p> region: ${data.region}</p>
      <p id="email" style="color:hotpink;"> e-mail: ${data.email}</p>
    `
  })
}

//渲染無興趣Modal
function renderNotinterestedModal(id) {
  const title = document.querySelector('#user-modal-title')
  const avatar = document.querySelector('#user-modal-image')
  const userInfo = document.querySelector('#user-modal-info')

  axios.get(BASE_URL + INDEX_ROUTE + id).then(response => {
    const data = response.data

    title.innerText = `${data.name} ${data.surname}`
    avatar.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid" style="height:100%;">`
    userInfo.innerHTML = `
      <p> gender: ${data.gender}</p>
      <p> age: ${data.age}</p>
      <p> birthday: ${data.birthday}</p>
      <p> region: ${data.region}</p>
      <p id="email" style="color:gray;"> 看不見他/她的聯絡方式...</p>
    `
  })
}

//與localStorage交互 存入choices名單JSON資料
function addToChoices (id) {
  const list = JSON.parse(localStorage.getItem('choices')) || []

  const user = users.find((user) => user.id === id)

  if (list.some(user => user.id === id)) {
    heartCount += 1
    return alert('今天已經選擇過他/她囉！') 
  }

  list.push(user)

  localStorage.setItem('choices', JSON.stringify(list))
}

//定義監聽器
//監聽按確認按鈕的觸擊事件
dataPanel.addEventListener('click', function onPanelClicked(evt) {
  if (evt.target.matches('.user-link')) {
    if (evt.target.dataset.isinterested === 'Y') {
      alert('對方也喜歡你！快留下你們的第一句聊天給他吧！')
      evt.target.innerText = '已成為好友'
      evt.target.style = "color: hotpink;"
      renderUserModal(Number(evt.target.dataset.id))
    } else if (evt.target.dataset.isinterested === 'N') {
      alert('很遺憾對方沒有也剛好選擇你。但那些留在心裡的是最美的，不是嘛?')
      evt.target.innerText = '未成為好友'
      evt.target.style = "color: gray;"
      renderNotinterestedModal(Number(evt.target.dataset.id))
    }
  } 
})







//main 
renderUserList(users)
