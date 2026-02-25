import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { getReviewsByUser, getRecentReviews } from "@/services/reviews"
import { getBookmarksByUser } from "@/services/bookmarks"
import { Button } from "@/components/ui/button"
import { DashboardSkeleton } from "./_components/DashboardSkeleton"
import { MyReviewsSection } from "./_components/MyReviewsSection"
import { BookmarksSection } from "./_components/BookmarksSection"
import { RecentReviewsSection } from "./_components/RecentReviewsSection"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

async function DashboardContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [profile, reviews, bookmarks, recentReviews] = await Promise.all([
    getProfile(user.id),
    getReviewsByUser(user.id),
    getBookmarksByUser(user.id),
    getRecentReviews(5),
  ])

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold">
          {profile?.display_name ?? "ユーザー"}さん、こんにちは
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          レビュー {reviews.length} 件 / ブックマーク {bookmarks.length} 件
        </p>
      </section>

      <MyReviewsSection reviews={reviews} />
      <BookmarksSection bookmarks={bookmarks} />
      <RecentReviewsSection reviews={recentReviews} />

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/whiskeys">ウイスキーを探す</Link>
        </Button>
      </div>
    </div>
  )
}
