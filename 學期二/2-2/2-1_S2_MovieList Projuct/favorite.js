const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
          <button class="btn btn-danger btn-remove-favorite" data-id="${
            item.id
          }">X</button>
        </div>
      </div>
    </div>
  </div>`
  })

  dataPanel.innerHTML = rawHTML
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

// favorite頁面 不需用到故註解掉
// function addToFavorite(id) {
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //or 左邊優先  Falsy值
//   const movie = movies.find(movie => movie.id === id)

//   if (list.some(movie => movie.id === id)) {
//     return alert('此電影已在收藏清單中！')
//   } 

//   list.push(movie)

//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// } 

function removeFromFavorite(id) {
  if (!movies) return //若本來就為空陣列就停止函式

  const movieIndex = movies.findIndex(movie => movie.id === id)
  if(movieIndex === -1) return //若找不到相同ID就停止函式

  movies.splice(movieIndex, 1) //刪除該index位址的一部電影

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))//結果存回localStorage

  renderMovieList(movies)//重新渲染頁面
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id)) //這邊也可不加Number可能因為JS弱型別
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

//favorite main
renderMovieList(movies)

// search功能 favorite 用不到故註解掉
// searchForm.addEventListener('submit', function onSearchFormSubmiited(event) {
//   // 取消表單預設action行為
//   event.preventDefault()
//   const keyword = searchInput.value.toLowerCase().trim() //.trim() 去頭去尾
//   let filteredMovies = []

//   // if (!keyword.length) {
//   //   return alert('請輸入有效的搜尋字串')
//   // }

//   // 2. .filter() 法 (陣列用的方法，可過濾出篩選結果為true的元素)
//   filteredMovies = movies.filter(movie => 
//     movie.title.toLowerCase().includes(keyword)
//   )

//   // 1. for 迴圈法
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filteredMovies.push(movie)
//   //   }
//   // }

//   // 若篩選結果為無結果，仍顯示正常全滿頁面，而非空結果
//   if (filteredMovies.length === 0) {
//     return alert(`Cannot find movie with keyword: ${keyword}`)
//   }

//   renderMovieList(filteredMovies)
// })

// favorite頁面的資料來源是 localStorage ，不用重新接API資料故註解掉
// axios
//   .get(INDEX_URL)
//   .then((response) => {
//   // for (const movies of response.data.results) {
//   //   movies.push(movie) 
//   // }
//   //push支援 '展開運算子' '...': 直接把array元素展開 可用在接資料 或傳函式參數
//     movies.push(...response.data.results)
//     renderMovieList(movies)
//   })
//   .catch((err) => console.log(err))
