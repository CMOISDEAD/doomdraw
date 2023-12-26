/* eslint-disable @typescript-eslint/no-explicit-any */
import rough from "roughjs/bundled/rough.esm";
import { ELEMENT_TOOL, ICoordinates, IElement } from "../global.d";
import getStroke from "perfect-freehand";

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

  switch (type) {
    case ELEMENT_TOOL.LINE:
      roughElement = generator.line(x1, y1, x2, y2, opts);
      break;
    case ELEMENT_TOOL.RECT:
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, opts);
      break;
    case ELEMENT_TOOL.CIRCLE:
      roughElement = generator.circle(x1, y1, x2 - x1, opts);
      break;
    case ELEMENT_TOOL.PEN:
      return {
        id,
        type,
        points: [{ x: x1, y: y1 }],
        x1,
        y1,
        x2,
        y2,
        roughElement: null,
      };
    default:
      roughElement = generator.line(x1, y1, x2, y2, opts);
  }

  return { id, x1, y1, x2, y2, type, roughElement };
};

const distance = (a: ICoordinates, b: ICoordinates) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string,
) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  distanceOffset: number = 1,
) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < distanceOffset ? "inside" : null;
};

const positionWithinElement = (x: number, y: number, element: IElement) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case ELEMENT_TOOL.RECT: {
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }
    case ELEMENT_TOOL.LINE: {
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    }
    case ELEMENT_TOOL.CIRCLE: {
      const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) <= d / 2
        ? "inside"
        : null;
    }
    case ELEMENT_TOOL.PEN: {
      const betweenAnyPoint = element.points!.some((point, index) => {
        const nextPoint = element.points![index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    }
    default:
      throw new Error("Unimplemented type");
  }
};

export const getElementAtPosition = (
  x: number,
  y: number,
  elements: IElement[],
) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position);
};

export const deleteElement = (
  element: IElement,
  elements: IElement[],
): IElement[] => {
  console.log("deleteElement", element);
  const elementsCopy = elements.filter((el) => el.id !== element.id);
  return elementsCopy;
};

export const adjustElementCorrdinates = (
  element: IElement,
): { x1: number; x2: number; y1: number; y2: number } => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === ELEMENT_TOOL.RECT) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, x2: maxX, y1: minY, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, x2, y1, y2 };
    } else {
      return { x1: x2, x2: x1, y1: y2, y2: y1 };
    }
  }
};

export const cursorForPosition = (position: string) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

export const resizedCoordinates = (
  clientX: number,
  clientY: number,
  position: string,
  coordinates: any,
) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return { x1, y1, x2, y2 };
  }
};

const getSVGFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc: any[], [x0, y0], i: number, arr: any[]) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );

  d.push("Z");
  return d.join(" ");
};

export const drawElement = (
  roughCanvas: any,
  ctx: CanvasRenderingContext2D,
  element: IElement,
  theme: string | undefined,
) => {
  const stroke = theme === "dark" ? "white" : "black";
  switch (element.type) {
    case ELEMENT_TOOL.RECT:
    case ELEMENT_TOOL.LINE:
    case ELEMENT_TOOL.CIRCLE:
      roughCanvas.draw({
        ...element.roughElement,
        options: {
          ...element.roughElement.options,
          stroke,
        },
      });
      break;
    case ELEMENT_TOOL.PEN: {
      const path = getSVGFromStroke(
        getStroke(element.points!, {
          size: 7,
        }),
      );
      ctx.fillStyle = stroke;
      ctx.fill(new Path2D(path));
      break;
    }
    default:
      throw new Error("Unimplemented type");
  }
};

// NOTE: man this is ugly, i should probably use another trick
export const adjustmentIsRequired = (type: ELEMENT_TOOL) =>
  [ELEMENT_TOOL.RECT, ELEMENT_TOOL.LINE, ELEMENT_TOOL.CIRCLE].includes(type);
