import { useState } from "react";
import { Editor } from "./components/Editor";
import { ELEMENT_TOOL } from "./global.d";
import { Toolbar } from "./components/Layout/Toolbar";
import { ThemeSwitcher } from "./components/Layout/ThemeSwitcher";
import { ZoomControl } from "./components/Layout/ZoomControl";
import { HelpButton } from "./components/Layout/HelpButton";
import { OptionsMenu } from "./components/Layout/OptionsMenu";

function App() {
  const [tool, setTool] = useState<ELEMENT_TOOL>(ELEMENT_TOOL.PEN);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.currentTarget;
    setTool(name as ELEMENT_TOOL);
  };

  return (
    <div className="relative">
      <OptionsMenu />
      <Toolbar tool={tool} handleTool={handleClick} />
      <ThemeSwitcher />
      <Editor tool={tool} />
      <ZoomControl />
      <HelpButton />
    </div>
  );
}

export default App;
