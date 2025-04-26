import { useState, useEffect, useCallback } from "react";
import { QuestionItem } from "./types";
import { shuffle, findLastIndex, some, max, floor } from "lodash";
import { MathJax } from "better-react-mathjax";

// Take the question and answer and add few more properties to them
type FlashCard = QuestionItem & {
  status: "unseen" | "learning" | "mastered"; // Track card status
  lastRating: number | null; // Last rating given (1-4)
};

interface RecallProps {
  parsedQuestions: QuestionItem[];
}

function Recall({ parsedQuestions }: RecallProps) {
  // "question" for showing the question, "answer-rating" for showing the answer and rating
  const [mode, setMode] = useState<"question" | "answer-rating">("question");

  // the queue of cards to be shown to the user
  const [flashcardQueue, setFlashcardQueue] = useState<FlashCard[]>([]);

  // tracking stats
  const [totalMastered, setTotalMastered] = useState(0);
  const [cardsReviewed, setCardsReviewed] = useState(0);

  // track if the session is completed
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // initialize flashcards from parsedQuestions
  useEffect(() => {
    if (parsedQuestions.length > 0) {
      const initialFlashcards: FlashCard[] = parsedQuestions.map(
        (question) => ({
          ...question,
          status: "unseen",
          lastRating: null,
        })
      );

      // init random queue
      setFlashcardQueue(shuffle(initialFlashcards));
      setSessionCompleted(false);
      setTotalMastered(0);
      setCardsReviewed(0);
    }
  }, [parsedQuestions]);

  // handler for when the user clicks / types the rating
  const handleRating = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (flashcardQueue.length === 0) return;

      // shallow copy and pop
      const updatedQueue = [...flashcardQueue];
      const currentCard = updatedQueue.shift();

      if (!currentCard) return;

      // update card based on rating
      const updatedCard: FlashCard = {
        ...currentCard,
        status: rating === 4 ? "mastered" : "learning",
        lastRating: rating,
      };

      // update stats
      setCardsReviewed((prev) => prev + 1);

      const isNewlyMastered =
        updatedCard.status === "mastered" && currentCard.status !== "mastered";
      if (isNewlyMastered) {
        setTotalMastered((prev) => prev + 1);
      }

      // check if completed
      const allCardsMastered = updatedQueue.every(
        (card) =>
          (card == updatedCard && updatedCard.status == "mastered") ||
          card.status === "mastered"
      );
      if (allCardsMastered) {
        setSessionCompleted(true);
        setFlashcardQueue(updatedQueue);
        setMode("question");
        return;
      }

      // if mastered, push to end
      if (rating === 4) {
        updatedQueue.push(updatedCard);
      } else {
        // run through to check for any unseen cards
        const hasUnseenCards = some(
          updatedQueue,
          (card) => card.status === "unseen"
        );

        if (hasUnseenCards) {
          // find the last unseen card and place after
          const lastUnseenIndex = findLastIndex(
            updatedQueue,
            (card) => card.status === "unseen"
          );
          updatedQueue.splice(lastUnseenIndex + 1, 0, updatedCard);
        } else {
          const positions = {
            1: 0, // as far in front as possible
            2: max([floor(updatedQueue.length / 3), 1]) as number, // 1/3 back
            3: max([floor((updatedQueue.length * 2) / 3), 2]) as number, // 2/3 back
          };
          updatedQueue.splice(positions[rating], 0, updatedCard);
        }
      }

      setFlashcardQueue(updatedQueue);
      setMode("question");
    },
    [
      flashcardQueue,
      setMode,
      setFlashcardQueue,
      setTotalMastered,
      setCardsReviewed,
      setSessionCompleted,
    ]
  );

  // keyboard listener
  useEffect(() => {
    // dont listen if the session is completed
    if (sessionCompleted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // show answer and rating on space
      if (event.code === "Space") {
        event.preventDefault();
        if (mode === "question") {
          setMode("answer-rating");
        }
      }

      // Handle ratings via keyboard
      if (
        mode === "answer-rating" &&
        ["1", "2", "3", "4"].includes(event.key)
      ) {
        event.preventDefault();
        handleRating(Number(event.key) as 1 | 2 | 3 | 4);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, sessionCompleted, handleRating]);

  // no questions to show
  if (parsedQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-2xl text-gray-800 dark:text-gray-200">
          Active Recall Questions
        </p>
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No questions added yet. Go to the Questions tab to add some.
        </div>
      </div>
    );
  }

  // completed session, ask if they want ot go again
  if (sessionCompleted) {
    return (
      <div className="space-y-4">
        <p className="text-2xl text-gray-800 dark:text-gray-200">
          Active Recall Questions
        </p>
        <div className="py-8 text-center bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
          <h3 className="text-2xl font-medium text-green-600 dark:text-green-400 mb-2">
            Session Completed!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            You've mastered all {parsedQuestions.length} cards.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total cards reviewed: {cardsReviewed}
          </p>
          <button
            onClick={() => {
              // Reset the session with shuffled cards
              const resetFlashcards: FlashCard[] = parsedQuestions.map(
                (question) => ({
                  ...question,
                  status: "unseen",
                  lastRating: null,
                })
              );
              setFlashcardQueue(shuffle(resetFlashcards));
              setSessionCompleted(false);
              setTotalMastered(0);
              setCardsReviewed(0);
            }}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Restart Session
          </button>
        </div>
      </div>
    );
  }

  if (flashcardQueue.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-2xl text-gray-800 dark:text-gray-200">
          Active Recall Questions
        </p>
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading flashcards...
        </div>
      </div>
    );
  }

  // get the top card and render it
  const currentCard = flashcardQueue[0];

  return (
    <div className="space-y-4">
      <p className="text-2xl text-gray-800 dark:text-gray-200">
        Active Recall Questions
      </p>

      <div className="flex flex-col min-h-[50vh] p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 relative">
        {/* Progress indicator - top right */}
        <div className="absolute top-4 right-4 text-sm text-gray-500 dark:text-gray-400 text-right">
          <div>
            Mastered: {totalMastered} of {parsedQuestions.length}
          </div>
          <div>Cards Reviewed: {cardsReviewed}</div>
        </div>

        {/* Content container with question and answer/prompt */}
        <div className="flex flex-col h-full pt-10">
          {/* Question - aligned to top but centered horizontally */}
          <div className="text-xl font-medium mt-2 mb-6 text-center whitespace-pre-wrap">
            <MathJax dynamic>{currentCard.question}</MathJax>{" "}
          </div>

          {/* Answer (visible only in answer-rating mode) */}
          {mode === "answer-rating" && (
            <div className="mb-6 p-4 w-full bg-white dark:bg-gray-700 rounded-md shadow-sm whitespace-pre-wrap">
              <p className="font-medium">Answer:</p>
              <p className="mt-2">
                <MathJax dynamic>{currentCard.answer}</MathJax>
              </p>
            </div>
          )}

          {/* Rating UI or Space prompt */}
          {mode === "answer-rating" ? (
            <div className="mt-auto w-full">
              <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
                How well did you know this?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleRating(1)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  1 - Bad
                </button>
                <button
                  onClick={() => handleRating(2)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  2 - Good
                </button>
                <button
                  onClick={() => handleRating(3)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  3 - Better
                </button>
                <button
                  onClick={() => handleRating(4)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  4 - Easy
                </button>
              </div>
              <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  1
                </kbd>{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  2
                </kbd>{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  3
                </kbd>{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  4
                </kbd>{" "}
                to rate
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  space
                </kbd>{" "}
                to show answer
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recall;
