# 🧁 GD Pâtisserie - E-commerce Artisan

![gd-website.png](gd-website.png)
Une application web Fullstack de commande en ligne (Click & Collect) pour une pâtisserie artisanale.
Conçue pour gérer le catalogue, les stocks en temps réel et le suivi des commandes via un Dashboard Administrateur complet.

## ✨ Fonctionnalités

### 🛍️ Pour les Clients
* **Catalogue Interactif :** Filtrage par catégories (Gâteaux, Chocolats...) et recherche instantanée.
* **Panier Persistant :** Gestion du panier côté client (Zustand) conservé même après fermeture du navigateur.
* **Tunnel de Commande :** Sélection de la date et du créneau de retrait.
* **Emails Transactionnels :** Confirmation de commande automatique via Resend.

### 👨‍🍳 Pour l'Artisan (Back-Office)
* **Dashboard Sécurisé :** Authentification robuste (NextAuth v5).
* **Vue d'ensemble (KPIs) :** Graphiques de CA (Recharts) et indicateurs d'activité en temps réel.
* **Gestion des Commandes :** Changement de statut (Confirmé, Prêt, Livré) et impression de bons de commande.
* **Gestion des Produits :** Création, modification, archivage et gestion de la disponibilité (On/Off) en un clic.
* **Upload d'Images :** Intégration Drag & Drop avec Cloudinary.

## 🛠️ Stack Technique

* **Framework :** [Next.js 15](https://nextjs.org/) (App Router)
* **Langage :** TypeScript
* **Base de Données :** PostgreSQL
* **ORM :** Prisma
* **Styling :** Tailwind CSS + shadcn/ui
* **Authentification :** Auth.js (NextAuth v5)
* **State Management :** Zustand
* **Services Tiers :** Cloudinary (Images), Resend (Emails)
* **DevOps :** Docker & Docker Compose (Déploiement VPS)

## 🚀 Installation & Démarrage

### Prérequis
* Node.js 18+
* Docker & Docker Compose
* pnpm (`npm install -g pnpm`)

### 1. Cloner le projet
```bash
git clone [https://github.com/ton-pseudo/gdpatisserie.git](https://github.com/ton-pseudo/gdpatisserie.git)
cd gdpatisserie
```

### 2. Configuration
Dupliquez le fichier `.env.example` en `.env` et remplissez vos clés :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gdpatisserie_db"
AUTH_SECRET="votre_super_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
RESEND_API_KEY="re_123..."
```

### 3. Lancer avec Docker (Recommandé)
Pour lancer la base de données et l'application en local :

```bash
docker-compose up -d
```

### 4. Lancer en mode Développement (Sans Docker pour l'app)
Si vous préférez développer avec le Hot-Reload :

```bash
# Lancer uniquement la BDD via Docker
docker-compose up -d db

# Installer les dépendances
pnpm install

# Initialiser la BDD
pnpm prisma migrate dev
pnpm prisma db seed

# Lancer le serveur
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 📂 Structure du Projet

```text
├── src/
│   ├── app/              # Pages et API Routes (App Router)
│   │   ├── (admin)/      # Routes protégées Back-Office
│   │   ├── api/          # Endpoints API (Auth, Upload...)
│   │   └── ...           # Routes publiques (Catalog, Cart...)
│   ├── components/       # Composants React réutilisables
│   ├── lib/              # Utilitaires (Prisma client, cn...)
│   └── store/            # Stores Zustand (Panier)
├── prisma/               # Schéma de BDD et Seed
├── public/               # Assets statiques
└── docker-compose.yml    # Orchestration Docker
```

## 📜 Licence

Ce projet est sous licence MIT.