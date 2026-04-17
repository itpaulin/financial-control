"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { formatBRL, parseBRL } from "@/lib/format"

type EditableCellProps = {
  value: number | string
  type: "number" | "text"
  onSave: (v: number | string) => void
  cellId: string
  placeholder?: string
  className?: string
  align?: "left" | "right"
}

export function EditableCell({
  value,
  type,
  onSave,
  cellId,
  placeholder,
  className,
  align = "left",
}: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const editingRef = useRef(false)
  const [display, setDisplay] = useState(() =>
    type === "number" ? formatBRL(value as number) : String(value)
  )

  useEffect(() => {
    if (!editingRef.current) {
      setDisplay(type === "number" ? formatBRL(value as number) : String(value))
    }
  }, [value, type])

  function commit(raw: string) {
    if (type === "number") {
      const num = parseBRL(raw)
      onSave(num)
      setDisplay(formatBRL(num))
    } else {
      const str = raw.trim()
      onSave(str)
      setDisplay(str)
    }
    editingRef.current = false
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    editingRef.current = true
    const raw = type === "number"
      ? ((value as number) === 0 ? "" : String(value))
      : String(value)
    setDisplay(raw)
    e.target.select()
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    commit(e.target.value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      editingRef.current = false
      setDisplay(type === "number" ? formatBRL(value as number) : String(value))
      inputRef.current?.blur()
      return
    }

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      commit(e.currentTarget.value)

      const cells = Array.from(
        document.querySelectorAll<HTMLInputElement>("[data-cell]")
      )
      const idx = cells.findIndex((c) => c === inputRef.current)
      const delta = e.key === "Tab" && e.shiftKey ? -1 : 1
      const next = cells[idx + delta]
      if (next) {
        next.focus()
      } else {
        inputRef.current?.blur()
      }
    }
  }

  return (
    <input
      ref={inputRef}
      data-cell={cellId}
      value={display}
      placeholder={placeholder}
      onChange={(e) => setDisplay(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full bg-transparent outline-none border-none text-sm font-mono tabular-nums",
        "focus:bg-accent/10 focus:ring-1 focus:ring-accent/40 rounded-sm px-2 py-0.5",
        "placeholder:text-muted-foreground/40 transition-colors",
        align === "right" && "text-right",
        className
      )}
    />
  )
}
