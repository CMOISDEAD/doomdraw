import { useTheme } from "next-themes";
import { MouseEvent, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { ACTION_TYPE, ELEMENT_TOOL, IElement } from "../global.d";
import { drawGrid } from "../utils/canvasUtils";
import { createElement, getElementAtPosition } from "../utils/elementUtils";

interface Props {
  tool: ELEMENT_TOOL;
}

export const Editor = ({ tool }: Props) => {
  const { theme } = useTheme();
  const [elements, setElements] = useState<IElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<IElement | null>(null);
  const [action, setAction] = useState<ACTION_TYPE>(ACTION_TYPE.NONE);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(canvas, ctx);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) =>
      roughCanvas.draw({
        ...roughElement,
        options: {
          ...roughElement.options,
          stroke: theme === "dark" ? "white" : "black",
        },
      }),
    );
  }, [elements, theme]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tool: ELEMENT_TOOL,
  ) => {
    const element = createElement(id, x1, y1, x2, y2, tool);
    const elementsCopy = [...elements];
    elementsCopy[id] = element;
    setElements(elementsCopy);
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (tool === ELEMENT_TOOL.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;
      const offsetX = clientX - element.x1;
      const offsetY = clientY - element.y1;
      setAction(ACTION_TYPE.MOVING);
      setSelectedElement({ ...element, offsetX, offsetY });
    } else {
      setAction(ACTION_TYPE.DRAW);
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
    }
  };

  const handleMouseUp = () => {
    setAction(ACTION_TYPE.NONE);
    setSelectedElement(null);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (tool === ELEMENT_TOOL.SELECTION)
      event.currentTarget.style.cursor = getElementAtPosition(
        clientX,
        clientY,
        elements,
      )
        ? "move"
        : "default";
    if (action === ACTION_TYPE.DRAW) {
      const { clientX, clientY } = event;
      const idx = elements.length - 1;
      const { x1, y1 } = elements[idx];
      updateElement(idx, x1, y1, clientX, clientY, tool);
    } else if (action === ACTION_TYPE.MOVING) {
      if (!selectedElement) return;
      const { id, x1, y1, x2, y2, offsetX, offsetY, type } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const nexX1 = clientX - offsetX!;
      const nexY1 = clientY - offsetY!;
      updateElement(id, nexX1, nexY1, nexX1 + width, nexY1 + height, type);
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
