// utils/preload.js

export async function preloadAssets(type) {
  const folder = `assets/${type}/`;
  const assets = {};

  const filenames = type === "images" ? [
    "RUMPI.png", "RUMPI2.png",
    "obstacle1.png", "obstacle2.png", "obstacle3.png",
    "cloud1.png", "cloud2.png", "cloud3.png",
    "plane.png", "plane1.png"
  ] : [
    "jump.wav", "gameover.wav"
  ];

  const loadPromises = filenames.map(name => {
    return new Promise((resolve, reject) => {
      if (type === "images") {
        const img = new Image();
        img.src = folder + name;
        img.onload = () => {
          assets[name] = img;
          resolve();
        };
        img.onerror = () => reject(`Error al cargar imagen: ${name}`);
      } else {
        const audio = new Audio(folder + name);
        audio.oncanplaythrough = () => {
          assets[name] = audio;
          resolve();
        };
        audio.onerror = () => reject(`Error al cargar sonido: ${name}`);
      }
    });
  });

  await Promise.all(loadPromises);
  return assets;
}
