const dataFile = '../donnees/test.csv';
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
};

// Chargement du fichier CSV
d3.dsv(";", "../donnees/test.csv").then(function (data) {
    console.log(data);

    // Vérification des données
    if (!data || data.length === 0) {
        console.error("Aucune donnée trouvée dans le fichier CSV !");
        return;
    }

    // Graphique 1 : Répartition des Méthodes
    const methode_compteur = {};
    data.forEach(row => {
        const methode = row["Nom méthode"];
        if (methode) {
            methode_compteur[methode] = (methode_compteur[methode] || 0) + 1;
        }
    });

    const methodes = Object.keys(methode_compteur);
    const donnees_methode = Object.values(methode_compteur);

    // Création du graphique 1 : Fréquence d'utilisation des méthodes
    const graph_methode = document.getElementById("Graphique_1").getContext("2d");
    new Chart(graph_methode, {
        type: "bar",
        data: {
            labels: methodes, // Étiquettes des méthodes
            datasets: [{
                label: "Nombre de fois utilisés", // Label pour l'axe des Y
                data: donnees_methode, // Données à afficher
                backgroundColor: "rgba(54, 162, 235, 0.2)", // Couleur de fond des barres
                borderColor: "rgba(54, 162, 235, 1)", // Couleur de bordure des barres
                borderWidth: 1 // Largeur de la bordure
            }]
        },
        options: {
            responsive: true, // Rendre le graphique responsive
        }
    });

    // Graphique 2 : Répartition des Méthodes par Famille
    const familyCounts = {};
    data.forEach(row => {
        const family = row["Famille méthode de contrôle biologique"];
        if (family) {
            familyCounts[family] = (familyCounts[family] || 0) + 1;
        }
    });

    const families = Object.keys(familyCounts);
    const familyData = Object.values(familyCounts);
    const familyColors = families.map((_, i) => `hsl(${(i / families.length) * 360}, 70%, 50%)`);

    // Création du graphique 2 : Répartition des méthodes par famille
    const graph_methode_famille = document.getElementById("Graphique_2").getContext("2d");
    new Chart(graph_methode_famille, {
        type: "pie", // Type de graphique : Camembert
        data: {
            labels: families, // Étiquettes des familles
            datasets: [{
                label: "Répartition des Méthodes par Famille", // Label du graphique
                data: familyData, // Données à afficher
                backgroundColor: familyColors, // Couleurs pour chaque famille
                borderColor: "white", // Couleur de bordure
                borderWidth: 2 // Largeur de la bordure
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const value = tooltipItem.raw || 0;
                            const total = familyData.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1); // Calcul du pourcentage
                            return `${tooltipItem.label}: ${value} (${percentage}%)`; // Affichage du tooltip
                        }
                    }
                }
            }
        }
    });

    // Graphique 3 : Type de Traitement par Filière
    const treatmentByFiliere = {};
    data.forEach(row => {
        const filiere = row["Filière"];
        const treatment = row["Type de traitement"];
        if (filiere && treatment) {
            treatmentByFiliere[filiere] = treatmentByFiliere[filiere] || {};
            treatmentByFiliere[filiere][treatment] = (treatmentByFiliere[filiere][treatment] || 0) + 1;
        }
    });

    const filieres = Object.keys(treatmentByFiliere);
    const treatments = [...new Set(Object.values(treatmentByFiliere).flatMap(f => Object.keys(f)))];

    const datasets = treatments.map(treatment => ({
        label: treatment,
        data: filieres.map(filiere => treatmentByFiliere[filiere][treatment] || 0),
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` // Couleur aléatoire pour chaque type de traitement
    }));

    // Création du graphique 3 : Traitement par filière
    const graph_traitement_filiere = document.getElementById("Graphique_3").getContext("2d");
    new Chart(graph_traitement_filiere, {
        type: "bar", // Type de graphique : Barres
        data: {
            labels: filieres, // Étiquettes des filières
            datasets: datasets // Données des traitements
        },
        options: {
            responsive: true,
            indexAxis: "y", // Graphique horizontal
            scales: {
                x: {
                    beginAtZero: true, // Commencer l'axe X à zéro
                    title: {
                        display: true,
                        text: "Nombre d'utilisations" // Titre de l'axe X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Filières" // Titre de l'axe Y
                    }
                }
            },
            plugins: {
                legend: {
                    position: "top" // Position de la légende
                }
            }
        }
    });
}).catch(error => console.error("Erreur lors du chargement du fichier CSV :", error));