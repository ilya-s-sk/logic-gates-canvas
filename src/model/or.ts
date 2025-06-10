import { LogicGate, SignalSource } from "./base";
import { GATE_TYPE } from "./gate";

export class OrGate implements LogicGate {
  readonly type = GATE_TYPE.OR;
  sources: SignalSource[] = [];

  get isActive() {
    return this.getOutput();
  }

  setInput(i: number, src: SignalSource): void {
    this.sources[i] = src;
  }

  getOutput(): boolean {
    return this.sources.some(i => i.getOutput());
  }
}
