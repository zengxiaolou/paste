import React from 'react';
import styled from 'styled-components';
import { Input, Popover, Space } from '@arco-design/web-react';
import { IconSettings } from '@arco-design/web-react/icon';
import {useTranslation} from "react-i18next";

export const Header = () => {
  const {t} = useTranslation();
  return (
    <Wrapper>
      <Space style={{ width: '80%' }}>
        <Popover content="固定">
          <Fixed>📌</Fixed>
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

const Fixed = styled.div`
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
