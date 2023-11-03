import React from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Button, Checkbox } from '@arco-design/web-react';
import { Item, Label } from './CItem';
import i18n from '../../../i18n';

export const General = () => {
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    i18n.changeLanguage(selected);
    window.ipc.changeLanguage(selected);
  };

  return (
    <Wrapper>
      <Item>
        <Label>Launch:</Label>
        <Checkbox>Start at Login</Checkbox>
      </Item>
      <Item>
        <Label>Sound:</Label>
        <Checkbox>Enable Sound Effect</Checkbox>
      </Item>
      <Item>
        <Label>Language:</Label>
        <select style={{ borderRadius: 8, marginLeft: 4 }} onChange={handleLanguageChange}>
          <option value="zh">Simplified Chinese</option>
          <option value="en">English</option>
        </select>
      </Item>
      <Item>
        <Label>Quit:</Label>
        <Button size="small" style={{ borderRadius: 8, marginLeft: 4 }}>
          Quite ECM
        </Button>
      </Item>
    </Wrapper>
  );
};
