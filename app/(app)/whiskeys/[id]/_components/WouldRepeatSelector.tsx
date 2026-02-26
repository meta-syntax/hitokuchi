import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { WOULD_REPEAT_OPTIONS } from "@/lib/constants"

interface Props {
  value: string
  onChange: (value: string) => void
}

export function WouldRepeatSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label>また飲みたい？</Label>
      <div className="flex flex-wrap gap-2">
        {WOULD_REPEAT_OPTIONS.map((option) => (
          <Badge
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              onChange(value === option.value ? "" : option.value)
            }
          >
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
