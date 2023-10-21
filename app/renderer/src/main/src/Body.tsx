import { Button, Card, Space, Tabs, Image } from '@arco-design/web-react';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from './utils/time';
import { extractMostFrequentBackgroundColor } from './utils/string';
import { debounce } from './utils/func';
import { ClipData } from './type';
import { Context } from './Context';

const TabPane = Tabs.TabPane;
const defaultSize = 30;
export const Body = memo(() => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ClipData[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { search } = useContext(Context);

  const isFetching = useRef(false);
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const result = await window.ipc.getData(defaultSize, page);
    if (result) {
      setData(prevData => (prevData ? [...prevData, ...result] : [...result]));
      setPage(prevPage => prevPage + 1);
    }
    isFetching.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      fetchData().then();
    }
  };

  const handleClipboardData = (data: ClipData) => {
    data && setData((prevData: any) => (prevData ? [data, ...prevData] : [data]));
  };
  const handleClipboardDataDebounced = debounce(handleClipboardData, 100);

  useEffect(() => {
    fetchData().then();
  }, [fetchData]);

  useEffect(() => {
    window.ipc.onClipboardData(handleClipboardDataDebounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search) {
        const result = await window.ipc.searchContent(search);
        setData(result || []);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchData]);

  return (
    <CTabs type="rounded" defaultActiveTab="all" showAddButton editable={true} addButton={<Button>添加</Button>}>
      <TabPane title={t('All')} key="all">
        <BodyContainer onScroll={handleScroll}>
          {data?.map((v: ClipData, index: number) => (
            <UCard
              key={index}
              isActive={activeCard === index}
              bgColor={extractMostFrequentBackgroundColor(v.content)}
              onClick={() => setActiveCard(index)}
              onDoubleClick={() => window.ipc.requestPaste(v.type, v.content, v.id)}
            >
              <Container>
                {v.type === 'html' ? (
                  <Space>
                    <Html dangerouslySetInnerHTML={{ __html: v?.content }} />
                  </Space>
                ) : (
                  <ImageContainer>
                    <CenteredImage src={v?.content} loader={true} height={60} />
                  </ImageContainer>
                )}
                <Space>{v?.created_at && formatDateTime(v?.created_at)}</Space>
              </Container>
            </UCard>
          ))}
        </BodyContainer>
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
});

const CTabs = styled(Tabs)`
  margin: 16px;
  height: 100%;
  top: 60px;
`;

const BodyContainer = styled.div`
  overflow-y: scroll;
  height: calc(100vh - 130px);
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #2b2c2d;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #78797a;
    border-radius: 10px;
    background-clip: content-box;
    border: 2px solid transparent;
  }

  &::-webkit-scrollbar-button,
  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track-piece,
  &::-webkit-scrollbar-corner,
  &::-webkit-resizer {
    display: none;
  }
`;

const UCard = styled(Card)<{ isActive?: boolean; bgColor?: string }>`
  border-radius: 15px;
  margin-bottom: 8px;
  margin-right: 8px;
  .arco-card-body {
    padding: 8px 16px;
  }
  align-content: center;
  border: ${props => (props.isActive ? '1px solid #007AFF' : 'none')};
  background-color: ${props => props.bgColor || 'defaultBgColor'};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Html = styled.div`
  height: 60px;
  max-height: 60px;
  max-width: 900px;
  overflow: hidden;
  align-content: center;
`;

const ImageContainer = styled.div`
  height: 70px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CenteredImage = styled(Image)`
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  display: block;
`;
