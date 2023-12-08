const apiWorksModal = fetch("http://localhost:5678/api/works");
const galleryModal = document.querySelector('.gallery-modal');


// AJOUT DES BALISES DE LA GALERIE MODAL
function createFigureModal(work) {
    const figureModal = document.createElement('figure');
    const imageModal = document.createElement('img');
    imageModal.src = work.imageUrl;

    const iDelete = document.createElement('i');
    iDelete.className = "fa-solid fa-trash-can";

    figureModal.appendChild(imageModal);
    figureModal.appendChild(iDelete);

    return figureModal;
};

// IMPORTATION DES PROJETS 
apiWorksModal
    .then(async (responseApiWorksModal) => {
    if (!responseApiWorksModal.ok) {
    throw new Error('Erreur lors de la récupération des projets');
    }

    const data = await responseApiWorksModal.json();

    if (galleryModal) {
    allWorksModal = data;
      // Créer et ajouter l'image 
    data.forEach(work => {
        const figureModal = createFigureModal(work);
        galleryModal.appendChild(figureModal);
    });
    } else {
        console.error("La galerie n'a pas été trouvée.");
    }
});

// OUVERTURE DE LA MODALE AU CLIC

const modalContainer = document.getElementById('modal-container');
const buttonModify = document.getElementById('modify');
const modalPhoto = document.getElementById('modal-photo');

buttonModify.addEventListener('click', ()=>{
    modalContainer.style.display = 'block'
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});


// FERMETURE DE LA MODALE AU CLIC 

const closeModal = document.getElementById('modal-close');
const overlay = document.querySelector('.overlay');

closeModal.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

overlay.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

// FERMETURE MODAL 1 ET OUVERTURE MODAL 2

const addPhoto = document.getElementById('add-photo');
const modal = document.getElementById('modal');

addPhoto.addEventListener('click', ()=>{
    modal.style.display = 'none';
    modalPhoto.style.display = 'flex'
});

// FERMETURE MODAL 2

const closeModalPhoto = document.getElementById('modal-photo-close');

closeModalPhoto.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

// RETOUR DE LA MODAL 1 A LA MODALE 2

const modalReturn = document.getElementById('modal-return');

modalReturn.addEventListener('click', ()=>{
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});

