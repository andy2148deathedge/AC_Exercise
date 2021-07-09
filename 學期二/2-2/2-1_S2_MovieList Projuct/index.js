const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
let currentPage = 1 //A12 新增 用以表示點擊後的目前頁面
let currentMode = 'card' //A12 新增 用以表示目前顯示模式: 'card' & 'bar'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const iconPanel = document.querySelector('#icon-panel')//A12 新增模式觸控面板

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    // title, image
    // console.log(item)

    rawHTML += `<div class="col-sm-3">
    <!-- margin bottom 2 單位 -->
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${
            item.id
          }">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${
            item.id
          }">+</button>
        </div>
      </div>
    </div>
  </div>`
  })

  dataPanel.innerHTML = rawHTML
}

//A12 新增Bar Chart 模式
function renderMovieBar(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `<div class="col-12">
        <div class="row" style="height:6rem; margin:auto; border-top:solid rgb(199, 204, 209) 1px;">
          <div class="col-6 d-flex align-items-center">
            <h2> ${item.title} </h2>
          </div>
          <div class="col-6 d-flex justify-content-center align-items-center">
              <button class="btn btn-primary btn-show-movie" style="margin:10px;" data-toggle="modal" data-target="#movie-modal" data-id="${item.id
      }">More</button>
              <button class="btn btn-info btn-add-favorite" style="margin:10px;" data-id="${item.id
                      }">+</button>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}


// 傳入電影數量以渲染分頁器
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  // 若filteredMovies是有長度的，就給filteredMovies, 沒有就給movies
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`
    console.log(data)
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //or 左邊優先  Falsy值
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert('此電影已在收藏清單中！')
  } 

  list.push(movie)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
} 

//A12 新增顯示模式觸控面板
iconPanel.addEventListener('click', function oniconPanelClicked(event) {
  if (event.target.matches('.icon-card')) {//點擊後會回到分頁器記錄的全域currentPage
    console.log('Display in Card Mode')
    currentMode = 'card'
    renderMovieList(getMoviesByPage(currentPage))
  } else if (event.target.matches('.icon-bar')) {
    console.log('Display in Bar Mode')
    currentMode = 'bar'
    renderMovieBar(getMoviesByPage(currentPage))
  }
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id)) //這邊也可不加Number可能因為JS弱型別
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  currentPage = Number(event.target.dataset.page)
  
  // 判斷目前顯示模式
  if (currentMode === 'card') {
    renderMovieList(getMoviesByPage(currentPage))
  } else if (currentMode === 'bar') {
    renderMovieBar(getMoviesByPage(currentPage))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmiited(event) {
  // 取消表單預設action行為
  event.preventDefault()
  const keyword = searchInput.value.toLowerCase().trim() //.trim() 去頭去尾

  // if (!keyword.length) {
  //   return alert('請輸入有效的搜尋字串')
  // }

  // 2. .filter() 法 (陣列用的方法，可過濾出篩選結果為true的元素)
  filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(keyword)
  )

  // 1. for 迴圈法
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  // 若篩選結果為無結果，仍顯示正常全滿頁面，而非空結果
  if (filteredMovies.length === 0) {
    return alert(`Cannot find movie with keyword: ${keyword}`)
  }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

axios
  .get(INDEX_URL)
  .then((response) => {
  // for (const movies of response.data.results) {
  //   movies.push(movie) 
  // }
  //push支援 '展開運算子' '...': 直接把array元素展開 可用在接資料 或傳函式參數
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(currentPage))
  })
  .catch((err) => console.log(err))
