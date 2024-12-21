// fonctionsCommunes.js
const tauxChange = {
    'EUR': 1,       // L'euro est la devise de base
    'USD': 1.10,    // Dollar américain
    'GBP': 0.86,    // Livre sterling
    'CAD': 1.47,    // Dollar canadien
    'GIP': 1.09,    // Livre de Gibraltar
    'ANG': 2.12,    // Florin des Antilles néerlandaises
    'CHF': 1.10,    // Franc suisse
    'QAR': 4.31,    // Riyal qatari
    'AUD': 1.59,    // Dollar australien
    'CLP': 913.32,  // Peso chilien
    'CDF': 2361.58, // Franc congolais
    'PLN': 4.59,    // Zloty polonais
    'TWD': 34.36,   // Nouveau dollar taïwanais
    'BAM': 1.95,    // Mark convertible de Bosnie-Herzégovine
    'UGX': 4472.79, // Shilling ougandais
    'SAR': 4.43,    // Riyal saoudien
    'BGN': 1.96,    // Lev bulgare
    'CRC': 800.01,  // Colón costaricain
    'INR': 89.94,   // Roupie indienne
    'HKD': 9.18,    // Dollar de Hong Kong
    'UAH': 1,       // Hryvnia ukrainienne
    'ZAR': 2,       // Rand sud-africain
    'BRL': 1.96,    // Réal brésilien
    'ILS': 4.00     // Nouveau shekel israélien
};

const devisesNonPrisesEnCharge = new Set();

function convertirTotalCompEnDevise(totalComp, devise) {
    const deviseSelectionnee = $('#devise').val();
    const correspondanceCodeDevise = devise.match(/([A-Za-z]+)/);

    if (correspondanceCodeDevise) {
        const codeDevise = correspondanceCodeDevise[0];
        if (tauxChange.hasOwnProperty(codeDevise)) {
            const tauxConversion = tauxChange[deviseSelectionnee] / tauxChange[codeDevise];
            return totalComp * tauxConversion;
        } else {
            devisesNonPrisesEnCharge.add(codeDevise);
            console.error(`Taux de change non disponible pour la devise : ${codeDevise}`);
            return totalComp;
        }
    } else {
        console.error(`Impossible d'extraire le code de la devise de : ${devise}`);
        return totalComp;
    }
}

function chargerPays(continent) {
      // Obtenir le chemin du fichier des résultats du sondage
      const repertoireResultatsSondage = obtenirRepertoireFichiers();
      const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
  
    $.ajax({
        type: "GET",
        url: `${cheminFichier}`,
        dataType: "json",
        success: function (data) {
            try {
                let options = '<option value="tous">Tous les pays</option>';
                let paysUniques = obtenirPaysUniques(data);
                paysUniques.forEach(pays => {
                    options += `<option value="${pays}">${pays}</option>`;
                });
                $('#pays').html(options);
            } catch (e) {
                console.error("Erreur lors du traitement des données :", e);
            }
        },
        error: function (xhr, status, error) {
            console.error("Erreur lors du chargement des pays : ", error);
        }
    });
}


function obtenirPaysUniques(data) {
    return Array.from(new Set(data.map(item => item.Country)));
}

function chargerDevises() {
    const devises = Object.keys(tauxChange);
    let options = '';
    devises.forEach(devise => {
        options += `<option value="${devise}">${devise}</option>`;
    });
    $('#devise').html(options);
}


function obtenirRepertoireFichiers() {
    let repertoireResultatsSondage = "";

    // Lire la configuration depuis config.conf
    $.ajax({
        type: "GET",
        url: "../configuration.conf",
        dataType: "text",
        async: false,
        success: function (donneesConfig) {
            const lignes = donneesConfig.split('\n');
            lignes.forEach(ligne => {
                const partieSansCommentaire = ligne.split('#')[0].trim(); // Ignorer les commentaires après le #
                const parties = partieSansCommentaire.split('=');
                if (parties.length === 2) {
                    const cle = parties[0].trim();
                    const valeur = parties[1].trim();
                    if (cle === "repertoire_survey_results") {
                        repertoireResultatsSondage = valeur.replace(/["']/g, ''); // Supprimer les guillemets
                    }
                }
            });
        },
        error: function (xhr, status, erreur) {
            console.error("Erreur lors du chargement de config.conf :", erreur);
        }
    });

    // Retourner le chemin complet du fichier
    return repertoireResultatsSondage;
}

function chargerListeContinentsEtPays() {
    const continents = [
        { nom: 'Europe', val: 'WE' },
        { nom: 'Amérique du Nord', val: 'NA' }
    ];

    function genererOptions(continents) {
        return continents.map(continent => 
            `<option value="${continent.val}">${continent.nom}</option>`).join('');
    }

    const options = genererOptions(continents);
    $('#continent').html(options);

    const initialContinent = continents[0].val;

    chargerPays(initialContinent);
    
    return initialContinent;
}