import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { getReviewsByUser } from "@/services/reviews"
import { getBookmarksByUser } from "@/services/bookmarks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function MyPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
      <MyPageContent />
    </Suspense>
  )
}

async function MyPageContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getProfile(user.id)
  const reviews = await getReviewsByUser(user.id)
  const bookmarks = await getBookmarksByUser(user.id)

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>
            {profile?.display_name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">
            {profile?.display_name ?? "ユーザー"}
          </h1>
          <p className="text-sm text-muted-foreground">
            レビュー {reviews.length} 件 / ブックマーク {bookmarks.length} 件
          </p>
        </div>
      </div>

      <Separator className="mb-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">自分のレビュー</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">まだレビューがありません。</p>
        ) : (
          <div className="grid gap-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {"★".repeat(review.rating)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {review.comment && <p className="mb-2 text-sm">{review.comment}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {review.taste_tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">ブックマーク</h2>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-muted-foreground">ブックマークがありません。</p>
        ) : (
          <div className="grid gap-3">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id}>
                <CardContent className="py-3">
                  <p className="text-sm">ウイスキー ID: {bookmark.whiskey_id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
