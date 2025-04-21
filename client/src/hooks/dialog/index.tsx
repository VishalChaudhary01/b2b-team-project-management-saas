/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';

export const useConfirmDialog = () => {
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

export const useCreateWorkspaceDialog = () => {
  const [open, setOpen] = useQueryState(
    'new-workspace',
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export const useCreateProjectDialog = () => {
  const [open, setOpen] = useQueryState(
    'new-project',
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export const useEditProjectDialog = () => {
  const [open, setOpen] = useQueryState(
    'edit-project',
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export const useCreateTaskDialog = () => {
  const [open, setOpen] = useQueryState(
    'create-task',
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};
