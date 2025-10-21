# Guide d'installation Google Analytics 4 pour calculeage.fr

## Étape 1: Créer votre compte Google Analytics

1. **Allez sur**: https://analytics.google.com
2. **Connectez-vous** avec votre compte Google
3. **Cliquez sur** "Commencer la mesure"
4. **Nom du compte**: `Calcul Age`
5. **Cochez** les cases de partage de données (recommandé)
6. **Cliquez sur** "Suivant"

## Étape 2: Créer une propriété

1. **Nom de la propriété**: `calculeage.fr`
2. **Fuseau horaire**: `France (GMT+1:00) Paris`
3. **Devise**: `Euro (€)`
4. **Cliquez sur** "Suivant"

## Étape 3: Informations sur l'entreprise

1. **Secteur d'activité**: `Internet et télécom`
2. **Taille de l'entreprise**: `Petite (1-10 employés)`
3. **Utilisation**: Cochez "Mesurer l'engagement des utilisateurs"
4. **Cliquez sur** "Créer"
5. **Acceptez** les conditions d'utilisation

## Étape 4: Configuration du flux de données

1. **Sélectionnez**: "Web"
2. **URL du site web**: `https://calculeage.fr`
3. **Nom du flux**: `Site Web calculeage.fr`
4. **Cliquez sur** "Créer un flux"

## Étape 5: Récupérer votre ID de mesure

Après la création, vous verrez votre **ID de mesure** au format:
```
G-XXXXXXXXXX
```

**COPIEZ CET ID** - vous en aurez besoin pour l'installation.

## Étape 6: Installer le code de suivi

### Option A: Installation manuelle (recommandée)

1. Ouvrez le fichier `analytics.js` que j'ai créé dans votre repo
2. Remplacez `G-XXXXXXXXXX` par votre vrai ID de mesure
3. Le code est déjà intégré dans toutes vos pages HTML

### Option B: Via Google Tag Manager (avancé)

Si vous préférez utiliser Google Tag Manager:
1. Créez un compte sur https://tagmanager.google.com
2. Suivez les instructions d'installation
3. Ajoutez Google Analytics 4 comme tag

## Vérification de l'installation

1. Retournez dans Google Analytics
2. Allez dans **Rapports** > **Temps réel**
3. Ouvrez votre site `https://calculeage.fr` dans un nouvel onglet
4. Vous devriez voir votre visite apparaître en temps réel !

## Événements personnalisés configurés

J'ai déjà configuré les événements suivants:

- ✅ **calculate_age**: Quand un utilisateur calcule son âge
- ✅ **share_result**: Quand un utilisateur partage son résultat
- ✅ **copy_result**: Quand un utilisateur copie son résultat
- ✅ **visit_bio_age**: Quand un utilisateur clique vers agebiologique.eu
- ✅ **404_error**: Quand un utilisateur arrive sur une page 404

## Rapports importants à surveiller

### Acquisition
- **Source du trafic**: D'où viennent vos visiteurs (Google, Direct, Réseaux sociaux)
- **Recherche Google**: Quels mots-clés amènent du trafic

### Engagement
- **Pages vues**: Quelles sont vos pages les plus visitées
- **Temps moyen**: Combien de temps les gens restent sur votre site
- **Taux de rebond**: Pourcentage de visiteurs qui quittent sans interaction

### Conversions personnalisées
- **Calculs d'âge**: Nombre de personnes qui utilisent le calculateur
- **Partages sociaux**: Combien de fois les résultats sont partagés
- **Clics vers âge biologique**: Trafic envoyé vers votre autre site

## Configuration avancée (optionnel)

### 1. Lier Google Search Console

1. Dans GA4, allez dans **Admin** > **Liens Search Console**
2. Cliquez sur **Associer**
3. Sélectionnez votre propriété Search Console
4. Cela vous donnera des données sur les requêtes de recherche Google

### 2. Créer des audiences

Exemples d'audiences utiles:
- Utilisateurs qui ont calculé leur âge
- Visiteurs qui ont visité 3+ pages
- Utilisateurs mobiles vs desktop
- Visiteurs récurrents

### 3. Configurer des objectifs de conversion

Marquez ces événements comme conversions:
- `calculate_age` (objectif principal)
- `share_result` (engagement)
- `visit_bio_age` (cross-promotion)

## Données importantes à surveiller

| Métrique | Objectif Mois 1 | Objectif Mois 3 | Objectif Mois 6 |
|----------|----------------|-----------------|-----------------|
| Sessions | 100+ | 500+ | 2000+ |
| Utilisateurs | 80+ | 400+ | 1500+ |
| Calculs d'âge | 50+ | 300+ | 1200+ |
| Pages/session | 2+ | 2.5+ | 3+ |
| Durée moyenne | 1min+ | 1.5min+ | 2min+ |

## Troubleshooting

### ❌ "Aucune donnée collectée"
- Vérifiez que vous avez bien remplacé `G-XXXXXXXXXX` par votre vrai ID
- Attendez 24-48h pour les premières données
- Vérifiez que JavaScript est activé sur votre site

### ❌ "Trafic bloqué par AdBlock"
- Normal, 20-30% des visiteurs utilisent un bloqueur de pub
- Les données restent fiables pour les tendances

### ❌ "Événements personnalisés non trackés"
- Vérifiez la console JavaScript (F12) pour les erreurs
- Assurez-vous que gtag.js est bien chargé

## Support

- Documentation officielle: https://support.google.com/analytics
- Communauté: https://www.fr.advertisercommunity.com/t5/Google-Analytics/ct-p/Google_Analytics_fr

---

**Une fois votre ID obtenu, donnez-le moi et je l'intégrerai automatiquement dans tous vos fichiers HTML !**
