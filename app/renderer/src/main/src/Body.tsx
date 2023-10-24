import { BackTop, Spin, Tabs } from '@arco-design/web-react';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { debounce } from './utils/func';
import { ClipboardDataQuery, ClipData } from './types/type';
import { Context } from './Context';
import { ContextMenu } from './component/ContextMenu';
import { ContentCard } from './component/ContentCard';
import { DataTypes } from './types/enum';

const TabPane = Tabs.TabPane;
const defaultSize = 30;

const createTabs = (t: any) => {
  return [
    {
      title: t('All'),
      key: 'all',
    },
    {
      title: t('Collect'),
      key: 'collect',
    },
    {
      title: t('ToDay'),
      key: 'today',
    },
    {
      title: t('Text'),
      key: 'text',
    },
    {
      title: t('Image'),
      key: 'image',
    },
    {
      title: t('Link'),
      key: 'link',
    },
  ];
};
export const Body = memo(() => {
  const [data, setData] = useState<ClipData[]>([]);
  const [query, setQuery] = useState<ClipboardDataQuery>({ page: 1, size: defaultSize });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [activeRecord, setActiveRecord] = useState<ClipData | undefined>(undefined);
  const [activeCard, setActiveCard] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string | undefined>('all');
  const [loading, setLoading] = useState<boolean>(false);

  const { search, deletedRecord } = useContext(Context);

  const isFetching = useRef(false);
  const { t } = useTranslation();

  const tabs = createTabs(t);

  const getData = async (queryData: ClipboardDataQuery) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    const res = await window.ipc.getData(queryData);
    if (res) {
      if (queryData.page && queryData.page > 1) {
        setData(prevData => (prevData ? [...prevData, ...res] : [...res]));
      } else {
        setData(res);
      }
      isFetching.current = false;
    }
    setLoading(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      query?.page && setQuery({ ...query, page: query?.page + 1 });
    }
  };

  const handleClipboardData = (data: ClipData) => {
    data && setData((prevData: any) => (prevData ? [data, ...prevData] : [data]));
  };
  const handleClipboardDataDebounced = debounce(handleClipboardData, 100);

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;
    return (
      <div style={{ position: 'absolute', top: `${contextMenu.y - 80}px`, left: `${contextMenu.x - 20}px` }}>
        <ContextMenu record={activeRecord} />
      </div>
    );
  };

  const handleChangeTab = (tab: string) => {
    switch (tab) {
      case 'all':
        setQuery({ page: 1, size: defaultSize });
        break;
      case 'collect':
        setQuery({ page: 1, size: defaultSize, collection: true });
        break;
      case 'today':
        setQuery({ page: 1, size: defaultSize, createdAt: new Date() });
        break;
      case 'text':
        setQuery({ page: 1, size: defaultSize, type: DataTypes.HTML });
        break;
      case 'image':
        setQuery({ page: 1, size: defaultSize, type: DataTypes.IMAGE });
        break;
      default:
        break;
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    getData(query).then();
  }, [query]);

  useEffect(() => {
    if (search) {
      setQuery({ content: search });
    } else {
      setQuery({ page: 1, size: defaultSize });
    }
  }, [search]);

  useEffect(() => {
    window.ipc.onClipboardData(handleClipboardDataDebounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (deletedRecord) {
      setData(prevData => prevData && [...prevData.filter(value => value.id !== deletedRecord.id)]);
      setContextMenu({
        ...contextMenu,
        visible: false,
      });
    }
  }, [contextMenu, deletedRecord]);

  return (
    <CTabs type="rounded" defaultActiveTab="all" activeTab={activeTab} onChange={handleChangeTab}>
      {tabs.map(item => (
        <TabPane title={t(item.title)} key={item.key}>
          <BodyContainer onScroll={handleScroll} id="top">
            <Spin loading={loading} block dot size={20}>
              {data?.map((v: ClipData, index: number) => (
                <ContentCard
                  index={index}
                  data={v}
                  onContext={setActiveRecord}
                  onClick={setActiveCard}
                  activeCard={activeCard}
                  onContextMenu={(visible, x, y) => setContextMenu({ visible: visible, x: x, y: y })}
                />
              ))}
              {renderContextMenu()}
              <BackTop
                visibleHeight={40}
                style={{ position: 'absolute' }}
                target={() => document.getElementById('top') || document.body}
              />
            </Spin>
          </BodyContainer>
        </TabPane>
      ))}
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
