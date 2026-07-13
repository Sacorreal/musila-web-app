'use client';

import { useEffect } from 'react';
import { useEventStore } from '@domains/events/store/event.store';
import { EventGroupCard } from '@/src/domains/admin/components/events/EventGroupCard';
import { EventsDashboardTitle } from '@/src/domains/admin/components/events/EventsDashboardTitle';

export default function EventsDashboard() {
  const { grouped, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-[20px]">
      <EventsDashboardTitle />

      {Object.entries(grouped).map(([event, consumers]) => (
        <EventGroupCard key={event} event={event} consumers={consumers} />
      ))}
    </div>
  );
}
