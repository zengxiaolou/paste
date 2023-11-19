import React, { FC } from 'react';
import styled from 'styled-components';
import { Card, Grid, Image, Notification } from '@arco-design/web-react';
import { ClipData } from '@/types/type';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/utils/time';

const { Col } = Grid;
interface props {
  data: ClipData;
  index: number;
  onClick: (value: number) => void;
  activeCard?: number;
  onDelete?: () => void;
}

export const ImageContainer: FC<props> = ({ data, index, onClick, activeCard, onDelete }) => {
  const { content, id, type, created_at } = data;
  const { t } = useTranslation();

  const handleClick = (index: number) => {
    onClick(index);
  };

  const handleDoubleClick = async (type: string, content: string, id: number) => {
    const res = await window.ipc.requestPaste(type, content, id);
    res && Notification.success({ content: t('Copy success') });
  };

  const handleContextMenu = async (event: any, data: ClipData) => {
    event.preventDefault();
    const res = await window.ipc.showContextMenu({ ...data, content: '', icon: undefined });
    res && onDelete?.();
  };
  return (
    <Col span={12}>
      <UCard
        is_active={activeCard === index ? 1 : 0}
        onClick={() => handleClick(index)}
        onDoubleClick={() => handleDoubleClick(type, content, id)}
        onContextMenu={event => handleContextMenu(event, data)}
      >
        <Header>{created_at && formatDateTime(created_at)}</Header>
        <UImage src={content} simple loader lazyload width={500} />
      </UCard>
    </Col>
  );
};

const UCard = styled(Card)<{ is_active?: number; bg_color?: string }>`
  border-radius: 15px;
  margin-bottom: 8px;
  margin-right: 8px;
  height: 600px;
  width: 100%;
  .arco-card-body {
    padding: 8px 16px;
  }
  align-content: center;
  border: ${props => (props.is_active === 1 ? '1px solid #007AFF' : 'none')};
  background-color: #1c1d1d;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  display: flex;
`;

const UImage = styled(Image)`
  object-fit: contain;
  margin: auto;
  padding: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  color: gray;
  margin-right: 16px;
`;
