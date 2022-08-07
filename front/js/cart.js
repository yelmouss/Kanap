// pour différancier la page confirmation et panier
const page = document.location.href;

// appel de la ressource api product (voir script.js) si on est sur la page panier
if (page.match("cart")) {
    fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((objetProduits) => {
            console.log(objetProduits);
            // appel de la fonction affichagePanier
            affichagePanier(objetProduits);
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
        });
} else {
    console.log("sur page confirmation");
}


// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
    // on récupère le panier converti
    let panier = JSON.parse(localStorage.getItem("panierStocké"));
    // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
    if (panier && panier.length != 0) {
        // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
        for (let choix of panier) {
            console.log(choix);
            for (let g = 0, h = index.length; g < h; g++) {
                if (choix._id === index[g]._id) {
                    // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
                    choix.name = index[g].name;
                    choix.prix = index[g].price;
                    choix.image = index[g].imageUrl;
                    choix.description = index[g].description;
                    choix.alt = index[g].altTxt;
                }
            }
        }
        // on joue affiche,  panier a des clefs/valeurs ajoutés que l'on a pas remonté dans le local storage et sont pourtant réèlles
        // ici panier à les valeurs du local storage + les valeurs définies au dessus
        //on demande à affiche() de jouer avec les données panier 
        //les valeurs ajoutés à panier ont un scope agrandi puisque appelé via la fonction affiche() d'ailleur dans affiche() il n'y a pas d'appel à panier de local storage.
        affiche(panier);
    } else {
        // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";
    }
    // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
    modifQte();
    suppression();
}


//--------------------------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------
function affiche(r) {
    // on déclare et on pointe la zone d'affichage
    let zonePanier = document.querySelector("#cart__items");
    // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
    zonePanier.innerHTML += r.map((choix) =>
        `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
    <div class="cart__item__img">
      <img src="${choix.image}" alt="${choix.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choix.name}</h2>
        <span>couleur : ${choix.couleur}</span>
        <p data-prix="${choix.prix}">${choix.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
    // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
    totalProduit();
}

//--------------------------------------------------------------
// fonction modifQuantité on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------
function modifQte() {
    const cart = document.querySelectorAll(".cart__item");
    /* manière de regarder ce que l'on a d'affiché dynamiquement grace au dataset
     cart.forEach((cart) => {console.log("item panier en dataset: " + " " + cart.dataset.id + " " + cart.dataset.couleur + " " + cart.dataset.quantité); }); */
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
    cart.forEach((cart) => {
        cart.addEventListener("change", (eq) => {
            // vérification d'information de la valeur du clic et son positionnement dans les articles
            let panier = JSON.parse(localStorage.getItem("panierStocké"));
            // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
            for (article of panier)
                if (
                    article._id === cart.dataset.id &&
                    cart.dataset.couleur === article.couleur
                ) {
                    article.quantité = eq.target.value;
                    localStorage.panierStocké = JSON.stringify(panier);
                    // on met à jour le dataset quantité
                    cart.dataset.quantité = eq.target.value;
                    // on joue la fonction pour actualiser les données
                    totalProduit();
                }
        });
    });
}

//--------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//--------------------------------------------------------------
function suppression() {
    // déclaration de variables
    const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
    // pour chaque élément cartdelete
    cartdelete.forEach((cartdelete) => {
        // On écoute s'il y a un clic dans l'article concerné
        cartdelete.addEventListener("click", () => {
            // appel de la ressource du local storage
            let panier = JSON.parse(localStorage.getItem("panierStocké"));
            for (let d = 0, c = panier.length; d < c; d++)
                if (
                    panier[d]._id === cartdelete.dataset.id &&
                    panier[d].couleur === cartdelete.dataset.couleur
                ) {
                    // déclaration de variable utile pour la suppression
                    const num = [d];
                    // création d'un tableau miroir, voir mutation
                    let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
                    //suppression de 1 élément à l'indice num
                    nouveauPanier.splice(num, 1);
                    //affichage informatif
                    if (nouveauPanier && nouveauPanier.length == 0) {
                        // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
                        document.querySelector("#totalQuantity").innerHTML = "0";
                        document.querySelector("#totalPrice").innerHTML = "0";
                        document.querySelector("h1").innerHTML =
                            "Vous n'avez pas d'article dans votre panier";
                    }
                    // on renvoit le nouveau panier converti dans le local storage et on joue la fonction
                    localStorage.panierStocké = JSON.stringify(nouveauPanier);
                    totalProduit(); // logique mais pas obligatoire à cause du reload plus bas qui raffraichit l'affichage; serait necessaire avec suppression sans reload
                    // on recharge la page qui s'affiche sans le produit grace au nouveau panier
                    return location.reload();
                }
        });
    });
}


//--------------------------------------------------------------
// fonction ajout nombre total produit et coût total
//--------------------------------------------------------------
function totalProduit() {
    // déclaration variable en tant que nombre
    let totalArticle = 0;
    // déclaration variable en tant que nombre
    let totalPrix = 0;
    // on pointe l'élément
    const cart = document.querySelectorAll(".cart__item");
    // pour chaque élément cart
    cart.forEach((cart) => {
        //je récupère les quantités des produits grâce au dataset
        totalArticle += JSON.parse(cart.dataset.quantité);
        // je créais un opérateur pour le total produit grâce au dataset
        totalPrix += cart.dataset.quantité * cart.dataset.prix;
    });
    // je pointe l'endroit d'affichage nombre d'article
    document.getElementById("totalQuantity").textContent = totalArticle;
    // je pointe l'endroit d'affichage du prix total
    document.getElementById("totalPrice").textContent = totalPrix;
}