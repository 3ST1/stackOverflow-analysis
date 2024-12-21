$(document).ready(function () {
    let selectedContinent;

    chargerContinents();
    function chargerContinents() {
        initialContinent = chargerListeContinentsEtPays()
        chargerGraphiqueOS(initialContinent, "tous", $('#nbrTop').val());
        chargerGraphiqueCommunication(initialContinent, "tous", $('#nbrTop').val());
    }

    
   
    // Appeler chargerMetiers avec la valeur du continent
    selectedContinent = $('#continent').val();
    chargerMetiers(selectedContinent);

    // Traitement dans le cas ou le continent est changé
    $('#continent').change(function () {
        selectedContinent = $(this).val();
        chargerMetiers(selectedContinent);
        chargerGraphiqueOS(selectedContinent, "tous", $('#nbrTop').val());
        chargerGraphiqueCommunication(selectedContinent, "tous", $('#nbrTop').val());
        majMetierTexte("Tous les métiers")

    });

    // Traitement dans le cas ou typeMetier ou nbrTop sont changés
    $('#typeMetier, #nbrTop').change(function () {
        if ($('#typeMetier').val()) {
            chargerGraphiqueOS(selectedContinent, $('#typeMetier').val(), $('#nbrTop').val());
            chargerGraphiqueCommunication(selectedContinent, $('#typeMetier').val(), $('#nbrTop').val());
            majMetierTexte();
        }
        else{
            chargerGraphiqueOS(selectedContinent, "tous", $('#nbrTop').val());
            chargerGraphiqueCommunication(selectedContinent, "tous", $('#nbrTop').val());
            majMetierTexte();
        }
    });

    function chargerMetiers(continent) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                let options = '<option value="tous">Tous les métiers</option>';
                let uniquetypeMetiers = getUniquetypeMetiers(jsonData);
                uniquetypeMetiers.forEach(typeMetier => {
                    options += `<option value="${typeMetier}">${typeMetier}</option>`;
                });
                $('#typeMetier').html(options);
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    }

    function chargerGraphiqueOS(continent, typeMetiers, nbrTop) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'osChart';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }
    
                let donneesGraphique;
    
                if (!typeMetiers) {
                    donneesGraphique = extraireDonneesGraphique("tous", jsonData, 'os', nbrTop);
                } else {
                    donneesGraphique = extraireDonneesGraphique(typeMetiers, jsonData, 'os', nbrTop);
                }
    
                const ctx = getContexteGraphique(canvasId);
                Chart.register(ChartDataLabels);
    
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: donneesGraphique.labels,
                        datasets: [{
                            data: donneesGraphique.donneesGraphique,
                            backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50', '#FFC107', '#9C27B0', '#FFEB3B', '#00BCD4', '#E91E63'],
                            borderColor: 'white',
                            borderWidth: 5,
                        }]
                    },
                    options: {
                        cutout: '30%',
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = donneesGraphique.labels[context.dataIndex];
                                        const value = donneesGraphique.donneesGraphique[context.dataIndex];
                                        return `${label}: ${value}`;
                                    }
                                }
                            },
                            datalabels: {
                                display: true,
                                color: 'black',
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Erreur : " + error);
            }
        });
    }
    
    
    
    
    function chargerGraphiqueCommunication(continent, typeMetiers, nbrTop) {
         // Obtenir le chemin du fichier des résultats du sondage
         const repertoireResultatsSondage = obtenirRepertoireFichiers();
         const cheminFichier = `${repertoireResultatsSondage}survey_results_${continent}.json`;
     
        $.ajax({
            type: "GET",
            url: `${cheminFichier}`,
            dataType: "json",
            success: function (jsonData) {
                const canvasId = 'communicationChart';
                const existingChart = Chart.getChart(canvasId);
                if (existingChart) {
                    existingChart.destroy();
                }
        
                let donneesGraphique;
    
                if (!typeMetiers) {
                    // Si aucun type de métiers n'est sélectionné, charger les données pour tous les métiers
                    donneesGraphique = extraireDonneesGraphique("tous", jsonData, 'comm', nbrTop);
                } else {
                    donneesGraphique = extraireDonneesGraphique(typeMetiers, jsonData, 'comm', nbrTop);
                }
                const ctx = getContexteGraphique(canvasId);
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: donneesGraphique.labels,
                        datasets: [{
                            label: `Top ${donneesGraphique.label}`,
                            data: donneesGraphique.donneesGraphique,
                            backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50', '#FFC107', '#9C27B0', '#FFEB3B', '#00BCD4', '#E91E63'],
                            borderColor: 'white',
                            borderWidth: 5,

                        }]
                    },
                    options: {
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = donneesGraphique.labels[context.dataIndex];
                                        const value = donneesGraphique.donneesGraphique[context.dataIndex];
                                        return `${label}: ${value}`;
                                    }
                                }
                            },
                            datalabels: {
                                display: true,
                                color: 'black',
                                font: {
                                    weight: 'bold'
                                }
                            }

                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Erreur : " + error);
            }
        });
    }
    
    function majMetierTexte(customText) {
        let typeMetierSelectionneTexte = $('#typeMetier option:selected').text();
        if (customText) {
            $('.selectedtypeMetier').text(customText);
        } else {
            if (typeMetierSelectionneTexte == "Tous les métiers") {
                $('.selectedtypeMetier').text("Tous les métiers");
            } else {
                $('.selectedtypeMetier').text(typeMetierSelectionneTexte);
            }
        }
    }
    
    function getUniquetypeMetiers(data) {
        let tousLesTypesMetiers = [];
        data.forEach(item => {
            let typesMetiers = item.DevType.split(';').map(typeMetier => typeMetier.trim());
            tousLesTypesMetiers = tousLesTypesMetiers.concat(typesMetiers);
        });
        return Array.from(new Set(tousLesTypesMetiers));
    }
    
    function getContexteGraphique(canvasId) {
        return document.getElementById(canvasId).getContext('2d');
    }
    
    function extraireDonneesGraphique(typeMetiers, jsonData, typeGraphique, nbrTop) {
        let donneesFiltrees = jsonData.filter(item => {
            if (!typeMetiers || typeMetiers === "tous") {
                return true;
            }
    
            let itemTypesMetiers = item.DevType.split(';').map(typeMetier => typeMetier.trim());
    
            if (!Array.isArray(typeMetiers)) {
                typeMetiers = [typeMetiers];
            }
    
            return typeMetiers.some(typeMetierSelectionne => itemTypesMetiers.includes(typeMetierSelectionne));
        });
    
        let donneesComptees = {};
    
        if (typeGraphique === 'os') {
            donneesFiltrees.forEach(item => {
                let os = item.OpSysProfessionaluse;
                donneesComptees[os] = (donneesComptees[os] || 0) + 1;
            });
        } else if (typeGraphique === 'comm') {
            donneesFiltrees.forEach(item => {
                let outil = item.OfficeStackSyncHaveWorkedWith;
                donneesComptees[outil] = (donneesComptees[outil] || 0) + 1;
            });
        } else {
            console.error("Type de graphique sélectionné invalide.");
            return;
        }
    
        let donneesTriees = Object.entries(donneesComptees).sort((a, b) => b[1] - a[1]);
        donneesTriees = donneesTriees.slice(0, nbrTop);
    
        let labels = donneesTriees.map(entry => entry[0]);
        let data = donneesTriees.map(entry => entry[1]);
    
        return {
            labels: labels,
            donneesGraphique: data
        };
    }
});
