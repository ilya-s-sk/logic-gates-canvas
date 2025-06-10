import { SignalSource } from "./base";
import { GATE_TYPE } from "./gate";

export class ToggleSource implements SignalSource {
  readonly type = GATE_TYPE.INPUT;
  private value = false;

  toggle() {
    this.value = !this.value;
  }

  getOutput(): boolean {
    return this.value;
  }
}
