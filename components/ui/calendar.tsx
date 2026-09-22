"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-card p-3 rounded-2xl border border-border/80 shadow-lg shadow-purple-950/5",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 aria-disabled:opacity-50 p-0 select-none rounded-lg",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 aria-disabled:opacity-50 p-0 select-none rounded-lg",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 w-full px-8 font-semibold text-sm",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative border border-border/80 rounded-lg bg-background px-2 py-1 text-xs",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-bold text-foreground text-sm",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex justify-between", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-semibold text-[0.75rem] uppercase tracking-wider text-center select-none py-1",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2 justify-between", defaultClassNames.week),
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm flex items-center justify-center font-medium rounded-lg hover:bg-primary/10 transition-colors select-none",
          defaultClassNames.day
        ),
        today: cn(
          "bg-primary/20 text-primary font-bold rounded-lg",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground/40",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }: any) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }: any) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
