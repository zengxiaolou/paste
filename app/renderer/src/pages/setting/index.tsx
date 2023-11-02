import React, { useState } from 'react';
import { Header } from './Header';
import { Body } from './Body';
import styled from 'styled-components';
import { Divider } from '@arco-design/web-react';
import { TabKey } from './const';

export const Settings = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('general');
  return (
    <Wrapper>
      <Header onSelect={setCurrentTab} />
      <Divider style={{ margin: 0, color: 'black' }} />
      <Body currentTab={currentTab} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
