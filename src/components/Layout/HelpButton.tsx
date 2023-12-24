import { Button } from "@nextui-org/react";
import { RxQuestionMarkCircled } from "react-icons/rx";

export const HelpButton = () => {
  return (
    <Button variant="flat" className="absolute right-2 bottom-2 m-auto">
      <RxQuestionMarkCircled />
    </Button>
  );
};
