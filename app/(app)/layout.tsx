interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-5xl px-4 py-8">
      {children}
    </main>
  )
}
