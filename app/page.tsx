import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
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
              <Button variant="outline" size="lg" disabled className="min-w-35">
                &nbsp;
              </Button>
            }
          >
            <AuthCTA />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <FeatureCard icon="🥃" title="ひとくちレビュー" description="味わい・飲み方・ひとことで、サクッと記録" />
          <FeatureCard icon="🔖" title="ブックマーク" description="気になるウイスキーをあとでチェック" />
          <FeatureCard icon="📊" title="みんなの評価" description="他のユーザーのレビューを参考にできる" />
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
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
