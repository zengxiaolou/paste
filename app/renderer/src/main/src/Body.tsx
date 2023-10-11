import { Button, Card, Space, Tabs } from '@arco-design/web-react';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';

const TabPane = Tabs.TabPane;
export const Body = () => {
  const { t } = useTranslation();
  return (
    <CTabs type="rounded" defaultActiveTab="all" showAddButton editable={true} addButton={<Button>添加</Button>}>
      <TabPane title={t('All')} key="all">
        <UCard>
          <Container>
            <Space>图标/内容</Space>
            <Space>时间</Space>
          </Container>
        </UCard>
      </TabPane>
      <TabPane title={t('Collect')} key="collect">
        Tab 2
      </TabPane>
      <TabPane title={t('Today')} key="today">
        Tab 3
      </TabPane>
      <TabPane title={t('Text')} key="text">
        Tab 1
      </TabPane>
      <TabPane title={t('Image')} key="image">
        Tab 2
      </TabPane>
      <TabPane title={t('Link')} key="link">
        Tab 3
      </TabPane>
    </CTabs>
  );
};

const CTabs = styled(Tabs)`
  margin: 16px;
  height: 100%;
`;
const UCard = styled(Card)`
  border-radius: 10px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
