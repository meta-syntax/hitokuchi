"use client"

import { Suspense } from "react"

function Copyright() {
  return <>&copy; {new Date().getFullYear()} hitokuchi</>
}

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
        <Suspense fallback={<>&copy; hitokuchi</>}>
          <Copyright />
        </Suspense>
      </div>
    </footer>
  )
}
