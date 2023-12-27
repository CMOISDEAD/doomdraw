import {
  RxHand,
  RxSlash,
  RxBox,
  RxCircle,
  RxPencil1,
  RxEraser,
  RxCursorArrow,
} from "react-icons/rx";
import { Button, ButtonGroup } from "@nextui-org/react";
import { ELEMENT_TOOL } from "../../global.d";

interface Props {
  tool: ELEMENT_TOOL;
  handleTool: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const Toolbar = ({ tool, handleTool }: Props) => {
  return (
    <div className="absolute right-0 left-0 top-2 m-auto w-fit">
      <ButtonGroup variant="flat">
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.HAND}
          color={tool === ELEMENT_TOOL.HAND ? "success" : "default"}
        >
          <RxHand />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.SELECTION}
          color={tool === ELEMENT_TOOL.SELECTION ? "success" : "default"}
        >
          <RxCursorArrow />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.LINE}
          color={tool === ELEMENT_TOOL.LINE ? "success" : "default"}
        >
          <RxSlash />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.RECT}
          color={tool === ELEMENT_TOOL.RECT ? "success" : "default"}
        >
          <RxBox />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.CIRCLE}
          color={tool === ELEMENT_TOOL.CIRCLE ? "success" : "default"}
        >
          <RxCircle />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.PEN}
          color={tool === ELEMENT_TOOL.PEN ? "success" : "default"}
        >
          <RxPencil1 />
        </Button>
        <Button
          onClick={handleTool}
          name={ELEMENT_TOOL.ERASER}
          color={tool === ELEMENT_TOOL.ERASER ? "success" : "default"}
        >
          <RxEraser />
        </Button>
      </ButtonGroup>
    </div>
  );
};
