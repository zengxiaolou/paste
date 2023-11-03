import styled from 'styled-components';
import React, { FC } from 'react';
import { General } from './component/General';
import { TabKey } from './const';
import { Shortcuts } from './component/Shortcuts';
import { Advanced } from './component/Advanced';

interface props {
  currentTab: TabKey;
}

const TabsMap: Record<TabKey, React.ReactNode> = {
  general: <General />,
  shortcuts: <Shortcuts />,
  advanced: <Advanced />,
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
