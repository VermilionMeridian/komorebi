"use client"

import React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import {
  ToggleButton as RACToggleButton,
  type ToggleButtonProps
} from "react-aria-components/ToggleButton"
import { tv } from "tailwind-variants"

const styles = tv({
  base: "group/toggle-button focus-visible:border-ring focus-visible:ring-ring/30 relative inline-flex h-9 cursor-default items-center justify-center gap-1.5 rounded-4xl border border-transparent bg-clip-padding px-3 text-sm font-medium whitespace-nowrap transition-all forced-color-adjust-none outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    isSelected: {
      false:
        "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] pressed:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_10%)] forced-colors:bg-[ButtonFace]! forced-colors:text-[ButtonText]!",
      true: "bg-primary text-primary-foreground hover:bg-primary/80 pressed:bg-primary/70 forced-colors:bg-[Highlight]! forced-colors:text-[HighlightText]!"
    }
  }
})

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <RACToggleButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className })
      )}
      data-slot="toggle-button"
    />
  )
}
