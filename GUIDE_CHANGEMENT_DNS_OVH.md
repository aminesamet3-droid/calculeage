# 🔧 GUIDE CHANGEMENT DNS OVH → NETLIFY

## 📋 INFORMATIONS DÉTECTÉES

**Domaine** : calculeage.fr
**Registrar** : OVH
**Nameservers actuels** :
- dns16.ovh.net (5.135.112.57)
- ns16.ovh.net (5.39.116.25)

**Pointent vers** : GitHub Pages (185.199.108-111.153)

**Objectif** : Changer vers Netlify

---

## ⚡ MÉTHODE RAPIDE (5 MINUTES)

### Étape 1 : Se connecter à OVH

1. Aller sur : https://www.ovh.com/manager/
2. Se connecter avec vos identifiants OVH
3. Cliquer sur **"Web Cloud"** dans le menu

### Étape 2 : Accéder au domaine

1. Dans le menu de gauche, cliquer sur **"Noms de domaine"**
2. Cliquer sur **"calculeage.fr"**

### Étape 3 : Option A - Changer les Nameservers (RECOMMANDÉ)

**Cette option délègue tout le DNS à Netlify (plus simple)**

1. Onglet **"Serveurs DNS"**
2. Cliquer sur **"Modifier les serveurs DNS"**
3. Sélectionner **"Ajouter/Modifier les serveurs DNS personnalisés"**
4. Supprimer les serveurs OVH existants
5. Ajouter les 4 serveurs Netlify :
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
6. Cliquer sur **"Appliquer la configuration"**
7. Confirmer

**Propagation** : 2-48 heures (généralement 2-6h)

### Étape 3 : Option B - Modifier les Enregistrements DNS (Garder DNS OVH)

**Cette option garde le DNS chez OVH**

1. Onglet **"Zone DNS"**
2. Cliquer sur **"Modifier la zone en mode textuel"** (plus rapide)
3. Chercher les lignes avec **"185.199"** (GitHub Pages)
4. Les remplacer par **75.2.60.5** (Netlify)
5. Ajouter/Modifier :
   ```dns
   calculeage.fr.      IN  A       75.2.60.5
   www                 IN  CNAME   calculeage.netlify.app.
   ```
6. Sauvegarder

**Propagation** : 2-24 heures

---

## 📖 GUIDE DÉTAILLÉ OPTION A (NAMESERVERS)

### 1. Connexion OVH

**URL** : https://www.ovh.com/manager/

**Écran de connexion** :
```
┌─────────────────────────────────────┐
│         OVH Manager                 │
├─────────────────────────────────────┤
│  Identifiant : [_____________]      │
│  Mot de passe : [_____________]     │
│                                     │
│  [ Se connecter ]                   │
└─────────────────────────────────────┘
```

### 2. Navigation vers le domaine

**Menu de gauche** :
```
📁 Web Cloud
   └─ 🌐 Noms de domaine
      └─ calculeage.fr ← CLIQUER ICI
```

### 3. Page du domaine calculeage.fr

Vous verrez plusieurs onglets :
```
[ Informations générales ] [ Zone DNS ] [ Serveurs DNS ] [ DNSSEC ] [ Contacts ]
                                           ↑
                                      CLIQUER ICI
```

### 4. Onglet "Serveurs DNS"

Vous verrez actuellement :
```
┌──────────────────────────────────────────────────┐
│  Serveurs DNS actuels                            │
├──────────────────────────────────────────────────┤
│  Type : Serveurs DNS OVH                         │
│                                                  │
│  • dns16.ovh.net                                 │
│  • ns16.ovh.net                                  │
│                                                  │
│  [ Modifier les serveurs DNS ]  ← CLIQUER ICI   │
└──────────────────────────────────────────────────┘
```

### 5. Fenêtre de modification

```
┌──────────────────────────────────────────────────┐
│  Modifier les serveurs DNS                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  ○ Utiliser les serveurs DNS OVH                │
│  ● Ajouter/Modifier les serveurs DNS personnalisés │
│                                                  │
│  Serveur DNS 1 : [dns1.p01.nsone.net____]       │
│  Serveur DNS 2 : [dns2.p01.nsone.net____]       │
│  Serveur DNS 3 : [dns3.p01.nsone.net____]       │
│  Serveur DNS 4 : [dns4.p01.nsone.net____]       │
│                                                  │
│  [ Annuler ]  [ Appliquer la configuration ]    │
└──────────────────────────────────────────────────┘
```

### 6. Confirmation

```
┌──────────────────────────────────────────────────┐
│  ⚠️ Attention                                     │
├──────────────────────────────────────────────────┤
│  Vous êtes sur le point de modifier les         │
│  serveurs DNS de calculeage.fr                   │
│                                                  │
│  Cette opération peut prendre jusqu'à 48h       │
│  pour se propager.                               │
│                                                  │
│  [ Annuler ]  [ Confirmer ]                     │
└──────────────────────────────────────────────────┘
```

### 7. Validation

Après validation, vous verrez :
```
┌──────────────────────────────────────────────────┐
│  ✅ Opération en cours                           │
├──────────────────────────────────────────────────┤
│  La modification des serveurs DNS est en cours.  │
│  Un e-mail de confirmation vous sera envoyé.     │
│                                                  │
│  Propagation estimée : 2 à 48 heures             │
└──────────────────────────────────────────────────┘
```

---

## 📖 GUIDE DÉTAILLÉ OPTION B (ZONE DNS)

### 1-2. Connexion et Navigation (identique Option A)

### 3. Onglet "Zone DNS"

```
[ Informations générales ] [ Zone DNS ] [ Serveurs DNS ] [ DNSSEC ] [ Contacts ]
                              ↑
                         CLIQUER ICI
```

### 4. Vue de la Zone DNS

Vous verrez une liste d'enregistrements :
```
┌─────────────────────────────────────────────────────────────────┐
│  Zone DNS : calculeage.fr                                       │
├─────────────────────────────────────────────────────────────────┤
│  [ Ajouter une entrée ] [ Modifier en mode textuel ] [ Export ] │
├─────────────────────────────────────────────────────────────────┤
│  Type    │ Sous-domaine │ Cible                    │ Actions    │
├──────────┼──────────────┼──────────────────────────┼────────────┤
│  A       │              │ 185.199.108.153          │ [✏️] [🗑️]  │
│  A       │              │ 185.199.109.153          │ [✏️] [🗑️]  │
│  A       │              │ 185.199.110.153          │ [✏️] [🗑️]  │
│  A       │              │ 185.199.111.153          │ [✏️] [🗑️]  │
│  CNAME   │ www          │ aminesamet3-droid.git... │ [✏️] [🗑️]  │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Supprimer les anciens enregistrements GitHub

**Cliquer sur 🗑️ pour CHAQUE ligne avec 185.199.x.x**

Confirmer chaque suppression

### 6. Ajouter l'enregistrement Netlify

Cliquer sur **"Ajouter une entrée"**

```
┌──────────────────────────────────────────────────┐
│  Ajouter un enregistrement DNS                   │
├──────────────────────────────────────────────────┤
│  Type d'enregistrement : [A ▼]                   │
│                                                  │
│  Sous-domaine : [________________]  (vide)       │
│  Cible : [75.2.60.5________]                     │
│  TTL : [3600 ▼]                                  │
│                                                  │
│  [ Annuler ]  [ Valider ]                       │
└──────────────────────────────────────────────────┘
```

### 7. Modifier le CNAME www

Cliquer sur ✏️ sur la ligne `CNAME www`

```
┌──────────────────────────────────────────────────┐
│  Modifier l'enregistrement CNAME                 │
├──────────────────────────────────────────────────┤
│  Sous-domaine : [www_____________]               │
│  Cible : [calculeage.netlify.app.]               │
│  TTL : [3600 ▼]                                  │
│                                                  │
│  [ Annuler ]  [ Valider ]                       │
└──────────────────────────────────────────────────┘
```

### 8. Résultat Final

```
┌─────────────────────────────────────────────────────────────────┐
│  Zone DNS : calculeage.fr                                       │
├─────────────────────────────────────────────────────────────────┤
│  Type    │ Sous-domaine │ Cible                    │ Actions    │
├──────────┼──────────────┼──────────────────────────┼────────────┤
│  A       │              │ 75.2.60.5                │ [✏️] [🗑️]  │
│  CNAME   │ www          │ calculeage.netlify.app.  │ [✏️] [🗑️]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ MÉTHODE AUTOMATIQUE (API OVH)

Si vous avez accès à l'API OVH, vous pouvez automatiser :

### Prérequis

Créer des clés API sur : https://eu.api.ovh.com/createToken/

**Permissions requises** :
- GET /domain/zone/*
- POST /domain/zone/*
- PUT /domain/zone/*
- DELETE /domain/zone/*

### Script Python (si disponible)

```python
import ovh

# Configuration
client = ovh.Client(
    endpoint='ovh-eu',
    application_key='YOUR_APP_KEY',
    application_secret='YOUR_APP_SECRET',
    consumer_key='YOUR_CONSUMER_KEY',
)

domain = 'calculeage.fr'

# Option A : Changer les nameservers
result = client.put(f'/domain/zone/{domain}/nameServers',
    nameServers=[
        {'host': 'dns1.p01.nsone.net'},
        {'host': 'dns2.p01.nsone.net'},
        {'host': 'dns3.p01.nsone.net'},
        {'host': 'dns4.p01.nsone.net'},
    ]
)

print("✅ Nameservers changés vers Netlify")
```

### Script Bash OVH CLI

```bash
# Installer OVH CLI
pip install ovh

# Configurer
ovh-eu domain zone record list calculeage.fr

# Supprimer anciens A records
ovh-eu domain zone record delete calculeage.fr <ID>

# Ajouter nouveau A record
ovh-eu domain zone record create calculeage.fr --fieldType A --target 75.2.60.5

# Rafraîchir la zone
ovh-eu domain zone refresh calculeage.fr
```

---

## ✅ VÉRIFICATIONS

### Pendant la Propagation

**Vérifier le changement DNS :**

```bash
# Windows
nslookup calculeage.fr

# Doit retourner :
# - Pendant transition : 185.199.x.x (GitHub) ou 75.2.60.5 (Netlify)
# - Après propagation : 75.2.60.5 (Netlify)
```

**Vérifier les nameservers (si Option A) :**

```bash
nslookup -type=NS calculeage.fr

# Doit retourner :
# dns1.p01.nsone.net
# dns2.p01.nsone.net
# dns3.p01.nsone.net
# dns4.p01.nsone.net
```

### Après Propagation (2-48h)

**1. Tester le domaine**

```bash
curl -I https://calculeage.fr

# Doit retourner :
# Server: Netlify  ← Important !
# Strict-Transport-Security: max-age=63072000...
```

**2. Vérifier SSL/TLS**

- Aller sur : https://calculeage.fr
- Cliquer sur le cadenas 🔒
- Vérifier : **"Let's Encrypt"** ou **"Netlify"**

**3. Tester les headers A++**

```bash
curl -I https://calculeage.fr | grep -i "content-security\|x-frame"

# Doit afficher les 15 headers de sécurité
```

**4. Vérifier score sécurité**

- https://securityheaders.com/?q=calculeage.fr
- **Score attendu : A+**

**5. Vérifier SSL/TLS**

- https://www.ssllabs.com/ssltest/analyze.html?d=calculeage.fr
- **Score attendu : A+**

**6. Vérifier performance**

- https://pagespeed.web.dev/analysis?url=https://calculeage.fr
- **Scores attendus : 100/100 partout**

---

## 🚨 RÉSOLUTION DE PROBLÈMES

### Problème 1 : Impossible de modifier les serveurs DNS

**Cause** : Domaine verrouillé ou en transfert

**Solution** :
1. Vérifier dans "Informations générales" → "Statut"
2. Si "Verrouillé" : Cliquer sur "Déverrouiller"
3. Si "En transfert" : Attendre la fin du transfert

### Problème 2 : Erreur "Operation forbidden"

**Cause** : Permissions insuffisantes

**Solution** :
1. Vérifier que vous êtes le contact administrateur
2. Aller dans "Contacts" → Vérifier le contact Admin
3. Si besoin, demander les droits au propriétaire

### Problème 3 : DNS ne se propagent pas après 48h

**Cause** : Cache DNS ou configuration incorrecte

**Solution** :
```bash
# Vider le cache DNS Windows
ipconfig /flushdns

# Tester avec Google DNS
nslookup calculeage.fr 8.8.8.8

# Tester avec Cloudflare DNS
nslookup calculeage.fr 1.1.1.1
```

### Problème 4 : SSL ne s'active pas

**Cause** : DNS pas encore propagés ou config incorrecte

**Solution** :
1. Attendre 24-48h après propagation DNS
2. Vérifier dans Netlify : Domain management → Domaine → "Verify DNS configuration"
3. Forcer le provisionnement : Cliquer "Renew certificate"

### Problème 5 : Site affiche encore GitHub Pages

**Cause** : Cache navigateur ou CDN

**Solution** :
```bash
# Vider cache navigateur
Ctrl + Shift + Delete (Chrome/Edge)
Ctrl + Shift + R (Firefox)

# Tester en navigation privée
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

---

## 📊 TIMELINE ATTENDUE

### Jour 0 (Aujourd'hui)

- **00:00** - Changement DNS effectué dans OVH ✅
- **00:05** - Email confirmation OVH reçu
- **00:10** - Début propagation DNS

### Jour 0+2h à 6h (Généralement)

- **02:00-06:00** - DNS propagés dans la plupart des régions
- Tester : `nslookup calculeage.fr`
- Si `75.2.60.5` : ✅ Propagé !

### Jour 0+6h à 24h

- **06:00-24:00** - Propagation mondiale complète
- SSL/TLS automatiquement provisionné par Netlify
- HTTPS actif sur calculeage.fr

### Jour 1

- **24:00** - Propagation complète garantie
- Site 100% opérationnel sur calculeage.fr
- Headers A++ actifs
- SSL/TLS A+ actif

### Jour 2 (Max)

- **48:00** - Délai maximum de propagation DNS
- Tous les utilisateurs voient le nouveau site
- Cache CDN actif partout

---

## 📋 CHECKLIST COMPLÈTE

### Avant de Commencer

- [ ] Compte OVH accessible
- [ ] Email de contact valide (pour confirmation)
- [ ] Backup des paramètres DNS actuels (screenshot)

### Changement DNS

- [ ] Connexion à OVH Manager
- [ ] Navigation vers calculeage.fr
- [ ] **Option A** : Nameservers changés vers Netlify (RECOMMANDÉ)
  - [ ] dns1.p01.nsone.net
  - [ ] dns2.p01.nsone.net
  - [ ] dns3.p01.nsone.net
  - [ ] dns4.p01.nsone.net

  **OU**

- [ ] **Option B** : Zone DNS modifiée
  - [ ] Suppression A records GitHub (185.199.x.x)
  - [ ] Ajout A record Netlify (75.2.60.5)
  - [ ] Modification CNAME www → calculeage.netlify.app

- [ ] Confirmation changement
- [ ] Email confirmation reçu

### Attente Propagation

- [ ] Attendre 2-6 heures minimum
- [ ] Tester périodiquement : `nslookup calculeage.fr`
- [ ] Surveiller emails OVH

### Vérifications Finales

- [ ] DNS pointent vers Netlify (75.2.60.5)
- [ ] Site charge sur https://calculeage.fr
- [ ] Server: Netlify (curl -I)
- [ ] SSL/TLS actif (cadenas 🔒)
- [ ] Headers A++ actifs (securityheaders.com)
- [ ] Performance 100/100 (pagespeed.web.dev)
- [ ] PWA fonctionne
- [ ] Mode offline fonctionne

---

## 🎯 RÉSUMÉ RAPIDE

**Ce qu'il faut faire** :

1. Aller sur https://www.ovh.com/manager/
2. Noms de domaine → calculeage.fr → Serveurs DNS
3. Modifier les serveurs DNS → Ajouter serveurs personnalisés :
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
4. Appliquer la configuration
5. Attendre 2-48h (généralement 2-6h)
6. Vérifier https://calculeage.fr fonctionne

**C'est tout !** Le reste est automatique (SSL, headers, CDN, etc.)

---

## 📞 SUPPORT

### OVH

- Support : https://www.ovh.com/fr/support/
- Guides : https://docs.ovh.com/fr/domains/
- Téléphone : 1007 (depuis la France)

### Netlify

- Dashboard : https://app.netlify.com/projects/calculeage
- Docs DNS : https://docs.netlify.com/domains-https/custom-domains/
- Forum : https://answers.netlify.com/
- Email : support@netlify.com

---

**Dernière mise à jour** : 19 octobre 2025
**Version** : 1.0.0
**Registrar détecté** : OVH
**Nameservers actuels** : dns16.ovh.net, ns16.ovh.net
**Nameservers cibles** : dns1-4.p01.nsone.net

---

## 🎉 APRÈS LE CHANGEMENT DNS

Une fois propagé, votre site sera :

✅ **Sur Netlify** (https://calculeage.fr)
✅ **SSL/TLS A+** (Let's Encrypt automatique)
✅ **Headers A++** (15 headers militaires)
✅ **Performance 100/100** (CDN global)
✅ **Sécurité maximale** (DDoS protection)
✅ **PWA installable** (mode offline)

**Temps estimé changement DNS** : 5 minutes
**Temps propagation** : 2-48h (généralement 2-6h)
