"use client"

import * as React from "react"

// Simplified chart components for compatibility
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<string, string>
  }
}

export function ChartContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function ChartTooltip({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function ChartTooltipContent({
  active,
  payload,
  className,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; [key: string]: unknown }>
  className?: string
}) {
  return active && payload && payload.length ? (
    <div className={className}>
      {payload.map((entry, index) => (
        <div key={index}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  ) : null
}

export function ChartLegend({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function ChartLegendContent({
  className,
}: {
  className?: string
}) {
  return <div className={className}>Legend</div>
}