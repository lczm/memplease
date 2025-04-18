import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Questions from "./Questions";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="container mx-auto max-w-[75%] pt-[5%]">
        <Tabs defaultValue="recall" className="w-full">
          <div className="flex justify-between items-center w-full">
            <TabsList>
              <TabsTrigger value="recall">Recall</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <ModeToggle />
          </div>
          <TabsContent value="recall">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="questions">
            <Questions />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  );
}

export default App;
