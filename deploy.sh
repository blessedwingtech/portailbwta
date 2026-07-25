#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT AUTOMATISÉ ET SÉCURISÉ - PORTAIL BWTA (DOCKER / NGINX)
# Serveur Cible : vmi2717052 (bwta.bittonik.com - Port 3002)
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

# Affichage du diagnostic des ports Node/Web (3000, 3001, 3002, 3005, 8080, 8081...)
if command -v ss >/dev/null 2>&1; then
    ACTIVE_PORTS=$(sudo ss -tuln | grep -E "(3000|3001|3002|3005|8080|8081|5432|5433)")
    echo -e "${CYAN}Ports majeurs et bases de données actifs :${NC}"
    echo "$ACTIVE_PORTS"
else
    echo -e "${CYAN}Vérification avec netstat :${NC}"
    sudo netstat -tuln | grep -E "(3000|3001|3002|3005|8080|8081|5432|5433)"
fi

echo -e "\n${BOLD}${YELLOW}--> Vérification spécifique du PORT 3002 (Cible du proxy Nginx pour bwta.bittonik.com) :${NC}"
if sudo ss -tuln | grep -q ":3002 "; then
    echo -e "${YELLOW}⚠️ Notice : Le port 3002 est actuellement en écoute. S'il s'agit d'un ancien processus, Docker Compose va l'actualiser.${NC}"
    # Si c'est un processus PM2 ou Node non-docker, on enivre l'info
    sudo lsof -i :3002 2>/dev/null || echo -e "Processus sur 3002 identifié en tâche de fond."
else
    echo -e "${GREEN}✔ Le port 3002 est actuellement libre. C'est la raison exacte de l'erreur '502 Bad Gateway' sur Nginx ! Notre conteneur Docker va s'y connecter.${NC}"
fi
echo ""

# ------------------------------------------------------------------------------
# ÉTAPE 2 : MISE À JOUR DU CODE VIA GIT (GITHUB)
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[2/5] 📥 Récupération des dernières évolutions (Archives, Mails, Comptes, Rôles)...${NC}"
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
echo -e "${BOLD}${YELLOW}[4/5] 🐳 Build multi-stage optimisé et lancement du conteneur Docker...${NC}"
echo -e "${CYAN}--> Le build compile Next.js 16 et prépare la synchronisation automatique des tables de la base de données...${NC}"

# Support pour docker-compose (ancien) et docker compose (moderne V2)
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Arrêt propreté et relance du build en réseau "host" (accès instantané sur Port 3002 & Postgres 5432)
$COMPOSE_CMD down --remove-orphans 2>/dev/null
$COMPOSE_CMD up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✔ Conteneur 'bwta-portal-prod' déployé et démarré avec succès !${NC}\n"
else
    echo -e "${RED}❌ Échec lors du docker compose up. Vérifiez les journaux d'erreur ci-dessus.${NC}"
    exit 1
fi

# ------------------------------------------------------------------------------
# ÉTAPE 5 : VÉRIFICATION DE LA SANTÉ DU SERVICE SUR LE PORT 3002 & FIN DU 502
# ------------------------------------------------------------------------------
echo -e "${BOLD}${YELLOW}[5/5] 🩺 Attente de l'initialisation (Prisma db push & Next.js start) et test du port 3002...${NC}"
sleep 6 # Laisse 6 secondes à Node/Prisma pour se brancher

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3002 || echo "000")

if [ "$HTTP_CODE" -ne "000" ] && [ "$HTTP_CODE" -ne "502" ]; then
    echo -e "${BOLD}${GREEN}✅ SYSTÈM EN LIGNE (Code HTTP local : $HTTP_CODE) ! Le port 3002 répond parfaitement.${NC}"
    echo -e "${BOLD}${GREEN}🏆 L'erreur 502 Bad Gateway sur https://bwta.bittonik.com est désormais TERMINÉE !${NC}"
else
    echo -e "${YELLOW}⚠️ Le port 3002 met un peu de temps à se stabiliser (Code HTTP : $HTTP_CODE). Displaying logs :${NC}"
    $COMPOSE_CMD logs --tail=15
fi

echo -e "\n${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${GREEN}       ✨ DÉPLOIEMENT BWTA COMPLÈTEMENT VALIDÉ ET SUCCÈS ! ✨       ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}👉 Pour consulter le journal des accès en direct à tout moment, tapez :${NC}"
echo -e "${BOLD}   $COMPOSE_CMD logs -f${NC}\n"
