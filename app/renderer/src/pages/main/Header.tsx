import React from 'react';
import styled from 'styled-components';
import { Input, Popover, Space } from '@arco-design/web-react';
import { IconPushpin, IconSettings } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import { Context } from './Context';

interface FixedProps {
  is_fixed: number;
  onClick: () => void;
}

export const Header = () => {
  const [fixed, setFixed] = React.useState(0);

  const { search, setSearch } = React.useContext(Context);

  const { t } = useTranslation();
  const handleFixed = async () => {
    const res = await window.ipc.toggleAlwaysOnTop();

    res && fixed === 0 && setFixed(1);
    res && fixed === 1 && setFixed(0);
  };
  return (
    <Wrapper>
      <Space style={{ width: '80%' }}>
        <Popover content={fixed ? t('Remove from top') : t('On Top')}>
          <Fixed is_fixed={fixed} onClick={handleFixed} />
        </Popover>
        <Search placeholder={t('Type to Search ')} value={search} onChange={setSearch} allowClear />
      </Space>
      <Space>
        <Settings />
      </Space>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px 0 16px;
`;

const Settings = styled(IconSettings)`
  color: #a5a6a6;
  cursor: pointer;
  font-size: 20px;
`;

const Fixed = styled(IconPushpin)<FixedProps>`
  color: ${props => (props.is_fixed === 1 ? 'red' : '#a5a6a6')};
  cursor: pointer;
  font-size: 20px;
`;

const Search = styled(Input.Search)`
  margin-left: 16px;
  width: calc(100vw - 120px);
  .arco-input-group > .arco-input-inner-wrapper {
    border-radius: 15px;
  }
`;
