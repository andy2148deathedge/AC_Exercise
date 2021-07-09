const movies = [
  {
    title: "The Avengers",
    image: "https://bit.ly/2NQOG6H",
    rating: 0
  },
  {
    title: "Our Times",
    image: "https://bit.ly/2OsGmv2",
    rating: 0
  }
];

dataPanel = document.querySelector("#data-panel");

function displayMovieList(movies) {
  let htmlContent = `
     <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Rating</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;
  for (let i = 0; i < movies.length; i++) {
    htmlContent += `
        <tr>
            <td>
              <img src= ${movies[i].image} width="70" class="img-thumbnail" />
            </td>
            <td>${movies[i].title}</td>
            <td>
              <span class="fa fa-thumbs-up"></span>
              <span class="fa fa-thumbs-down px-2"></span>
              <span>${movies[i].rating}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-danger">X</button>
            </td>
        </tr>
      `;
  }
  htmlContent += `
      </tbody>
    </table>
  `;
  return htmlContent;
}

dataPanel.innerHTML = displayMovieList(movies);
