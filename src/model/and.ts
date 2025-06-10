import { LogicGate, SignalSource } from "./base";
import { GATE_TYPE } from "./gate";

export class AndGate implements LogicGate {
  readonly type = GATE_TYPE.AND;
  sources: SignalSource[] = [];

  setInput(i: number, src: SignalSource): void {
    this.sources[i] = src;
  }

  getOutput(): boolean {
    return this.sources.every(i => i.getOutput());
  }
}
