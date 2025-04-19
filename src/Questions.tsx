import { Dispatch, SetStateAction } from "react";
import { Textarea } from "./components/ui/textarea";
import { QuestionItem } from "./types";
import { MathJax } from "better-react-mathjax";

interface QuestionsProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  parsedQuestions: QuestionItem[];
  setParsedQuestions: Dispatch<SetStateAction<QuestionItem[]>>;
  parseQuestions: (inputText: string) => QuestionItem[];
  saveToLocalStorage: (textToSave: string) => void;
}

function Questions({
  text,
  setText,
  parsedQuestions,
  setParsedQuestions,
  parseQuestions,
  saveToLocalStorage,
}: QuestionsProps) {
  // overwride the default submit behavior and instead parse the text
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParsedQuestions(parseQuestions(text));
    // save the user text back up, this will be parsed back again later on
    saveToLocalStorage(text);
  };

  return (
    <div className="space-y-4">
      <p className="text-2xl text-gray-800 dark:text-gray-200">
        Questions to be used for active recall
      </p>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <Textarea
          id="question"
          placeholder="Type your question here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[50vh] resize-y"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md w-fit mt-2"
        >
          Save
        </button>
      </form>

      {parsedQuestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-4">
            Parsed Questions ({parsedQuestions.length})
          </h3>
          <div className="space-y-4">
            {parsedQuestions.map((item, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800"
              >
                <p className="font-medium">Question {index + 1}:</p>
                <p className="ml-4 mt-1 whitespace-pre-wrap">
                  <MathJax>{item.question}</MathJax>
                </p>
                <p className="font-medium mt-2">Answer:</p>
                <p className="ml-4 mt-1 whitespace-pre-wrap">
                  <MathJax>{item.answer}</MathJax>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Questions;
