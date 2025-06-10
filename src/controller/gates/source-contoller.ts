import type { ToggleSource } from "../../model";
import type { GateView } from "../../view/gate-view";
import { BaseGateController } from "./base-gate-controller";


export class SourceContoller extends BaseGateController {
  constructor(
    readonly model: ToggleSource,
    readonly view: GateView,
  ) {
    super(model, view);
  }

  toggle() {
    this.model.toggle();
    this.view.isActive = this.model.getOutput();
  }
}