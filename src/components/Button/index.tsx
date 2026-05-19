"use client"

import { SpinnerIcon } from "@phosphor-icons/react"
import React from "react"
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps
} from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/utils"

const button = tv({
  base: "group/button focus-visible:border-ring focus-visible:ring-ring/30 relative inline-flex shrink-0 cursor-default items-center justify-center gap-1.5 overflow-hidden rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 forced-colors:outline-[Highlight] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  defaultVariants: { size: "default", variant: "default" },
  variants: {
    size: {
      "default": "h-9 px-3",
      "icon": "size-9",
      "icon-lg": "size-10",
      "icon-sm": "size-8",
      "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
      "lg": "h-10 px-4",
      "sm": "h-8 gap-1 px-3",
      "xs": "h-6 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3"
    },
    variant: {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/80 pressed:bg-primary/70",
      destructive:
        "bg-destructive/10 text-destructive hover:bg-destructive/20 pressed:bg-destructive/30 dark:bg-destructive/20 dark:hover:bg-destructive/30",
      ghost:
        "text-foreground hover:bg-muted pressed:bg-muted/80 dark:hover:bg-muted/50",
      link: "text-primary underline-offset-4 hover:underline",
      outline:
        "border-input bg-background hover:bg-muted hover:text-foreground pressed:bg-muted/80 dark:bg-input/30",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 pressed:bg-secondary/70"
    }
  }
})

export interface ButtonProps
  extends Omit<VariantProps<typeof button>, "isPending">, RACButtonProps {
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link"
}

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({
          ...renderProps,
          className,
          size: props.size,
          variant: props.variant
        })
      )}
      data-size={props.size ?? "default"}
      data-slot="button"
      data-variant={props.variant ?? "default"}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          <span
            className={cn(
              "inline-flex items-center justify-center gap-1.5",
              isPending && "opacity-0"
            )}
          >
            {children}
          </span>
          {isPending && (
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                props.variant === "default" || props.variant == null
                  ? "text-primary-foreground"
                  : props.variant === "destructive"
                    ? "text-destructive"
                    : "text-foreground"
              )}
            >
              <SpinnerIcon className="size-4 animate-spin" />
            </span>
          )}
        </>
      ))}
    </RACButton>
  )
}
