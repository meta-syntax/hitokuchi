"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WhiskeyForm } from "./WhiskeyForm"

interface Whiskey {
  id: string
  name: string
  name_en: string | null
  type: string
  distillery: string | null
  country: string
  abv: number | null
  price_range: string | null
  description: string | null
}

interface Props {
  whiskeys: Whiskey[]
}

export function AdminWhiskeyList({ whiskeys }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("whiskeys")
      .delete()
      .eq("id", id)

    if (error) {
      alert("削除に失敗しました。")
      return
    }

    setDeletingId(null)
    startTransition(() => router.refresh())
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ウイスキー管理</h1>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          新規追加
        </Button>
      </div>

      {showCreateForm && (
        <WhiskeyForm onClose={() => setShowCreateForm(false)} />
      )}

      {whiskeys.length === 0 ? (
        <p className="text-muted-foreground">ウイスキーがまだ登録されていません。</p>
      ) : (
        <div className="grid gap-3">
          {whiskeys.map((w) => (
            <div key={w.id}>
              {editingId === w.id ? (
                <WhiskeyForm
                  initialData={{
                    id: w.id,
                    name: w.name,
                    name_en: w.name_en ?? "",
                    type: w.type,
                    distillery: w.distillery ?? "",
                    country: w.country,
                    abv: w.abv?.toString() ?? "",
                    price_range: w.price_range ?? "",
                    description: w.description ?? "",
                  }}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{w.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(w.id)}
                        >
                          編集
                        </Button>
                        {deletingId === w.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(w.id)}
                              disabled={isPending}
                            >
                              確認
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingId(null)}
                            >
                              取消
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingId(w.id)}
                          >
                            削除
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{w.type}</Badge>
                      <Badge variant="outline">{w.distillery}</Badge>
                      <Badge variant="outline">{w.country}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
