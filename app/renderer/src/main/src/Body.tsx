import { Button, Card, Space, Tabs, Image } from '@arco-design/web-react';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from './utils/time';
import { extractMostFrequentBackgroundColor } from './utils/string';
import { debounce } from './utils/func';
import { ClipData } from './type';
import { Context } from './Context';
import { ContextMenu } from './component/ContextMenu';

const TabPane = Tabs.TabPane;
const defaultSize = 30;
export const Body = memo(() => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ClipData[]>([]);
  const [activeCard, setActiveCard] = useState<number | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [activeId, setActiveId] = useState<number | undefined>(undefined);

  const { search, deletedId } = useContext(Context);

  const isFetching = useRef(false);
  const { t } = useTranslation();

  const fetchData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const result = await window.ipc.getData(defaultSize, page);
    if (result && result.length > 0) {
      setData(prevData => (prevData ? [...prevData, ...result] : [...result]));
      setPage(page + 1);
    }
    isFetching.current = false;
  };

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

  const handleContextMenu = (event: any, id: number) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY });
    setActiveId(id);
  };

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;
    return (
      <div style={{ position: 'absolute', top: `${contextMenu.y - 80}px`, left: `${contextMenu.x - 20}px` }}>
        <ContextMenu id={activeId} />
      </div>
    );
  };

  const handleClick = (index: number) => {
    setContextMenu({ ...contextMenu, visible: false });
    setActiveCard(index);
  };

  useEffect(() => {
    fetchData().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [search]);

  useEffect(() => {
    const handleBlur = () => {
      setContextMenu({
        ...contextMenu,
        visible: false,
      });
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deletedId) {
      setData(prevData => prevData && [...prevData.filter(value => value.id !== deletedId)]);
      setContextMenu({
        ...contextMenu,
        visible: false,
      });
    }
  }, [contextMenu, deletedId]);

  return (
    <CTabs type="rounded" defaultActiveTab="all" showAddButton editable={true} addButton={<Button>添加</Button>}>
      <TabPane title={t('All')} key="all">
        <BodyContainer onScroll={handleScroll}>
          {data?.map((v: ClipData, index: number) => (
            <UCard
              key={index}
              isActive={activeCard === index}
              bgColor={extractMostFrequentBackgroundColor(v.content)}
              onClick={() => handleClick(index)}
              onDoubleClick={() => window.ipc.requestPaste(v.type, v.content, v.id)}
              onContextMenu={event => handleContextMenu(event, v.id)}
            >
              <Container>
                {v.type === 'html' && (
                  <Space>
                    {v.icon && <Icon src={v?.icon} height={40} />}
                    <Html dangerouslySetInnerHTML={{ __html: v?.content }} />
                  </Space>
                )}
                {v.type === 'image' && v.icon && <Icon src={v?.icon} height={40} />}
                {v.type === 'image' && (
                  <ImageContainer>
                    <CenteredImage src={v?.content} loader={true} height={60} />
                  </ImageContainer>
                )}
                <Space>{v?.created_at && formatDateTime(v?.created_at)}</Space>
              </Container>
            </UCard>
          ))}
          {renderContextMenu()}
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
  width: 90%;
`;

const CenteredImage = styled(Image)`
  max-height: 100%;
  max-width: 90%;
  margin: auto;
  display: block;
`;

const Icon = styled(Image)``;
