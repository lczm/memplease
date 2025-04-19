import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { QuestionItem } from "./types";
import Questions from "./Questions";
import Recall from "./Recall";

function App() {
  // Questions is a global state in app instead
  const [text, setText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<QuestionItem[]>([]);

  return (
    // Gives the light / dark theme
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* Main wrapper, gives max width and height padding */}
      <div className="container mx-auto max-w-[75%] pt-[5%]">
        {/* Tabs, each tab goes to each component */}
        <Tabs defaultValue="recall" className="w-full">
          {/* Tabs content, the Recall, Questions, and Theme toggle */}
          <div className="flex justify-between items-center w-full">
            <TabsList>
              <TabsTrigger value="recall">Recall</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <ModeToggle />
          </div>

          {/* Recall tab + component */}
          <TabsContent value="recall">
            <Recall parsedQuestions={parsedQuestions} />
          </TabsContent>
          {/* Questions tab + component */}
          <TabsContent value="questions">
            <Questions
              text={text}
              setText={setText}
              parsedQuestions={parsedQuestions}
              setParsedQuestions={setParsedQuestions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  );
}

export default App;
