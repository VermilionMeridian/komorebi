"use client"

import { CaretRightIcon } from "@phosphor-icons/react"
import React from "react"
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  Button,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps
} from "react-aria-components/Tree"
import { tv } from "tailwind-variants"
import { composeTailwindRenderProps } from "@/utils"
import { Checkbox } from "../Checkbox"

const itemStyles = tv({
  base: "group/tree-item border-border bg-background text-foreground focus-visible:ring-ring/30 hover:bg-muted pressed:bg-muted/80 selected:bg-accent selected:text-accent-foreground relative flex cursor-default border-b px-3 py-1 text-sm -outline-offset-2 outline-none select-none first:rounded-t-3xl first:border-t-0 last:rounded-b-3xl last:border-b-0 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    isDisabled: {
      true: "z-10"
    },
    isSelected: {
      false: "",
      true: "z-20 border-y-transparent"
    }
  }
})

export function Tree<T extends object>({ children, ...props }: TreeProps<T>) {
  return (
    <AriaTree
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "w-48 max-w-full overflow-auto relative rounded-3xl border border-border bg-background shadow-sm"
      )}
      data-slot="tree"
    >
      {children}
    </AriaTree>
  )
}

const expandButton = tv({
  base: "focus-visible:ring-ring/30 flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border-0 bg-transparent p-0 text-start outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2",
  variants: {
    isDisabled: {
      true: "text-muted-foreground forced-colors:text-[GrayText]"
    }
  }
})

const chevron = tv({
  base: "text-muted-foreground size-4 transition-transform duration-200 ease-in-out",
  variants: {
    isExpanded: {
      true: "rotate-90 transform"
    }
  }
})

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  title: string
}

export function TreeItem(props: TreeItemProps) {
  return (
    <AriaTreeItem
      className={itemStyles}
      data-slot="tree-item"
      textValue={props.title}
      {...props}
    >
      <AriaTreeItemContent {...props}>
        {({
          hasChildItems,
          isDisabled,
          isExpanded,
          selectionBehavior,
          selectionMode
        }) => (
          <div className="flex items-center">
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            <div className="w-[calc(calc(var(--tree-item-level)-1)*(--spacing(3)))] shrink-0" />
            {hasChildItems ? (
              <Button className={expandButton({ isDisabled })} slot="chevron">
                <CaretRightIcon
                  aria-hidden
                  className={chevron({ isExpanded })}
                />
              </Button>
            ) : (
              <div className="size-8 shrink-0" />
            )}
            {props.title}
          </div>
        )}
      </AriaTreeItemContent>
      {props.children}
    </AriaTreeItem>
  )
}
