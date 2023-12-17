const apiWorks = fetch("http://localhost:5678/api/works");
const categories = fetch("http://localhost:5678/api/categories");
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');
const buttonFiltre = document.querySelector('.button');
let allWorks = [];


// DOM : AJOUT DES BALISES DE LA GALERIE
function createFigureElement(work) {
    const figureElement = document.createElement('figure');
    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;

    const titleElement = document.createElement('figcaption');
    titleElement.textContent = work.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);

    return figureElement;
};


// APPEL API : IMPORTATION DES PROJETS
apiWorks
    .then(async (responseApiWorks) => {
    if (!responseApiWorks.ok) {
    throw new Error('Erreur lors de la récupération des projets');
    }

    const data = await responseApiWorks.json();

    if (gallery) {
    allWorks = data;
      // Créer et ajouter l'image et le titre à la div gallery
    displayWorks(allWorks);
    } else {
        console.error("La galerie n'a pas été trouvée.");
    }
});

//  APPEL API : IMPORTATION DES CATEGORIES
// DOM : CREATION DES BOUTONS DE FILTRES ET CLASSE ACTIVE
categories
    .then(async (responseCategories) => {
    if (!responseCategories.ok) {
    throw new Error('Erreur lors de la récupération des catégories');
    }

    const dataCategories = await responseCategories.json();

    if (portfolio) {
      // Créer la div filtres
    const filtres = document.createElement('div');
    filtres.classList.add('filtres');

      // Créer et ajouter un bouton "Tous" à la div .filtres
    const tousButton = document.createElement('button');
    tousButton.textContent = 'Tous';
    tousButton.classList.add('button');
    tousButton.addEventListener('click', () => {
        // Supprimer la classe 'active' de tous les boutons
    document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));

    // Ajouter la classe 'active' au bouton "Tous"
    tousButton.classList.add('active');
    displayWorks(allWorks);
    });

    filtres.appendChild(tousButton);

    dataCategories.forEach(categories => {
        // Créer les boutons
        const buttonElement = document.createElement('button');
        buttonElement.classList.add('button');
        buttonElement.textContent = categories.name;

        // Ajouter un gestionnaire d'événements pour filtrer la galerie au clic du bouton
        buttonElement.addEventListener('click', () => {
          // Supprimer la classe 'active' de tous les boutons
        document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));

        // Ajouter la classe 'active' au bouton actuel
        buttonElement.classList.add('active');
        const filteredWorks = filterWorksByCategory(categories);
        displayWorks(filteredWorks);
        });

        // Ajouter les boutons à la div filtres
        filtres.appendChild(buttonElement);

        // Ajouter la div filtres à portfolio et la placer avant la gallery
        portfolio.appendChild(filtres);
        portfolio.insertBefore(filtres, gallery);

        if (JSON.parse(sessionStorage.getItem("connected"))) {
          filtres.style.display = 'none';
      }
    });
    } else {
        console.error('Les catégories n\'ont pas été trouvées.');
    }
});

// APPEL API : FONCTIONS DE FILTRE 
function displayWorks(works) {
  // Supprimer tous les travaux actuellement affichés
    gallery.innerHTML = '';

  // Afficher les travaux spécifiés
    works.forEach(work => {
    const figureElement = createFigureElement(work);
    gallery.appendChild(figureElement);
    });
};

// Filtre par catégories en fonction de l'id 
function filterWorksByCategory(categories) {
    return allWorks.filter(work => work.categoryId === categories.id);
};

// PARTIE EDITION 
// A FAIRE : CACHER LA DIV FILTRES
const admin = document.getElementById('admin');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const modify = document.getElementById('modify');
const header = document.getElementById('header');

if (JSON.parse(sessionStorage.getItem("connected"))){
    login.style.display = 'none'
    logout.style.display = 'block'
    admin.style.display = 'flex'
    modify.style.display = 'inline-block'
    header.style.marginTop = '100px'   

}
else {
    login.style.display = 'block'
    logout.style.display = 'none'
    admin.style.display = 'none'
    modify.style.display = 'none'
};

logout.addEventListener("click", (event) => {
  event.preventDefault();
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("connected");
  window.location.replace("index.html");
});















