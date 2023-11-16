import styled from 'styled-components';
import React, { FC } from 'react';
import { General } from './component/General';
import { TabKey } from './const';
import { Shortcuts } from './component/Shortcuts';
import { Advanced } from './component/Advanced';
import { About } from '@/pages/setting/component/About';

interface props {
  currentTab: TabKey;
}

const TabsMap: Record<TabKey, React.ReactNode> = {
  general: <General />,
  shortcuts: <Shortcuts />,
  advanced: <Advanced />,
  about: <About />,
};

export const Body: FC<props> = ({ currentTab }) => {
  return <Wrapper>{TabsMap[currentTab]}</Wrapper>;
};

const Wrapper = styled.div`
  padding-top: 32px;
  background-color: #2a2b2c;
  display: flex;
  justify-content: center;
  flex: 1;
  color: cornsilk;
`;
