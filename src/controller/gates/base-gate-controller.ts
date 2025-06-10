import { LogicGate, SignalSink, SignalSource } from "../../model";
import { CanvasRenderer, Point } from "../../utils/canvas-renderer";
import type { GateView, RenderOptions } from "../../view/gate-view";


export class BaseGateController {
  highlightIn: number | null = null;
  highlightOut = false;

  constructor(
    public model: SignalSource | SignalSink | LogicGate,
    public view: GateView,
  ) {}

  get type() {
    return this.model.type;
  }

  get modelValue() {
    if ('getOutput' in this.model) {
      return this.model.getOutput();
    }
    return this.model.isActive;
  }

  render(renderer: CanvasRenderer, options?: RenderOptions) {
    this.view.render(renderer, {
      ...options,
      highlightIn: this.highlightIn, 
      highlightOut: this.highlightOut,
      isActive: this.modelValue,
    });
  }

  setPosition({ x, y }: Point) {
    this.view.x = x;
    this.view.y = y;
  }
}