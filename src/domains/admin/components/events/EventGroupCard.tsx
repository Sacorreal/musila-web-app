import { EventConsumerRow } from './EventConsumerRow'

interface EventConsumer {
  event: string
  handlerName: string
  module: string
  channel: string
}

interface EventGroupCardProps {
  event: string
  consumers: EventConsumer[]
}

export function EventGroupCard({ event, consumers }: EventGroupCardProps) {
  return (
    <div className="mb-[20px]">
      <h2>🔹 {event}</h2>

      {consumers.map((c, index) => (
        <EventConsumerRow key={index} consumer={c} />
      ))}
    </div>
  )
}
