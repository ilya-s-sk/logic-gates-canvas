import { BaseGateController } from "./gates/base-gate-controller";
import { GateView, ViewOptions } from "../view/gate-view";
import { SignalSink, SignalSource, OutputProbe, ToggleSource, GATE_TYPE, type GateType, AndGate } from "../model";
import { LogicGateController, SinkController, SourceContoller } from "./gates";
import { OrGate } from "../model/or";

const viewBuilder = (
  model: SignalSource | SignalSink, additionalOptions: Partial<ViewOptions> = {}
): GateView => {
  const view = new GateView({ 
    x: 0, y: 0, 
    isActive: 'getOutput' in model ? model.getOutput() : false, 
    label: model?.type, 
    ...additionalOptions 
  });

  return view;
};

const GATES_BUILDERS_MAP = {
  [GATE_TYPE.AND]: () => {
    const model = new AndGate();
    const view = viewBuilder(model);
    const controller = new LogicGateController(model, view);

    return controller;
  },
  [GATE_TYPE.INPUT]: () => {
    const model = new ToggleSource();
    const view = viewBuilder(model, { inputsCount: 0 });
    const controller = new SourceContoller(model, view);

    return controller;
  },
  [GATE_TYPE.OUTPUT]: () => {
    const model = new OutputProbe();
    const view = viewBuilder(model, { inputsCount: 1 });
    const controller = new SinkController(model, view);

    return controller;
  },
  [GATE_TYPE.OR]: () => {
    const model = new OrGate();
    const view = viewBuilder(model);
    const controller = new LogicGateController(model, view);

    return controller;
  },
  [GATE_TYPE.NOT]: () => {
    return null;
  },
}

type Result<Type extends GateType> = ReturnType<(typeof GATES_BUILDERS_MAP)[Type]>;

export const gateBuilder = <Type extends GateType>(type: Type): Result<Type> => {
  const builder = GATES_BUILDERS_MAP[type];

  return builder() as Result<Type>;
}