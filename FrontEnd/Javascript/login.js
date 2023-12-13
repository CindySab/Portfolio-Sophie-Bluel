const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const button = document.querySelector('#button');
const error = document.querySelector('#error');

// DOM : MESSAGE D'ERREUR SI CHAMPS VIDES
button.addEventListener('click', function(){
    if (inputEmail.value.length<1){
        error.innerText = "*Veuillez remplir tous les champs svp"
        error.style.display = "block";
        
        return
    }
});

inputEmail.addEventListener('input', function(){
    error.style.display = "none";
});

// APPEL API : CONNEXION
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
                alert("Erreur: l\'identifiant ou le mot de passe ne sont pas correct");
            } else {
                sessionStorage.setItem("connected", JSON.stringify(true));
                sessionStorage.setItem("Token", data.token);
                window.location.replace("index.html");
            }
        })
});