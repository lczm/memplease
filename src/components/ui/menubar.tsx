import * as Menubar from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

const MenubarMenus = () => {
  return (
    <Menubar.Root className="flex space-x-2">
      <Menubar.Menu>
        <Menubar.Trigger className="px-4 py-2 bg-gray-100 rounded">Recall</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="bg-white shadow-md p-2 rounded">
            <Menubar.Item className="p-2 hover:bg-gray-200">Recall Option 1</Menubar.Item>
            <Menubar.Item className="p-2 hover:bg-gray-200">Recall Option 2</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger className="px-4 py-2 bg-gray-100 rounded">Questions</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="bg-white shadow-md p-2 rounded">
            <Menubar.Item className="p-2 hover:bg-gray-200">Questions Option 1</Menubar.Item>
            <Menubar.Item className="p-2 hover:bg-gray-200">Questions Option 2</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

export default MenubarMenus;
