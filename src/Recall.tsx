import { QuestionItem } from "./types";

interface RecallProps {
  parsedQuestions: QuestionItem[];
}

function Recall({ parsedQuestions }: RecallProps) {
  return (
    <div className="space-y-4">
      <p className="text-2xl text-gray-800 dark:text-gray-200">
        Active Recall Questions
      </p>

      {parsedQuestions.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No questions added yet. Go to the Questions tab to add some.
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Recall;
