import styled from 'styled-components';
import React, { useContext } from 'react';
import { Context } from '@/pages/main/Context';

export const Footer = () => {
  const { total } = useContext(Context);
  return <FooterContainer>total: {total}</FooterContainer>;
};

const FooterContainer = styled.div`
  background-color: rgba(41, 41, 42, 0.9);
  color: white;
  text-align: center;
  position: absolute;
  bottom: -66px;
  left: 0;
  right: 0;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
