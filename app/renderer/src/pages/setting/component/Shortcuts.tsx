import React from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Input, Message, Space } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Item, Label } from './CItem';
import styled from 'styled-components';
import { IconClose } from '@arco-design/web-react/icon';

export const Shortcuts = () => {
  const [active, setActive] = React.useState<string | undefined>();
  const [allShortcuts, setAllShortcuts] = React.useState<string[]>([]);
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const invalidKeys = ['Tab', 'CapsLock', 'Enter', 'Backspace', 'Insert', 'Escape'];
    let keys = [];

    if (!invalidKeys.includes(e.key)) {
      e.preventDefault();
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Cmd');
      if ((e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) || /^F\d+$/.test(e.key)) {
        keys.push(e.key.toUpperCase());
      }
      const cur = keys.join('+');
      if (!allShortcuts.includes(cur)) {
        setActive(cur);
        setAllShortcuts([...allShortcuts, cur]);
      } else {
        Message.error('快捷键已被占用');
      }
    }
  };

  const handleDeleteShortcut = (shortcut: string) => {
    setAllShortcuts(allShortcuts.filter(item => item !== shortcut));
    if (active === shortcut) {
      setActive(undefined);
    }
  };

  return (
    <Wrapper>
      <Space style={{ marginBottom: 16 }}>{t('shortcuts setting')}</Space>
      <Item>
        <ULabel>{t('Activate ECM')}:</ULabel>
        <UInput
          value={active}
          onKeyDown={handleKeyDown}
          placeholder={t('Record Shortcut')}
          suffix={
            <Space>
              <IconClose style={{ cursor: 'pointer' }} onClick={() => handleDeleteShortcut(active as string)} />
            </Space>
          }
        />
      </Item>
      <Item>
        <ULabel>{t('Select Previous List')}:</ULabel>
        <UInput />
      </Item>
      <Item>
        <ULabel>{t('Select Next List')}:</ULabel>
        <UInput />
      </Item>
      <Item>
        <ULabel>{t('Quick Paste')}:</ULabel>
        <UInput />
      </Item>
    </Wrapper>
  );
};

const ULabel = styled(Label)`
  width: 160px;
`;

const UInput = styled(Input)`
  width: 160px;
  text-align: center;
  .arco-input {
    padding: 0;
    border-radius: 15px;
  }
  .arco-input-group-wrapper .arco-input-inner-wrapper {
    border-radius: 15px;
  }
`;
