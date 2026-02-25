import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/services/profiles"
import { getWhiskeys } from "@/services/whiskeys"
import { AdminWhiskeyList } from "./_components/AdminWhiskeyList"

export default function AdminWhiskeysPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
      <AdminWhiskeysContent />
    </Suspense>
  )
}

async function AdminWhiskeysContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getProfile(user.id)

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const whiskeys = await getWhiskeys()

  return <AdminWhiskeyList whiskeys={whiskeys} />
}
