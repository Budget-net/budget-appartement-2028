// ========================================
// MON PLAN 2028 - MOTEUR FINANCIER
// ========================================

const champs = [
    "objectifAppartement",
    "miseDeFonds",
    "salaire",
    "commission",
    "logement",
    "epicerie",
    "restaurant",
    "auto",
    "sport",
    "loisirs",
    "plaisir",
    "autres",
    "celiapp",
    "fondsAppartement",
    "celi",
    "reer",
    "urgence",
    "seancesSport",
    "objectifSport"
];

const champsDepenses = [
    "logement",
    "epicerie",
    "restaurant",
    "auto",
    "sport",
    "loisirs",
    "plaisir",
    "autres"
];

const champsEpargne = [
    "celiapp",
    "fondsAppartement",
    "celi",
    "reer",
    "urgence"
];


// ========================================
// OUTILS
// ========================================

function valeur(id) {
    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    return Number(element.value) || 0;
}

function argent(nombre) {
    return nombre.toLocaleString("fr-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
    });
}


// ========================================
// CALCUL PRINCIPAL
// ========================================

function calculer() {

    // REVENUS

    const salaire = valeur("salaire");
    const commission = valeur("commission");

    const revenuTotal = salaire + commission;


    // DEPENSES

    const totalDepenses = champsDepenses.reduce(
        (total, id) => total + valeur(id),
        0
    );


    // EPARGNE

    const totalEpargne = champsEpargne.reduce(
        (total, id) => total + valeur(id),
        0
    );


    // ARGENT RESTANT

    const argentRestant =
        revenuTotal - totalDepenses - totalEpargne;


    // TAUX D'EPARGNE

    let tauxEpargne = 0;

    if (revenuTotal > 0) {
        tauxEpargne =
            (totalEpargne / revenuTotal) * 100;
    }


    // ========================================
    // AFFICHAGE
    // ========================================

    document.getElementById("revenuTotal").textContent =
        argent(revenuTotal);

    document.getElementById("totalDepenses").textContent =
        argent(totalDepenses);

    document.getElementById("totalEpargne").textContent =
        argent(totalEpargne);

    document.getElementById("resumeRevenu").textContent =
        argent(revenuTotal);

    document.getElementById("resumeDepenses").textContent =
        argent(totalDepenses);

    document.getElementById("resumeEpargne").textContent =
        argent(totalEpargne);

    document.getElementById("argentRestant").textContent =
        argent(argentRestant);

    document.getElementById("tauxEpargne").textContent =
        tauxEpargne.toFixed(1) + " %";


    // ========================================
    // COULEUR ARGENT RESTANT
    // ========================================

    const affichageArgentRestant =
        document.getElementById("argentRestant");

    if (argentRestant < 0) {
        affichageArgentRestant.style.color = "#dc2626";
    } else {
        affichageArgentRestant.style.color = "#16a34a";
    }


    // ========================================
    // OBJECTIF APPARTEMENT
    // ========================================

    const objectifAppartement =
        valeur("objectifAppartement");

    const miseDeFonds =
        valeur("miseDeFonds");

    let progression = 0;

    if (objectifAppartement > 0) {
        progression =
            (miseDeFonds / objectifAppartement) * 100;
    }

    progression = Math.max(
        0,
        Math.min(progression, 100)
    );

    document.getElementById(
        "progressionAppartement"
    ).textContent =
        "Progression : " +
        progression.toFixed(1) +
        " %";

    document.getElementById(
        "barreAppartement"
    ).value = progression;


    // ========================================
    // COMMISSION 70 / 20 / 10
    // ========================================

    document.getElementById(
        "commissionAppartement"
    ).textContent =
        argent(commission * 0.70);

    document.getElementById(
        "commissionInvestissement"
    ).textContent =
        argent(commission * 0.20);

    document.getElementById(
        "commissionPlaisir"
    ).textContent =
        argent(commission * 0.10);


    // ========================================
    // SANTE / SPORT
    // ========================================

    const seances =
        valeur("seancesSport");

    const objectifSport =
        valeur("objectifSport");

    const statutSport =
        document.getElementById("statutSport");

    if (objectifSport > 0) {

        const progressionSport =
            (seances / objectifSport) * 100;

        if (seances >= objectifSport) {

            statutSport.textContent =
                "🟢 Objectif atteint ! " +
                seances +
                " / " +
                objectifSport +
                " séances";

            statutSport.style.color =
                "#16a34a";

        } else if (progressionSport >= 60) {

            statutSport.textContent =
                "🟠 En bonne voie : " +
                seances +
                " / " +
                objectifSport +
                " séances";

            statutSport.style.color =
                "#d97706";

        } else {

            statutSport.textContent =
                "🔴 À améliorer : " +
                seances +
                " / " +
                objectifSport +
                " séances";

            statutSport.style.color =
                "#dc2626";
        }
    }


    // ========================================
    // SAUVEGARDE
    // ========================================

    sauvegarder();
}


// ========================================
// SAUVEGARDE LOCALE
// ========================================

function sauvegarder() {

    const donnees = {};

    champs.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            donnees[id] = element.value;
        }
    });

    localStorage.setItem(
        "monPlan2028",
        JSON.stringify(donnees)
    );
}


// ========================================
// CHARGEMENT DES DONNEES
// ========================================

function charger() {

    const sauvegarde =
        localStorage.getItem("monPlan2028");

    if (!sauvegarde) {
        calculer();
        return;
    }

    try {

        const donnees =
            JSON.parse(sauvegarde);

        champs.forEach(id => {

            const element =
                document.getElementById(id);

            if (
                element &&
                donnees[id] !== undefined
            ) {
                element.value =
                    donnees[id];
            }
        });

    } catch (erreur) {

        console.error(
            "Erreur de chargement :",
            erreur
        );
    }

    calculer();
}


// ========================================
// ANALYSE D'UN ACHAT
// ========================================

function analyserAchat() {

    const prixAchat =
        valeur("prixAchat");

    const revenu =
        valeur("salaire") +
        valeur("commission");

    const depenses =
        champsDepenses.reduce(
            (total, id) =>
                total + valeur(id),
            0
        );

    const epargne =
        champsEpargne.reduce(
            (total, id) =>
                total + valeur(id),
            0
        );

    const disponible =
        revenu -
        depenses -
        epargne;

    const resultat =
        document.getElementById(
            "resultatAchat"
        );


    if (prixAchat <= 0) {

        resultat.textContent =
            "Entre le prix de l'achat que tu envisages.";

        return;
    }


    if (prixAchat <= disponible * 0.50) {

        resultat.innerHTML =
            "🟢 <strong>Achat raisonnable.</strong><br>" +
            "Tu conserverais " +
            argent(disponible - prixAchat) +
            " après cet achat.";

        resultat.style.borderLeft =
            "5px solid #16a34a";

    }

    else if (prixAchat <= disponible) {

        resultat.innerHTML =
            "🟠 <strong>Achat possible, mais attention.</strong><br>" +
            "Il ne te resterait que " +
            argent(disponible - prixAchat) +
            " ce mois-ci.";

        resultat.style.borderLeft =
            "5px solid #d97706";

    }

    else {

        const manque =
            prixAchat - disponible;

        resultat.innerHTML =
            "🔴 <strong>Je reporterais cet achat.</strong><br>" +
            "Il dépasse ton argent disponible de " +
            argent(manque) +
            ".";

        resultat.style.borderLeft =
            "5px solid #dc2626";
    }
}


// ========================================
// SURVEILLER LES MODIFICATIONS
// ========================================

champs.forEach(id => {

    const element =
        document.getElementById(id);

    if (element) {

        element.addEventListener(
            "input",
            calculer
        );
    }
});


// ========================================
// BOUTON ANALYSER ACHAT
// ========================================

const boutonAchat =
    document.getElementById(
        "analyserAchat"
    );

if (boutonAchat) {

    boutonAchat.addEventListener(
        "click",
        analyserAchat
    );
}


// ========================================
// DEMARRAGE
// ========================================

charger();
