import React from 'react';
import styled from 'styled-components';
import { Input, Popover, Space } from '@arco-design/web-react';
import { IconPushpin, IconSettings } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';

interface FixedProps {
  isFixed: boolean;
  onClick: () => void; // 如果你也想类型化 onClick 事件处理函数
}

export const Header = () => {
  const [fixed, setFixed] = React.useState(false);
  const { t } = useTranslation();
  const handleFixed = () => {
    window.ipc.toggleAlwaysOnTop();
    setFixed(!fixed);
  };
  return (
    <Wrapper>
      <Space style={{ width: '80%' }}>
        <Popover content={fixed ? t('Remove from top') : t('On Top')}>
          <Fixed isFixed={fixed} onClick={handleFixed} />
        </Popover>
        <Search placeholder={t('Type to Search ')} allowClear />
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
  padding: 16px;
`;

const Settings = styled(IconSettings)`
  color: #a5a6a6;
  cursor: pointer;
  font-size: 20px;
`;

const Fixed = styled(IconPushpin)<FixedProps>`
  color: ${props => (props.isFixed ? 'red' : '#a5a6a6')};
  cursor: pointer;
  font-size: 20px;
`;

const Search = styled(Input.Search)`
  margin-left: 16px;
  width: 90vw;
  .arco-input-group > .arco-input-inner-wrapper {
    border-radius: 15px;
  }
`;
