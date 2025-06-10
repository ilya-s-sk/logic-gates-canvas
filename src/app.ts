import { Editor } from "./controller/editor";
import { PanelController } from "./controller/panel";
import { GATE_TYPES } from "./model";
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

  return panelController;
}

export const initApp = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const renderer = new CanvasRenderer(canvas);
  const editor = new Editor(renderer, canvas);

  const panel = createPanel(editor);

  const inputA = panel.createGate('INPUT');
  inputA.toggle();
  inputA.setPosition({ x: 50, y: 100 });

  const inputB = panel.createGate('INPUT');
  inputB.setPosition({ x: 50, y: 200 });

  const andGate = panel.createGate('AND');
  andGate.setPosition({ x: 220, y: 150 });
  [inputA.model, inputB.model].forEach((model, i) => {
    andGate.updateInput(i, model);
  });

  const output = panel.createGate('OUTPUT');
  output.setPosition({ x: 400, y: 160 });

  editor.init();
}