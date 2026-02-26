import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWhiskey } from "@/services/whiskeys"
import { getReviewsByWhiskey } from "@/services/reviews"
import { getBookmark } from "@/services/bookmarks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkButton } from "./_components/BookmarkButton"
import { ReviewForm } from "./_components/ReviewForm"
import { DRINKING_STYLE_LABEL, WOULD_REPEAT_LABEL } from "@/lib/constants"

interface Props {
  params: Promise<{ id: string }>
}

export default function WhiskeyDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<WhiskeyDetailSkeleton />}>
      <WhiskeyDetailContent params={params} />
    </Suspense>
  )
}

async function WhiskeyDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const whiskey = await getWhiskey(id)

  if (!whiskey) {
    notFound()
  }

  const supabasePromise = createClient()
  const [reviews, supabase] = await Promise.all([
    getReviewsByWhiskey(id),
    supabasePromise,
  ])
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{whiskey.name}</h1>
            {whiskey.name_en && (
              <p className="text-sm text-muted-foreground">{whiskey.name_en}</p>
            )}
          </div>
          <Suspense fallback={<Skeleton className="h-8 w-28" />}>
            <BookmarkButtonWrapper whiskeyId={id} userId={user?.id} />
          </Suspense>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{whiskey.type}</Badge>
          <Badge variant="outline">{whiskey.distillery}</Badge>
          <Badge variant="outline">{whiskey.country}</Badge>
          {whiskey.abv && <Badge variant="outline">{whiskey.abv}%</Badge>}
        </div>
        {whiskey.description && (
          <p className="mt-4 text-sm text-muted-foreground">{whiskey.description}</p>
        )}
      </div>

      <Separator className="mb-8" />

      <h2 className="mb-4 text-lg font-semibold">
        レビュー ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="mb-6 text-sm text-muted-foreground">まだレビューがありません。</p>
      ) : (
        <div className="mb-6 grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span>{"★".repeat(review.rating)}</span>
                  <span className="text-sm text-muted-foreground">
                    {review.drinking_style && DRINKING_STYLE_LABEL[review.drinking_style]}
                  </span>
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
                  {review.would_repeat && (
                    <Badge variant="outline" className="text-xs">
                      {WOULD_REPEAT_LABEL[review.would_repeat]}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="mb-8" />

      <ReviewForm whiskeyId={id} isLoggedIn={!!user} />
    </div>
  )
}

async function BookmarkButtonWrapper({ whiskeyId, userId }: { whiskeyId: string; userId?: string }) {
  const bookmark = userId ? await getBookmark(userId, whiskeyId) : null
  return <BookmarkButton whiskeyId={whiskeyId} initialBookmarked={!!bookmark} />
}

function WhiskeyDetailSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Separator className="mb-8" />
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
    </div>
  )
}
