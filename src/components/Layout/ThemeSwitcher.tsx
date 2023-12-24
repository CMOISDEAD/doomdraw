import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { RxMoon, RxSun } from "react-icons/rx";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleSwitch = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="flat"
      className="absolute top-2 right-2 m-auto"
      onPress={handleSwitch}
    >
      {theme === "light" ? <RxSun /> : <RxMoon />}
    </Button>
  );
};
