import { Switch } from "@shared/components/UI/switch"

interface ToggleFieldCardProps {
  label: string
  description?: string
  checked: boolean | undefined
  onCheckedChange: (checked: boolean) => void
}

export function ToggleFieldCard({ label, description, checked, onCheckedChange }: ToggleFieldCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
