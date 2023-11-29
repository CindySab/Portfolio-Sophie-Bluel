const apiWorks = fetch("http://localhost:5678/api/works");
const categories = fetch("http://localhost:5678/api/categories");
const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');
const buttonFiltre = document.querySelector('.button');
let allWorks = [];

function createFigureElement(work) {
    const figureElement = document.createElement('figure');
    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;

    const titleElement = document.createElement('figcaption');
    titleElement.textContent = work.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);

    return figureElement;
}

function displayWorks(works) {
  // Supprimer tous les travaux actuellement affichés
    gallery.innerHTML = '';

  // Afficher les travaux spécifiés
    works.forEach(work => {
    const figureElement = createFigureElement(work);
    gallery.appendChild(figureElement);
    });
};

apiWorks
    .then(async (responseApiWorks) => {
    if (!responseApiWorks.ok) {
    throw new Error('Erreur lors de la récupération des projets');
    }

    const data = await responseApiWorks.json();

    if (gallery) {
    allWorks = data;
      // Créer et ajouter l'image et le titre à la div gallery
    data.forEach(work => {
        const figureElement = createFigureElement(work);
        gallery.appendChild(figureElement);
    });
    } else {
        console.error("La galerie n'a pas été trouvée.");
    }
});

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
    displayAllWorks();
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
    });
    } else {
        console.error('Les catégories n\'ont pas été trouvées.');
    }
});

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categories) {
    return allWorks.filter(work => work.categoryId === categories.id);
};

// Fonction pour afficher tous les travaux dans la galerie
function displayAllWorks() {
    displayWorks(allWorks);
};
















