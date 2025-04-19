import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { QuestionItem } from "./types";
import Questions from "./Questions";
import Recall from "./Recall";

const STORAGE_KEY = "recallData";

function App() {
  // Questions is a global state in app instead
  const [text, setText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<QuestionItem[]>([]);

  const parseQuestions = (inputText: string): QuestionItem[] => {
    if (!inputText.trim()) return [];

    // Split the text by double line breaks to separate question-answer blocks
    const blocks = inputText.split(/\n\s*\n/).filter((block) => block.trim());

    return blocks.map((block) => {
      const parts = block.split(/===/).map((part) => part.trim());
      if (parts.length >= 2) {
        return {
          question: parts[0],
          answer: parts.slice(1).join("==="), // In case there are multiple "===" in the answer
        };
      }
      return {
        question: block,
        answer: "",
      };
    });
  };

  const saveToLocalStorage = (textToSave: string) => {
    localStorage.setItem(STORAGE_KEY, textToSave);
  };

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const savedText = savedData;
      setText(savedText);
      setParsedQuestions(parseQuestions(savedText));
    }
  }, []);

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
              parseQuestions={parseQuestions}
              saveToLocalStorage={saveToLocalStorage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  );
}

export default App;
