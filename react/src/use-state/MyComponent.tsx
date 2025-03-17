import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { myUseState, setRerender, resetHooks } from "./myUseState";

export default function MyComponent() {
  resetHooks(); // Reset hook index on every render

  const [count, setCount] = myUseState<number>(0);
  const [text, setText] = myUseState<string>("Hi");

  // Register a re-render function using useEffect
  // (required due to custom useState limitations)
  useEffect(() => {
    setRerender(() => {
      rerender();
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Custom useState Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Text: {text}</p>
      <button onClick={() => setText(text === "Hi" ? "Bye" : "Hi")}>
        Toggle Text
      </button>
    </div>
  );
}

// Force re-render function (remount MyComponent on React root)
function rerender() {
  const root = document.getElementById("root");
  if (root) {
    const AppComponent = <MyComponent />;
    ReactDOM.createRoot(root).render(AppComponent);
  }
}
