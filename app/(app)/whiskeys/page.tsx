import Link from "next/link"
import { getWhiskeys } from "@/services/whiskeys"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const priceRangeLabel: Record<string, string> = {
  low: "$",
  medium: "$$",
  high: "$$$",
  premium: "$$$$",
}

export default async function WhiskeysPage() {
  const whiskeys = await getWhiskeys()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">ウイスキー一覧</h1>
      {whiskeys.length === 0 ? (
        <p className="text-muted-foreground">ウイスキーがまだ登録されていません。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whiskeys.map((w) => (
            <Link key={w.id} href={`/whiskeys/${w.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{w.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {w.distillery} / {w.country}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{w.type}</Badge>
                    {w.abv && <Badge variant="outline">{w.abv}%</Badge>}
                    {w.price_range && (
                      <Badge variant="outline">{priceRangeLabel[w.price_range]}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
