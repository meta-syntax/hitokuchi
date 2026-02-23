import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

interface Props {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </>
  )
}
