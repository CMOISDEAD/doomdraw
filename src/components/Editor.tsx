import { useTheme } from "next-themes";
import { MouseEvent, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";
import { ACTION_TYPE, ELEMENT_TOOL, IElement } from "../global.d";
import useDrawStore from "../store/useStore";
import { drawGrid } from "../utils/canvasUtils";
import {
  adjustElementCorrdinates,
  adjustmentIsRequired,
  createElement,
  cursorForPosition,
  deleteElement,
  drawElement,
  getElementAtPosition,
  resizedCoordinates,
} from "../utils/elementUtils";

interface Props {
  tool: ELEMENT_TOOL;
}

export const Editor = ({ tool }: Props) => {
  const { theme } = useTheme();
  // const [elements, setElements] = useState<IElement[]>(
  //   useDrawStore((state) => state.elements),
  // );
  // NOTE: I'm not sure if this is the best way to do this, sometimes when we have a lot of elements in the store, the canvas gets slow
  const { elements, setElements } = useDrawStore((state) => state);
  const [selectedElement, setSelectedElement] = useState<IElement | null>(null);
  const [action, setAction] = useState<ACTION_TYPE>(ACTION_TYPE.NONE);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(canvas, ctx);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) =>
      drawElement(roughCanvas, ctx, element, theme),
    );
    // useDrawStore.setState({ elements });
  }, [elements, theme]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tool: ELEMENT_TOOL,
  ) => {
    const elementsCopy = [...elements];
    switch (tool) {
      case ELEMENT_TOOL.LINE:
      case ELEMENT_TOOL.RECT:
      case ELEMENT_TOOL.CIRCLE:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, tool);
        break;
      case ELEMENT_TOOL.PEN:
        elementsCopy[id].points = [
          ...elementsCopy[id].points!,
          { x: x2, y: y2 },
        ];
        break;
      default:
        throw new Error("Invalid tool");
    }
    setElements(elementsCopy);
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (tool === ELEMENT_TOOL.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;
      if (element.type === ELEMENT_TOOL.PEN) {
        const xOffsets = element.points!.map((point) => clientX - point.x);
        const yOffsets = element.points!.map((point) => clientY - point.y);
        setSelectedElement({ ...element, xOffsets, yOffsets });
      } else {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
      }
      if (element.position === "inside") {
        setAction(ACTION_TYPE.MOVING);
        return;
      }
      setAction(ACTION_TYPE.RESIZING);
    } else if (tool === ELEMENT_TOOL.ERASER) {
      setAction(ACTION_TYPE.ERASING);
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;
      setElements(deleteElement(element, elements));
    } else if (tool === ELEMENT_TOOL.HAND) {
      //event.currentTarget.style.cursor = "grabbing";
    } else {
      // drawing tools (rectangle, circle, line, pen), maybe this should be added to the comparison
      const idx = elements.length;
      const element = createElement(
        idx,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
      );
      setElements((prev) => [...prev, element]);
      setSelectedElement(element);
      setAction(ACTION_TYPE.DRAW);
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const idx = selectedElement.id;
      const { id, type } = elements[idx];
      if (
        (ACTION_TYPE.DRAW || ACTION_TYPE.RESIZING) &&
        adjustmentIsRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCorrdinates(elements[idx]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
    setAction(ACTION_TYPE.NONE);
    setSelectedElement(null);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    // TOOLS
    if (tool === ELEMENT_TOOL.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.currentTarget.style.cursor = element
        ? cursorForPosition(element.position!)
        : "default";
    } else if (tool === ELEMENT_TOOL.ERASER) {
      event.currentTarget.style.cursor = getElementAtPosition(
        clientX,
        clientY,
        elements,
      )
        ? "cell"
        : "default";
    } else if (tool === ELEMENT_TOOL.HAND) {
      event.currentTarget.style.cursor = "grab";
    } else {
      event.currentTarget.style.cursor = "crosshair";
    }

    // ACTIONS
    if (action === ACTION_TYPE.DRAW) {
      const { clientX, clientY } = event;
      const idx = elements.length - 1;
      const { x1, y1 } = elements[idx];
      updateElement(idx, x1, y1, clientX, clientY, tool);
    } else if (action === ACTION_TYPE.MOVING) {
      if (!selectedElement) return;
      if (selectedElement.type === ELEMENT_TOOL.PEN) {
        const newPoints = selectedElement.points!.map((_, idx) => ({
          x: clientX - selectedElement.xOffsets![idx],
          y: clientY - selectedElement.yOffsets![idx],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy);
      } else {
        const { id, x1, y1, x2, y2, offsetX, offsetY, type } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const nexX1 = clientX - offsetX!;
        const nexY1 = clientY - offsetY!;
        updateElement(id, nexX1, nexY1, nexX1 + width, nexY1 + height, type);
      }
    } else if (action === ACTION_TYPE.RESIZING) {
      const { id, type, position, ...coordinates } = selectedElement!;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates,
      );
      updateElement(id, x1, y1, x2, y2, type);
    } else if (action === ACTION_TYPE.ERASING) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) setElements(deleteElement(element, elements));
    }
  };

  return (
    <div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        Canvas
      </canvas>
    </div>
  );
};
