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

function App() {
  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
  
  return (
    <div className="container mx-auto max-w-[75%]">
      <Tabs defaultValue="account" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <button onClick={toggleDarkMode} className="p-2 border rounded">
            Toggle Dark/Light
          </button>
        </div>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
