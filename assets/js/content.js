/**
 * content.js — Toutes les données éditables du portfolio.
 *
 * Pour modifier un texte, un projet, une compétence, une expérience,
 * une image ou un lien : c'est ici, et nulle part ailleurs dans le code.
 * Rien dans main.js ou index.html n'a besoin d'être touché pour changer
 * du contenu.
 */

const SITE = {
  meta: {
    title: "Noé Pouliquen — Création graphique, motion & stratégie publicitaire",
    description:
      "Portfolio de Noé Pouliquen, étudiant en BUT Information-Communication parcours Publicité (IUT Bordeaux Montaigne). Création graphique, motion design et stratégie publicitaire.",
  },

  person: {
    firstName: "Noé",
    lastName: "Pouliquen",
    fullName: "Noé Pouliquen",
    tagline:
      "Je prends au sérieux les idées qui ne le sont pas. Aime explorer chaque terrain où l’idée peut prendre forme.",
    intro:
      "Étudiant en 3ᵉ année de publicité à Bordeaux, entre création graphique et stratégie de marque.",
    roles: ["Création graphique", "Motion design & vidéo", "Stratégie publicitaire"],
    email: "noepouliquenn@gmail.com",
    linkedin: "https://www.linkedin.com/in/noé-pouliquen",
    // Version publique du CV : sans téléphone ni adresse, le dépôt GitHub
    // étant public. La version complète reste à envoyer à la main.
    cvUrl: "assets/cv-noe-pouliquen.pdf",
  },

  about: {
    paragraphs: [
      "J’ai 21 ans, je suis originaire de Nantes, en 3ᵉ année de BUT Information-Communication, parcours Publicité, à l’IUT Bordeaux Montaigne.",
      "Je ne cherche pas forcément à choisir une seule case.",
      "Je me construis encore dans mon profil publicitaire, alors j’aime toucher un peu à tout : graphisme, vidéo, motion, 3D, stratégie… sans prétendre tout maîtriser.",
      "Je teste, j’apprends, je bidouille. Je m’intéresse aussi beaucoup à l’IA et à la façon dont elle peut trouver sa place dans la création.",
    ],
    qualities: ["Polyvalent", "Créatif", "Persévérant", "Curieux"],
    interests: ["Cinéma", "Dessin", "Jeux vidéo", "Basket"],
  },

  skills: [
    {
      category: "Création graphique",
      items: ["Photoshop", "Illustrator", "Dessin"],
    },
    {
      category: "Motion & vidéo",
      items: ["After Effects", "DaVinci Resolve"],
    },
    {
      category: "Communication & publicité",
      items: [
        "Recommandation publicitaire",
        "Benchmark",
        "Veille concurrentielle",
        "Veille informationnelle",
        "Marketing",
      ],
    },
  ],

  projects: [
    {
      id: "club-med",
      title: "Club Med",
      subtitle: "Rediscover yourself",
      type: "Recommandation publicitaire",
      role: "Supports print — affiches, citylights & mockup du carnet",
      tools: ["Photoshop", "IA générative (visuels)"],
      summary:
        "Repositionner Club Med sur le luxe avec une idée à contre-courant : l’ennui est le vrai privilège.",
      cover: "assets/img/clubmed-print-02.jpg",
      coverAlt:
        "Affiche Club Med « Rediscover yourself » : une femme allongée sur un court de tennis, jambes levées, à côté d'une coupe de fruits.",
      images: [
        {
          src: "assets/img/clubmed-book.jpg",
          alt: "Mockup du carnet « Rediscover yourself » déposé dans les chambres Club Med, posé sur un meuble en bois au soleil.",
        },
        {
          src: "assets/img/clubmed-citylight.jpg",
          alt: "Mockup citylight urbain avec deux affiches Club Med, dans une première version du slogan : « Define your own rhythm ».",
        },
        {
          src: "assets/img/clubmed-print-01.jpg",
          alt: "Affiche « Rediscover yourself » : une femme allongée dans l'herbe, lisant, encart blanc autour de la photo.",
        },
        {
          src: "assets/img/clubmed-print-02.jpg",
          alt: "Affiche « Rediscover yourself » : une femme allongée sur un court de tennis, jambes levées, à côté d'une coupe de fruits.",
        },
      ],
      caseStudy: {
        context: "Recommandation publicitaire en équipe, BUT Publicité.",
        problem:
          "Faire de Club Med une marque de luxe aspirationnel, sur un marché de l’all-inclusive saturé où aucune marque ne se démarque.",
        insight:
          "On remplit chaque minute libre, au point d’avoir oublié comment s’ennuyer — alors que c’est là qu’on se retrouve.",
        concept:
          "Au Club Med, tout est déjà géré : il ne reste que le temps. L’ennui devient l’apogée du luxe. Signature : Rediscover yourself.",
        artDirection:
          "Des affiches cadrées de blanc, une typographie manuscrite et des poses volontairement désœuvrées.",
        device:
          "Un carnet blanc dans chaque chambre, pour garder une trace de ce qu’on redécouvre pendant le séjour.",
      },
      resultNote: null,
      externalLink: null,
    },
    {
      id: "sainte-croix",
      title: "Parc animalier de Sainte-Croix",
      subtitle: "Ici, la nature se fait entendre",
      type: "Concours de publicité inter-écoles",
      role: "Partie créative — slogan & réalisation des visuels",
      tools: ["Photoshop"],
      summary:
        "Démarquer Sainte-Croix des autres parcs animaliers en misant sur un sens qu’ils oublient tous : l’ouïe.",
      cover: "assets/img/saintecroix-03.jpg",
      coverAlt:
        "Affiche « Ici, la nature se fait entendre » : silhouette d'un lynx remplie en double exposition par les lodges du parc et un troupeau de cerfs.",
      images: [
        {
          src: "assets/img/saintecroix-01.jpg",
          alt: "Affiche d'hiver « Ici, la nature se fait entendre » : silhouette d'un loup qui hurle, remplie par une forêt et un lodge enneigés.",
        },
        {
          src: "assets/img/saintecroix-02.jpg",
          alt: "Affiche d'été « Ici, la nature se fait entendre » : silhouette d'un ours remplie en double exposition par de grands arbres et un bâtiment du parc.",
        },
        {
          src: "assets/img/saintecroix-03.jpg",
          alt: "Affiche de printemps « Ici, la nature se fait entendre » : silhouette d'un lynx remplie par les lodges du parc et un troupeau de cerfs.",
        },
        {
          src: "assets/img/saintecroix-04.jpg",
          alt: "Affiche d'automne « Ici, la nature se fait entendre » : silhouette d'un cerf qui brame, remplie par un feuillage roux, des lodges sur pilotis et des bisons.",
        },
      ],
      caseStudy: {
        context: "Challenge Pub inter-écoles, en équipe. Non retenu pour le tour suivant.",
        problem:
          "Tous les parcs concurrents vendent la même chose : des lodges avec vue sur les animaux. Comment faire de Sainte-Croix la référence de la vie sauvage européenne ?",
        insight:
          "Une nature en bonne santé n’est jamais silencieuse. Et l’écouter apaise presque immédiatement.",
        concept:
          "Miser sur l’ouïe, le sens qu’aucun parc n’exploite. Slogan : Ici, la nature se fait entendre.",
        artDirection:
          "Une affiche par saison — loup, lynx, ours, cerf —, chaque silhouette remplie par les paysages du parc en double exposition.",
        device:
          "Des micros dans les enclos et des casques dans les allées et les lodges : on entend les animaux en direct, même quand on ne les voit pas.",
      },
      resultNote: null,
      externalLink: null,
    },
  ],

  experience: [
    {
      company: "L’Oreille Graphique",
      role: "Stage",
      place: "Bordeaux",
      duration: "2 mois",
      description:
        "Studio qui édite un jeu de société entièrement dessiné à la main. Face aux productions générées par IA, tout le positionnement repose sur cet artisanat.",
      missions: [
        "Aide sur la stratégie réseaux sociaux",
        "Contribution à certaines règles du jeu",
        "Community management",
        "Motion design pour animer l’univers graphique du jeu (personnages, éléments décoratifs)",
      ],
      note:
        "Présence sur salons, dont l’Alchimie du Jeu à Toulouse : les retours des joueurs portaient très souvent sur l’identité graphique.",
    },
    {
      company: "ScreenUp",
      role: "Stage",
      place: "Rennes",
      duration: "1 mois",
      description:
        "Agence web : conception et production de sites pour des clients de secteurs variés.",
      missions: [
        "Production de contenu web, dont le site du Whisky Live Paris — mise à jour des informations exposants en direct pendant le salon",
        "Veille graphique et suivi des tendances visuelles",
      ],
      note: null,
    },
  ],

  education: [
    {
      degree: "BUT Information-Communication, parcours Publicité",
      school: "IUT Bordeaux Montaigne",
      period: "3ᵉ année — en cours",
    },
    {
      degree: "Baccalauréat STMG",
      school: null,
      period: null,
    },
  ],

  gallery: [
    {
      src: "assets/img/gallery-montblanc.jpg",
      alt: "Montage publicitaire pour un parfum Montblanc Legend, portrait noir et blanc et flacon.",
      caption: "Montblanc Legend — montage photo & typographie",
    },
    {
      src: "assets/img/gallery-icare.jpg",
      alt: "Affiche « Icare et sa vanité », collage de fresque classique et typographie, thème des péchés capitaux.",
      caption: "Icare et sa vanité — collage",
    },
    {
      src: "assets/img/gallery-bd.jpg",
      alt: "Illustration façon bande dessinée d'un personnage au style cartoon.",
      caption: "Illustration — style BD",
    },
  ],

  // Clin d'œil du Contact : le perso dépasse du bas de la section, mains sur le
  // bord (rendu Blender blender/contact-peek.blend, rendu SANS pupilles).
  // Valeurs en % de l'image, à recalculer si on refait le rendu :
  // edge = bord du mur depuis le haut ; eyes = centre du blanc de l'œil (x, y),
  // r = rayon du blanc et pupil = rayon de la pupille (en % de la largeur).
  contactPeek: {
    src: "assets/img/peek/peek.webp",
    width: 1400,
    height: 620,
    edge: 79.9,
    eyes: [
      { x: 34.84, y: 57.55, r: 2.9, pupil: 1.5 },
      { x: 65.16, y: 57.55, r: 2.9, pupil: 1.5 },
    ],
  },

  contact: {
    // Le titre (« Et maintenant, on construit quoi ensemble ? ») est en dur
    // dans index.html, avec le mot en <em> pour la couleur d’accent.
    message:
      "Une campagne, une identité, une affiche, une vidéo, une idée un peu bizarre… Je ne sais pas encore. Et c’est justement ce qui m’intéresse. Tant qu’il y a quelque chose à chercher, à construire ou à créer, je suis partant.",
    cta: "Le reste, je préfère vous le montrer en vrai.",
  },

  nav: [
    { href: "#accueil", label: "Accueil" },
    { href: "#a-propos", label: "À propos" },
    { href: "#competences", label: "Compétences" },
    { href: "#projets", label: "Projets" },
    { href: "#experiences", label: "Expériences" },
    { href: "#parcours", label: "Parcours" },
    { href: "#galerie", label: "Créations" },
    { href: "#contact", label: "Contact" },
  ],
};
