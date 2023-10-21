import styled from 'styled-components';
import React from 'react';
import { Header } from './Header';
import '@arco-design/web-react/dist/css/arco.css';
import { Body } from './Body';
import { Layout } from '@arco-design/web-react';
import { Footer } from './Footer';
const { Header: AHeader, Content } = Layout;

function App() {
  return (
    <Container>
      <FixedHeader>
        <Header />
      </FixedHeader>
      <Content>
        <Body />
      </Content>
      <Footer />
    </Container>
  );
}

const Container = styled('Layout')`
  background-color: rgba(41, 41, 42);
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

export default App;
