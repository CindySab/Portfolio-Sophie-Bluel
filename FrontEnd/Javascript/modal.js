const apiWorksModal = fetch("http://localhost:5678/api/works");
const galleryModal = document.querySelector('.gallery-modal');


// DOM : AJOUT DES BALISES DE LA GALERIE MODAL
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

// APPEL API : IMPORTATION DES PROJETS 
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

// DOM : OUVERTURE DE LA MODALE AU CLIC

const modalContainer = document.getElementById('modal-container');
const buttonModify = document.getElementById('modify');
const modalPhoto = document.getElementById('modal-photo');

buttonModify.addEventListener('click', ()=>{
    modalContainer.style.display = 'block'
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});


// DOM : FERMETURE DE LA MODALE AU CLIC 

const closeModal = document.getElementById('modal-close');
const overlay = document.querySelector('.overlay');

closeModal.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

overlay.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

// DOM : FERMETURE MODAL 1 ET OUVERTURE MODAL 2

const addPhoto = document.getElementById('add-photo');
const modal = document.getElementById('modal');

addPhoto.addEventListener('click', ()=>{
    modal.style.display = 'none';
    modalPhoto.style.display = 'flex'
});

// DOM : FERMETURE MODAL 2

const closeModalPhoto = document.getElementById('modal-photo-close');

closeModalPhoto.addEventListener('click', ()=>{
    modalContainer.style.display = 'none';
});

// DOM : RETOUR DE LA MODAL 1 A LA MODALE 2

const modalReturn = document.getElementById('modal-return');

modalReturn.addEventListener('click', ()=>{
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});

// DOM : PREVIEW IMAGE
const inputImage = document.getElementById("input-image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector(".p-image");
const photoImage = document.getElementById('photo-image');
const photoContainer = document.getElementById('photo-container');
const originalChildren = Array.from(photoContainer.children);
const maxSizeInBytes = 3 * 1024 * 1024; // 4 Mo

function resetImage() {
    // Réinitialisez l'aperçu de l'image et rétablissez les éléments d'origine
    labelImage.style.display = "";
    pImage.style.display = "";
    photoImage.style.display = "";
    photoContainer.innerHTML = ""; // Supprimez tous les enfants de photoContainer, y compris le bouton de réinitialisation

    // Rétablissez les éléments d'origine
    for (const child of originalChildren) {
        photoContainer.appendChild(child);
    }

    // Réinitialisez également la valeur de l'input pour permettre à l'utilisateur de choisir à nouveau un fichier
    inputImage.value = "";
}

inputImage.addEventListener("change", function () {
    const selectedImage = inputImage.files[0];

    // Supprimez tous les enfants de photoContainer avant d'ajouter le nouvel aperçu
    photoContainer.innerHTML = "";

    if (selectedImage) {
            // Vérifiez si la taille du fichier est inférieure à 4 Mo
            if (selectedImage.size > maxSizeInBytes) {
                alert("La taille de l'image dépasse 4 Mo. Veuillez choisir une image plus petite.");
                resetImage(); // Réinitialisez l'interface utilisateur
                return;
            };

    const imgPreview = document.createElement("img");
    imgPreview.src = URL.createObjectURL(selectedImage);
    imgPreview.style.maxHeight = "100%";
    imgPreview.style.width = "auto";
    imgPreview.style.position = "relative";

    // Ajoutez l'aperçu de l'image
    photoContainer.appendChild(imgPreview);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'X'; // Utilisez une croix comme contenu du bouton
    resetButton.style.position = "absolute";
    resetButton.style.top = "120px";
    resetButton.style.right = "110px";
    resetButton.style.backgroundColor = "transparent";
    resetButton.style.border = "none";
    resetButton.style.fontSize = "15px";
    resetButton.style.cursor = "pointer";

    resetButton.addEventListener('click', resetImage);
    photoContainer.appendChild(resetButton);
    }
});

// APPEL API : MENU DEROULANT CATEGORIES

const reponseCategory = fetch('http://localhost:5678/api/categories')
.then((response) => response.json())
.then((data) => {
    data.forEach((category) => {
    const categoryOption = document.createElement('option')
    const categoryLabel = document.createElement('label')

    categoryOption.setAttribute('value', category.id)
    categoryLabel.innerHTML = category.name

    modalPhotoCategory.appendChild(categoryOption)
    categoryOption.appendChild(categoryLabel)
});
});

// DOM : BOUTON VALIDER L'AJOUT DE PORJET

const buttonValidePhoto = document.getElementById('valide-photo');
const modalPhotoTitle = document.getElementById('modal-photo-title');
const modalPhotoCategory = document.getElementById('modal-photo-category');
const formulaire = document.getElementById('form-project');

function formValide (){
    if (modalPhotoTitle.value !== '' && modalPhotoCategory.value !== '' && inputImage.value !== '') {
        buttonValidePhoto.style.backgroundColor = '#1D6154';
    } else {
        buttonValidePhoto.style.backgroundColor = '';
    }
};

formulaire.addEventListener ('input', formValide);

formulaire.addEventListener ('submit', function (event){
    if (modalPhotoTitle.value === '' || modalPhotoCategory.value === '' || inputImage.value === '') {
        event.preventDefault(); // Empêche l'envoi du formulaire s'il manque des informations
    }
});

// APPEL API : ENVOI NOUVEAU PROJET AU BACKEND

