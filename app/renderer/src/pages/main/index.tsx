import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Header } from './Header';
import '@arco-design/web-react/dist/css/arco.css';
import { Body } from './Body';
import { Layout } from '@arco-design/web-react';
import { Footer } from '@/pages/main/Footer';
import { Provider } from '@/pages/main/Context';
import i18n from '@/i18n/index';
import useLanguage from '@/hooks/useLanguage';
const { Header: AHeader, Content } = Layout;

function ClipBoard() {
  useLanguage();
  useEffect(() => {
    window.ipc.onLanguageChange((language: string) => i18n.changeLanguage(language));
  }, []);
  return (
    <Provider>
      <Container>
        <FixedHeader>
          <Header />
        </FixedHeader>
        <Content>
          <Body />
        </Content>
        <Footer />
      </Container>
    </Provider>
  );
}

const Container = styled('Layout')`
  background-color: rgb(41, 41, 42);
  backdrop-filter: blur(100px);
  overflow: hidden;
  position: relative;
  height: 100vh;
`;

const FixedHeader = styled(AHeader)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 30px;
`;

export default ClipBoard;
