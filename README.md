# Portfolio n8n - Teina Teinauri

Portfolio personnel présentant mes compétences en automatisation n8n et architecture Supabase.

## ✨ Fonctionnalités

- **Effet 3D Zoom Révélateur** : Animation Three.js immersive avec plongée dans un webhook n8n
- **Skills flottants** : Icônes SVG animées avec anneaux lumineux style n8n
- **Formulaire de contact** : Intégré avec workflow n8n (Gmail + Telegram)
- **Responsive** : Adapté mobile avec fallback CSS
- **Bilingue** : Français / English

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3 (variables CSS, Grid, Flexbox)
- **3D** : Three.js, GSAP ScrollTrigger
- **Backend** : n8n webhook pour le formulaire de contact
- **Hébergement** : Vercel

## 📁 Structure

```
portfolio-n8n/
├── index.html              # Page principale
├── css/
│   └── main.css            # Styles (variables n8n, responsive)
├── js/
│   ├── main.js             # App principale, i18n, formulaire
│   ├── three-scene.js      # Scène 3D zoom révélateur
│   └── scroll-animations.js # GSAP ScrollTrigger
├── data/
│   └── projects.json       # Données des projets
├── assets/                 # Images et assets
├── n8n-workflow-contact.json # Template workflow n8n
├── vercel.json             # Configuration Vercel
└── .env.example            # Variables d'environnement
```

## 🚀 Déploiement Vercel

### 1. Fork/Clone le repository

```bash
git clone https://github.com/VOTRE-USERNAME/portfolio-n8n.git
```

### 2. Importer sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. "Add New Project" → Importer depuis GitHub
3. Sélectionner le repository `portfolio-n8n`

### 3. Configurer les variables d'environnement

Dans Vercel Dashboard > Project Settings > Environment Variables :

| Variable | Valeur |
|----------|--------|
| `N8N_WEBHOOK_URL` | `https://votre-instance.app.n8n.cloud/webhook/portfolio-contact` |

### 4. Configurer le workflow n8n

1. Importer `n8n-workflow-contact.json` dans votre instance n8n
2. Configurer les credentials Gmail et Telegram
3. Remplacer les placeholders :
   - `REPLACE_WITH_YOUR_GMAIL_CREDENTIALS_ID`
   - `REPLACE_WITH_YOUR_TELEGRAM_CREDENTIALS_ID`
   - `REPLACE_WITH_YOUR_TELEGRAM_CHAT_ID`
4. Activer le workflow

### 5. Mettre à jour l'URL webhook

Dans `js/main.js`, ligne ~380 :
```javascript
const N8N_WEBHOOK_URL = 'https://votre-instance.app.n8n.cloud/webhook/portfolio-contact';
```

## 🧪 Développement local

```bash
# Servir avec Python
python -m http.server 8080

# Ou avec Node.js
npx serve .
```

Ouvrir http://localhost:8080

## 📝 Personnalisation

### Projets
Modifier `data/projects.json` pour ajouter/modifier les projets.

### Traductions
Modifier les objets `translations.fr` et `translations.en` dans `js/main.js`.

### Couleurs
Les variables CSS sont dans `css/main.css` :
```css
:root {
  --n8n-color-primary: #FF6D5A;
  --n8n-color-background: #1a1a1a;
  /* ... */
}
```

## 📄 Licence

MIT - Libre d'utilisation et modification.

---

Créé avec ❤️ par Teina Teinauri
