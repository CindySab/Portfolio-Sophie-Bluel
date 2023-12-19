/*
 * @brief Effectue une requête pour récupérer la liste des projets et les catégories depuis l'API.
 * @type {Promise<Response>} apiWorks - La promesse contenant la réponse de la requête.
 * @type {Promise<Response>} categories - La promesse contenant la réponse de la requête.
 *
 * @brief Elément HTML de la galerie, du portfolio et du bouton de filtrage
 * @type {HTMLElement} gallery - L'élément HTML représentant la galerie des projets.
 * @type {HTMLElement} portfolio - L'élément HTML représentant le portfolio.
 * @type {HTMLElement} buttonFiltre - L'élément HTML représentant le bouton de filtrage.
 *
 * @brief Stocke la liste complète des projets récupérée depuis l'API.
 * @type {Array} allWorks - Un tableau contenant tous les projets.
 */
const apiWorks = fetch("http://localhost:5678/api/works");
const categories = fetch("http://localhost:5678/api/categories");
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");
const buttonFiltre = document.querySelector(".button");
let allWorks = [];

/*
 * @brief Crée un élément figure HTML (figure, img et figcaption) pour un projet donné.
 * @function
 * @param {object} work - Les détails du projet.
 * @returns {HTMLElement} - L'élément figure créé.
 */
function createFigureElement(work) {
  const figureElement = document.createElement("figure");
  figureElement.setAttribute("data-id", work.id);

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;

  const titleElement = document.createElement("figcaption");
  titleElement.textContent = work.title;

  figureElement.appendChild(imageElement);
  figureElement.appendChild(titleElement);

  return figureElement;
}

/*
 * @brief Traite la réponse de la requête vers l'API des projets.
 * @function
 * @param {Response} responseApiWorks - La réponse de la requête API pour les projets.
 * @throws {Error} - Lance une erreur si la réponse n'est pas OK.
 * @type {object[]} data - Les données des projets récupérées depuis la réponse API.
 */
apiWorks.then(async (responseApiWorks) => {
  if (!responseApiWorks.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }

  const data = await responseApiWorks.json();

  if (gallery) {
    allWorks = data;

    displayWorks(allWorks);
  } else {
    console.error("La galerie n'a pas été trouvée.");
  }
});

/*
 * @brief Traite la réponse de la requête vers l'API des catégories, créé les boutons de filtres et la classe active
 * @function
 * @param {Response} responseCategories - La réponse de la requête API pour les catégories.
 * @throws {Error} - Lance une erreur si la réponse n'est pas OK.
 * @type {object[]} dataCategories -  Les données des catégories récupérées depuis la réponse API.
 */
categories.then(async (responseCategories) => {
  if (!responseCategories.ok) {
    throw new Error("Erreur lors de la récupération des catégories");
  }

  const dataCategories = await responseCategories.json();

  if (portfolio) {
    const filtres = document.createElement("div");
    filtres.classList.add("filtres");

    const tousButton = document.createElement("button");
    tousButton.textContent = "Tous";
    tousButton.classList.add("button");
    tousButton.addEventListener("click", () => {
      document
        .querySelectorAll(".button")
        .forEach((btn) => btn.classList.remove("active"));

      tousButton.classList.add("active");
      displayWorks(allWorks);
    });

    filtres.appendChild(tousButton);

    dataCategories.forEach((categories) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button");
      buttonElement.textContent = categories.name;

      buttonElement.addEventListener("click", () => {
        document
          .querySelectorAll(".button")
          .forEach((btn) => btn.classList.remove("active"));

        buttonElement.classList.add("active");
        const filteredWorks = filterWorksByCategory(categories);
        displayWorks(filteredWorks);
      });

      filtres.appendChild(buttonElement);

      portfolio.appendChild(filtres);
      portfolio.insertBefore(filtres, gallery);

      if (JSON.parse(sessionStorage.getItem("connected"))) {
        filtres.style.display = "none";
      }
    });
  } else {
    console.error("Les catégories n'ont pas été trouvées.");
  }
});

/*
 * @brief Affiche les projets dans la galerie.
 * @function
 * @param {Array} works - Les projets à afficher.
 */
function displayWorks(works) {
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figureElement = createFigureElement(work);
    gallery.appendChild(figureElement);
  });
}

/*
 * @brief Filtrer les projets par catégorie.
 * @function
 * @param {object} categories
 * @returns {Array} - Les projets filtrés par catégorie.
 */
function filterWorksByCategory(categories) {
  return allWorks.filter((work) => work.categoryId === categories.id);
}

// PARTIE EDITION
/*
 * @brief Éléments HTML liés à l'administration.
 * @type {HTMLElement} admin - Élément HTML représentant la partie administration.
 * @type {HTMLElement} login - Élément HTML représentant le bouton de connexion.
 * @type {HTMLElement} logout - Élément HTML représentant le bouton de déconnexion.
 * @type {HTMLElement} modify - Élément HTML représentant le bouton de modification.
 * @type {HTMLElement} header - Élément HTML représentant l'en-tête.
 */
const admin = document.getElementById("admin");
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const modify = document.getElementById("modify");
const header = document.getElementById("header");

if (JSON.parse(sessionStorage.getItem("connected"))) {
  login.style.display = "none";
  logout.style.display = "block";
  admin.style.display = "flex";
  modify.style.display = "inline-block";
  header.style.marginTop = "100px";
} else {
  login.style.display = "block";
  logout.style.display = "none";
  admin.style.display = "none";
  modify.style.display = "none";
}

/*
 * @brief Ajoute un écouteur d'événement au bouton de déconnexion.
 * @brief Déconnecte l'utilisateur en supprimant les informations de session et redirige vers la page d'accueil.
 * @event click
 * @param {Event} event - L'événement de clic.
 */
logout.addEventListener("click", (event) => {
  event.preventDefault();
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("connected");
  window.location.replace("index.html");
});
