import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="flex flex-col items-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            ウイスキーをひとくち、
            <br />
            感想をひとこと。
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            hitokuchiは、ウイスキーの感想を気軽に記録・共有できるレビューサイトです。
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/whiskeys">ウイスキーを探す</Link>
            </Button>
            <Suspense
              fallback={
                <Button variant="outline" size="lg" disabled>
                  はじめる
                </Button>
              }
            >
              <AuthCTA />
            </Suspense>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl">🥃</div>
              <h3 className="mb-1 font-semibold">ひとくちレビュー</h3>
              <p className="text-sm text-muted-foreground">
                味わい・飲み方・ひとことで、サクッと記録
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🔖</div>
              <h3 className="mb-1 font-semibold">ブックマーク</h3>
              <p className="text-sm text-muted-foreground">
                気になるウイスキーをあとでチェック
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">📊</div>
              <h3 className="mb-1 font-semibold">みんなの評価</h3>
              <p className="text-sm text-muted-foreground">
                他のユーザーのレビューを参考にできる
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

async function AuthCTA() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return (
      <Button asChild variant="outline" size="lg">
        <Link href="/dashboard">ダッシュボード</Link>
      </Button>
    )
  }

  return (
    <Button asChild variant="outline" size="lg">
      <Link href="/login">はじめる</Link>
    </Button>
  )
}
