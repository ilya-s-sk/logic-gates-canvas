import { CanvasRenderer, COLOR, Point } from "../utils/canvas-renderer";

export interface ViewOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  isActive: boolean;
  inputsCount?: number;
}

interface RenderOptions {
  highlightIn: number | null;
  highlightOut: boolean;
  isActive?: boolean;
}

export abstract class View {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public inputsCount: number = 0;

  public label: string = '';
  public isActive: boolean = false;

  render(
    renderer: CanvasRenderer,
    options?: RenderOptions,
  ): void {};
}

export class GateView extends View {
  readonly portR = 7;

  constructor({
    x, y, width = 120, height = 80, label, isActive, inputsCount = 2
  }: ViewOptions) {
    super();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.isActive = isActive;
    this.inputsCount = inputsCount;
  }

  get inputsPortsPos(): Point[] {
    const ports = [];

    for (let i = 0; i < this.inputsCount; i++) {
      const partHeight = Math.round(this.height / this.inputsCount);
      const y = (this.y + partHeight * i) + (partHeight / 2);

      const pos = { 
        x: this.x,
        y,
      };
      ports.push(pos);
    }

    return ports;
  }

  get outputPort(): Point {
    return this.rightSideCenter;
  }

  get leftSideCenter(): Point {
    const x = this.x;
    const y = this.y + Math.round(this.height / 2);
    return { x, y };
  }

  get rightSideCenter(): Point {
    const x = this.x + this.width;
    const y = this.y + Math.round(this.height / 2);
    return { x, y };
  }

  protected renderInputPorts(r: CanvasRenderer, hightlightPort: number | null) {
    this.inputsPortsPos.forEach((pos, index) => {
      r.drawCircle(pos, this.portR, hightlightPort === index ? COLOR.ORANGE : COLOR.BLACK);
    })
  }

  protected renderOutputPorts(r: CanvasRenderer, highlight: boolean) {
    const pos = this.rightSideCenter;
    r.drawCircle(pos, this.portR, highlight ? COLOR.ORANGE : COLOR.BLACK);
  }

  render(
    renderer: CanvasRenderer,
    opt?: RenderOptions,
  ): void {
    const fillColor = (opt?.isActive ?? this.isActive) ? COLOR.GREEEN : COLOR.RED;

    renderer.drawRect({ x: this.x, y: this.y }, this.width, this.height, fillColor);
    renderer.drawText(this.label, { x: this.x + 35, y: this.y + 45 }, COLOR.WHITE);

    const { highlightIn = null, highlightOut = false } = opt || {};

    this.renderInputPorts(renderer, highlightIn);
    this.renderOutputPorts(renderer, highlightOut)
  }
}