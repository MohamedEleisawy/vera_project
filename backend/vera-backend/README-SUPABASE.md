# 🗄️ Configuration Supabase - VERA Backend

## Informations projet

- **Nom :** vera-backend
- **Provider :** Supabase
- **Région :** Europe
- **Plan :** Free (500MB database)

---

## 🔗 Accès Supabase Dashboard

**URL :** https://supabase.com/dashboard/project/geybaicurwzwjsanxely

---

## 📦 Configuration locale

### 1. Copier `.env.example` vers `.env`
```bash
cp .env.example .env
```

### 2. Demander les credentials à Mohamed

**Variables à configurer :**
- `DATABASE_URL` (port 6543 avec pgbouncer)
- `DIRECT_URL` (port 5432 sans pgbouncer)
- `JWT_SECRET`

### 3. Installer dépendances
```bash
npm install
```

### 4. Lancer migrations Prisma
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Tester connexion
```bash
npx prisma studio
# Ouvre http://localhost:5555
# Vérifie que tu vois la table "users"
```

---

## 🧪 Outils utiles

### Prisma Studio (interface visuelle BDD)
```bash
npx prisma studio
```

### Supabase SQL Editor
1. Dashboard → SQL Editor
2. Exécuter requêtes SQL directement

### Reset base de données (DEV UNIQUEMENT)
```bash
npx prisma migrate reset
# ⚠️ SUPPRIME TOUTES LES DONNÉES !
```

---

## 📊 Limites plan gratuit Supabase

| Ressource | Limite Free |
|-----------|-------------|
| **Database** | 500 MB |
| **File Storage** | 1 GB |
| **Bandwidth** | 5 GB/mois |
| **API Requests** | Unlimited |
| **Projects** | 2 projets actifs |

**Monitoring :** Dashboard → Settings → Usage

---

## 🔒 Sécurité
### Mots de passe Supabase
- ✅ Ne JAMAIS commit `.env`
---

## 🆘 Problèmes courants

### Erreur "Can't reach database server"
**Solution :**
1. Vérifier que le projet Supabase est démarré (Dashboard)
2. Vérifier `DATABASE_URL` dans `.env`
3. Tester connexion : `npx prisma db pull`

### Erreur "Migration failed"
**Solution :**
1. Vérifier `DIRECT_URL` (port 5432, pas 6543)
2. Vérifier que mot de passe est correctement URL-encodé
3. Si caractères spéciaux dans mot de passe, utiliser : https://www.urlencoder.org/

### Base de données pleine (500MB)
**Solution :**
1. Dashboard → Settings → Usage
2. Nettoyer données de test
3. Upgrader vers plan Pro ($25/mois) si nécessaire

---

## 📞 Contact

**Questions Supabase ?** → Mohamed (chef projet backend)