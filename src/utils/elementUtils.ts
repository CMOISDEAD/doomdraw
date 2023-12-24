import rough from "roughjs/bundled/rough.esm";
import { ELEMENT_TOOL, ICoordinates, IElement } from "../global.d";

const generator = rough.generator();

export const createElement = (
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ELEMENT_TOOL,
): IElement => {
  const opts = {
    roughness: 0.5,
  };
  let roughElement;
  if (type === ELEMENT_TOOL.LINE)
    roughElement = generator.line(x1, y1, x2, y2, opts);
  else if (type === ELEMENT_TOOL.RECT)
    roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, opts);
  else if (type === ELEMENT_TOOL.CIRCLE)
    roughElement = generator.circle(x1, y1, x2 - x1, opts);
  return { id, x1, y1, x2, y2, type, roughElement };
};

const distance = (a: ICoordinates, b: ICoordinates) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const isWithinElement = (x: number, y: number, element: IElement) => {
  const { type, x1, x2, y1, y2 } = element;
  // TODO: implement drag logic for circle
  if (type === ELEMENT_TOOL.RECT) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < 1;
  }
};

export const getElementAtPosition = (
  x: number,
  y: number,
  elements: IElement[],
) => {
  return elements.find((element) => isWithinElement(x, y, element));
};
