"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

const themes = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システム", icon: Monitor },
] as const

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={mounted && theme === value ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(value)}
        >
          <Icon className="mr-1.5 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  )
}
