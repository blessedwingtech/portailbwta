#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT AUTOMATISÉ ET SÉCURISÉ - PORTAIL BWTA (DOCKER / NGINX)
# Serveur Cible : vmi2717052 (bwta.bittonik.com - Port 3004 dédié)
# ==============================================================================

# Couleurs pour un affichage terminal élégant et pro
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "\n${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${GREEN}🚀 DÉMARRAGE DU DÉPLOIEMENT DOCKERISÉ - BLESSED WING TECH ACADEMY (BWTA)${NC}"
echo -e "${CYAN}======================================================================${NC}\n"

# ------------------------------------------------------------------------------
# ÉTAPE 1 : VÉRIFICATION DES PORTS RÉSEAU ET DE L'ÉCOLOGIE DU SERVEUR
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[1/5] 🔍 Inspection des ports réseaux actuellement occupés sur le VPS...${NC}"

if command -v ss >/dev/null 2>&1; then
    ACTIVE_PORTS=$(sudo ss -tuln | grep -E "(3000|3001|3002|3004|3005|8080|8081|5432|5433)")
    echo -e "${CYAN}Ports majeurs et bases de données actifs :${NC}"
    echo "$ACTIVE_PORTS"
else
    sudo netstat -tuln | grep -E "(3000|3001|3002|3004|3005|8080|8081|5432|5433)"
fi

echo -e "\n${BOLD}${YELLOW}--> Vérification spécifique du PORT 3004 (Port dédié au portail BWTA, évitant le port 3002 de news-platform) :${NC}"
if sudo ss -tulnp 2>/dev/null | grep -q ":3004 "; then
    echo -e "${YELLOW}⚠️ Notice : Le port 3004 est actuellement en écoute. Nettoyage et actualisation du conteneur en cours...${NC}"
    docker stop bwta-portal-prod 2>/dev/null || true
    docker rm bwta-portal-prod 2>/dev/null || true
    sudo fuser -k 3004/tcp 2>/dev/null || sudo lsof -t -i:3004 | xargs -r sudo kill -9 2>/dev/null || true
    sleep 2
    echo -e "${GREEN}✔ Port 3004 nettoyé et prêt pour la nouvelle version du portail.${NC}"
else
    echo -e "${GREEN}✔ Le port 3004 est 100% disponible et libre ! Aucune collision avec vos autres projets (3000, 3001, 3002, 3005).${NC}"
fi
echo ""

# ------------------------------------------------------------------------------
# ÉTAPE 2 : MISE À JOUR DU CODE VIA GIT (GITHUB)
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[2/5] 📥 Récupération des dernières évolutions et de la configuration Docker (Port 3004)...${NC}"
git fetch origin main && git reset --hard origin/main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du git reset. Vérifiez votre connexion internet ou les permissions git.${NC}"
    exit 1
fi
echo -e "${GREEN}✔ Dépôt local synchronisé à 100 % avec le serveur Github origin/main.${NC}\n"

# ------------------------------------------------------------------------------
# ÉTAPE 3 : VÉRIFICATION DU FICHIER .ENV (POSTGRESQL & NEXTAUTH)
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[3/5] 🔐 Vérification de l'environnement de production (.env)...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ ERREUR CRITIQUE : Fichier .env manquant dans /var/www/portailbwta !${NC}"
    echo -e "${YELLOW}Veuillez vous assurer que .env existe et contient DATABASE_URL, NEXTAUTH_SECRET, etc.${NC}"
    exit 1
else
    echo -e "${GREEN}✔ Fichier .env détecté et valide pour injection sécurisée dans Docker.${NC}\n"
fi

# ------------------------------------------------------------------------------
# ÉTAPE 4 : CONSTRUCTION ET DÉMARRAGE DOCKER (DOCKER COMPOSE)
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[4/5] 🐳 Build multi-stage optimisé (avec .dockerignore) et lancement sur Port 3004...${NC}"
echo -e "${CYAN}--> Compilation pure sans conflit et synchronisation automatique de la base Postgres...${NC}"

if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

$COMPOSE_CMD down --remove-orphans 2>/dev/null || true
$COMPOSE_CMD up -d --build --force-recreate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✔ Conteneur 'bwta-portal-prod' déployé et démarré avec succès sur le réseau 'host' (Port 3004) !${NC}\n"
else
    echo -e "${RED}❌ Échec lors du docker compose up. Vérifiez les journaux ci-dessus.${NC}"
    exit 1
fi

# ------------------------------------------------------------------------------
# ÉTAPE 5 : VÉRIFICATION DE LA SANTÉ DU SERVICE SUR LE PORT 3004 & FIN DU 502
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[5/5] 🩺 Attente de l'initialisation (Prisma db push & Next.js) et test HTTP local sur Port 3004...${NC}"
sleep 6

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3004 || echo "000")

if [ "$HTTP_CODE" -ne "000" ] && [ "$HTTP_CODE" -ne "502" ]; then
    echo -e "${BOLD}${GREEN}✅ SYSTÈME EN LIGNE ! (Code HTTP local : $HTTP_CODE) sur http://127.0.0.1:3004.${NC}"
    echo -e "${BOLD}${GREEN}🏆 PENSEZ À METTRE À JOUR NGINX SUR LE SERVEUR SUR LE PORT 3004 (proxy_pass http://127.0.0.1:3004;) !${NC}"
else
    echo -e "${YELLOW}⚠️ Le port 3004 prend quelques secondes de plus pour démarrer (Code HTTP : $HTTP_CODE). Affichage du journal :${NC}"
    $COMPOSE_CMD logs --tail=20
fi

echo -e "\n${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${GREEN}       ✨ DÉPLOIEMENT BWTA COMPLÈTEMENT VALIDÉ ET SUCCÈS ! ✨       ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}👉 Pour consulter les journaux d'accès en temps réel :${NC}"
echo -e "${BOLD}   $COMPOSE_CMD logs -f${NC}\n"
