export const drawGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  ctx.beginPath();
  ctx.strokeStyle = "#cccccc3d";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }
  ctx.stroke();
};
