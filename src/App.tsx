import { Button } from "@/components/ui/button";
import MenubarMenus from "@/components/ui/menubar";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh space-y-4">
      <MenubarMenus />
      <Button>Click me</Button>
    </div>
  );
}

export default App;
