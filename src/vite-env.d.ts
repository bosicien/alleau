/// <reference types="vite/client" />

declare module "*.json" {
  const value: {
    "learn-french": {
      flashcards: Array<{
        question: string;
        answer: string;
      }>;
    };
  };
  export default value;
}