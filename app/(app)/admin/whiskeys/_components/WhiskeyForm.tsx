"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

const typeOptions = [
  "シングルモルト",
  "ブレンデッド",
  "バーボン",
  "ライ",
  "アイリッシュ",
  "ジャパニーズ",
  "その他",
]

const priceRangeOptions = [
  { value: "low", label: "$ (〜3,000円)" },
  { value: "medium", label: "$$ (3,000〜6,000円)" },
  { value: "high", label: "$$$ (6,000〜15,000円)" },
  { value: "premium", label: "$$$$ (15,000円〜)" },
]

interface WhiskeyData {
  id?: string
  name: string
  name_en: string
  type: string
  distillery: string
  country: string
  abv: string
  price_range: string
  description: string
}

interface Props {
  initialData?: WhiskeyData
  onClose: () => void
}

export function WhiskeyForm({ initialData, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [form, setForm] = useState<WhiskeyData>({
    name: initialData?.name ?? "",
    name_en: initialData?.name_en ?? "",
    type: initialData?.type ?? typeOptions[0],
    distillery: initialData?.distillery ?? "",
    country: initialData?.country ?? "",
    abv: initialData?.abv ?? "",
    price_range: initialData?.price_range ?? "",
    description: initialData?.description ?? "",
  })

  const updateField = (field: keyof WhiskeyData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name || !form.type || !form.country) {
      setError("名前、タイプ、生産国は必須です。")
      return
    }

    const supabase = createClient()
    const payload = {
      name: form.name,
      name_en: form.name_en || null,
      type: form.type,
      distillery: form.distillery || null,
      country: form.country,
      abv: form.abv ? parseFloat(form.abv) : null,
      price_range: form.price_range || null,
      description: form.description || null,
    }

    if (initialData?.id) {
      const { error: updateError } = await supabase
        .from("whiskeys")
        .update(payload)
        .eq("id", initialData.id)

      if (updateError) {
        setError("更新に失敗しました。")
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from("whiskeys")
        .insert(payload)

      if (insertError) {
        setError("追加に失敗しました。")
        return
      }
    }

    onClose()
    startTransition(() => router.refresh())
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">
          {initialData?.id ? "ウイスキーを編集" : "ウイスキーを追加"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">名前 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nameEn">英語名</Label>
              <Input
                id="nameEn"
                value={form.name_en}
                onChange={(e) => updateField("name_en", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="type">タイプ *</Label>
              <Select value={form.type} onValueChange={(value) => updateField("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="country">生産国 *</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="distillery">蒸留所</Label>
              <Input
                id="distillery"
                value={form.distillery}
                onChange={(e) => updateField("distillery", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="abv">ABV (%)</Label>
              <Input
                id="abv"
                type="number"
                step="0.1"
                value={form.abv}
                onChange={(e) => updateField("abv", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="priceRange">価格帯</Label>
            <Select value={form.price_range} onValueChange={(value) => updateField("price_range", value)}>
              <SelectTrigger id="priceRange">
                <SelectValue placeholder="未設定" />
              </SelectTrigger>
              <SelectContent>
                {priceRangeOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "保存中..." : initialData?.id ? "更新" : "追加"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
