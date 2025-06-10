import { CanvasRenderer, Point } from "../../utils/canvas-renderer";
import { BaseGateController, LogicGateController, SinkController, SourceContoller } from "../gates";
import { GATE_TYPE, type SignalSink } from '../../model';
import { defineGateByPos, defineInputByPos, defineOutputByPos } from "./utils";
import { throttle } from "../../utils/throttle";

enum State {
  Idle,
  DragGate,
  DragWire
}

export class Editor {
  private state = State.Idle;

  private gates: BaseGateController[] = [];
  private draggingGate: BaseGateController | null = null;
  private isDragging = false;
  private dragOffset: Point = { x: 0, y: 0 };
  private startPos: Point | null = null;
  private hoveredGate: BaseGateController | null = null;

  private wireSource?: LogicGateController | SourceContoller;
  private tempCursos: Point = { x: 0, y: 0 }

  constructor(
    private renderer: CanvasRenderer,
    private canvas: HTMLCanvasElement
  ) {}

  init() {
    this.attachEvents();
    this.render();
  }

  get gatesRelationsMap() {
    const map: Map<BaseGateController, BaseGateController[]> = new Map();

    this.gates.forEach(gate => {
      const isSourceGate = gate instanceof SourceContoller;

      if (isSourceGate) {
        map.set(gate, []);
        return;
      }

      const gateWithSources = gate as (SinkController | LogicGateController);
      const inputs = gateWithSources.model.sources;
      const inputControllers = this.gates.filter(gate => inputs?.includes(gate.model as any));

      map.set(gate, inputControllers);
    })

    return map;
  }
  
  addGates(gate: BaseGateController[]) {
    this.gates.push(...gate);
    this.render();
  }

  render() {
    this.renderer.clear();

    this.gates.forEach(gate => gate.render(this.renderer, { isHovered: gate === this.hoveredGate }));
    this.renderWires();
    this.renderActiveWire();
  }

  private renderWires() {
    for (const item of this.gatesRelationsMap) {
      const [toGate, fromGates] = item;

      fromGates.forEach((fromGate, i) => {
        const to = toGate.view.inputsPortsPos[i];
        const from = fromGate.view.rightSideCenter;
        this.renderer.drawLine({ x: from.x, y: from.y }, { x: to.x, y: to.y })
      })
    }
  }

  private renderActiveWire() {
    if (this.state === State.DragWire && this.wireSource) {
      const output = this.wireSource.view.outputPort;
      this.renderer.drawLine(output, this.tempCursos, '#000', 1)
    }
  }

  private attachEvents() {
    console.log('attach events')
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    
    const mousemoveHandler = throttle((e) => this.onHover(e as MouseEvent), 100);
    this.canvas.addEventListener('mousemove', mousemoveHandler);
  }

  // ----------- event handlers -----------

  private onMouseDown(e: MouseEvent) {
    const pos = this.getCanvasPosition(e);
    this.startPos = pos;
    const outputPort = defineOutputByPos(this.gates, pos);
    const isCorrectGate = outputPort && (outputPort instanceof SourceContoller || outputPort instanceof LogicGateController)

    if (outputPort && isCorrectGate) {
      this.state = State.DragWire;
      this.wireSource = outputPort;
      this.tempCursos = pos;
      outputPort.highlightOut = true;
      this.render();
      return;
    }

    const gate = defineGateByPos(this.gates, pos);

    if (gate) {  
      this.state = State.DragGate;    
      this.draggingGate = gate;
      this.dragOffset = {
        x: pos.x - gate.view.x, y: pos.y - gate.view.y,
      };
      this.isDragging = true;
    };
  }

  private onMouseMove(e: MouseEvent) {
    const pos = this.getCanvasPosition(e);

    if (this.state === State.DragGate && this.draggingGate) {
      this.draggingGate.setPosition({ x: pos.x - this.dragOffset.x, y: pos.y - this.dragOffset.y });
      this.render();
      return;
    }

    if (this.state === State.DragWire && this.wireSource) {
      this.tempCursos = pos;
      this.clearHighlights();
      const input = defineInputByPos(this.gates, pos);
      if (input) {
        input.gate.highlightIn = input.inputIndex;
      }
      this.render();
      return;
    }
  }

  private handleInputClick(gate: SourceContoller) {
    gate.toggle();
    this.render();
  }

  private handleClick(currentPos: Point) {
    const gate = defineGateByPos(this.gates, currentPos);
    const isInputGate = gate?.type === GATE_TYPE.INPUT;

    if (isInputGate) {
      this.handleInputClick(gate as SourceContoller)
    }
  }

  private onMouseUp(e: MouseEvent) {
    const currentPos = this.getCanvasPosition(e);
    const isSamePos = this.startPos?.x === currentPos.x && this.startPos?.y === currentPos.y;

    if (isSamePos) {
      this.handleClick(currentPos);
      this.reset();
      return;
    }

    if (this.state === State.DragGate) {
      this.render();
      this.reset();
      return;
    }

    if (this.state === State.DragWire && this.wireSource) {
      const pos = this.getCanvasPosition(e);
      const input = defineInputByPos(this.gates, pos);

      if (input && 'setInput' in input.gate.model) {
        input.gate.model.setInput(input.inputIndex, this.wireSource.model);
      }

      this.clearHighlights();
      this.wireSource.highlightOut = false;
      this.state = State.Idle;
      this.wireSource = undefined;
      this.render();
    }
  }

  private onHover(e: MouseEvent) {
    const currentPos = this.getCanvasPosition(e);
    const gate = defineGateByPos(this.gates, currentPos);
    if (gate) {
      this.hoveredGate = gate;
      this.render();
    } else if (this.hoveredGate) {
      this.hoveredGate = null;
      this.render();
    }
  }

  // ------------- helpers -------------
  private clearHighlights() {
    this.gates.forEach(g => {
      if (this.wireSource === g) {
        return;
      }

      g.highlightIn = null;
      g.highlightOut = false;
    })
  }

  private reset() {
    this.state = State.Idle;
    this.draggingGate = null;
  }

  private getCanvasPosition(e: MouseEvent): Point {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
    }
  }
}