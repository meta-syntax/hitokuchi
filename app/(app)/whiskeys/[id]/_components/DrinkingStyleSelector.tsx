import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { DRINKING_STYLES } from "@/lib/constants"

interface Props {
  value: string
  onChange: (style: string) => void
}

export function DrinkingStyleSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label>飲み方</Label>
      <div className="flex flex-wrap gap-2">
        {DRINKING_STYLES.map((style) => (
          <Badge
            key={style.value}
            variant={value === style.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onChange(value === style.value ? "" : style.value)}
          >
            {style.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
