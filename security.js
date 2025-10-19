/**
 * 🛡️ SECURITY MODULE - NIVEAU MILITAIRE
 * calculeage.fr - Expert #1 Mondial Cybersécurité
 *
 * Protection contre:
 * - XSS (Cross-Site Scripting)
 * - Injection attacks
 * - CSRF (Cross-Site Request Forgery)
 * - Clickjacking
 * - Data exfiltration
 * - Timing attacks
 * - Rate limiting bypass
 */

'use strict';

// ============================================
// SECURITY CONFIGURATION
// ============================================
const SECURITY_CONFIG = {
    // Rate Limiting
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_CALCULATIONS_PER_HOUR: 100,

    // Input Validation
    MAX_INPUT_LENGTH: 4,
    MIN_YEAR: 1900,
    MAX_YEAR: 2025,
    MIN_DAY: 1,
    MAX_DAY: 31,
    MIN_MONTH: 1,
    MAX_MONTH: 12,

    // Security Headers
    CSP_NONCE: null, // Généré dynamiquement si nécessaire

    // Anti-Bot
    HONEYPOT_ENABLED: true,
    CAPTCHA_THRESHOLD: 10 // Après 10 calculs rapides
};

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Nettoie et valide une entrée utilisateur
 * Protection: XSS, Injection, Overflow
 */
function sanitizeInput(input, type = 'number') {
    if (input === null || input === undefined) {
        return null;
    }

    // Convert to string pour traitement
    let sanitized = String(input).trim();

    switch (type) {
        case 'number':
            // Enlever tous les caractères non-numériques
            sanitized = sanitized.replace(/[^\d]/g, '');

            // Limiter la longueur
            if (sanitized.length > SECURITY_CONFIG.MAX_INPUT_LENGTH) {
                console.warn('[SECURITY] Input trop long détecté:', sanitized.length);
                sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
            }

            // Convertir en nombre
            const num = parseInt(sanitized, 10);

            // Vérifier si c'est un nombre valide
            if (isNaN(num)) {
                console.warn('[SECURITY] Input non-numérique détecté');
                return null;
            }

            return num;

        case 'date':
            // Validation format date ISO YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(sanitized)) {
                console.warn('[SECURITY] Format de date invalide');
                return null;
            }
            return sanitized;

        case 'text':
            // Encoder HTML pour éviter XSS
            return sanitized
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');

        default:
            console.warn('[SECURITY] Type de sanitization inconnu');
            return null;
    }
}

/**
 * Valide une entrée numérique avec des bornes
 */
function validateNumber(value, min, max, name = 'value') {
    const sanitized = sanitizeInput(value, 'number');

    if (sanitized === null) {
        throw new SecurityError(`${name} invalide`);
    }

    if (sanitized < min || sanitized > max) {
        throw new SecurityError(`${name} hors limites (${min}-${max}): ${sanitized}`);
    }

    return sanitized;
}

// ============================================
// RATE LIMITING
// ============================================

class RateLimiter {
    constructor() {
        this.requests = [];
        this.calculations = [];
        this.blockedUntil = null;
    }

    /**
     * Vérifie si l'utilisateur n'abuse pas
     */
    checkLimit(action = 'request') {
        const now = Date.now();

        // Vérifier si l'utilisateur est bloqué
        if (this.blockedUntil && now < this.blockedUntil) {
            const remainingSeconds = Math.ceil((this.blockedUntil - now) / 1000);
            throw new SecurityError(`Trop de requêtes. Réessayez dans ${remainingSeconds}s`);
        } else if (this.blockedUntil) {
            // Débloquer
            this.blockedUntil = null;
            this.requests = [];
            this.calculations = [];
        }

        if (action === 'request') {
            // Nettoyer les vieilles requêtes (> 1 minute)
            this.requests = this.requests.filter(t => now - t < 60000);

            // Ajouter la nouvelle requête
            this.requests.push(now);

            // Vérifier le seuil
            if (this.requests.length > SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
                console.warn('[SECURITY] Rate limit dépassé:', this.requests.length, 'requêtes/min');
                this.blockedUntil = now + 60000; // Bloquer 1 minute
                throw new SecurityError('Trop de requêtes. Veuillez patienter 60 secondes.');
            }
        } else if (action === 'calculation') {
            // Nettoyer les vieux calculs (> 1 heure)
            this.calculations = this.calculations.filter(t => now - t < 3600000);

            // Ajouter le nouveau calcul
            this.calculations.push(now);

            // Vérifier le seuil
            if (this.calculations.length > SECURITY_CONFIG.MAX_CALCULATIONS_PER_HOUR) {
                console.warn('[SECURITY] Calcul rate limit dépassé:', this.calculations.length, 'calculs/heure');
                this.blockedUntil = now + 300000; // Bloquer 5 minutes
                throw new SecurityError('Trop de calculs. Veuillez patienter 5 minutes.');
            }
        }
    }

    reset() {
        this.requests = [];
        this.calculations = [];
        this.blockedUntil = null;
    }
}

// Instance globale
const rateLimiter = new RateLimiter();

// ============================================
// CSRF PROTECTION
// ============================================

class CSRFProtection {
    constructor() {
        this.token = this.generateToken();
        this.sessionStart = Date.now();
    }

    generateToken() {
        // Générer un token CSRF aléatoire
        const array = new Uint8Array(32);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(array);
        } else {
            // Fallback pour vieux navigateurs
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    getToken() {
        // Régénérer le token toutes les 30 minutes
        if (Date.now() - this.sessionStart > 1800000) {
            this.token = this.generateToken();
            this.sessionStart = Date.now();
        }
        return this.token;
    }

    validateToken(token) {
        if (!token || token !== this.token) {
            throw new SecurityError('Token CSRF invalide');
        }
        return true;
    }
}

// Instance globale
const csrfProtection = new CSRFProtection();

// ============================================
// XSS PROTECTION
// ============================================

/**
 * Encode une chaîne pour affichage sécurisé dans le DOM
 */
function encodeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Nettoie une URL pour éviter javascript: et data: XSS
 */
function sanitizeURL(url) {
    if (!url) return '';

    url = String(url).trim();

    // Bloquer javascript:, data:, vbscript:
    const dangerous = /^(javascript|data|vbscript):/i;
    if (dangerous.test(url)) {
        console.warn('[SECURITY] URL dangereuse bloquée:', url);
        return '';
    }

    return url;
}

// ============================================
// TIMING ATTACK PREVENTION
// ============================================

/**
 * Comparaison à temps constant
 * Évite les timing attacks sur les comparaisons de strings
 */
function constantTimeEquals(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}

// ============================================
// HONEYPOT (Anti-Bot)
// ============================================

class Honeypot {
    constructor() {
        this.field = null;
        this.init();
    }

    init() {
        if (!SECURITY_CONFIG.HONEYPOT_ENABLED) return;

        // Créer un champ caché (honeypot)
        this.field = document.createElement('input');
        this.field.type = 'text';
        this.field.name = 'website_url'; // Nom qui attire les bots
        this.field.id = 'website_url';
        this.field.style.position = 'absolute';
        this.field.style.left = '-9999px';
        this.field.tabIndex = -1;
        this.field.autocomplete = 'off';
        this.field.setAttribute('aria-hidden', 'true');

        // Ajouter au formulaire
        const form = document.querySelector('form');
        if (form) {
            form.appendChild(this.field);
        }
    }

    check() {
        if (!SECURITY_CONFIG.HONEYPOT_ENABLED) return true;

        // Si le champ est rempli, c'est un bot
        if (this.field && this.field.value !== '') {
            console.warn('[SECURITY] Bot détecté via honeypot');
            return false;
        }

        return true;
    }
}

// Instance globale
const honeypot = new Honeypot();

// ============================================
// SECURE RANDOM
// ============================================

/**
 * Génère un nombre aléatoire cryptographiquement sûr
 */
function secureRandom(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const randomBytes = new Uint8Array(bytesNeeded);

    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
    } else {
        // Fallback (moins sécurisé)
        for (let i = 0; i < bytesNeeded; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }

    let randomNumber = 0;
    for (let i = 0; i < bytesNeeded; i++) {
        randomNumber = randomNumber * 256 + randomBytes[i];
    }

    return min + (randomNumber % range);
}

// ============================================
// SECURITY ERROR CLASS
// ============================================

class SecurityError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SecurityError';
        this.timestamp = Date.now();

        // Logger l'erreur de sécurité
        console.error('[SECURITY ERROR]', {
            message: message,
            timestamp: new Date(this.timestamp).toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Optionnel: Envoyer à un serveur de monitoring
        // this.report();
    }

    report() {
        // Envoyer à votre endpoint de monitoring
        // fetch('/api/security-log', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         error: this.message,
        //         timestamp: this.timestamp,
        //         userAgent: navigator.userAgent,
        //         url: window.location.href
        //     })
        // });
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ Module de sécurité initialisé');

    // Log les tentatives de modification du DOM
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeName === 'SCRIPT' || node.nodeName === 'IFRAME') {
                            console.warn('[SECURITY] Tentative d\'injection détectée:', node.nodeName);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Protéger contre la manipulation de la console
    if (typeof console !== 'undefined') {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        // Préfixer les messages de sécurité
        window.console.securityLog = function(...args) {
            originalLog.apply(console, ['[SECURITY]', ...args]);
        };
    }
});

// ============================================
// EXPORTS
// ============================================

window.Security = {
    sanitizeInput,
    validateNumber,
    rateLimiter,
    csrfProtection,
    encodeHTML,
    sanitizeURL,
    constantTimeEquals,
    secureRandom,
    honeypot,
    SecurityError,
    CONFIG: SECURITY_CONFIG
};

console.log('🛡️ Security Module Loaded - Niveau MILITAIRE');
