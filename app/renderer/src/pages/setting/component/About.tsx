import React from 'react';
import styled from 'styled-components';
import { Button, Image, Popover, Space, Spin } from '@arco-design/web-react';
import Icon from '@/assets/icon.png';
import Friend from '@/assets/friend.jpg';
import Pay from '@/assets/pay.png';
import { Wrapper } from '@/component/Wrapper';
import { useTranslation } from 'react-i18next';
import { useGetRelease } from '@/api/service/github';
import { isVersionLessThan } from '@/utils/time';
import useResizeWindow from '@/hooks/useResizeWindow';

export const About = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetRelease({ repoOwner: 'zengxiaolou', repoName: 'paste' });
  useResizeWindow(600);

  const handleUpdate = () => {
    const current = process.env.REACT_APP_VERSION;
    if (current && data?.name) {
      return !isVersionLessThan(current, data.name);
    }
    return true;
  };

  const handleJump = (event: Event) => {
    window.ipc.openExternal('https://github.com/zengxiaolou/paste/releases');
  };

  return (
    <Wrapper>
      <Content>
        <Image src={Icon} preview={false} width={120} />
        <Name>
          <Space>
            <h4>Electron Clipboard Manager 0.0.3</h4>
            <Label type="primary">Free</Label>
          </Space>
        </Name>
        <h4>
          {t('Latest version')}:{' '}
          <Spin loading={loading} style={{ color: '#4a9ff3' }}>
            {data?.name}
          </Spin>
        </h4>
        <Copyright>Copyright @ 2023~2023 Ruler </Copyright>
        <ButtonContainer>
          <Space>
            <Popover
              style={{ width: 400, height: 250, backgroundColor: 'none' }}
              content={
                <QR style={{ width: 400 }}>
                  <Image src={Pay} preview={false} width={200} style={{ marginRight: 16 }} />
                  <Image src={Friend} preview={false} width={200} />
                </QR>
              }
            >
              <UButton type="secondary">{t('sendGifts')}</UButton>
            </Popover>
          </Space>

          <div style={{ flex: 1 }} />
          <UButton type="primary" disabled={handleUpdate()} onClick={handleJump}>
            {t('Update')}
          </UButton>
        </ButtonContainer>
      </Content>
    </Wrapper>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  text-align: center;
`;

const Name = styled.div`
  color: #4a9ff3;
  font-size: 22px;
`;

const Label = styled(Button)`
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
`;

const Copyright = styled.h4`
  font-size: 14px;
  color: #9e9f9f;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 90vw;
  justify-content: space-between;
  padding: 20px;
`;

const UButton = styled(Button)`
  border-radius: 15px;
`;

const QR = styled.div`
  display: flex;
  justify-content: center;
  width: 120px;
  height: 120px;
`;
