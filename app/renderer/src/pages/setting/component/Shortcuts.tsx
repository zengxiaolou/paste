import React, { useState } from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Input, Message, Space } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Item, Label } from './CItem';
import styled from 'styled-components';
import { IconClose } from '@arco-design/web-react/icon';
import { ShortcutAction, StoreKey } from '../../../types/enum';
import { useStorePrefix } from '../../../hooks/useStorePrefix';

const keyToIcon: Record<string, string> = {
  Ctrl: '⌃',
  Command: '⌘',
  Shift: '⇧',
  Alt: '⌥',
};
export const Shortcuts = () => {
  const [active, setActive] = useState<string | undefined>();
  const [prevValue, setPrevValue] = useState<string | undefined>();
  const [nextValue, setNextValue] = useState<string | undefined>();
  const [pasteValue, setPasteValue] = useState<string | undefined>();
  const [allShortcuts, setAllShortcuts] = useState<string[]>([]);
  const { t } = useTranslation();
  const initialValues = useStorePrefix('shortcut');

  const shortcuts = [
    {
      label: t('Activate ECM'),
      placeholder: t('Record Shortcut'),
      value: active || initialValues.shortcutAction,
      method: setActive,
      key: StoreKey.SHORTCUT_ACTION,
    },
    {
      label: t('Select Previous List'),
      placeholder: t('Record Shortcut'),
      value: prevValue || initialValues.shortcutPrevious,
      method: setPrevValue,
      key: StoreKey.SHORTCUT_PREVIOUS,
    },
    {
      label: t('Select Next List'),
      placeholder: t('Record Shortcut'),
      value: nextValue || initialValues.shortcutNext,
      method: setNextValue,
      key: StoreKey.SHORTCUT_NEXT,
    },
    {
      label: t('Quick Paste'),
      placeholder: t('Record Shortcut'),
      value: pasteValue || initialValues.shortcutPaste,
      method: setPasteValue,
      key: StoreKey.SHORTCUT_PASTE,
    },
  ];

  const isValidCombination = (cur: string, key: string) => {
    const parts = cur.split('+');
    const hasModifier = parts.some(part => ['Ctrl', 'Shift', 'Alt', 'Cmd'].includes(part));
    const hasCharacter = parts.some(part => {
      return (
        part.match(/^[a-zA-Z0-9]$/) ||
        ['←', '↑', '→', '↓'].includes(part) ||
        part.match(/[`~!@#$%^&*()_+\-=[\]{}\\|;:'",.<>/?]$/)
      );
    });

    if (key === 'shortcut:paste') {
      return hasModifier && parts.length === 2;
    }

    return hasModifier && hasCharacter;
  };

  const handleKeyDown = async (e: React.KeyboardEvent, key: string, method: (v: string) => void) => {
    e.stopPropagation();
    e.preventDefault();
    const invalidKeys = ['Tab', 'CapsLock', 'Enter', 'Backspace', 'Insert', 'Escape'];
    let keys = [];

    if (!invalidKeys.includes(e.key)) {
      if (e.getModifierState('Control')) keys.push('Ctrl');
      if (e.getModifierState('Shift')) keys.push('Shift');
      if (e.getModifierState('Alt')) keys.push('Alt');
      if (e.getModifierState('Meta')) keys.push('Command');
      if (
        (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) ||
        /^F\d+$/.test(e.key) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
        /[`~!@#$%^&*()_+\-=[\]{}\\|;:'",.<>/?]/.test(e.key)
      ) {
        keys.push(e.key.toUpperCase());
      }

      const isPasteAction = key === StoreKey.SHORTCUT_PASTE;
      const validModifierCombination = isValidCombination(keys.join('+'), key);

      if (validModifierCombination) {
        const cur = keys.join('+');
        if (!allShortcuts.some(shortcut => shortcut === cur)) {
          method(cur);
          setAllShortcuts([...allShortcuts, cur]);
          await window.ipc.changeShortcuts(key, ShortcutAction.ADD, cur);
        } else {
          Message.error(t('The shortcut key is occupied'));
        }
      } else if (isPasteAction) {
        Message.error(t('shortcut paste operation error message'));
      }
    }
  };

  const handleDeleteShortcut = async (shortcut: string, method: (value: string | undefined) => void, key: string) => {
    setAllShortcuts(allShortcuts.filter(item => item !== shortcut));
    method(undefined);
    await window.ipc.changeShortcuts(key, ShortcutAction.DELETE, shortcut);
  };

  return (
    <Wrapper>
      <Space style={{ marginBottom: 16 }}>{t('shortcuts setting')}</Space>
      {shortcuts.map((item, key) => (
        <Item key={key}>
          <ULabel>{item.label}:</ULabel>
          <UInput
            value={
              item.value &&
              item.value
                .split('+')
                .map((boardKey: string) => keyToIcon[boardKey] || boardKey)
                .join('')
            }
            onKeyDown={event => handleKeyDown(event, item.key, item.method)}
            placeholder={t('Record Shortcut')}
            suffix={
              item.value ? (
                <IconClose
                  style={{ cursor: 'pointer' }}
                  onClick={() => item.value && handleDeleteShortcut(item.value, item.method, item.key)}
                />
              ) : (
                <div />
              )
            }
          />
        </Item>
      ))}
    </Wrapper>
  );
};

const ULabel = styled(Label)`
  width: 160px;
`;

const UInput = styled(Input)`
  width: 160px;
  && .arco-input {
    padding: 0;
  }
`;
