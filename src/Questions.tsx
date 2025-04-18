import * as React from "react";
import { Textarea } from "./components/ui/textarea";

// Define the type for parsed questions
type QuestionItem = {
  question: string;
  answer: string;
};

function Questions() {
  const [text, setText] = React.useState("");
  const [parsedQuestions, setParsedQuestions] = React.useState<QuestionItem[]>(
    []
  );

  // Parse the input text into structured question/answer pairs
  const parseQuestions = (inputText: string): QuestionItem[] => {
    if (!inputText.trim()) return [];

    // Split the text by double line breaks to separate question-answer blocks
    const blocks = inputText.split(/\n\s*\n/).filter((block) => block.trim());

    return blocks.map((block) => {
      // Split each block by the separator "==="
      const parts = block.split(/===/).map((part) => part.trim());

      if (parts.length >= 2) {
        return {
          question: parts[0],
          answer: parts.slice(1).join("==="), // In case there are multiple "===" in the answer
        };
      }

      // Handle case where there's no separator (treat as question only)
      return {
        question: block,
        answer: "",
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions = parseQuestions(text);
    setParsedQuestions(questions);
    console.log("Parsed Questions:", questions);
    // Here you could save these questions to your storage/backend
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
                <p className="ml-4 mt-1">{item.question}</p>
                <p className="font-medium mt-2">Answer:</p>
                <p className="ml-4 mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Questions;
