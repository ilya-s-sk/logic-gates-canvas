import type { LogicGate } from "../../model";
import type { GateView } from "../../view/gate-view";
import { BaseGateController } from "./base-gate-controller";


export class LogicGateController extends BaseGateController {
  constructor(
    readonly model: LogicGate,
    readonly view: GateView,
  ) {
    super(model, view);
  }

  updateInput(index: number, value: LogicGate) {
    this.model.setInput(index, value);
    this.view.isActive = this.model.getOutput();
  }

  getOutput() {
    return this.model.getOutput();
  }
}