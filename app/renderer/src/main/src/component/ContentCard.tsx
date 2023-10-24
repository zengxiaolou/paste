import { extractMostFrequentBackgroundColor } from '../utils/string';
import { Card, Image, Space } from '@arco-design/web-react';
import { Collect } from './Collect';
import { formatDateTime } from '../utils/time';
import React, { FC, useState, MouseEvent } from 'react';
import styled from 'styled-components';
import { ClipData } from '../types/type';

interface props {
  index: number;
  data: ClipData;

  onContext: (value: ClipData) => void;
  onContextMenu: (visible: boolean, x: any, y: any) => void;
}

export const ContentCard: FC<props> = ({ index, data, onContext, onContextMenu }) => {
  const [activeCard, setActiveCard] = useState<number | undefined>(undefined);
  const { content, type, id, icon, created_at } = data;
  const handleClick = (index: number) => {
    onContextMenu(false, null, null);
    setActiveCard(index);
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>, record: ClipData) => {
    event.preventDefault();
    onContextMenu(true, event.pageX, event.pageY);
    onContext(record);
  };

  return (
    <UCard
      key={index}
      isActive={activeCard === index}
      bgColor={extractMostFrequentBackgroundColor(content)}
      onClick={() => handleClick(index)}
      onDoubleClick={() => window.ipc.requestPaste(type, content, id)}
      onContextMenu={(event: MouseEvent<HTMLDivElement>) => handleContextMenu(event, data)}
    >
      <Container>
        {type === 'html' && (
          <Space>
            {icon && <Icon src={icon} height={40} />}
            <Html dangerouslySetInnerHTML={{ __html: content }} />
          </Space>
        )}
        {type === 'image' && icon && <Icon src={icon} height={40} />}
        {type === 'image' && (
          <ImageContainer>
            <CenteredImage src={content} loader={true} height={60} />
          </ImageContainer>
        )}
        <Space>
          <Collect data={data} />
          {created_at && formatDateTime(created_at)}
        </Space>
      </Container>
    </UCard>
  );
};

const UCard = styled(Card)<{ isActive?: boolean; bgColor?: string }>`
  border-radius: 15px;
  margin-bottom: 8px;
  margin-right: 8px;
  .arco-card-body {
    padding: 8px 16px;
  }
  align-content: center;
  border: ${props => (props.isActive ? '1px solid #007AFF' : 'none')};
  background-color: ${props => props.bgColor || 'defaultBgColor'};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Html = styled.div`
  height: 60px;
  max-height: 60px;
  max-width: 800px;
  overflow: hidden;
  align-content: center;
`;

const ImageContainer = styled.div`
  height: 70px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
`;

const CenteredImage = styled(Image)`
  max-height: 100%;
  max-width: 90%;
  margin: auto;
  display: block;
`;

const Icon = styled(Image)``;
