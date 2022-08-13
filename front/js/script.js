// Shope depuis l'api les élements pour afficher dans notre index 
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((products) => {
        ShowProducts(products);
    })
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>error 404</h1>";
        // console.log("error:" + err);
    });

function ShowProducts(index) {
    let Counter = document.querySelector("span.PanierCounter");
    Counter.innerHTML += JSON.parse(localStorage.panierStocké).length

    let Vitrine = document.querySelector("#items");
    for (let article of index) {
        Vitrine.innerHTML += `<a href="./product.html?_id=${article._id}">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTxt}">
      <h3 class="productName">${article.name}</h3>
      <p class="productDescription">${article.description}</p>
    </article>
  </a>`;
    }


}

// var storedNames = JSON.parse(localStorage.getItem("panierStocké"))
// JSON.parse(localStorage.panierStocké).length = 0
// alert(JSON.parse(localStorage.panierStocké).length)