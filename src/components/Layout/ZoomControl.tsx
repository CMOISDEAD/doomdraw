import { Button, ButtonGroup } from "@nextui-org/react";
import { RxMinus, RxPlus } from "react-icons/rx";

export const ZoomControl = () => {
  return (
    <div className="absolute bottom-2 left-2 m-auto w-fit">
      <ButtonGroup variant="flat">
        <Button>
          <RxPlus />
        </Button>
        <Button>100%</Button>
        <Button>
          <RxMinus />
        </Button>
      </ButtonGroup>
    </div>
  );
};
