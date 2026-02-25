import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { Button } from "@/components/ui/button"
import { HeaderUserMenu } from "@/components/layout/HeaderUserMenu"

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="shrink-0 text-lg font-bold">
          hitokuchi
        </Link>
        <Suspense
          fallback={
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          }
        >
          <AuthSection />
        </Suspense>
      </div>
    </header>
  )
}

async function AuthSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = user ? await getProfile(user.id) : null

  const isAdmin = profile?.role === "admin"

  if (user) {
    return (
      <HeaderUserMenu
        displayName={profile?.display_name ?? "ユーザー"}
        avatarUrl={profile?.avatar_url ?? undefined}
        isAdmin={isAdmin}
      />
    )
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">ログイン</Link>
    </Button>
  )
}
