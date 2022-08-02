const params = new URLSearchParams(document.location.search);
const id = params.get("_id");
console.log(id);

fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        lesProduits(objetProduits);
    })
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });

let articleClient = {};

articleClient._id = id;

function lesProduits(produit) {

    let imageAlt = document.querySelector("article div.item__img");
    let titre = document.querySelector("#title");
    let prix = document.querySelector("#price");
    let description = document.querySelector("#description");
    let couleurOption = document.querySelector("#colors");

    for (let choix of produit) {

        if (id === choix._id) {

            imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
            titre.textContent = `${choix.name}`;
            prix.textContent = `${choix.price}`;
            description.textContent = `${choix.description}`;

            for (let couleur of choix.colors) {
                couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
            }
        }
    }
    console.log("affichage effectué");
}

let choixCouleur = document.querySelector("#colors");

choixCouleur.addEventListener("input", (ec) => {
    let couleurProduit;

    couleurProduit = ec.target.value;

    articleClient.couleur = couleurProduit;

    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(couleurProduit);
});

let choixQuantité = document.querySelector('input[id="quantity"]');
let QTE;

choixQuantité.addEventListener("input", (eq) => {

    QTE = eq.target.value;

    articleClient.quantité = QTE;

    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(QTE);
});

let choixProduit = document.querySelector("#addToCart");

choixProduit.addEventListener("click", () => {

    if (

        articleClient.quantité < 1 ||
        articleClient.quantité > 100 ||
        articleClient.quantité === undefined ||
        articleClient.couleur === "" ||
        articleClient.couleur === undefined
    ) {

        alert("Veuillez renseigner une couleur, et une quantité valide");

    } else {
        Panier();
        console.log("clic effectué");
        document.querySelector("#addToCart").style.color = "green";
        document.querySelector("#addToCart").textContent = "Produit ajouté !";
    }
});


let choixProduitClient = [];
let produitsEnregistrés = [];
let produitsTemporaires = [];
let produitsAPousser = [];

function ajoutPremierProduit() {
    console.log(produitsEnregistrés);
    if (produitsEnregistrés === null) {
        choixProduitClient.push(articleClient);
        console.log(articleClient);
        return (localStorage.ToPanier = JSON.stringify(choixProduitClient));
    }
}

function ajoutAutreProduit() {
    produitsAPousser = [];
    produitsTemporaires.push(articleClient);
    produitsAPousser = [...produitsEnregistrés, ...produitsTemporaires];
    produitsAPousser.sort(function triage(a, b) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        if (a._id = b._id) {
            if (a.couleur < b.couleur) return -1;
            if (a.couleur > b.couleur) return 1;
        }
        return 0;
    });
    produitsTemporaires = [];
    return (localStorage.ToPanier = JSON.stringify(produitsAPousser));
}

function Panier() {
    produitsEnregistrés = JSON.parse(localStorage.getItem("ToPanier"));
    if (produitsEnregistrés) {
        for (let choix of produitsEnregistrés) {
            if (choix._id === id && choix.couleur === articleClient.couleur) {
                alert("RAPPEL: Vous aviez déja choisit cet article.");
                let additionQuantité = parseInt(choix.quantité) + parseInt(QTE);
                choix.quantité = JSON.stringify(additionQuantité);
                return (localStorage.ToPanier = JSON.stringify(produitsEnregistrés));
            }
        }
        return ajoutAutreProduit();
    }

    return ajoutPremierProduit();
}