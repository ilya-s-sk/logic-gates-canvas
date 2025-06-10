import { GATE_TYPE, GateType } from "../model";
import { gateBuilder } from "./builder";
import { PanelView } from "../view/panel-view";
import { Editor } from "./editor";


export class PanelController {
  private gateType: GateType = GATE_TYPE.AND;

  constructor(
    private view: PanelView,
    private editor: Editor,
  ) {}

  init() {
    this.view.create();

    this.gateType = (this.view.select?.value as GateType) || GATE_TYPE.AND;

    this.view.select?.addEventListener('change', (event) => this.handleGateTypeSelect(event))
    this.view.button?.addEventListener('click', (event) => this.handleButtonAddClick(event));
  }

  handleGateTypeSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.gateType = value as GateType;
  }

  handleButtonAddClick(event: Event) {
    const controller = gateBuilder(this.gateType as GateType);

    if (!controller) {
      throw new Error(`Unknown gate type ${this.gateType}`)
    }

    this.editor.addGates([controller]);
  }
}