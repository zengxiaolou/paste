import { Button, Card, Space, Tabs, Notification } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';

const TabPane = Tabs.TabPane;
const defaultSize = 30;
export const Body = () => {
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  // useEffect(() => {
  //   Notification.error({ content: 'aaaa' });
  //   window.ipc.getData();
  // }, []);

  // useEffect(() => {
  //   const handleDataResponse = (data: any) => {
  //     console.log(data); // 在控制台打印从主进程接收到的数据
  //     // 处理接收到的数据...
  //     setPage(page + 1);
  //   };
  //
  //   window.ipc.onData(handleDataResponse);
  //
  //   // // 清除监听器以避免内存泄漏
  //   // return () => {
  //   //   window.ipc.removeDataListener(handleDataResponse);
  //   // };
  // }, []);

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
