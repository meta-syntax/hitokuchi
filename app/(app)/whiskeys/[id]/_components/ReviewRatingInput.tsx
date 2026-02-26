import { Label } from "@/components/ui/label"

interface Props {
  value: number
  onChange: (rating: number) => void
}

export function ReviewRatingInput({ value, onChange }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label>評価</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star}つ星`}
            aria-pressed={star <= value}
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? "text-yellow-500" : "text-muted-foreground/30"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
