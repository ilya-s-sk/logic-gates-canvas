import { GateType } from "./gate";

export interface TypedGate {
  type: GateType
}

export interface SignalSource extends TypedGate {
  getOutput(): boolean;
}

export interface SignalSink extends TypedGate {
  sources: SignalSource[];

  setInput(i: number, src: SignalSource): void
}

export interface LogicGate extends SignalSource, SignalSink {}