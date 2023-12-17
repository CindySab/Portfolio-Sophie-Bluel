const apiWorksModal = fetch("http://localhost:5678/api/works");
const galleryModal = document.querySelector('.gallery-modal');

// DOM : Ajout des balises de la galerie modal
function createFigureModal(work) {
    const figureModal = document.createElement('figure');
    figureModal.setAttribute('data-id', work.id);
    const imageModal = document.createElement('img');
    imageModal.src = work.imageUrl;

    const iDelete = document.createElement('i');
    iDelete.className = "fa-solid fa-trash-can delete-icone";

    figureModal.appendChild(imageModal);
    figureModal.appendChild(iDelete);

    return figureModal;
};

// Appel API : Importation des projets
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

                // Ajout de l'écouteur pour chaque icône de suppression
                const deleteIcon = figureModal.querySelector('.delete-icone');
                deleteIcon.addEventListener("click", () => {
                    deleteProjectConfirm(work.id);
                });
            });
        } else {
            console.error("La galerie n'a pas été trouvée.");
        }
    });

// DOM : Ouverture de la modale au clic
const modalContainer = document.getElementById('modal-container');
const buttonModify = document.getElementById('modify');
const modalPhoto = document.getElementById('modal-photo');

buttonModify.addEventListener('click', () => {
    modalContainer.style.display = 'block'
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});

// DOM : Fermeture de la modale au clic 
const closeModal = document.getElementById('modal-close');
const overlay = document.querySelector('.overlay');

closeModal.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

// DOM : Fermeture modal 1 et ouverture modal 2
const addPhoto = document.getElementById('add-photo');
const modal = document.getElementById('modal');

addPhoto.addEventListener('click', () => {
    modal.style.display = 'none';
    modalPhoto.style.display = 'flex'
});

// DOM : Fermeture modal 2
const closeModalPhoto = document.getElementById('modal-photo-close');

closeModalPhoto.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

// DOM : Retour de la modal 1 à la modal 2
const modalReturn = document.getElementById('modal-return');

modalReturn.addEventListener('click', () => {
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});

// DOM : Preview image
const inputImage = document.getElementById("input-image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector(".p-image");
const photoImage = document.getElementById('photo-image');
const photoContainer = document.getElementById('photo-container');
const originalChildren = Array.from(photoContainer.children);
const maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo

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

// Appel API : Menu déroulant catégories
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

// DOM : Bouton valider l'ajout de projet
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

// APPEL API : ENVOI NOUVEAU PROJET AU BACKEND

// Récupérer les éléments du formulaire
const category = document.getElementById('modal-photo-category');
const title = document.getElementById('modal-photo-title');
const image = document.querySelector('input[type=file]');

// Récupérer le token depuis la session
const token = sessionStorage.getItem("Token");

// Ajouter un écouteur d'événement pour le formulaire lors de la soumission
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    // Appeler la fonction d'ajout de projet sans confirmation
    addproject(event, token);
});

// Fonction asynchrone pour ajouter un nouveau projet
async function addproject(event, token) {
    event.preventDefault();

    // Vérifier si les champs nécessaires sont renseignés
    if (!title.value || !category.value || !image.files[0]) {
        alert("Veuillez remplir tous les champs");
        return;
    }
    
    // Créer un objet FormData pour les données du formulaire
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append('image', image.files[0]);

    try {
        // Effectuer une requête POST pour ajouter le projet
        const response = await fetch("http://localhost:5678/api/works/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        // Vérifier si la requête a réussi
        if (response.ok) {
            const responseData = await response.json();

            // Créer et ajouter l'image à la galerie
            const figureModal = createFigureModal(responseData);
            galleryModal.appendChild(figureModal);

            // Ajout de l'écouteur pour l'icône de suppression du nouveau projet
            const deleteIcon = figureModal.querySelector('.delete-icone');
            deleteIcon.addEventListener("click", () => {
                deleteProjectConfirm(responseData.id);
            });

            modal.style.display = 'flex';
            modalPhoto.style.display = 'none'

            resetImage();
            title.value = '';
            category.value = '';
            // Afficher une alerte indiquant que le projet a été ajouté avec succès
            window.alert("Projet ajouté avec succès");
        }
    } catch (error) {
        console.error(error);
    }
};

// Fonction asynchrone pour supprimer un projet
async function deleteProject(id, token) {
    try {
        // Effectuer une requête DELETE pour supprimer le projet avec l'ID spécifié
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });

        // Vérifier si la requête a réussi
        if (response.ok) {

            // Afficher une alerte indiquant que le projet a été supprimé avec succès
            window.alert("Projet supprimé avec succès");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
    }
};

// Fonction de confirmation de suppression d'un projet
function deleteProjectConfirm(id) {
    // Afficher une confirmation pour la suppression du projet
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (confirmation) {
        // Appeler la fonction de suppression de projet en passant l'ID et le token en paramètres
        deleteProject(id, token); 
    } 
    
    const figureToDelete = document.querySelector(`[data-id="${id}"]`);
        if (figureToDelete) {
            figureToDelete.remove();
        }
};


