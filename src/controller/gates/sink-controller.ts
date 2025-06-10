import type { SignalSink } from "../../model";
import type { GateView } from "../../view/gate-view";
import { BaseGateController } from "./base-gate-controller";


export class SinkController extends BaseGateController {
  constructor(
    readonly model: SignalSink,
    readonly view: GateView,
  ) {
    super(model, view);
  }
}