import styled from 'styled-components';
import React from 'react';

export const Footer = () => {
  return <FooterContainer>© 2023 My Website. All rights reserved.</FooterContainer>;
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
`;
