import { GATE_TYPE, GateType } from "../model";
import { gateBuilder } from "./builder";
import { PanelView } from "../view/panel-view";
import type { Editor } from "./editor";

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

  private handleGateTypeSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.gateType = value as GateType;
  }

  private handleButtonAddClick(event: Event) {
    this.createGate();
  }

  createGate<T extends GateType>(gateType?: T) {
    const definedGateType = (gateType || this.gateType) as T;

    const controller = gateBuilder<T>(definedGateType);

    if (!controller) {
      throw new Error(`Unknown gate type ${this.gateType}`)
    }

    this.editor.addGates([controller]);

    return controller;
  }
}