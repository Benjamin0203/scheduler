import {useState} from 'react';
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
//Test
// console.log("mode", mode, "history", history);

  function transition (newMode, replace = false) {
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
    setMode(newMode);
  }
  
  function back () {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    } else {
      setMode(initial);
    }
  }

  return { mode, transition, back };
}

