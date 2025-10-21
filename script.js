/**
 * Calculeage.fr - Main JavaScript
 * Version: 2.0 | Octobre 2025
 * Optimized for Performance & Accessibility
 */

'use strict';

// ==============================
// DOM Elements Cache
// ==============================
const elements = {
    customDate: null,
    targetDateGroup: null,
    targetDate: null,
    day: null,
    month: null,
    year: null,
    result: null,
    resultMain: null,
    totalDays: null,
    totalWeeks: null,
    totalMonths: null,
    funStats: null,
    shareMenu: null
};

// ==============================
// Initialize DOM Elements
// ==============================
function initElements() {
    elements.customDate = document.getElementById('customDate');
    elements.targetDateGroup = document.getElementById('targetDateGroup');
    elements.targetDate = document.getElementById('targetDate');
    elements.day = document.getElementById('day');
    elements.month = document.getElementById('month');
    elements.year = document.getElementById('year');
    elements.result = document.getElementById('result');
    elements.resultMain = document.getElementById('resultMain');
    elements.totalDays = document.getElementById('totalDays');
    elements.totalWeeks = document.getElementById('totalWeeks');
    elements.totalMonths = document.getElementById('totalMonths');
    elements.funStats = document.getElementById('funStats');
    elements.shareMenu = document.getElementById('shareMenu');
}

// ==============================
// Event Listeners Setup
// ==============================
function setupEventListeners() {
    // Custom date toggle
    if (elements.customDate) {
        elements.customDate.addEventListener('change', function() {
            if (elements.targetDateGroup) {
                elements.targetDateGroup.style.display = this.checked ? 'block' : 'none';
            }
            if (this.checked && elements.targetDate) {
                elements.targetDate.value = new Date().toISOString().split('T')[0];
            }
        });
    }

    // Enter key to submit
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(element => {
        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAge();
            }
        });
    });
}

// ==============================
// Age Calculation Function
// ==============================
function calculateAge() {
    const day = parseInt(elements.day.value);
    const month = parseInt(elements.month.value);
    const year = parseInt(elements.year.value);

    // Validation
    if (!day || !month || !year) {
        showAlert('⚠️ Veuillez remplir tous les champs (jour, mois et année)');
        return;
    }

    if (day < 1 || day > 31) {
        showAlert('⚠️ Le jour doit être entre 1 et 31');
        return;
    }

    if (year < 1900 || year > 2025) {
        showAlert('⚠️ L\'année doit être entre 1900 et 2025');
        return;
    }

    const birthdate = new Date(year, month - 1, day);

    // Determine target date
    let targetDate;
    if (elements.customDate && elements.customDate.checked) {
        const targetInput = elements.targetDate.value;
        if (!targetInput) {
            showAlert('⚠️ Veuillez sélectionner une date cible');
            return;
        }
        targetDate = new Date(targetInput);
    } else {
        targetDate = new Date();
    }

    if (birthdate > targetDate) {
        showAlert('⚠️ La date de naissance ne peut pas être après la date cible');
        return;
    }

    if (birthdate.getMonth() !== month - 1 || birthdate.getDate() !== day) {
        showAlert('⚠️ Cette date n\'existe pas. Vérifiez le jour et le mois.');
        return;
    }

    // Calculate age
    let years = targetDate.getFullYear() - year;
    let months = targetDate.getMonth() - (month - 1);
    let days = targetDate.getDate() - day;

    if (days < 0) {
        months--;
        const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const totalDays = Math.floor((targetDate - birthdate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Display results
    displayResults(years, months, days, totalDays, totalWeeks, totalMonths);

    // Generate fun statistics
    generateFunStats(birthdate, targetDate, totalDays, years);

    // Show results section
    if (elements.result) {
        elements.result.classList.add('show');
        elements.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Track event in Google Analytics
    if (typeof trackAgeCalculation !== 'undefined') {
        trackAgeCalculation(years);
    }
}

// ==============================
// Display Results
// ==============================
function displayResults(years, months, days, totalDays, totalWeeks, totalMonths) {
    if (elements.resultMain) {
        elements.resultMain.textContent =
            `${years} an${years > 1 ? 's' : ''}, ${months} mois et ${days} jour${days > 1 ? 's' : ''}`;
    }

    if (elements.totalDays) {
        elements.totalDays.textContent = totalDays.toLocaleString('fr-FR');
    }

    if (elements.totalWeeks) {
        elements.totalWeeks.textContent = totalWeeks.toLocaleString('fr-FR');
    }

    if (elements.totalMonths) {
        elements.totalMonths.textContent = totalMonths.toLocaleString('fr-FR');
    }
}

// ==============================
// Generate Fun Statistics
// ==============================
function generateFunStats(birthdate, targetDate, totalDays, years) {
    const heartbeats = (totalDays * 100800).toLocaleString('fr-FR');
    const breaths = (totalDays * 23040).toLocaleString('fr-FR');
    const earthRotations = years;
    const moonCycles = Math.floor(totalDays / 29.5).toLocaleString('fr-FR');
    const sleepDays = Math.floor(totalDays / 3).toLocaleString('fr-FR');

    let nextBirthday = new Date(targetDate.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    if (nextBirthday <= targetDate) {
        nextBirthday.setFullYear(targetDate.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - targetDate) / (1000 * 60 * 60 * 24));

    const stats = {
        heartbeats,
        breaths,
        earthRotations,
        moonCycles,
        sleepDays,
        nextBirthday: daysUntilBirthday
    };

    // Update DOM
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// ==============================
// Toggle Fun Statistics
// ==============================
function toggleFunStats(event) {
    if (event) {
        event.preventDefault();
    }

    if (!elements.funStats) {
        console.error('Element funStats not found');
        return;
    }

    const btn = event ? event.target : null;
    const isShowing = elements.funStats.classList.contains('show');
    elements.funStats.classList.toggle('show');

    if (btn) {
        btn.textContent = elements.funStats.classList.contains('show')
            ? '✨ Masquer les statistiques'
            : '✨ Découvrir des statistiques amusantes';
    }

    // Track event in Google Analytics (only when opening)
    if (!isShowing && typeof trackFunStats !== 'undefined') {
        trackFunStats();
    }
}

// ==============================
// Copy Result to Clipboard
// ==============================
function copyResult() {
    if (!elements.resultMain || !elements.day || !elements.month || !elements.year) {
        showAlert('⚠ Veuillez d\'abord calculer votre âge');
        return;
    }

    const resultText = elements.resultMain.textContent;
    const day = elements.day.value;
    const month = elements.month.value;
    const year = elements.year.value;

    if (!resultText || !day || !month || !year) {
        showAlert('⚠ Veuillez d\'abord calculer votre âge');
        return;
    }

    const text = `Mon âge : ${resultText}\nNé(e) le : ${day}/${month}/${year}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('✅ Résultat copié dans le presse-papier !\n\n💡 Vous pouvez maintenant le coller où vous voulez, ou cliquer sur "Partager" pour l\'envoyer directement.');
            // Track event
            if (typeof trackCopy !== 'undefined') {
                trackCopy();
            }
        }).catch(() => {
            showAlert('❌ Erreur lors de la copie');
        });
    } else {
        // Fallback for older browsers
        copyFallback(text);
    }
}

// ==============================
// Fallback Copy Method
// ==============================
function copyFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showAlert('✅ Résultat copié !');
        // Track event
        if (typeof trackCopy !== 'undefined') {
            trackCopy();
        }
    } catch (err) {
        showAlert('❌ Erreur lors de la copie');
    }

    document.body.removeChild(textArea);
}

// ==============================
// Share Menu Toggle
// ==============================
function toggleShareMenu(event) {
    if (event) {
        event.stopPropagation();
    }

    if (!elements.shareMenu) return;

    const resultText = elements.resultMain ? elements.resultMain.textContent : '';

    if (!resultText) {
        showAlert('❌ Veuillez d\'abord calculer votre âge');
        return;
    }

    const isShowing = elements.shareMenu.classList.contains('show');
    elements.shareMenu.classList.toggle('show');

    if (!isShowing) {
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    } else {
        document.removeEventListener('click', handleOutsideClick);
    }
}

// ==============================
// Handle Outside Click
// ==============================
function handleOutsideClick(event) {
    if (!elements.shareMenu) return;

    const clickedInsideMenu = event.target.closest('.share-menu');
    const clickedShareButton = event.target.closest('button')?.textContent.includes('Partager');

    if (!clickedInsideMenu && !clickedShareButton) {
        elements.shareMenu.classList.remove('show');
        document.removeEventListener('click', handleOutsideClick);
    }
}

// ==============================
// Close Share Menu
// ==============================
function closeShareMenu() {
    if (elements.shareMenu) {
        elements.shareMenu.classList.remove('show');
        document.removeEventListener('click', handleOutsideClick);
    }
}

// ==============================
// Get Share Text
// ==============================
function getShareText() {
    const resultText = elements.resultMain ? elements.resultMain.textContent : '';
    const day = elements.day ? elements.day.value : '';
    const month = elements.month ? elements.month.value : '';
    const year = elements.year ? elements.year.value : '';
    return `Mon âge exact : ${resultText} (né(e) le ${day}/${month}/${year})`;
}

// ==============================
// Share via WhatsApp
// ==============================
function shareViaWhatsApp(event) {
    event.preventDefault();
    event.stopPropagation();
    const text = getShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text + '\n\n✨ Calculé sur Calcul d\'Âge')}`;
    window.open(url, '_blank');
    // Track event
    if (typeof trackShare !== 'undefined') {
        trackShare('whatsapp');
    }
    closeShareMenu();
}

// ==============================
// Share via Facebook
// ==============================
function shareViaFacebook(event) {
    event.preventDefault();
    event.stopPropagation();
    const shareUrl = 'https://calculeage.fr';
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    // Track event
    if (typeof trackShare !== 'undefined') {
        trackShare('facebook');
    }
    closeShareMenu();
}

// ==============================
// Share via Twitter
// ==============================
function shareViaTwitter(event) {
    event.preventDefault();
    event.stopPropagation();
    const text = getShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ✨')}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    // Track event
    if (typeof trackShare !== 'undefined') {
        trackShare('twitter');
    }
    closeShareMenu();
}

// ==============================
// Alert Helper
// ==============================
function showAlert(message) {
    alert(message);
}

// ==============================
// Initialize on DOM Content Loaded
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    setupEventListeners();
    console.log('✅ Calculeage.fr initialized successfully');
});

// ==============================
// Export functions for global access
// ==============================
window.calculateAge = calculateAge;
window.toggleFunStats = toggleFunStats;
window.copyResult = copyResult;
window.toggleShareMenu = toggleShareMenu;
window.shareViaWhatsApp = shareViaWhatsApp;
window.shareViaFacebook = shareViaFacebook;
window.shareViaTwitter = shareViaTwitter;
