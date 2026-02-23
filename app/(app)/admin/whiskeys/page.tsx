import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { getWhiskeys } from "@/services/whiskeys"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminWhiskeysPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
      <AdminWhiskeysContent/>
    </Suspense>
  )
}

async function AdminWhiskeysContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getProfile(user.id)

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const whiskeys = await getWhiskeys()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ウイスキー管理</h1>
        <Button>新規追加</Button>
      </div>

      {whiskeys.length === 0 ? (
        <p className="text-muted-foreground">ウイスキーがまだ登録されていません。</p>
      ) : (
        <div className="grid gap-3">
          {whiskeys.map((w) => (
            <Card key={w.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{w.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">編集</Button>
                    <Button variant="destructive" size="sm">削除</Button>
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
          ))}
        </div>
      )}
    </div>
  )
}
