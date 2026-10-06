import { forwardRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  tooltip: string;
  children: ReactNode;
  className?: string;
  variant?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltip, children, className, variant, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            {...props}
            variant={variant ? variant : "outline"}
            className={cn("hover:cursor-pointer", className)}
          >
            {children}
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent className="z-2000">{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);

IconButton.displayName = "IconButton";
