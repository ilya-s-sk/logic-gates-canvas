export type Point = { x: number; y: number };

export const COLOR = {
  WHITE: '#fff',
  BLACK: '#000',
  DARK_GREY: '#333',
  GREY: '#888',
  RED: '#c00',
  GREEEN: '#0c0',
  ORANGE: '#ffa500',
} as const;

export type Color = typeof COLOR[keyof typeof COLOR];

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Cannot get 2D context');
    }

    this.ctx = context;
  }

  get canvasWidth() {
    return this.canvas.width;
  }

  get canvasHeight() {
    return this.canvas.height;
  }

  clear(color: Color = COLOR.WHITE) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawRect(topLeft: Point, width: number, height: number, color: Color = COLOR.DARK_GREY) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(topLeft.x, topLeft.y, width, height);
  }

  drawCircle(center: Point, radius: number, color: Color = COLOR.DARK_GREY) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text: string, position: Point, color: Color, font = '16px monospace') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, position.x, position.y)
  }

  drawLine(from: Point, to: Point, color: Color = COLOR.BLACK, width: number = 2) {
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }
}