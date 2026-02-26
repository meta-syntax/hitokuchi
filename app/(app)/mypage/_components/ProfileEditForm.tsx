"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { updateProfileAction } from "../_actions/profile"

interface Props {
  initialDisplayName: string
  initialAvatarUrl: string
}

export function ProfileEditForm({ initialDisplayName, initialAvatarUrl }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [error, setError] = useState("")

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")

    const { error: actionError } = await updateProfileAction({
      displayName,
      avatarUrl,
    })

    if (actionError) {
      setError("更新に失敗しました。")
      return
    }

    setEditing(false)
    startTransition(() => router.refresh())
  }

  if (!editing) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        プロフィールを編集
      </Button>
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSave} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="avatarUrl">アバターURL</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(false)
                setDisplayName(initialDisplayName)
                setAvatarUrl(initialAvatarUrl)
              }}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
