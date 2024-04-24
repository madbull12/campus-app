'use client';

import React, { useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn, withRef } from '@udecode/cn';
import {
  comboboxActions,
  ComboboxContentItemProps,
  ComboboxContentProps,
  ComboboxProps,
  useActiveComboboxStore,
  useComboboxContent,
  useComboboxContentState,
  useComboboxControls,
  useComboboxItem,
  useComboboxSelectors,
} from '@udecode/plate-combobox';
import {
  useEditorRef,
  useEditorSelector,
  useEventEditorSelectors,
  usePlateSelectors,
} from '@udecode/plate-common';
import {
  createVirtualRef,
  getBoundingClientRect,
} from '@udecode/plate-floating';

export const ComboboxItem = withRef<'div', ComboboxContentItemProps>(
  ({ combobox, index, item, onRenderItem, className, ...rest }, ref) => {
    const { props } = useComboboxItem({ item, index, combobox, onRenderItem });

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-9 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          'hover:bg-neutral-100 hover:text-neutral-900 data-[highlighted=true]:bg-neutral-100 data-[highlighted=true]:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:data-[highlighted=true]:bg-neutral-800 dark:data-[highlighted=true]:text-neutral-50',
          className
        )}
        {...props}
        {...rest}
      />
    );
  }
);

export function ComboboxContent(props: ComboboxContentProps) {
  const {
    component: Component,
    items,
    portalElement,
    combobox,
    onRenderItem,
  } = props;

  const editor = useEditorRef();

  const filteredItems = useComboboxSelectors.filteredItems();
  const activeComboboxStore = useActiveComboboxStore()!;

  const state = useComboboxContentState({ items, combobox });
  const { menuProps, targetRange } = useComboboxContent(state);

  const virtualRef = createVirtualRef(editor, targetRange ?? undefined, {
    fallbackRect: getBoundingClientRect(editor, editor.selection!),
  });

  return (
    <Popover.Root open>
      <Popover.PopoverAnchor virtualRef={virtualRef} />

      <Popover.Portal container={portalElement}>
        <Popover.Content
          {...menuProps}
          sideOffset={5}
          side='bottom'
          align='start'
          className={cn(
            'z-[500] m-0 max-h-[288px] w-[300px] overflow-scroll rounded-md bg-white p-0 shadow-md dark:bg-neutral-950'
          )}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          {Component ? Component({ store: activeComboboxStore }) : null}

          {filteredItems.map((item, index) => (
            <ComboboxItem
              key={item.key}
              item={item}
              combobox={combobox}
              index={index}
              onRenderItem={onRenderItem}
            />
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function Combobox({
  id,
  trigger,
  searchPattern,
  onSelectItem,
  controlled,
  maxSuggestions,
  filter,
  sort,
  disabled: _disabled,
  ...props
}: ComboboxProps) {
  const storeItems = useComboboxSelectors.items();
  const disabled =
    _disabled ?? (storeItems.length === 0 && !props.items?.length);

  const focusedEditorId = useEventEditorSelectors.focus?.();
  const combobox = useComboboxControls();
  const activeId = useComboboxSelectors.activeId();
  const selectionDefined = useEditorSelector(
    (editor) => !!editor.selection,
    []
  );
  const editorId = usePlateSelectors().id();

  useEffect(() => {
    comboboxActions.setComboboxById({
      id,
      trigger,
      searchPattern,
      controlled,
      onSelectItem,
      maxSuggestions,
      filter,
      sort,
    });
  }, [
    id,
    trigger,
    searchPattern,
    controlled,
    onSelectItem,
    maxSuggestions,
    filter,
    sort,
  ]);

  if (
    !combobox ||
    !selectionDefined ||
    focusedEditorId !== editorId ||
    activeId !== id ||
    disabled
  ) {
    return null;
  }

  return <ComboboxContent combobox={combobox} {...props} />;
}
