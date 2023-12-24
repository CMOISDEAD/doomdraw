export enum ELEMENT_TOOL {
  SELECTION = "SELECTION",
  LINE = "LINE",
  RECT = "RECT",
  CIRCLE = "CIRCLE",
  PEN = "PEN",
}

export enum ACTION_TYPE {
  NONE = "NONE",
  DRAW = "DRAW",
  MOVING = "MOVING",
}

interface ICoordinates {
  x: number;
  y: number;
}

interface IElement {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offsetX?: number;
  offsetY?: number;
  type: ELEMENT_TOOL;
  roughElement: unknown;
}
