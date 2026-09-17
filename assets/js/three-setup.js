/* =========================================================
   Noé Pouliquen — Couverture 3D du Hero
   Charge le modèle Blender (perso + titre Port(folio)), recrée
   matières et lumières, et anime l'ensemble au pointeur.
   Si quoi que ce soit échoue (file://, pas de WebGL, pas de réseau),
   rien n'est modifié : la couverture CSS et le dessin PNG restent.
   ========================================================= */
(function () {
  "use strict";

  const MODEL_URL = "assets/models/character.glb";
  const MODEL_EMBED_URL = "assets/models/character.glb.js";
  const DRACO_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function hasWebGL() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) {
      return false;
    }
  }

  /* En double-clic (file://), le navigateur refuse de lire le .glb.
     Un script classique, lui, se charge : il contient le modèle en base64. */
  function loadEmbeddedModel() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MODEL_EMBED_URL;
      script.onload = () => {
        const base64 = window.HERO_MODEL_BASE64;
        delete window.HERO_MODEL_BASE64;
        if (!base64) return reject(new Error("modèle intégré vide"));
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        resolve(bytes.buffer);
      };
      script.onerror = () => reject(new Error("modèle intégré introuvable"));
      document.head.appendChild(script);
    });
  }

  /* Studio de reflets pour le chrome : sol sombre, horizon net, ciel
     clair et une bande diagonale. Même logique que le monde Blender. */
  function chromeEnvironment(THREE, renderer) {
    const scene = new THREE.Scene();
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vDir;
        void main() {
          float h = vDir.y + vDir.x * 0.3;
          vec3 c = mix(vec3(0.1, 0.1, 0.12), vec3(0.8, 0.82, 0.86), smoothstep(-0.085, -0.05, h));
          c = mix(c, vec3(1.25, 1.25, 1.3), smoothstep(-0.02, 0.25, h));
          c = mix(c, vec3(0.55, 0.58, 0.64), smoothstep(0.45, 1.0, h));
          c += 1.8 * smoothstep(0.07, 0.0, abs(vDir.x * 0.82 + vDir.y * 0.57 + 0.12));
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 64, 32), material));
    const pmrem = new THREE.PMREMGenerator(renderer);
    const texture = pmrem.fromScene(scene, 0.02).texture;
    pmrem.dispose();
    material.dispose();
    return texture;
  }

  function materials(THREE) {
    return {
      SkinBlue: new THREE.MeshPhysicalMaterial({
        color: 0x2d96dd,
        roughness: 0.62,
        specularIntensity: 0.45,
        sheen: 0.35,
        sheenColor: 0x9fdcff,
        sheenRoughness: 0.6,
        emissive: 0x04162e,
        envMapIntensity: 0.12,
      }),
      Suit: new THREE.MeshStandardMaterial({ color: 0x4d4d52, roughness: 0.72, envMapIntensity: 0.3 }),
      TieRed: new THREE.MeshStandardMaterial({ color: 0xff4433, roughness: 0.6, envMapIntensity: 0.3 }),
      EyeWhite: new THREE.MeshStandardMaterial({ color: 0xefefe9, roughness: 0.38, envMapIntensity: 0.4 }),
      InkGloss: new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.45, envMapIntensity: 0.4 }),
      Outline: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      TextLacquer: new THREE.MeshPhysicalMaterial({
        color: 0xebebf0,
        metalness: 1,
        roughness: 0.1,
        iridescence: 0.35,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [250, 420],
        emissive: 0x8fb2ff,
        emissiveIntensity: 0.05,
        envMapIntensity: 1.25,
        // les faces de la courbe 2D Blender n'ont pas toutes le même sens
        side: THREE.DoubleSide,
      }),
    };
  }

  /* Grain photo sur le perso : bruit en espace écran ajouté en fin de shader,
     plus marqué dans les zones éclairées (on sent mieux la lumière). Le fond
     reste transparent : seuls les pixels du perso reçoivent du grain. */
  const GRAIN_MATERIALS = ["SkinBlue", "Suit", "TieRed", "EyeWhite", "InkGloss"];

  function addGrain(material, grain) {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uGrainSeed = grain.seed;
      shader.uniforms.uGrainCell = grain.cell;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `uniform float uGrainSeed;
          uniform float uGrainCell;
          float grainHash(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }
          void main() {`
        )
        .replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
          vec2 grainCell = floor(gl_FragCoord.xy / uGrainCell) + uGrainSeed * vec2(41.0, 17.0);
          float grainLum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor.rgb += (grainHash(grainCell) - 0.5) * 0.1 * (0.3 + grainLum);`
        );
    };
  }

  function addLights(THREE, scene, target) {
    scene.add(new THREE.HemisphereLight(0xb7c4d8, 0x0a0a12, 0.6));

    const dir = (color, intensity, x, y, z) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(x, y, z);
      scene.add(light);
    };
    // Positions reprises de la scène Blender (x, z, -y).
    dir(0xffffff, 1.6, -9, 12, 14);
    dir(0xbfd9ff, 0.5, 10, 2, 16);
    dir(0xff4433, 2.2, 0, 7, -8);
    dir(0x8573ff, 1.4, 7, 10, -11);

    // Lueurs bleues autour du titre : devant (texte + mains), et derrière
    // pour éclairer par en dessous le visage caché.
    const glow = (intensity, x, y, z) => {
      const light = new THREE.PointLight(0x8cc2ff, intensity, 0, 2);
      light.position.set(target.x + x, target.y + y, target.z + z);
      scene.add(light);
    };
    glow(40, 0, 0.3, 1.2);
    glow(5, 0, -1.8, -0.9);
    glow(12, -2.6, 0, 0.8);
    glow(12, 2.6, 0, 0.8);
  }

  async function init() {
    const hero = document.querySelector(".hero");
    const figure = hero && hero.querySelector(".hero-figure");
    if (!figure) return;
    if (!hasWebGL()) {
      console.warn("[Hero 3D] WebGL indisponible : couverture 2D affichée.");
      return;
    }

    let THREE, gltf;
    try {
      THREE = await import("three");
      const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/loaders/DRACOLoader.js"),
      ]);
      const draco = new DRACOLoader().setDecoderPath(DRACO_URL);
      const loader = new GLTFLoader().setDRACOLoader(draco);
      gltf =
        location.protocol === "file:"
          ? await loader.parseAsync(await loadEmbeddedModel(), "")
          : await loader.loadAsync(MODEL_URL);
      draco.dispose();
    } catch (e) {
      console.warn("[Hero 3D] chargement impossible : couverture 2D affichée.", e);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "hero-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Illustration 3D : le personnage bleu de Noé se cache derrière le titre chromé « Port(folio) », qu’il agrippe à deux mains ; seuls le haut de sa tête et ses yeux dépassent."
    );

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      console.warn("[Hero 3D] rendu WebGL impossible : couverture 2D affichée.", e);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const model = gltf.scene;
    const palette = materials(THREE);
    // seed : change 12 fois par seconde (grain vivant) ; cell : taille d'un grain en pixels écran
    const grain = { seed: { value: 0 }, cell: { value: 1 } };
    GRAIN_MATERIALS.forEach((name) => addGrain(palette[name], grain));
    model.traverse((node) => {
      if (node.isMesh && node.material && palette[node.material.name]) {
        node.material = palette[node.material.name];
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.updateMatrixWorld(true);

    // La caméra tourne autour du titre et le regarde toujours.
    const textNode = model.getObjectByName("PortfolioTextMesh");
    const textBox = textNode ? new THREE.Box3().setFromObject(textNode) : box.clone().translate(center.clone().negate());
    const target = textBox.getCenter(new THREE.Vector3());
    const textSize = textBox.getSize(new THREE.Vector3());

    const scene = new THREE.Scene();
    scene.environment = chromeEnvironment(THREE, renderer);
    addLights(THREE, scene, target);
    scene.add(model);

    const head = model.getObjectByName("HeadRig");
    const headRest = head ? { q: head.quaternion.clone(), y: head.position.y } : null;
    const pupils = ["PupilL", "PupilR"]
      .map((name) => model.getObjectByName(name))
      .filter(Boolean)
      .map((node) => ({ node, rest: node.position.clone() }));

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);
    const MAX_YAW = THREE.MathUtils.degToRad(30);
    const MAX_PITCH = THREE.MathUtils.degToRad(12);
    // Un peu au-dessus du titre, comme la caméra Blender.
    const BASE_PITCH = THREE.MathUtils.degToRad(4);
    let radius = 20;
    const closeUp = window.matchMedia("(min-width: 900px)");

    function placeCamera(yaw, pitch, zoom) {
      const r = radius * zoom;
      camera.position.set(
        target.x + r * Math.sin(yaw) * Math.cos(pitch),
        target.y + r * Math.sin(pitch),
        target.z + r * Math.cos(yaw) * Math.cos(pitch)
      );
      camera.lookAt(target);
    }

    function fit() {
      const w = figure.clientWidth;
      const h = figure.clientHeight;
      if (!w || !h) return;
      // Plein écran sur ordinateur : on limite la définition pour rester fluide.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w > 1100 ? 1.5 : 2));
      renderer.setSize(w, h, false);
      // Un grain ≈ 1,3 pixel CSS, quelle que soit la densité de l'écran.
      grain.cell.value = renderer.getPixelRatio() * 1.3;
      camera.aspect = w / h;
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

      if (closeUp.matches) {
        // Gros plan : le titre occupe ~60 % de la hauteur (et au plus 56 % de la
        // largeur). La tête sort du cadre par le haut ; on la découvre en tournant.
        const distForHeight = textSize.y / (0.6 * 2 * tanHalf);
        const distForWidth = textSize.x / (0.56 * 2 * tanHalf * camera.aspect);
        radius = Math.max(distForHeight, distForWidth);
        // Titre un peu sous le milieu de l'écran, pour laisser voir les yeux.
        camera.setViewOffset(w, h, 0, -0.07 * h, w, h);
      } else {
        // Mobile : perso entier. Marge en largeur car, vu à 30°, la
        // profondeur du modèle élargit la silhouette.
        const distForHeight = (size.y * 0.46) / tanHalf;
        const distForWidth = (size.x * 0.62) / (tanHalf * camera.aspect);
        radius = Math.max(distForHeight, distForWidth) + size.z / 2 - target.z;
        // Le titre est plus bas que le centre du modèle : on décale l'image
        // pour que tête et texte restent cadrés, sans changer le point fixé.
        const shift = -target.y / (2 * radius * tanHalf);
        camera.setViewOffset(w, h, 0, -shift * h, w, h);
      }
      placeCamera(0, BASE_PITCH, 1);
    }

    figure.appendChild(canvas);
    figure.classList.add("is-3d");
    hero.classList.add("is-3d");
    fit();
    new ResizeObserver(fit).observe(figure);

    const pointer = { x: 0, y: 0, active: false };
    const eased = { x: 0, y: 0 };
    if (!prefersReducedMotion) {
      window.addEventListener(
        "pointermove",
        (e) => {
          // Au doigt, le geste sert à défiler : on garde l'orbite automatique.
          if (e.pointerType === "touch") return;
          pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
          pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
          pointer.active = true;
        },
        { passive: true }
      );
    }

    let onScreen = true;
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    }).observe(figure);

    const qOffset = new THREE.Quaternion();
    const eOffset = new THREE.Euler();
    const clock = new THREE.Clock();
    let intro = prefersReducedMotion ? 1 : 0;

    function frame() {
      requestAnimationFrame(frame);
      if (!onScreen) return;
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        grain.seed.value = Math.floor(t * 12) % 997;
        intro = Math.min(1, intro + 0.012);
        const ease = 1 - Math.pow(1 - intro, 3);

        // Sans souris (mobile), la caméra fait d'elle-même un lent aller-retour.
        const tx = pointer.active ? pointer.x : Math.sin(t * 0.3) * 0.6;
        const ty = pointer.active ? pointer.y : Math.sin(t * 0.23) * 0.35;
        eased.x += (tx - eased.x) * 0.05;
        eased.y += (ty - eased.y) * 0.05;

        const yaw = eased.x * MAX_YAW + (1 - ease) * 0.45;
        const pitch = BASE_PITCH - eased.y * MAX_PITCH;
        placeCamera(yaw, pitch, 1 + (1 - ease) * 0.12);

        if (head) {
          // La tête suit un peu la caméra : il garde le visiteur à l'œil.
          eOffset.set(
            (pitch - BASE_PITCH) * 0.3 + Math.sin(t * 0.7) * 0.01,
            yaw * 0.35,
            Math.sin(t * 0.45) * 0.015
          );
          head.quaternion.copy(headRest.q).multiply(qOffset.setFromEuler(eOffset));
          head.position.y = headRest.y + Math.sin(t * 0.9) * 0.03;
        }
        pupils.forEach(({ node, rest }) => {
          node.position.set(rest.x + eased.x * 0.035, rest.y - eased.y * 0.025, rest.z);
        });
      }

      renderer.render(scene, camera);
      if (!canvas.classList.contains("is-ready")) canvas.classList.add("is-ready");
    }
    frame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
