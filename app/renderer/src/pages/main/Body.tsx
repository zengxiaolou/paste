import { BackTop, Spin, Tabs } from '@arco-design/web-react';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { debounce } from '../../utils/func';
import { ClipboardDataQuery, ClipData } from '../../types/type';
import { Context } from './Context';
import { ContentCard } from './component/ContentCard';
import { DataTypes } from '../../types/enum';

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
      title: t('Today'),
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
  const [activeCard, setActiveCard] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<string | undefined>('all');
  const [loading, setLoading] = useState<boolean>(false);

  const { search, deletedRecord } = useContext(Context);

  const isFetching = useRef(false);
  const { t } = useTranslation();

  const tabs = createTabs(t);
  const getData = async (queryData: ClipboardDataQuery) => {
    if (query.page === 1) {
      setData([]);
    }
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
    data &&
      setData((prevData: any) =>
        prevData ? [data, ...prevData.filter((item: ClipData) => item?.id !== data?.id)] : [data]
      );
  };
  const handleClipboardDataDebounced = debounce(handleClipboardData, 100);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        setActiveCard(prevIndex => (prevIndex + 1) % data.length);
        event.preventDefault();
      }
      if (event.ctrlKey && event.key === 'p') {
        setActiveCard(prevIndex => (prevIndex - 1 + data.length) % data.length);
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data.length]);

  return (
    <CTabs type="rounded" defaultActiveTab="all" activeTab={activeTab} onChange={handleChangeTab}>
      {tabs.map(item => (
        <TabPane title={t(item.title)} key={item.key}>
          <BodyContainer onScroll={handleScroll} id="top">
            <Spin loading={loading} block dot size={16} style={{ height: '100%' }}>
              {data?.map((v: ClipData, index: number) => (
                <ContentCard
                  key={index}
                  index={index}
                  data={v}
                  onClick={setActiveCard}
                  activeCard={activeCard}
                  onDelete={() => setData(prevData => prevData.filter(value => value.id !== v.id))}
                />
              ))}
              <UBackTop visibleHeight={40} target={() => document.getElementById('top') || document.body} />
            </Spin>
          </BodyContainer>
        </TabPane>
      ))}
    </CTabs>
  );
});

const CTabs = styled(Tabs)`
  margin: 8px 16px;
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

const UBackTop = styled(BackTop)`
  position: fixed;
  bottom: 10px;
  right: 30px;
  .arco-backtop-button {
    background-color: #2b2c2d;
  }
`;
