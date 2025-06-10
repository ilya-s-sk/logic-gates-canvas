import { SignalSink, SignalSource } from "./base";
import { GATE_TYPE } from "./gate";

export class OutputProbe implements SignalSink {
  readonly type = GATE_TYPE.OUTPUT;
  sources: SignalSource[] = [];

  setInput(_: number, src: SignalSource): void {
    this.sources[0] = src;
  }
}
