export const rigmap = (start, mot, d) => {
  //指定した座標（start）を起点に、
  const len = Math.sqrt(mot.x ** 2 + mot.y ** 2);
  return { x: (d / len) * mot.x + start.x, y: (d / len) * mot.y + start.y };
};
