export const dispatchEvents = <TState>(
  events: Record<string, Function[]>,
  key: string,
  newState: TState
) => (events[key] ?? []).map((event) => event(newState));

export const updateLocalStorage = <TState>(key: string, newState: TState) => {
  localStorage.setItem(
    `STACKED_${key}`,
    JSON.stringify({
      lastUpdated: new Date().toISOString(),
      value: newState,
    })
  );
};
