import { Wrapper } from '@/component/Wrapper';
import React from 'react';
import { Item, Label } from './CItem';

export const Advanced = () => {
  return (
    <Wrapper>
      <Item>
        <Label>Remove History Items:</Label>
        <select>
          <option value="1">After One Month</option>
          <option value="2">After Two Months</option>
          <option value="3">After Three Months</option>
          <option value="4">After Four Months</option>
        </select>
      </Item>
    </Wrapper>
  );
};
