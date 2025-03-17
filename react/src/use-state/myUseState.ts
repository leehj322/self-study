type StateSetter<T> = (newValue: T | ((prev: T) => T)) => void;

// eslint-disable-next-line
let hooks: any[] = []; // Array to store all hooks
let currentHook = 0; // Index to track the current hook position

export function myUseState<T>(
  initialValue: T | (() => T)
): [T, StateSetter<T>] {
  const hookIndex = currentHook;

  // Register initial value if this hook is called for the first time.
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
  }

  const setState: StateSetter<T> = (newValueOrUpdater) => {
    if (typeof newValueOrUpdater === "function") {
      const updater = newValueOrUpdater as (prev: T) => T;
      hooks[hookIndex] = updater(hooks[hookIndex]);
    } else {
      hooks[hookIndex] = newValueOrUpdater;
    }

    rerender(); // Trigger re-render after state update
  };

  currentHook++; // Move to the next hook slot

  return [hooks[hookIndex], setState];
}

// Function to hold the re-render logic (assigned externally)
let rerender: () => void = () => {};

// Allow external assignment of the re-render function
export function setRerender(renderFunction: () => void) {
  rerender = renderFunction;
}

// Reset hook index at the start of each render
export function resetHooks() {
  currentHook = 0;
}
