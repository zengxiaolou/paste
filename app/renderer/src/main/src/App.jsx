import styled from 'styled-components';
import React from 'react';
import { Header } from './Header';

function App() {
  return (
    <Container>
      <Header />
    </Container>
  );
}

const Container = styled.div`
  background-color: rgba(41, 41, 42, 0.9);
  width: 100%;
  height: 98vh;
`;

export default App;
