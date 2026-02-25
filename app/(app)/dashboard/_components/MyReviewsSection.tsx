import Link from "next/link"
import type { getReviewsByUser } from "@/services/reviews"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  reviews: Awaited<ReturnType<typeof getReviewsByUser>>
}

export function MyReviewsSection({ reviews }: Props) {
  const myReviews = reviews.slice(0, 3)

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">自分のレビュー</h2>
        {reviews.length > 0 && (
          <Link href="/mypage" className="text-sm text-muted-foreground hover:text-foreground">
            すべて見る
          </Link>
        )}
      </div>
      {myReviews.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              まだレビューがありません。ウイスキーを探してレビューを書いてみましょう！
            </p>
            <Button asChild size="sm">
              <Link href="/whiskeys">ウイスキーを探す</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {myReviews.map((review) => (
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
  )
}
