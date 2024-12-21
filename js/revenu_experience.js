$(document).ready(function () {

    // Define a dictionary to map education labels to their values
    const educationLabelDict = {
        0: "Something else",
        1: "Primary/elementary school",
        2: "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)",
        3: "Some college/university study without earning a degree",
        4: "Associate degree (A.A., A.S., etc.)",
        5: "Bachelor’s degree (B.A., B.S., B.Eng., etc.)",
        6: "Master’s degree (M.A., M.S., M.Eng., MBA, etc.)",
        7: "Professional degree (JD, MD, Ph.D, Ed.D, etc.)",    
    };

    chargerContinents();
    function chargerContinents() {
        initialContinent = chargerListeContinentsEtPays()
        chargerDevises();
        chargerGraphiqueExperience(initialContinent, "tous");
        chargerGraphiqueEducation(initialContinent, "tous");
    }

    $('#continent').change(function () {
        const continent = $(this).val();
        chargerPays(continent);
        chargerGraphiqueExperience(continent, "tous");
        chargerGraphiqueEducation(continent, "tous");
    });

    $('#pays').change(function () {
        const continent = $('#continent').val();
        const pays = $('#pays').val();
        chargerGraphiqueExperience(continent, pays);
        chargerGraphiqueEducation(continent, pays);
    });

    $('#devise').change(function () {
        const continent = $('#continent').val();
        const pays = $('#pays').val();
        chargerGraphiqueExperience(continent, pays);
        chargerGraphiqueEducation(continent, pays);
    });
    
    
    function chargerGraphiqueExperience(continent, pays) {
        // Obtenir le chemin du fichier des résultats du sondage
        const repertoireResultatsSondage = obtenirRepertoireFichiers();
        const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
    
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'graphique-experience';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }

                if (!pays) {
                    [annees, valeursMoyennes] = traiterDonneesExperience("tous", jsonData);
                } else {
                    [annees, valeursMoyennes] = traiterDonneesExperience(pays, jsonData);
                }
    
                const ctx = document.getElementById(canvasId).getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'line',  // Change 'bar' to 'line'
                    data: {
                        labels: annees,
                        datasets: [{
                            label: `Revenu Moyen en ${$('#devise').val()} en fonction de l'Expérience professionnelle en Codage`,
                            data: valeursMoyennes,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: "Années d'Expérience professionnelle en Codage"
                                }
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: `Revenu Moyen en ${$('#devise').val()}`
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: false,
                                text: `Revenu moyen en fonction de l'Expérience professionnelle en Codage`
                            }
                        }
                    }
                });
                
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    }

    function chargerGraphiqueEducation(continent, pays) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'graphique-education';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }

                if (!pays) {
                    [labelsEducation, valeursEducation] = traiterDonneesEducation("tous", jsonData);
                } else {
                    [labelsEducation, valeursEducation] = traiterDonneesEducation(pays, jsonData);
                }
    
                const ctx = document.getElementById(canvasId).getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labelsEducation,
                        datasets: [{
                            label: `Revenu moyen en ${$('#devise').val()} en fonction du Niveau de Diplôme`,
                            data: valeursEducation,
                            backgroundColor: 'rgba(192, 75, 192, 0.2)',
                            borderColor: 'rgba(192, 75, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: `Revenu moyen en ${$('#devise').val()}`
                                }
                            },
                            y: {
                                type: 'category',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Niveau de Diplôme'
                                },
                                ticks: {
                                    callback: function (value) {
                                        return value.length > 20 ? value.substr(0, 20) + '...' : value;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    }

    function traiterDonneesExperience(pays, jsonData) {
        let donneesFiltrees;
    
        if (pays == "tous") {
            // Si le pays est défini sur "tous", ne pas filtrer par pays
            donneesFiltrees = jsonData;
        } else {
            donneesFiltrees = jsonData.filter(item => item.Country === pays);
        }
    
        const donneesParAnnees = {};
    
        donneesFiltrees.forEach(item => {
            const anneesCodePro = item.YearsCodePro;
            const compTotal = parseInt(item.CompTotal) || 0;
    
            if (compTotal >= 1000 && compTotal <= 500000) {
                if (!donneesParAnnees[anneesCodePro]) {
                    donneesParAnnees[anneesCodePro] = [];
                }
                donneesParAnnees[anneesCodePro].push(convertirTotalCompEnDevise(compTotal, item.Currency));
            }
        });
    
        const annees = Object.keys(donneesParAnnees);
        const valeursMoyennes = annees.map(annee => {
            const valeurs = donneesParAnnees[annee];
            return valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length;
        });
   
        return [annees, valeursMoyennes];
    }
    

    function traiterDonneesEducation(pays, jsonData) {
        let donneesFiltrees;
    
        if (pays == "tous") {
            // Si le pays est défini sur "tous", ne pas filtrer par pays
            donneesFiltrees = jsonData;
        } else {
            donneesFiltrees = jsonData.filter(item => item.Country === pays);
        }
    
        const donneesEducation = {};
    
        donneesFiltrees.forEach(item => {
            const niveauEducation = item.EdLevel;
    
            if (!donneesEducation[niveauEducation]) {
                donneesEducation[niveauEducation] = [];
            }
    
            const compTotal = parseInt(item.CompTotal) || 0;
            if (compTotal >= 1000 && compTotal <= 1000000) {
                donneesEducation[niveauEducation].push(convertirTotalCompEnDevise(compTotal, item.Currency));
            }
        });
    
        const labelsEducation = Object.keys(donneesEducation);
    
        // Trier les labelsEducation en fonction de l'ordre des valeurs dans educationLabelDict
        labelsEducation.sort((a, b) => {
            const ordreA = Object.values(educationLabelDict).indexOf(a);
            const ordreB = Object.values(educationLabelDict).indexOf(b);
            return ordreA - ordreB;
        });
    
        const valeursEducation = labelsEducation.map(label => {
            const valeurs = donneesEducation[label];
            return valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length;
        });
    
        return [labelsEducation, valeursEducation];
    }

});
