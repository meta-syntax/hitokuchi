import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          hitokuchi
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/whiskeys" className="text-sm text-muted-foreground hover:text-foreground">
            ウイスキー一覧
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">ログイン</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
