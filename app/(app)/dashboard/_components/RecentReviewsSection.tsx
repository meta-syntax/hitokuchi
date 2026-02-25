import Link from "next/link"
import type { getRecentReviews } from "@/services/reviews"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Props {
  reviews: Awaited<ReturnType<typeof getRecentReviews>>
}

export function RecentReviewsSection({ reviews }: Props) {
  return (
    <>
      <Separator className="mb-8" />
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">みんなの最近のレビュー</h2>
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
                    <div className="flex items-center gap-2">
                      {review.profiles && (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={review.profiles.avatar_url ?? undefined} />
                            <AvatarFallback className="text-[10px]">
                              {review.profiles.display_name?.charAt(0) ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {review.profiles.display_name ?? "ユーザー"}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {review.taste_tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
