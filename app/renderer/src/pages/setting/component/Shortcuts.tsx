import React from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Input, Space } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Item, Label } from './CItem';

export const Shortcuts = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Space>{t('shortcuts setting')}</Space>
      <Item>
        <Label>Activate ECM:</Label>
        <Input />
      </Item>
      <Item>
        <Label>Select Previous List:</Label>
        <Input />
      </Item>
      <Item>
        <Label>Select Next List:</Label>
        <Input />
      </Item>
      <Item>
        <Label>Quick Paste:</Label>
        <Input />
      </Item>
    </Wrapper>
  );
};
