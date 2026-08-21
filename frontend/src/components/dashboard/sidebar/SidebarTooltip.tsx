import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

type SidebarTooltipProps = {
  label: string;
  disabled?: boolean;
  children: ReactNode;
};

export function SidebarTooltip({ label, disabled = false, children }: SidebarTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={12}
          align="center"
          className="z-[60] rounded-input border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text shadow-hover"
        >
          {label}
          <Tooltip.Arrow className="fill-surface" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}