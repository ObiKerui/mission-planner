import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FlowNodeDialogProps = {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
};

export function FlowNodeDialog({
  trigger,
  title,
  children,
}: FlowNodeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="nodrag cursor-pointer" onClick={() => setOpen(true)}>
        {trigger}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[90vh] min-w-[60vw] flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
