import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface DialogLayoutProps {
  open: boolean;
  onClose: (open: boolean) => void;
  header: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const DialogLayout: React.FC<DialogLayoutProps> = ({
  open,
  onClose,
  header,
  description,
  children,
  footer,
}) => {
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl md:text-2xl font-bold'>
            {header}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
