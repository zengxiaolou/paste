import styled from 'styled-components';
import React from 'react';
import { Header } from './Header';
import '@arco-design/web-react/dist/css/arco.css';
import { Body } from './Body';
import { Footer } from './Footer';

function App() {
  return (
    <Container>
      <Header />
      <BodyContainer>
        <Body />
      </BodyContainer>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background-color: rgba(41, 41, 42, 0.8);
  backdrop-filter: blur(40px);
  width: 100%;
  height: 98vh;
  display: flex;
  flex-direction: column;
`;
const BodyContainer = styled.div`
  flex-grow: 1;
`;

export default App;
