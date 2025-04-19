import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { QuestionItem } from "./types";
import { MathJaxContext } from "better-react-mathjax";
import Questions from "./Questions";
import Recall from "./Recall";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STORAGE_KEY = "recallData";

const mathJaxConfig = {
  tex: {
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    enableMenu: false,
  },
};

function App() {
  // Questions is a global state in app instead
  const [text, setText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<QuestionItem[]>([]);

  const parseQuestions = (inputText: string): QuestionItem[] => {
    if (!inputText.trim()) return [];

    // Parse the text into question-answer pairs based on the pattern:
    // question, followed by "===", followed by an answer
    const pattern = /([^\n]*)\n===\n([\s\S]*?)(?=\n[^\n]*\n===\n|$)/g;

    const questions: QuestionItem[] = [];
    let match;
    while ((match = pattern.exec(inputText)) !== null) {
      const question = match[1].trim();
      const answer = match[2].trim();
      questions.push({ question, answer });
    }

    return questions;
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
    <MathJaxContext config={mathJaxConfig}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        {/* Main wrapper, gives max width and height padding */}
        <div className="container mx-auto max-w-[75%] pt-[5%] pb-[5%]">
          {/* Tabs, each tab goes to each component */}
          <Tabs defaultValue="recall" className="w-full">
            {/* Tabs content, the Recall, Questions, and Theme toggle */}
            <div className="flex justify-between items-center w-full">
              <TabsList>
                <TabsTrigger value="recall">Recall</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">How to use</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[450px] max-h-[500px] overflow-y-auto">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">
                        How to generate questions
                      </h4>
                      <div className="space-y-2">
                        <p>
                          Generate your questions with your favourite LLM, just
                          drop your content in, and ask it to generate n number
                          of questions for you. The format that it should
                          generate it in should look like:
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm overflow-x-auto">
                          question
                          <br />
                          ===
                          <br />
                          answer
                        </div>
                        <p>
                          where the question is above{" "}
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            ===
                          </code>{" "}
                          and the answer is below{" "}
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            ===
                          </code>
                          . Each pair of question and answer is split by an
                          empty line.
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            \n\n.
                          </code>
                          But you can use \n for readability. Inline and block
                          math is recommended to render math properly.
                        </p>
                        <p>A concrete example would look like:</p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm overflow-x-auto">
                          What is the formula for the area of a circle?
                          <br />
                          ===
                          <br />
                          The area of a circle is $A = \pi r^2$ where $r$ is the
                          radius.
                          <br />
                          <br />
                          What is the quadratic formula?
                          <br />
                          ===
                          <br />
                          {"$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$"}
                          <br />
                          Where $x$ can be used later on.
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <ModeToggle />
              </div>
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
    </MathJaxContext>
  );
}

export default App;
