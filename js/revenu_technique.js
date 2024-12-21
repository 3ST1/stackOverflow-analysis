$(document).ready(function () {

    chargerContinents();
    function chargerContinents() {
        initialContinent = chargerListeContinentsEtPays()
        chargerDevises();
        chargerGraphiquePlateformesCloud(initialContinent, "tous", $('#experience').val());
        chargerGraphiqueFrameworksWeb(initialContinent, "tous", $('#experience').val());
    }

    $('#continent').change(function () {
        const continent = $(this).val();
        chargerPays(continent);
        chargerGraphiquePlateformesCloud(continent, "tous", $('#experience').val());
        chargerGraphiqueFrameworksWeb(continent, "tous", $('#experience').val());
    });


    $('#pays, #experience').change(function () {
        const continent = $('#continent').val();
        const pays = $('#pays').val();
        const experience = $('#experience').val();
        chargerGraphiquePlateformesCloud(continent, pays, experience);
        chargerGraphiqueFrameworksWeb(continent, pays, experience);
    });

    $('#devise').change(function () {
        const continent = $('#continent').val();
        const pays = $('#pays').val();
        const experience = $('#experience').val();
        chargerGraphiquePlateformesCloud(continent, pays, experience);
        chargerGraphiqueFrameworksWeb(continent, pays, experience);
    });

    function chargerGraphiquePlateformesCloud(continent, pays, experience) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'graphique-plateformes-cloud';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }
    
                let plateformes, valeurs, tailles;
    
                if (!pays) {
                    [plateformes, valeurs, tailles] = traiterDonneesPlateformesCloud("tous", experience, jsonData);
                } else {
                    [plateformes, valeurs, tailles] = traiterDonneesPlateformesCloud(pays, experience, jsonData);
                }
    
                // Créer un tableau d'objets pour stocker les plateformes avec les valeurs et tailles
                const pointsDonnees = plateformes.map((label, index) => ({
                    plateforme: label,
                    valeur: valeurs[index],
                    taille: tailles[index]
                }));
    
                // Trier le tableau pointsDonnees en fonction de la propriété 'taille'
                pointsDonnees.sort((a, b) => a.taille - b.taille);
    
                // Extraire les plateformes, valeurs et tailles triées du tableau pointsDonnees trié
                const plateformesTriees = pointsDonnees.map(dataPoint => dataPoint.plateforme);
                const valeursTriees = pointsDonnees.map(dataPoint => dataPoint.valeur);
                const taillesTriees = pointsDonnees.map(dataPoint => dataPoint.taille);
    
                const ctx = document.getElementById(canvasId).getContext('2d');
                const monGraphique = new Chart(ctx, {
                    type: 'bubble',
                    data: {
                        labels: plateformesTriees,
                        datasets: [{
                            label: `Revenu moyen en ${$('#devise').val()} en fonction des Plateformes Cloud`,
                            data: plateformesTriees.map((label, index) => ({
                                x: label,
                                y: valeursTriees[index],
                                r: taillesTriees[index]
                            })),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Plateformes Cloud'
                                }
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: `Revenu moyen en ${$('#devise').val()}`
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `Revenu moyen : ${context.parsed.y} ${$('#devise').val()}`;
                                    }
                                }
                            }
                        }
                    }
    
                });
            },
            error: function (xhr, status, error) {
                alert("Erreur : " + error);
            }
        });
    }
    
    
    function chargerGraphiqueFrameworksWeb(continent, pays, experience) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'graphique-frameworks-web';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }
    
                let frameworks, valeurs;
    
                if (!pays) {
                    [frameworks, valeurs] = traiterDonneesFrameworksWeb("tous", experience, jsonData);
                } else {
                    [frameworks, valeurs] = traiterDonneesFrameworksWeb(pays, experience, jsonData);
                }
    
                // Combiner les frameworks et valeurs dans un tableau d'objets
                const pointsDonnees = frameworks.map((label, index) => ({
                    framework: label,
                    valeur: valeurs[index]
                }));
    
                // Trier le tableau pointsDonnees en fonction de la propriété 'valeur'
                pointsDonnees.sort((a, b) => a.valeur - b.valeur);
    
                // Extraire les frameworks et valeurs triés du tableau pointsDonnees trié
                const frameworksTriés = pointsDonnees.map(dataPoint => dataPoint.framework);
                const valeursTriées = pointsDonnees.map(dataPoint => dataPoint.valeur);
    
                const ctx = document.getElementById(canvasId).getContext('2d');
                const monGraphique = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: frameworksTriés,
                        datasets: [{
                            label: `Revenu moyen en ${$('#devise').val()} en fonctions des Frameworks Web`,
                            data: valeursTriées,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Frameworks Web'
                                }
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: `Revenu moyen en ${$('#devise').val()}`
                                }
                            }
                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                alert("Erreur : " + error);
            }
        });
    }
    
    
    // Fonction pour traiter les données du graphique des plateformes Cloud
    function traiterDonneesPlateformesCloud(pays, experience, jsonData) {
        let donneesFiltrees;
    
        if (pays == "tous") {
            // Si pays est défini sur "tous" ne pas filtrer par pays
            donneesFiltrees = jsonData;
        } else {
            donneesFiltrees = jsonData.filter(item => item.Country === pays);
        }
    
        // Appliquer un filtrage en fonction de l'expérience
        if (experience == "5-10") {
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro >= 5 && item.YearsCodePro <= 10);
        } else if (experience == "10+") {
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro > 10);
        } else if (experience == "0") {
            // pas de filtrage car on veut toutes les expériences
        } else {
            // pour les valeurs correspondant à un chiffre
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro === experience);
        }
    
        let donneesPlateformes = {};
    
        donneesFiltrees.forEach(item => {
            let plateformes = item.PlatformHaveWorkedWith.split(';');
            plateformes.forEach(plateforme => {
                if (!donneesPlateformes[plateforme]) {
                    donneesPlateformes[plateforme] = [];
                }
                let compTotal = parseInt(item.CompTotal) || 0;
                if (compTotal >= 1000 && compTotal <= 500000) {
                    let valeurConvertie = convertirTotalCompEnDevise(compTotal, item.Currency);
                    donneesPlateformes[plateforme].push(valeurConvertie);
                }
            });
        });
    
        let labelsPlateformes = Object.keys(donneesPlateformes);
        let valeursPlateformes = labelsPlateformes.map(label => {
            let valeurs = donneesPlateformes[label];
            return valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length;
        });
    
    
        // Ajuster la taille des bublles pour n epas avoir des bulles trop grandes
        let tauxConversion = 1; // Valeur par défaut au cas où elle n'est pas trouvée
    
        const deviseSelectionnee = $('#devise').val();
        const correspondanceCodeDevise = deviseSelectionnee.match(/([A-Za-z]+)/);
    
        if (correspondanceCodeDevise) {
            const codeDevise = correspondanceCodeDevise[0];
            if (tauxChange.hasOwnProperty(codeDevise)) {
                tauxConversion = tauxChange[codeDevise];
            }
        }
    
        let taillesPlateformes = labelsPlateformes.map(label => {
            let avgCompTotal = valeursPlateformes[labelsPlateformes.indexOf(label)];
            let taille = avgCompTotal * 0.0001;
    
            return taille / tauxConversion;
        });
    
        return [labelsPlateformes, valeursPlateformes, taillesPlateformes];
    }
    
    
    // Fonction pour traiter les données du graphique des frameworks Web
    function traiterDonneesFrameworksWeb(pays, experience, jsonData) {
        let donneesFiltrees;
    
        if (pays == "tous") {
            // Si pays est défini sur "tous" ne pas filtrer par pays
            donneesFiltrees = jsonData;
        } else {
            donneesFiltrees = jsonData.filter(item => item.Country === pays);
        }
    
        // Appliquer un filtrage supplémentaire en fonction de l'expérience
        if (experience == "5-10") {
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro >= 5 && item.YearsCodePro <= 10);
        } else if (experience == "10+") {
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro > 10);
        } else if (experience == "0") {
            // pas de filtrage car on veut toutes les expériences
        } else {
            // pour les valeurs correspondant à un chiffre
            donneesFiltrees = donneesFiltrees.filter(item => item.YearsCodePro === experience);
        }
    
        let donneesFrameworks = {};
    
        donneesFiltrees.forEach(item => {
            let frameworks = item.WebframeHaveWorkedWith.split(';');
            frameworks.forEach(framework => {
                if (!donneesFrameworks[framework]) {
                    donneesFrameworks[framework] = [];
                }
                let compTotal = parseInt(item.CompTotal) || 0;
                if (compTotal >= 1000 && compTotal <= 500000) {
                    let valeurConvertie = convertirTotalCompEnDevise(compTotal, item.Currency);
                    donneesFrameworks[framework].push(valeurConvertie);
                }
            });
        });
    
        let labelsFrameworks = Object.keys(donneesFrameworks);
        let valeursFrameworks = labelsFrameworks.map(label => {
            let valeurs = donneesFrameworks[label];
            return valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length;
        });
    
        return [labelsFrameworks, valeursFrameworks];
    }
    

});
