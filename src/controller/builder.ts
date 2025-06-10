import { BaseGateController } from "./gates/base-gate-controller";
import { GateView, ViewOptions } from "../view/gate-view";
import { SignalSink, SignalSource, OutputProbe, ToggleSource, GATE_TYPE, type GateType, AndGate } from "../model";

const controllerBuilder = (
  model: SignalSource | SignalSink, additionalOptions: Partial<ViewOptions> = {}
): BaseGateController => {
  const view = new GateView({ 
    x: 0, y: 0, 
    isActive: 'getOutput' in model ? model.getOutput() : false, 
    label: model?.type, 
    ...additionalOptions 
  });
  const controller = new BaseGateController(model, view);

  return controller;
}

const GATES_BUILDERS_MAP: Partial<Record<GateType, () => BaseGateController>> = {
  [GATE_TYPE.AND]: () => {
    const model = new AndGate();
    const controller = controllerBuilder(model);

    return controller;
  },
  [GATE_TYPE.INPUT]: () => {
    const model = new ToggleSource();
    const controller = controllerBuilder(model, { inputsCount: 0 });

    return controller;
  },
  [GATE_TYPE.OUTPUT]: () => {
    const model = new OutputProbe();
    const controller = controllerBuilder(model, { inputsCount: 1 });

    return controller;
  },
}

export const gateBuilder = (type: GateType): BaseGateController | null => {
  const builder = GATES_BUILDERS_MAP[type];

  if (builder) {
    return builder();
  }

  return null;
}