interface EventConsumer {
  event: string
  handlerName: string
  module: string
  channel: string
}

const CHANNEL_COLOR_CLASS: Record<string, string> = {
  websocket: 'text-[green]',
  email: 'text-[blue]',
}

interface EventConsumerRowProps {
  consumer: EventConsumer
}

export function EventConsumerRow({ consumer }: EventConsumerRowProps) {
  return (
    <div className="mb-[5px] border border-[#ccc] p-[10px]">
      <strong>Module:</strong> {consumer.module} <br />
      <strong>Handler:</strong> {consumer.handlerName} <br />
      <strong>Channel:</strong>{' '}
      <span className={CHANNEL_COLOR_CLASS[consumer.channel] ?? 'text-[gray]'}>
        {consumer.channel}
      </span>
    </div>
  )
}
