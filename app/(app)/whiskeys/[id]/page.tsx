import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWhiskey } from "@/services/whiskeys"
import { getReviewsByWhiskey } from "@/services/reviews"
import { getBookmark } from "@/services/bookmarks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookmarkButton } from "./_components/BookmarkButton"
import { ReviewForm } from "./_components/ReviewForm"

const drinkingStyleLabel: Record<string, string> = {
  straight: "ストレート",
  rock: "ロック",
  highball: "ハイボール",
  mizuwari: "水割り",
}

const wouldRepeatLabel: Record<string, string> = {
  yes: "また飲みたい",
  maybe: "機会があれば",
  no: "一度でいいかな",
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function WhiskeyDetailPage({ params }: Props) {
  const { id } = await params
  const whiskey = await getWhiskey(id)

  if (!whiskey) {
    notFound()
  }

  const reviews = await getReviewsByWhiskey(id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const bookmark = user ? await getBookmark(user.id, id) : null

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
          <BookmarkButton whiskeyId={id} initialBookmarked={!!bookmark} />
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
                    {review.drinking_style && drinkingStyleLabel[review.drinking_style]}
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
                      {wouldRepeatLabel[review.would_repeat]}
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
