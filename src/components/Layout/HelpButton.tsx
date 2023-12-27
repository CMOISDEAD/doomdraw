import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { RxQuestionMarkCircled } from "react-icons/rx";

export const HelpButton = () => {
  return (
    <Popover showArrow placement="left-end">
      <PopoverTrigger>
        <Button variant="flat" className="absolute right-2 bottom-2 m-auto">
          <RxQuestionMarkCircled />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-32">
        <p className="text-xs text-center text-gray-600">
          This is a demo project for NextUI + React + TailwindCSS + Typescript
        </p>
      </PopoverContent>
    </Popover>
  );
};
