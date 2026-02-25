import Link from "next/link"
import type { getBookmarksByUser } from "@/services/bookmarks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Props {
  bookmarks: Awaited<ReturnType<typeof getBookmarksByUser>>
}

export function BookmarksSection({ bookmarks }: Props) {
  const myBookmarks = bookmarks.slice(0, 3)

  if (myBookmarks.length === 0) {
    return null
  }

  return (
    <>
      <Separator className="mb-8" />
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">ブックマーク</h2>
          {bookmarks.length > 3 && (
            <Link href="/mypage" className="text-sm text-muted-foreground hover:text-foreground">
              すべて見る
            </Link>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {myBookmarks.map((bookmark) => (
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
      </section>
    </>
  )
}
