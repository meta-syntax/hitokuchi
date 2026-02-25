import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeaderLogoutButton } from "@/components/layout/HeaderLogoutButton"

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          hitokuchi
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/whiskeys" className="text-sm text-muted-foreground hover:text-foreground">
            ウイスキー一覧
          </Link>
          <Suspense
            fallback={
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            }
          >
            <AuthSection />
          </Suspense>
        </nav>
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
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/admin/whiskeys"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            管理画面
          </Link>
        )}
        <Link href="/mypage" className="flex items-center gap-2 text-sm hover:opacity-80">
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">
              {profile?.display_name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-muted-foreground sm:inline">
            {profile?.display_name ?? "ユーザー"}
          </span>
          {isAdmin && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              Admin
            </Badge>
          )}
        </Link>
        <HeaderLogoutButton />
      </div>
    )
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">ログイン</Link>
    </Button>
  )
}
