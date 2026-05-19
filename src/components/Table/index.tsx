"use client"

import { ArrowUpIcon, CaretRightIcon } from "@phosphor-icons/react"
import React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { Group } from "react-aria-components/Group"
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableBody as AriaTableBody,
  Button,
  type CellProps,
  Collection,
  type ColumnProps,
  ColumnResizer,
  ResizableTableContainer,
  type RowProps,
  type TableHeaderProps,
  type TableProps as AriaTableProps,
  useTableOptions,
  type TableBodyProps
} from "react-aria-components/Table"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { composeTailwindRenderProps } from "@/utils"
import { Checkbox } from "../Checkbox"

interface TableProps extends Omit<AriaTableProps, "className"> {
  className?: string
}

export function Table(props: TableProps) {
  return (
    <ResizableTableContainer
      className={twMerge(
        "w-full max-h-[320px] overflow-auto scroll-pt-[2.281rem] relative rounded-3xl border border-border bg-background shadow-sm",
        props.className
      )}
      onScroll={props.onScroll}
    >
      <AriaTable
        {...props}
        className="box-border border-separate border-spacing-0 overflow-hidden has-[>[data-empty]]:h-full"
        data-slot="table"
      />
    </ResizableTableContainer>
  )
}

const columnStyles = tv({
  base: "focus-visible:ring-ring/30 box-border flex h-5 flex-1 items-center gap-1 overflow-hidden px-2 outline-none focus-visible:ring-2"
})

const resizerStyles = tv({
  base: "resizing:bg-primary forced-colors:resizing:bg-[Highlight] resizing:w-[2px] resizing:pl-[7px] bg-border focus-visible:ring-ring/30 box-content h-5 w-px translate-x-[8px] cursor-col-resize rounded-sm bg-clip-content px-[8px] py-1 -outline-offset-2 outline-none focus-visible:ring-2 forced-colors:bg-[ButtonBorder]"
})

export function Column(props: ColumnProps) {
  return (
    <AriaColumn
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "box-border h-1 [&:hover]:z-20 focus-within:z-20 text-start text-xs font-medium text-muted-foreground cursor-default outline-none"
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center">
            <Group className={columnStyles} role="presentation" tabIndex={-1}>
              <span className="truncate">{children}</span>
              {allowsSorting && (
                <span
                  className={`flex size-4 items-center justify-center transition ${
                    sortDirection === "descending" ? "rotate-180" : ""
                  }`}
                >
                  {sortDirection && (
                    <ArrowUpIcon
                      aria-hidden
                      className="text-muted-foreground size-4 forced-colors:text-[ButtonText]"
                    />
                  )}
                </span>
              )}
            </Group>
            {!props.width && <ColumnResizer className={resizerStyles} />}
          </div>
        )
      )}
    </AriaColumn>
  )
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
  const { allowsDragging, selectionBehavior, selectionMode } = useTableOptions()

  return (
    <AriaTableHeader
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "sticky top-0 z-10 bg-muted/60 border-b border-b-border rounded-t-3xl forced-colors:bg-[Canvas]"
      )}
      data-slot="table-header"
    >
      {allowsDragging && <Column />}
      {selectionBehavior === "toggle" && (
        <AriaColumn
          className="box-border cursor-default p-2 text-start text-sm font-semibold outline-none"
          minWidth={36}
          width={36}
        >
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={props.columns}>{props.children}</Collection>
    </AriaTableHeader>
  )
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      className="empty:text-center empty:text-sm empty:italic"
      data-slot="table-body"
    />
  )
}

const rowStyles = tv({
  base: "group/row text-foreground hover:bg-muted pressed:bg-muted/80 selected:bg-accent selected:text-accent-foreground focus-visible:ring-ring/30 border-b-border relative cursor-default border-b text-sm -outline-offset-2 outline-none select-none last:rounded-b-3xl last:border-b-0 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
})

export function Row<T extends object>({
  children,
  columns,
  id,
  ...otherProps
}: RowProps<T>) {
  const { allowsDragging, selectionBehavior } = useTableOptions()

  return (
    <AriaRow
      id={id}
      {...otherProps}
      className={rowStyles}
      data-slot="table-row"
    >
      {allowsDragging && (
        <Cell>
          <Button slot="drag">≡</Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  )
}

const cellStyles = tv({
  base: "group-selected/row:border-(--selected-border) border-b-border [--selected-border:theme(colors.accent/50%)] focus-visible:ring-ring/30 box-border truncate border-b p-2 -outline-offset-2 outline-none [-webkit-tap-highlight-color:transparent] group-last/row:border-b-0 focus-visible:ring-2"
})

const expandButton = tv({
  base: "focus-visible:ring-ring/30 shrink-0 cursor-default border-0 bg-transparent p-0 pr-1 align-middle outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2",
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

export function Cell(props: CellProps) {
  return (
    <AriaCell
      {...props}
      className={cellStyles}
      data-slot="table-cell"
      style={({ hasChildItems, isTreeColumn, level }) => ({
        paddingInlineStart: isTreeColumn
          ? 4 + (hasChildItems ? 0 : 20) + (level - 1) * 16
          : undefined
      })}
    >
      {composeRenderProps(
        props.children,
        (children, { hasChildItems, isDisabled, isExpanded, isTreeColumn }) => (
          <>
            {hasChildItems && isTreeColumn && (
              <Button className={expandButton({ isDisabled })} slot="chevron">
                <CaretRightIcon
                  aria-hidden
                  className={chevron({ isExpanded })}
                />
              </Button>
            )}
            {children}
          </>
        )
      )}
    </AriaCell>
  )
}
