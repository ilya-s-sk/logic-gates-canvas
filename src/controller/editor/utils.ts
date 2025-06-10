import { Point } from "../../utils/canvas-renderer";
import { BaseGateController } from "../gates/base-gate-controller";

const OFFSET_SIZE = 5;

export const defineGateByPos = (gates: BaseGateController[], { x, y }: Point): BaseGateController | null => {
  for (const gate of gates) {
    const { view } = gate;
    const { x: gateX, y: gateY, width, height } = view;
    const isIntersected = x >= (gateX - OFFSET_SIZE) 
      && x <= (gateX + width + OFFSET_SIZE) 
      && y >= (gateY - OFFSET_SIZE) 
      && y <= (gateY + height + OFFSET_SIZE);

    if (isIntersected) {
      return gate;
    }
  }
  return null;
}

export const defineOutputByPos = (gates: BaseGateController[], point: Point): BaseGateController | null => {
  for (const gate of gates) {
    const output = gate.view.outputPort;
    if (dist(output, point) <= gate.view.portR) {
      return gate;
    }
  }
  return null
}

export const defineInputByPos = (gates: BaseGateController[], point: Point): { gate: BaseGateController, inputIndex: number } | null => {
  for (const gate of gates) {
    const inputIndex = gate.view.inputsPortsPos.findIndex(port => {
      return dist(port, point) <= gate.view.portR;
    });

    if (inputIndex !== -1) return { gate, inputIndex: inputIndex };
  }

  return null
}

const dist = (a: Point, b: Point) => {
  return Math.hypot(a.x - b.x, a.y - b.y);
}