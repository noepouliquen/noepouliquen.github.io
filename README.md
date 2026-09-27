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
│   ├── video/showreel.mp4  ← showreel de la section Motion design (H.264, muet, ~10 Mo)
│   └── img/                ← images (déjà compressées pour le web)
└── README.md
```

**Projets, compétences, expériences, parcours et galerie : tout se modifie dans
`assets/js/content.js`.** Pour ajouter un projet, copier un bloc du tableau `projects` et
changer les champs ; si `caseStudy` est rempli, le bouton « Voir l'étude de cas » apparaît.

⚠️ Les textes de l'accueil, d'À propos et du Contact existent **à la fois** dans `index.html`
et dans `content.js` : modifier les deux.

## Le bouton CV

Il pointe sur `assets/cv-noe-pouliquen.pdf`, réglé dans `assets/js/content.js`
(`person.cvUrl`). Pour changer de CV : remplacer le PDF en gardant le même nom.

Ce PDF est la **version publique** : pas de téléphone ni d'adresse, le dépôt étant
public. La version complète est à envoyer à la main.

## Le showreel

Réglé dans `assets/js/content.js` (`motion`) : vidéo, image d'attente
(`assets/img/motion-poster.jpg`), description et crédits. Il se lance tout seul, sans son
et en boucle, quand la section arrive à l'écran ; avec « réduire les animations », il attend
qu'on appuie sur lecture. Pour le remplacer : exporter en H.264 (MP4, 1080p, 8 à 12 Mo, sans
son) sous le même nom.

## Ajouter des images

1. Exporter pour le web (100 à 400 Ko ; Photoshop « Exporter pour le web » ou squoosh.app).
2. Déposer dans `assets/img/` et référencer le chemin dans `content.js`.
3. Respecter les majuscules/minuscules du nom de fichier : GitHub Pages les distingue.

## Déjà en place

- Navigation complète au clavier, focus visible, lien d'évitement, textes alternatifs.
- Respect du réglage « réduire les animations » du système.
- Responsive ordinateur / mobile, sans défilement horizontal.
- Métadonnées SEO (titre, description, Open Graph, JSON-LD).
