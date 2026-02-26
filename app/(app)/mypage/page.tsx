import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { getReviewsByUser } from "@/services/reviews"
import { getBookmarksByUser } from "@/services/bookmarks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProfileEditForm } from "./_components/ProfileEditForm"
import { ThemeToggle } from "./_components/ThemeToggle"

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

  const [profile, reviews, bookmarks] = await Promise.all([
    getProfile(user.id),
    getReviewsByUser(user.id),
    getBookmarksByUser(user.id),
  ])

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>
            {profile?.display_name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              {profile?.display_name ?? "ユーザー"}
            </h1>
            {profile?.role === "admin" && (
              <Badge variant="destructive">Admin</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            レビュー {reviews.length} 件 / ブックマーク {bookmarks.length} 件
          </p>
        </div>
      </div>

      {profile?.role === "admin" && (
        <Card className="mb-8">
          <CardContent className="py-3">
            <Link
              href="/admin/whiskeys"
              className="text-sm font-medium text-primary hover:underline"
            >
              管理画面（ウイスキー管理）→
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <ProfileEditForm
          initialDisplayName={profile?.display_name ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? ""}
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">テーマ設定</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">自分のレビュー</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">まだレビューがありません。</p>
        ) : (
          <div className="grid gap-3">
            {reviews.map((review) => (
              <Link key={review.id} href={`/whiskeys/${review.whiskey_id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <span>{"★".repeat(review.rating)}</span>
                      {review.whiskeys && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {review.whiskeys.name}
                        </span>
                      )}
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
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">ブックマーク</h2>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-muted-foreground">ブックマークがありません。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookmarks.map((bookmark) => (
              <Link key={bookmark.id} href={`/whiskeys/${bookmark.whiskey_id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="py-3">
                    <p className="text-sm font-medium">
                      {bookmark.whiskeys?.name ?? "不明なウイスキー"}
                    </p>
                    {bookmark.whiskeys && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">
                          {bookmark.whiskeys.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {bookmark.whiskeys.country}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
