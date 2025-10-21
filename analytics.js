// Google Analytics 4 Configuration pour calculeage.fr
// INSTRUCTIONS: Remplacez 'G-XXXXXXXXXX' par votre vrai ID de mesure GA4

// Chargement du script Google Analytics
(function() {
    // CONFIGURATION - REMPLACEZ CETTE VALEUR
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ⚠️ À REMPLACER

    // Vérifier si un ID valide est configuré
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️ Google Analytics: ID de mesure non configuré. Remplacez G-XXXXXXXXXX dans analytics.js');
        return; // Ne pas charger GA si pas configuré
    }

    // Charger le script Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialiser gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'send_page_view': true,
        'anonymize_ip': true, // Anonymisation IP pour RGPD
        'cookie_flags': 'SameSite=None;Secure'
    });

    console.log('✅ Google Analytics 4 chargé avec succès');
})();

// Événements personnalisés pour calculeage.fr

// Événement: Calcul d'âge effectué
function trackAgeCalculation(ageInYears) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculate_age', {
            'event_category': 'Calculateur',
            'event_label': 'Âge calculé',
            'value': ageInYears
        });
    }
}

// Événement: Résultat partagé
function trackShare(platform) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share_result', {
            'event_category': 'Engagement',
            'event_label': platform, // 'whatsapp', 'facebook', 'twitter'
            'method': platform
        });
    }
}

// Événement: Résultat copié
function trackCopy() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_result', {
            'event_category': 'Engagement',
            'event_label': 'Copie résultat'
        });
    }
}

// Événement: Clic vers âge biologique
function trackBioAgeClick() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'visit_bio_age', {
            'event_category': 'Navigation externe',
            'event_label': 'Âge biologique',
            'transport_type': 'beacon'
        });
    }
}

// Événement: Statistiques amusantes affichées
function trackFunStats() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_fun_stats', {
            'event_category': 'Engagement',
            'event_label': 'Statistiques amusantes'
        });
    }
}

// Export des fonctions pour utilisation globale
window.trackAgeCalculation = trackAgeCalculation;
window.trackShare = trackShare;
window.trackCopy = trackCopy;
window.trackBioAgeClick = trackBioAgeClick;
window.trackFunStats = trackFunStats;
