# Portfolio — Noé Pouliquen

Site : https://noepouliquen.github.io/

Site statique en HTML / CSS / JS, sans framework ni build.

## Lancer le site

- **Double-clic sur `index.html`** : tout fonctionne, y compris la 3D de l'accueil.
- **En ligne** : GitHub Pages publie la branche `main` telle quelle. Chaque commit poussé met
  le site à jour en une ou deux minutes.

Une connexion internet est nécessaire pour la 3D (Three.js via jsDelivr) et pour la police du
texte (Archivo via Google Fonts). Sans connexion, l'accueil affiche une couverture 2D de
secours et le texte passe sur une police système.

## Où modifier quoi

```
├── index.html              ← structure + textes de l'accueil, d'À propos et du Contact
├── assets/
│   ├── css/style.css       ← toute la direction artistique (couleurs, typo, mise en page)
│   ├── fonts/Rinter.woff2  ← police des titres (Thunder Type, gratuite, usage commercial OK)
│   ├── js/content.js       ← DONNÉES : projets, compétences, expériences, parcours,
│   │                         galerie, liens (email / LinkedIn / CV)
│   ├── js/main.js          ← comportement du site
│   ├── js/three-setup.js   ← accueil 3D (Three.js)
│   ├── models/             ← personnage 3D (.glb) + sa copie .glb.js pour le double-clic
│   └── img/                ← images (déjà compressées pour le web)
└── README.md
```

**Projets, compétences, expériences, parcours et galerie : tout se modifie dans
`assets/js/content.js`.** Pour ajouter un projet, copier un bloc du tableau `projects` et
changer les champs ; si `caseStudy` est rempli, le bouton « Voir l'étude de cas » apparaît.

⚠️ Les textes de l'accueil, d'À propos et du Contact existent **à la fois** dans `index.html`
et dans `content.js` : modifier les deux.

## Le bouton CV

Désactivé tant qu'aucun fichier n'est fourni. Pour l'activer :
1. Déposer le PDF dans `assets/` (ex. `assets/cv-noe-pouliquen.pdf`).
2. Dans `assets/js/content.js`, remplir `person.cvUrl: "assets/cv-noe-pouliquen.pdf"`.

## Ajouter des images

1. Exporter pour le web (100 à 400 Ko ; Photoshop « Exporter pour le web » ou squoosh.app).
2. Déposer dans `assets/img/` et référencer le chemin dans `content.js`.
3. Respecter les majuscules/minuscules du nom de fichier : GitHub Pages les distingue.

## Déjà en place

- Navigation complète au clavier, focus visible, lien d'évitement, textes alternatifs.
- Respect du réglage « réduire les animations » du système.
- Responsive ordinateur / mobile, sans défilement horizontal.
- Métadonnées SEO (titre, description, Open Graph, JSON-LD).
