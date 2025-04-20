/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';

const useConfirmDialog = () => {
  const [open, setOpen] = useQueryState(
    'confirm',
    parseAsBoolean.withDefault(false)
  );
  const [content, setContent] = useState<any>(null);

  const onOpen = (data?: any) => {
    setContent(data || null);
    setOpen(true);
  };

  const onClose = () => {
    setContent(null);
    setOpen(false);
  };

  return {
    open,
    content,
    onOpen,
    onClose,
  };
};

export default useConfirmDialog;
