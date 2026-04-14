'use client';

import { useEffect } from 'react';
import { useEventStore } from '@domains/events/store/event.store';

export default function EventsDashboard() {
  const { grouped, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📡 Event System Dashboard</h1>

      {Object.entries(grouped).map(([event, consumers]) => (
        <div key={event} style={{ marginBottom: 20 }}>
          <h2>🔹 {event}</h2>

          {consumers.map((c, index) => (
            <div
              key={index}
              style={{
                padding: 10,
                border: '1px solid #ccc',
                marginBottom: 5,
              }}
            >
              <strong>Module:</strong> {c.module} <br />
              <strong>Handler:</strong> {c.handlerName} <br />
              <strong>Channel:</strong>{' '}
              <span
                style={{
                  color:
                    c.channel === 'websocket'
                      ? 'green'
                      : c.channel === 'email'
                      ? 'blue'
                      : 'gray',
                }}
              >
                {c.channel}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}