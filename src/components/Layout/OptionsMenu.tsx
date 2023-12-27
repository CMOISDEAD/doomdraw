import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  RxDownload,
  RxFilePlus,
  RxGithubLogo,
  RxImage,
  RxPilcrow,
  RxStack,
  RxTrash,
} from "react-icons/rx";
import useDrawStore from "../../store/useStore";

export const OptionsMenu = () => {
  const handleClearCanvas = () => {
    useDrawStore.setState({ elements: [] });
  };

  return (
    <div className="absolute top-2 left-2 m-auto">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat">
            <RxStack />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownSection title="Canvas" showDivider>
            <DropdownItem key="open" startContent={<RxFilePlus />}>
              Open
            </DropdownItem>
            <DropdownItem key="save" startContent={<RxDownload />}>
              Save to...
            </DropdownItem>
            <DropdownItem key="export" startContent={<RxImage />}>
              Export to image...
            </DropdownItem>
            <DropdownItem
              key="clear"
              startContent={<RxTrash />}
              onPress={handleClearCanvas}
            >
              Clear canvas
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Socials">
            <DropdownItem
              key="github"
              startContent={<RxGithubLogo />}
              href="https://github.com/CMOISDEAD/doomdraw"
              target="_blank"
            >
              Github
            </DropdownItem>
            <DropdownItem
              key="portfolio"
              startContent={<RxPilcrow />}
              href="https://camilodavila.vercel.app"
              target="_blank"
            >
              Portfolio
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
