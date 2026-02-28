interface Props {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: Props) {
  return <main className="min-h-[calc(100vh-8rem)]">{children}</main>
}
