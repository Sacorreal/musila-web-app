//TODO:refactorizar este archivo las llamadas a api deben estar en service

import { create } from 'zustand';

interface EventConsumer {
  event: string;
  handlerName: string;
  module: string;
  channel: string;
}

interface EventStore {
  events: EventConsumer[];
  grouped: Record<string, EventConsumer[]>;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  grouped: {},

  fetchEvents: async () => {
    const res = await fetch('http://localhost:3000/events/grouped');
    const data = await res.json();

    set({
      grouped: data,
      events: Object.values(data).flat(),
    });
  },
}));