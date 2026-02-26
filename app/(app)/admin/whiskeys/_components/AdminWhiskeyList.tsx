"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { WhiskeyForm } from "./WhiskeyForm"
import { deleteWhiskeyAction } from "../_actions/whiskey"
import type { Tables } from "@/types/database"

interface Props {
  whiskeys: Tables<"whiskeys">[]
}

export function AdminWhiskeyList({ whiskeys }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, Partial<Tables<"whiskeys">>>
  >({})
  const [prevWhiskeys, setPrevWhiskeys] = useState(whiskeys)

  // サーバーから新しいデータが届いたら楽観的更新をクリア
  if (prevWhiskeys !== whiskeys) {
    setPrevWhiskeys(whiskeys)
    setOptimisticUpdates({})
  }

  const displayWhiskeys = whiskeys.map((w) => {
    const update = optimisticUpdates[w.id]
    return update ? { ...w, ...update } : w
  })

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const { error } = await deleteWhiskeyAction(id)
      if (error) {
        return
      }
      router.refresh()
    })
  }

  const handleEditSave = (data: {
    name: string
    name_en: string
    type: string
    distillery: string
    country: string
    abv: string
    price_range: string
    description: string
  }) => {
    if (editingId) {
      setOptimisticUpdates((prev) => ({
        ...prev,
        [editingId]: {
          name: data.name,
          name_en: data.name_en || null,
          type: data.type,
          distillery: data.distillery || null,
          country: data.country,
          abv: data.abv ? parseFloat(data.abv) : null,
          price_range: data.price_range || null,
          description: data.description || null,
        },
      }))
    }
    setEditingId(null)
    startTransition(() => router.refresh())
  }

  const handleCreateSave = () => {
    setShowCreateForm(false)
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
        <WhiskeyForm
          onCancel={() => setShowCreateForm(false)}
          onSave={handleCreateSave}
        />
      )}

      {whiskeys.length === 0 ? (
        <p className="text-muted-foreground">ウイスキーがまだ登録されていません。</p>
      ) : (
        <div className="grid gap-3">
          {displayWhiskeys.map((w) => (
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
                  onCancel={() => setEditingId(null)}
                  onSave={handleEditSave}
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              削除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                「{w.name}」を削除します。この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(w.id)}
                                disabled={isPending}
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
