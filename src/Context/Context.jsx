import { createContext, useState, useEffect } from "react"; // CHANGED: added useEffect
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // CHANGED: loads saved history on startup instead of starting empty
  const [prevPrompts, setPrevPrompts] = useState(() => {
    try {
      const saved = localStorage.getItem("prevPrompts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // CHANGED: saves history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
    } catch {
      // ignore storage errors
    }
  }, [prevPrompts]);

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
  };

  // Shows a saved answer without calling Gemini
  const loadChat = (item) => {
    setRecentPrompt(item.prompt);
    setResultData(item.answer);
    setShowResult(true);
    setLoading(false);
  };
  

  const onSent = async (prompt) => {
    const activePrompt = prompt !== undefined ? prompt : input;
    if (!activePrompt.trim() || loading) return;

    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(activePrompt);

    try {
      const response = await main(activePrompt);
      const text = typeof response === "string" ? response : response.text;
      setResultData(text);

      // Saves prompt + answer; a repeated prompt replaces its old entry
      setPrevPrompts((prev) => [
        { prompt: activePrompt, answer: text },
        ...prev.filter((p) => p.prompt !== activePrompt),
      ]);
    } catch (err) {
      console.error("Gemini error:", err);
      setResultData("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    loadChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;