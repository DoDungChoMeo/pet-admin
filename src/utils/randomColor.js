const ranInt = (start = 0, end = 0) => {
  if (end < start) return -1;
  return Math.floor(start + Math.random() * (end - start));
};

const randomColor = ([rStart, rEnd], [gStart, gEnd], [bStart, bEnd]) => {
  const r = ranInt(rStart, rEnd);
  const g = ranInt(gStart, gEnd);
  const b = ranInt(bStart, bEnd);
  return `rgb(${r}, ${g}, ${b})`;
};

export { ranInt };
export default randomColor;
