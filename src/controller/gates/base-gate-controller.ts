import { LogicGate, SignalSink, SignalSource } from "../../model";
import { CanvasRenderer, Point } from "../../utils/canvas-renderer";
import { GateView } from "../../view/gate-view";


export class BaseGateController {
  highlightIn: number | null = null;
  highlightOut = false;

  constructor(
    public model: SignalSource | SignalSink | LogicGate,
    public view: GateView,
  ) {}

  render(renderer: CanvasRenderer) {
    this.view.render(renderer, { highlightIn: this.highlightIn, highlightOut: this.highlightOut });
  }

  setPosition({ x, y }: Point) {
    this.view.x = x;
    this.view.y = y;
  }
}