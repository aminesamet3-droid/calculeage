# ================================================================
# SCRIPT MONITORING DNS - calculeage.fr → Netlify
# ================================================================
# Ce script vérifie automatiquement quand le DNS change
# de GitHub Pages vers Netlify
# ================================================================

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║       🔍 MONITORING DNS - calculeage.fr → Netlify              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""

# Configuration
$domain = "calculeage.fr"
$targetIP = "75.2.60.5"  # Netlify IP
$githubIPs = @("185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153")
$netlifyNameservers = @("dns1.p01.nsone.net", "dns2.p01.nsone.net", "dns3.p01.nsone.net", "dns4.p01.nsone.net")
$checkInterval = 300  # 5 minutes
$maxChecks = 288  # 24 heures (288 × 5 minutes)

# Fonctions
function Get-DomainIP {
    param($domain)
    try {
        $result = Resolve-DnsName -Name $domain -Type A -ErrorAction Stop
        return $result | Where-Object { $_.Type -eq 'A' } | Select-Object -ExpandProperty IPAddress
    }
    catch {
        return $null
    }
}

function Get-DomainNameservers {
    param($domain)
    try {
        $result = Resolve-DnsName -Name $domain -Type NS -ErrorAction Stop
        return $result | Where-Object { $_.Type -eq 'NS' } | Select-Object -ExpandProperty NameHost
    }
    catch {
        return $null
    }
}

function Test-NetlifyDNS {
    param($ips, $nameservers)

    # Vérifier si les IPs contiennent l'IP Netlify
    $hasNetlifyIP = $ips -contains $targetIP

    # Vérifier si les nameservers contiennent au moins un nameserver Netlify
    $hasNetlifyNS = $false
    foreach ($ns in $nameservers) {
        if ($netlifyNameservers -contains $ns) {
            $hasNetlifyNS = $true
            break
        }
    }

    return $hasNetlifyIP -or $hasNetlifyNS
}

function Show-Status {
    param($ips, $nameservers, $checkNumber, $totalChecks)

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    Write-Host "┌─────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
    Write-Host "│ Check #$checkNumber / $totalChecks - $timestamp" -ForegroundColor Yellow
    Write-Host "└─────────────────────────────────────────────────────────┘" -ForegroundColor Yellow

    Write-Host ""
    Write-Host "🌐 Adresses IP actuelles :" -ForegroundColor Cyan
    if ($ips) {
        foreach ($ip in $ips) {
            if ($ip -eq $targetIP) {
                Write-Host "   ✅ $ip (NETLIFY)" -ForegroundColor Green
            }
            elseif ($githubIPs -contains $ip) {
                Write-Host "   ⏳ $ip (GitHub Pages - ancien)" -ForegroundColor Yellow
            }
            else {
                Write-Host "   ❓ $ip (inconnu)" -ForegroundColor Gray
            }
        }
    }
    else {
        Write-Host "   ❌ Aucune IP trouvée" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "🔧 Serveurs DNS (Nameservers) :" -ForegroundColor Cyan
    if ($nameservers) {
        foreach ($ns in $nameservers) {
            if ($netlifyNameservers -contains $ns) {
                Write-Host "   ✅ $ns (NETLIFY)" -ForegroundColor Green
            }
            else {
                Write-Host "   ⏳ $ns (ancien)" -ForegroundColor Yellow
            }
        }
    }
    else {
        Write-Host "   ❌ Aucun nameserver trouvé" -ForegroundColor Red
    }

    Write-Host ""
}

# Message d'introduction
Write-Host "📋 Configuration :" -ForegroundColor White
Write-Host "   Domaine : $domain" -ForegroundColor Gray
Write-Host "   IP cible : $targetIP (Netlify)" -ForegroundColor Gray
Write-Host "   Intervalle : $checkInterval secondes ($($checkInterval/60) minutes)" -ForegroundColor Gray
Write-Host "   Durée max : $($maxChecks * $checkInterval / 3600) heures" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Démarrage du monitoring..." -ForegroundColor White
Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host ""

# Boucle de monitoring
$checkCount = 0
$dnsChanged = $false

while ($checkCount -lt $maxChecks -and -not $dnsChanged) {
    $checkCount++

    # Récupérer les informations DNS
    $currentIPs = Get-DomainIP -domain $domain
    $currentNameservers = Get-DomainNameservers -domain $domain

    # Afficher le statut
    Show-Status -ips $currentIPs -nameservers $currentNameservers -checkNumber $checkCount -totalChecks $maxChecks

    # Vérifier si le DNS a changé
    $dnsChanged = Test-NetlifyDNS -ips $currentIPs -nameservers $currentNameservers

    if ($dnsChanged) {
        Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                                                                ║" -ForegroundColor Green
        Write-Host "║                    🎉 DNS CHANGÉ VERS NETLIFY !                ║" -ForegroundColor Green
        Write-Host "║                                                                ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""

        Write-Host "✅ Vérifications automatiques :" -ForegroundColor Green
        Write-Host ""

        # Test HTTPS
        Write-Host "🔒 Test HTTPS calculeage.fr..." -ForegroundColor Cyan
        try {
            $response = Invoke-WebRequest -Uri "https://calculeage.fr" -Method Head -UseBasicParsing -TimeoutSec 10
            $server = $response.Headers.Server

            if ($server -like "*Netlify*") {
                Write-Host "   ✅ Site en ligne sur Netlify !" -ForegroundColor Green
            }
            else {
                Write-Host "   ⚠️  Site en ligne mais serveur : $server" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "   ⏳ Site pas encore accessible (propagation en cours)" -ForegroundColor Yellow
        }

        Write-Host ""

        # Afficher les liens de vérification
        Write-Host "🔗 Liens de vérification :" -ForegroundColor Cyan
        Write-Host "   Site : https://calculeage.fr" -ForegroundColor White
        Write-Host "   Security Headers : https://securityheaders.com/?q=calculeage.fr" -ForegroundColor White
        Write-Host "   SSL Labs : https://www.ssllabs.com/ssltest/analyze.html?d=calculeage.fr" -ForegroundColor White
        Write-Host "   PageSpeed : https://pagespeed.web.dev/analysis?url=https://calculeage.fr" -ForegroundColor White
        Write-Host "   Dashboard Netlify : https://app.netlify.com/projects/calculeage" -ForegroundColor White
        Write-Host ""

        Write-Host "📊 Prochaines étapes :" -ForegroundColor Cyan
        Write-Host "   1. Attendre 2-24h pour propagation complète mondiale" -ForegroundColor Gray
        Write-Host "   2. Vérifier SSL/TLS sur securityheaders.com (Score A+)" -ForegroundColor Gray
        Write-Host "   3. Vérifier performance sur pagespeed.web.dev (100/100)" -ForegroundColor Gray
        Write-Host "   4. Tester PWA offline mode" -ForegroundColor Gray
        Write-Host ""

        # Sons de notification (Windows)
        [Console]::Beep(800, 300)
        Start-Sleep -Milliseconds 100
        [Console]::Beep(1000, 300)
        Start-Sleep -Milliseconds 100
        [Console]::Beep(1200, 500)

        break
    }
    else {
        # Calculer le temps restant
        $elapsedSeconds = $checkCount * $checkInterval
        $remainingChecks = $maxChecks - $checkCount
        $remainingSeconds = $remainingChecks * $checkInterval

        $elapsedHours = [math]::Floor($elapsedSeconds / 3600)
        $elapsedMinutes = [math]::Floor(($elapsedSeconds % 3600) / 60)

        $remainingHours = [math]::Floor($remainingSeconds / 3600)
        $remainingMinutes = [math]::Floor(($remainingSeconds % 3600) / 60)

        Write-Host "⏱️  Temps écoulé : ${elapsedHours}h ${elapsedMinutes}m" -ForegroundColor Gray
        Write-Host "⏳ Prochain check dans $($checkInterval/60) minutes..." -ForegroundColor Gray
        Write-Host "   (Temps restant max : ${remainingHours}h ${remainingMinutes}m)" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
        Write-Host ""

        # Attendre avant le prochain check
        Start-Sleep -Seconds $checkInterval
    }
}

if (-not $dnsChanged) {
    Write-Host "⚠️  Monitoring terminé après $($maxChecks * $checkInterval / 3600) heures" -ForegroundColor Yellow
    Write-Host "   Le DNS n'a pas encore changé vers Netlify" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solutions possibles :" -ForegroundColor Cyan
    Write-Host "   1. Vérifier que le changement a été effectué dans OVH" -ForegroundColor Gray
    Write-Host "   2. Attendre plus longtemps (propagation peut prendre 48h)" -ForegroundColor Gray
    Write-Host "   3. Relancer ce script : .\monitor-dns.ps1" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "✅ Script terminé." -ForegroundColor Green
Write-Host "   Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
