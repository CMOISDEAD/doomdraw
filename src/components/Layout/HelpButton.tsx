import {
  Button,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { RxQuestionMarkCircled } from "react-icons/rx";

export const HelpButton = () => {
  return (
    <Popover showArrow>
      <PopoverTrigger>
        <Button variant="flat" className="absolute right-2 bottom-2 m-auto">
          <RxQuestionMarkCircled />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="py-5 max-w-32">
        <ul className="flex flex-col gap-4">
          <li className="flex gap-2 justify-between w-full">
            Undo <Kbd keys={["command"]}>z</Kbd>
          </li>
          <li className="flex gap-2 justify-between w-full">
            Redo <Kbd keys={["command", "shift"]}>z</Kbd>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
