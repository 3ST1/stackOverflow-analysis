$(document).ready(function () {
    $("#headerContainer").load("header.html", function () {
        var script = document.createElement('script');
        script.src = '../js/header.js';
        document.body.appendChild(script);

        // Appeler la fonction pour vérifier la page actuelle et sélectionner le bouton radio correspondant
        verifierPageActuelle();
    });
});

// Fonction pour vérifier la page actuelle et sélectionner le bouton radio correspondant
function verifierPageActuelle() {
    var pageActuelle = window.location.pathname.split('/').pop(); // Obtenir le nom de la page actuelle
    var radios = document.getElementsByName('menu');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].getAttribute('data-page') === pageActuelle) {
            radios[i].checked = true;
            break;
        }
    }
}
