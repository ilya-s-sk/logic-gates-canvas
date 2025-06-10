import { Editor } from "./controller/editor";
import { LogicGateController, SinkController, SourceContoller } from "./controller/gates";
import { PanelController } from "./controller/panel";
import { AndGate, GATE_TYPES, OutputProbe, SignalSource, ToggleSource } from "./model";
import { CanvasRenderer } from "./utils/canvas-renderer";
import { GateView } from "./view/gate-view";
import { PanelView } from "./view/panel-view";

const createPanel = (editor: Editor) => {
  const panelView = new PanelView(
    document.getElementById('panel')!,
    {
      gatesList: GATE_TYPES
    },
  );
  const panelController = new PanelController(panelView, editor);

  panelController.init();
}

export const initApp = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const renderer = new CanvasRenderer(canvas);
  const editor = new Editor(renderer, canvas);

  createPanel(editor);

  const inputAModel = new ToggleSource();
  const inputAView = new GateView({ 
    label: 'input', x: 50, y: 100, isActive: inputAModel.getOutput(), inputsCount: 0,
  })
  const inputAController = new SourceContoller(inputAModel, inputAView);
  inputAController.toggle();

  const inputBModel = new ToggleSource();
  const inputBView = new GateView({ 
    label: 'input', x: 50, y: 200, isActive: inputBModel.getOutput(), inputsCount: 0,
  })
  const inputBController = new SourceContoller(inputBModel, inputBView);

  const andModel = new AndGate();
  [inputAController.model, inputBController.model].forEach((model, i) => {
    andModel.setInput(i, model as SignalSource);
  });
  const andGateView = new GateView({ 
    label: 'AND', x: 220, y: 150, isActive: andModel.getOutput(), 
  });
  const andGateController = new LogicGateController(andModel, andGateView);

  const outputModel = new OutputProbe();
  const outputView = new GateView({ label: 'output', x: 400, y: 160, isActive: andModel.getOutput(), inputsCount: 1 });
  const outputController = new SinkController(outputModel, outputView);

  editor.addGates([inputAController, inputBController, andGateController, outputController])
  editor.render();
}