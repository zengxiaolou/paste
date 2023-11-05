import React, { useState } from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Input, Message, Space } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Item, Label } from './CItem';
import styled from 'styled-components';
import { IconClose } from '@arco-design/web-react/icon';
import { ShortcutAction } from '../../../types/enum';

export const Shortcuts = () => {
  const [active, setActive] = useState<string | undefined>();
  const [prevValue, setPrevValue] = useState<string | undefined>();
  const [nextValue, setNextValue] = useState<string | undefined>();
  const [pasteValue, setPasteValue] = useState<string | undefined>();
  const [allShortcuts, setAllShortcuts] = useState<string[]>([]);
  const { t } = useTranslation();

  const shortcuts = [
    {
      label: t('Activate ECM'),
      placeholder: t('Record Shortcut'),
      value: active,
      method: setActive,
      key: 'shortcut:active',
    },
    {
      label: t('Select Previous List'),
      placeholder: t('Record Shortcut'),
      value: prevValue,
      method: setPrevValue,
      key: 'shortcut:previous',
    },
    {
      label: t('Select Next List'),
      placeholder: t('Record Shortcut'),
      value: nextValue,
      method: setNextValue,
      key: 'shortcut:next',
    },
    {
      label: t('Quick Paste'),
      placeholder: t('Record Shortcut'),
      value: pasteValue,
      method: setPasteValue,
      key: 'shortcut:paste',
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

      const isPasteAction = key === 'shortcut:paste';
      const validModifierCombination = isValidCombination(keys.join('+'), key);

      if (validModifierCombination) {
        const cur = keys.join('+');
        if (!allShortcuts.some(shortcut => shortcut === cur)) {
          method(cur);
          setAllShortcuts([...allShortcuts, cur]);
          await window.ipc.changeShortcuts(key, ShortcutAction.ADD, cur);
        } else {
          Message.error('快捷键已被占用');
        }
      } else if (isPasteAction) {
        Message.error('快捷粘贴操作必须只使用 Ctrl、Alt 或 Cmd 中的一个');
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
            value={item.value}
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
