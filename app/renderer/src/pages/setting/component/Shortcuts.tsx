import React, { ChangeEvent, useEffect, useState } from 'react';
import { Wrapper } from '@/component/Wrapper';
import { Input, Message, Space } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Item, Label } from './CItem';
import styled from 'styled-components';
import { IconClose } from '@arco-design/web-react/icon';
import { ShortcutAction, StoreKey } from '@/types/enum';
import { useStorePrefix } from '@/hooks/useStorePrefix';
import { keyToIcon, specialCharacters } from '@/pages/setting/component/const';
import useResizeWindow from '@/hooks/useResizeWindow';

export const Shortcuts = () => {
  const [active, setActive] = useState<string | undefined>();
  const [prevValue, setPrevValue] = useState<string | undefined>();
  const [nextValue, setNextValue] = useState<string | undefined>();
  const [pasteValue, setPasteValue] = useState<string | undefined>();
  const [allShortcuts, setAllShortcuts] = useState<string[]>([]);
  const { t } = useTranslation();
  const initialValues = useStorePrefix('shortcut');
  useResizeWindow(400);

  const isValidCombination = (cur: string) => {
    const parts = cur.replace('KEY', '').split('+');
    const hasModifier = parts.some(part => ['Ctrl', 'Shift', 'Alt', 'Command'].includes(part));
    const hasCharacter = parts.some(part => {
      return (
        part.match(/^[a-zA-Z0-9]$/) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(part) ||
        specialCharacters.includes(part)
      );
    });
    return hasModifier && hasCharacter;
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    key: string,
    method: (v: string) => void,
    old?: string
  ) => {
    e.preventDefault();
    const invalidKeys = ['Tab', 'CapsLock', 'Enter', 'Backspace', 'Insert', 'Escape'];
    let keys = [];

    if (!invalidKeys.includes(e.code)) {
      if (e.getModifierState('Control')) keys.push('Ctrl');
      if (e.getModifierState('Shift')) keys.push('Shift');
      if (e.getModifierState('Alt')) keys.push('Alt');
      if (e.getModifierState('Meta')) keys.push('Command');
      if (e.code.match(/^Key[A-Z]$/) || e.code.match(/^Digit[0-9]$/) || e.code.match(/^F[0-9]+$/)) {
        keys.push(e.code.toLocaleUpperCase());
      }
      if (specialCharacters.includes(e.code) || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        keys.push(e.code);
      }

      const validModifierCombination = isValidCombination(keys.join('+'));
      if (validModifierCombination) {
        const cur = keys.join('+').replace('KEY', '');
        if (!allShortcuts.some(shortcut => shortcut === cur)) {
          method(cur);
          setAllShortcuts(prevState => {
            const newShortcuts = prevState.filter(shortcut => shortcut !== old);
            return [...newShortcuts, cur];
          });
          await window.ipc.changeShortcuts(key, ShortcutAction.ADD, cur);
        } else {
          Message.error(t('The shortcut key is occupied'));
        }
      }
    }
  };

  const handleDeleteShortcut = async (shortcut: string, method: (value: string | undefined) => void, key: string) => {
    setAllShortcuts(allShortcuts.filter(item => item !== shortcut));
    method(undefined);
    await window.ipc.changeShortcuts(key, ShortcutAction.DELETE, shortcut);
  };
  const showShortcut = (value?: string) => {
    if (!value) {
      return '';
    }
    return value
      .split('+')
      .map((boardKey: string) => keyToIcon[boardKey] || boardKey)
      .join('');
  };
  const handleSuffix = (method: (value: string | undefined) => void, key: string, value?: string) => {
    if (!value) {
      return <div />;
    }
    return <IconClose style={{ cursor: 'pointer' }} onClick={() => handleDeleteShortcut(value, method, key)} />;
  };

  const handlePaste = async (event: ChangeEvent<HTMLSelectElement>) => {
    setPasteValue(event.target.value);
    await window.ipc.changeShortcuts(StoreKey.SHORTCUT_PASTE, ShortcutAction.ADD, event.target.value);
  };

  const handleRestShortcut = async () => {
    const res = await window.ipc.resetShortcuts();
    if (res) {
      setActive('Shift+Command+X');
      setPasteValue('Command');
      setPrevValue('Shift+Command+[');
      setNextValue('Shift+Command+]');
    }
  };

  useEffect(() => {
    setAllShortcuts([...Object.values(initialValues)]);
    setActive(initialValues?.[StoreKey.SHORTCUT_ACTION]);
    setPrevValue(initialValues?.[StoreKey.SHORTCUT_PREVIOUS]);
    setNextValue(initialValues?.[StoreKey.SHORTCUT_NEXT]);
    setPasteValue(initialValues?.[StoreKey.SHORTCUT_PASTE]);
  }, [initialValues]);

  return (
    <Wrapper>
      <Space style={{ marginBottom: 16 }}>{t('shortcuts setting')}</Space>
      <Item>
        <ULabel>{t('Activate ECM')}:</ULabel>
        <UInput
          value={showShortcut(active)}
          onKeyDown={event => handleKeyDown(event, StoreKey.SHORTCUT_ACTION, setActive, active)}
          placeholder={t('Record Shortcut')}
          suffix={handleSuffix(setActive, StoreKey.SHORTCUT_ACTION, active)}
        />
      </Item>
      <Item>
        <ULabel>{t('Select Previous List')}:</ULabel>
        <UInput
          value={showShortcut(prevValue)}
          onKeyDown={event => handleKeyDown(event, StoreKey.SHORTCUT_PREVIOUS, setPrevValue, prevValue)}
          placeholder={t('Record Shortcut')}
          suffix={handleSuffix(setPrevValue, StoreKey.SHORTCUT_PREVIOUS, prevValue)}
        />
      </Item>
      <Item>
        <ULabel>{t('Select Next List')}:</ULabel>
        <UInput
          value={showShortcut(nextValue)}
          onKeyDown={event => handleKeyDown(event, StoreKey.SHORTCUT_NEXT, setNextValue, nextValue)}
          placeholder={t('Record Shortcut')}
          suffix={handleSuffix(setNextValue, StoreKey.SHORTCUT_NEXT, nextValue)}
        />
      </Item>
      <Item>
        <ULabel>{t('Quick Paste')}:</ULabel>
        <select value={pasteValue} onChange={handlePaste}>
          <option value="command">{t('Hold Command Key')}</option>
          <option value="alt">{t('Hold Option Key')}</option>
          <option value="ctrl">{t('Hold Control Key')}</option>
        </select>
      </Item>

      <Item>
        <ULabel />
        <button onClick={handleRestShortcut}>{t('reset shortcut')}</button>
      </Item>
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
