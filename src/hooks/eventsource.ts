import { useCallback, useEffect, useRef, useState } from 'react';

export function useEventSource<Data extends object>(
  url: string | URL | null,
  initialData: Data,
  options?: EventSourceInit,
) {
  const [readyState, setReadyState] = useState<number>(0);
  const [error, setError] = useState<Event | null>(null);
  const [data, setData] = useState<Data>(initialData);
  const eventSource = useRef<EventSource | null>(null);

  const dataKeys = Object.keys(initialData) as Array<
    Extract<keyof Data, string>
  >;

  const readyStateChange = useCallback(() => {
    setReadyState(eventSource.current?.readyState ?? 0);
  }, []);

  const addListener = useCallback(
    <EventName extends Extract<keyof Data, string>>(
      eventName: EventName,
      handler?: (data: Data[EventName]) => void,
    ) => {
      const listener = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as Data[EventName];

        setData((prev) => ({
          ...prev,
          [eventName]: data,
        }));

        handler?.(data);
      };

      eventSource.current?.addEventListener(eventName, listener);

      return () => {
        eventSource.current?.removeEventListener(eventName, listener);
      };
    },
    [],
  );

  useEffect(() => {
    if (url) {
      eventSource.current = new EventSource(url, options);
      eventSource.current.addEventListener('open', readyStateChange);
      eventSource.current.addEventListener('error', readyStateChange);
      eventSource.current.addEventListener('error', setError);

      const subscriptions: ReturnType<typeof addListener>[] = dataKeys.map(
        (key) => addListener(key),
      );

      return () => {
        subscriptions.forEach((unsubscribe) => unsubscribe());

        eventSource.current?.close();
        eventSource.current = null;

        setReadyState(0);
        setError(null);
      };
    } else {
      eventSource.current = null;
      setReadyState(0);
      setError(null);
    }
  }, [url, options, readyStateChange]);

  return {
    readyState,
    error,
    addListener,
    data,
  };
}
