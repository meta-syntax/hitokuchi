import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { TASTE_TAGS } from "@/lib/constants"

interface Props {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TasteTagSelector({ value, onChange }: Props) {
  const toggleTag = (tag: string) => {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]
    )
  }

  return (
    <div className="grid gap-1.5">
      <Label>テイスト</Label>
      <div className="flex flex-wrap gap-1.5">
        {TASTE_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={value.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
