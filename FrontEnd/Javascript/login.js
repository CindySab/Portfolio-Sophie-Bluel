/*
 * @brief Sélectionne les éléments HTML et les stocke dans des variables.
 * @type {HTMLInputElement} inputEmail - Champ d'entrée pour l'adresse e-mail.
 * @type {HTMLInputElement} inputPassword - Champ d'entrée pour le mot de passe.
 * @type {HTMLButtonElement} button - Bouton de connexion.
 * @type {HTMLElement} error - Élément HTML pour afficher les messages d'erreur.
 */
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const button = document.querySelector("#button");
const error = document.querySelector("#error");

/*
 * @brief Ajoute un écouteur d'événement au bouton de connexion pour vérifier si les champs sont vides.
 * @brief Affiche un message d'erreur si le champ d'e-mail est vide.
 * @event click
 */
button.addEventListener("click", function () {
    if (inputEmail.value.length < 1) {
        error.innerText = "*Veuillez remplir tous les champs svp";
        error.style.display = "block";

        return;
    }
});

/*
 * @brief Ajoute un écouteur d'événement au champ d'e-mail pour masquer le message d'erreur.
 * @event input
 */
inputEmail.addEventListener("input", function () {
    error.style.display = "none";
});

/*
 * @brief Ajoute un écouteur d'événement au bouton de connexion pour effectuer une requête API de connexion.
 * @brief Empêche le comportement par défaut du formulaire.
 * @event click
 * @param {Event} a - L'événement de clic.
 */
let connexion = button.addEventListener("click", (a) => {
    a.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message || data.error) {
                alert("Erreur: l'identifiant ou le mot de passe ne sont pas correct");
            } else {
                // Enregistre dans la session que l'utilisateur est connecté et stocke le token.
                sessionStorage.setItem("connected", JSON.stringify(true));
                sessionStorage.setItem("Token", data.token);

                window.location.replace("index.html");
            }
        });
});
