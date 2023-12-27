/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ELEMENT_TOOL {
  SELECTION = "SELECTION",
  HAND = "HAND",
  PEN = "PEN",
  RECT = "RECT",
  LINE = "LINE",
  CIRCLE = "CIRCLE",
  ERASER = "ERASER",
}

export enum ACTION_TYPE {
  NONE = "NONE",
  GRABBING = "GRABBING",
  DRAW = "DRAW",
  ERASING = "ERASING",
  MOVING = "MOVING",
  RESIZING = "RESIZING",
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
  xOffsets?: number[];
  yOffsets?: number[];
  position?: any;
  points?: any[];

  type: ELEMENT_TOOL;
  roughElement: any;
}
