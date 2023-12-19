/*
 * @brief Requête l'API pour obtenir la liste des projets pour la modale.
 * @type {Promise<Response>} apiWorksModal - La promesse contenant la réponse de la requête.
 */
let apiWorksModal = fetch("http://localhost:5678/api/works");

/*
 * @brief Élément HTML représentant la galerie pour la modale.
 * @type {HTMLElement} galleryModal - L'élément HTML représentant la galerie pour la modale.
 */
const galleryModal = document.querySelector('.gallery-modal');


/*
 * @brief Crée un élément figure HTML pour la modale (figure, img et icône de suppression).
 * @function
 * @param {object} work - Les détails du projet.
 * @returns {HTMLElement} - L'élément figure créé pour la modale.
 */
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


/*
 * @brief Traitement de la réponse de la requête vers l'API des projets pour la modale.
 * @function
 * @param {Response} responseApiWorksModal - La réponse de la requête API pour les projets de la modale.
 * @throws {Error} - Lance une erreur si la réponse n'est pas OK.
 */
apiWorksModal
    .then(async (responseApiWorksModal) => {
        if (!responseApiWorksModal.ok) {
            throw new Error('Erreur lors de la récupération des projets');
        }

        const data = await responseApiWorksModal.json();

        if (galleryModal) {
            apiWorksModal = data;

            data.forEach(work => {
                const figureModal = createFigureModal(work);
                galleryModal.appendChild(figureModal);

                const deleteIcon = figureModal.querySelector('.delete-icone');
                deleteIcon.addEventListener("click", () => {
                    deleteProjectConfirm(work.id);
                });
            });
        } else {
            console.error("La galerie n'a pas été trouvée.");
        }
    });


// GESTION D'AFFICHAGE DES MODALES
/*
 * @brief Éléments HTML liés aux modales.
 * @type {HTMLElement} modalContainer - L'élément HTML représentant le conteneur de la modale.
 * @type {HTMLElement} buttonModify - L'élément HTML représentant le bouton de modification.
 * @type {HTMLElement} modalPhoto - L'élément HTML représentant la modale d'ajout de projets.
 */
const modalContainer = document.getElementById('modal-container');
const buttonModify = document.getElementById('modify');
const modalPhoto = document.getElementById('modal-photo');

/*
 * @brief Ajoute un écouteur d'événement au bouton de modification.
 * @brief Affiche la modale et masque la modale d'ajout de projet.
 * @event click
 */
buttonModify.addEventListener('click', () => {
    modalContainer.style.display = 'block'
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});


// FERMETURE ET OUVERTURE MODALES 
/*
 * @brief Eléments HTML liés à la modale
 * @type {HTMLElement} closeModal - L'élément HTML représentant le bouton de fermeture de la modale principale.
 * @type {HTMLElement} overlay - L'élément HTML représentant l'overlay.
 * @type {HTMLElement} addPhoto - L'élément HTML représentant le bouton d'ajout de photo.
 * @type {HTMLElement} modal - L'élément HTML représentant la modale.
 * @type {HTMLElement} closeModalPhoto - L'élément HTML représentant le bouton de fermeture de la modale d'ajout de projet.
 * @type {HTMLElement} modalReturn - L'élément HTML représentant le bouton de retour à la modale principale depuis la modale ajout de projet.
 */
const closeModal = document.getElementById('modal-close');
const overlay = document.querySelector('.overlay');
const addPhoto = document.getElementById('add-photo');
const modal = document.getElementById('modal');
const closeModalPhoto = document.getElementById('modal-photo-close');
const modalReturn = document.getElementById('modal-return');

/*
 * @brief Ajoute un écouteur d'événement au bouton de fermeture de la modale principale.
 * @brief Masque la modale.
 * @event click
 */
closeModal.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

/*
 * @brief Ajoute un écouteur d'événement à l'overlay.
 * @brief Masque les modales.
 * @event click
 */
overlay.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

/*
 * @brief Ajoute un écouteur d'événement au bouton d'ajout de photo.
 * @brief Masque la modale principale et affiche la modale d'ajout de projet.
 * @event click
 */
addPhoto.addEventListener('click', () => {
    modal.style.display = 'none';
    modalPhoto.style.display = 'flex'
});

/*
 * @brief Ajoute un écouteur d'événement au bouton de fermeture de la modale d'ajout de projet.
 * Masque les modales.
 * @event click
 */
closeModalPhoto.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

/*
 * @brief Ajoute un écouteur d'événement au bouton de retour à la modale principale depuis la modale d'ajout de projet.
 * @brief Masque la modale d'ajout de projet et affiche la modale principale.
 * @event click
 */
modalReturn.addEventListener('click', () => {
    modalPhoto.style.display = 'none'
    modal.style.display = 'flex'
});


// FORMULAIRE AJOUT DE PROJET
/*
 * @brief Éléments HTML liés à la gestion du formulaire d'ajout de projet.
 * @type {HTMLElement} inputImage - L'élément HTML représentant le champ de téléchargement d'image.
 * @type {HTMLElement} labelImage - L'élément HTML représentant l'étiquette 'ajouter des photos' associée au champ de téléchargement d'image.
 * @type {HTMLElement} pImage - L'élément HTML représentant le paragraphe pour afficher les informations de taille maximum de l'image.
 * @type {HTMLElement} photoImage - L'élément HTML représentant la balise image pour afficher l'image.
 * @type {HTMLElement} photoContainer - L'élément HTML représentant le conteneur pour afficher l'image.
 * @type {Array<HTMLElement>} originalChildren - Un tableau d'éléments HTML représentant les enfants originaux du conteneur d'image (icône, label, input et p)
 * @type {number} maxSize - La taille maximale autorisée pour une image (en octets).
 */
const inputImage = document.getElementById("input-image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector(".p-image");
const photoImage = document.getElementById('photo-image');
const photoContainer = document.getElementById('photo-container');
const originalChildren = Array.from(photoContainer.children);
const maxSize = 4 * 1024 * 1024;


/*
 * @brief Réinitialise la gestion des images.
 * @brief Rétablit l'affichage des éléments originaux et réinitialise le conteneur d'image.
 * @function
 */
function resetImage() {

    labelImage.style.display = "";
    pImage.style.display = "";
    photoImage.style.display = "";
    photoContainer.innerHTML = "";

    for (const child of originalChildren) {
        photoContainer.appendChild(child);
    }
    inputImage.value = "";
};


/*
 * @brief Écouteur d'événement au champ de téléchargement d'image 
 * (afficher l'aperçu de l'image selectionnée, vérifier la taille, et ajouter un bouton de réinitialisation).
 * @event change
 */
inputImage.addEventListener("change", function () {
    const selectedImage = inputImage.files[0]; 
    
    photoContainer.innerHTML = "";

    if (selectedImage) {
            if (selectedImage.size > maxSize) {
                alert("La taille de l'image dépasse 4 Mo. Veuillez choisir une image plus petite.");
                resetImage();
                return;
            };

    const imgPreview = document.createElement("img"); 
    imgPreview.src = URL.createObjectURL(selectedImage);

    imgPreview.style.maxHeight = "100%";
    imgPreview.style.width = "auto";
    imgPreview.style.position = "relative";

    photoContainer.appendChild(imgPreview);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'X';

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


/*
 * @brief Requête l'API pour obtenir la liste des catégories, création des options et label et atribution d'un id.
 * @type {Promise<Response>} reponseCategory - La promesse contenant la réponse de la requête.
 */
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


// VALIDATION FORMULAIRE
/*
 * @brief Éléments liés à la validation du formulaire :
 * - @type {HTMLElement} buttonValidePhoto - Bouton de validation du formulaire.
 * - @type {HTMLElement} modalPhotoTitle - Champ de saisie du titre du projet dans le formulaire.
 * - @type {HTMLElement} modalPhotoCategory - Liste déroulante des catégories dans le formulaire.
 * - @type {HTMLElement} formulaire - Formulaire de gestion d'ajout de projet.
 */
const buttonValidePhoto = document.getElementById('valide-photo');
const modalPhotoTitle = document.getElementById('modal-photo-title');
const modalPhotoCategory = document.getElementById('modal-photo-category');
const formulaire = document.getElementById('form-project');

/*
 * @brief Vérifie si le formulaire est valide en fonction des champs remplis.
 * @brief Change la couleur de fond du bouton de validation en conséquence.
 * @function
 */
function formValide (){
    if (modalPhotoTitle.value.trim() !== '' && modalPhotoCategory.value !== '' && inputImage.value !== '') {
        buttonValidePhoto.style.backgroundColor = '#1D6154'; 
    } else {
        buttonValidePhoto.style.backgroundColor = '';
    }
};

/*
 * @brief Ajoute un écouteur d'événement au formulaire pour vérifier la validité en temps réel.
 * @event input
 */
formulaire.addEventListener ('input', formValide);


// AJOUT DE PROJET AU BACKEND
/*
 * @brief Éléments liés à l'envoi du formulaire au backend :
 * @type {HTMLElement} category - Liste déroulante des catégories dans le formulaire.
 * @type {HTMLElement} title - Champ de saisie du titre du projet dans le formulaire.
 * @type {HTMLElement} image - Champ de téléchargement d'image dans le formulaire.
 * @type {string | null} token - Jeton d'authentification de session.
 */
const category = document.getElementById('modal-photo-category');
const title = document.getElementById('modal-photo-title');
const image = document.querySelector('input[type=file]');
const token = sessionStorage.getItem("Token");

/*
 * @brief Ajoute un écouteur d'événement à la soumission du formulaire pour empêcher le comportement par défaut, 
 * puis appelle la fonction addproject avec l'événement et le jeton d'authentification.
 * @event submit
 */
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    addproject(event, token);
});

/*
 * @brief Fonction asynchrone pour ajouter un projet, appelée lors de la soumission du formulaire.
 * @function
 * @async
 * @param {Event} event - Objet d'événement de la soumission du formulaire.
 * @param {string | null} token - Jeton d'authentification de session.
 */
async function addproject(event, token) {
    event.preventDefault();

    if (!title.value.trim() || !category.value || !image.files[0]) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append('image', image.files[0]);

    try {
        const response = await fetch("http://localhost:5678/api/works/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        if (response.ok) {
            const responseData = await response.json();

            const figure = createFigureElement(responseData);
            const gallery = document.querySelector('.gallery');
            gallery.appendChild(figure);

            const figureModal = createFigureModal(responseData);
            galleryModal.appendChild(figureModal);

            const deleteIcon = figureModal.querySelector('.delete-icone');
            deleteIcon.addEventListener("click", () => {
                deleteProjectConfirm(responseData.id);
            });

            modal.style.display = 'flex';
            modalPhoto.style.display = 'none'

            resetImage();
            title.value = '';
            category.value = '';

            window.alert("Projet ajouté avec succès");
        }
    } catch (error) {
        console.error(error);
    }
};


// SUPPRESSION DE PROJET
/*
 * @brief Fonction asynchrone pour supprimer un projet.
 * @function
 * @async
 * @param {number} id - Identifiant du projet à supprimer.
 * @param {string | null} token - Jeton d'authentification de session.
 */
async function deleteProject(id, token) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            window.alert("Projet supprimé avec succès");
        }

    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
    }
};

/*
 * @brief Fonction pour confirmer la suppression d'un projet.
 * @function
 * @param {number} id - Identifiant du projet à supprimer.
 */
function deleteProjectConfirm(id) {

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (confirmation) {
        deleteProject(id, token); 
    }
    const figureToDelete = document.querySelector(`[data-id="${id}"]`);
        if (figureToDelete) {
            figureToDelete.remove();         
        }
};