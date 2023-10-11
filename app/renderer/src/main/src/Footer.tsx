import styled from 'styled-components';
import React from 'react';

export const Footer = () => {
  return <FooterContainer>© 2023 My Website. All rights reserved.</FooterContainer>;
};

const FooterContainer = styled.div`
  background-color: #29292a;
  color: white;
  padding: 10px 0;
  text-align: center;
`;
