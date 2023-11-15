import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import React, { FC, useEffect, useState } from 'react';
import { Button } from '@arco-design/web-react';
import { TabKey } from './const';
import { IconAbout, IconAdvance, IconGeneral, IconShortcut } from '@/icon/index';

const handleTabs = (t: any) => {
  return [
    {
      icon: IconGeneral,
      title: t('General'),
      key: 'general',
    },
    {
      icon: IconShortcut,
      title: t('Shortcuts'),
      key: 'shortcuts',
    },
    {
      icon: IconAdvance,
      title: t('Advanced'),
      key: 'advanced',
    },
    // {
    //   icon: IconLabs,
    //   title: t('Labs'),
    //   key: 'labs',
    // },
    {
      icon: IconAbout,
      title: t('About'),
      key: 'about',
    },
  ];
};

interface props {
  onSelect: (v: TabKey) => void;
}

export const Header: FC<props> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [isFocused, setIsFocused] = useState<number>(1);
  const tabs = handleTabs(t);
  const handleSetTabs = (v: TabKey) => {
    setActiveTab(v);
    onSelect?.(v);
  };

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(1);
    };
    const handleBlur = () => {
      setIsFocused(0);
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <Wrapper is_focused={isFocused}>
      {tabs.map((v, key) => (
        <IconWrapper key={key} active={activeTab === v.key} onClick={() => handleSetTabs(v.key as TabKey)}>
          <Button style={{ marginBottom: 4 }} icon={<v.icon />} />
          <div>{v.title}</div>
        </IconWrapper>
      ))}
    </Wrapper>
  );
};

const IconWrapper = styled.button<{ active: boolean }>`
  text-align: center;
  margin: 0 8px;
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  background: ${({ active }) => (active ? 'rgba(211, 211, 211, 0.1)' : 'none')}; // 添加浅灰色背景
  fill: ${({ active }) => (active ? '#007bff' : '#7F8081')};

  svg {
    width: 25px;
    height: 25px;
    outline: none;
  }

  div {
    color: ${({ active }) => (active ? '#007bff' : '#7F8081')};
  }
`;

const Wrapper = styled.div<{ is_focused: number }>`
  display: flex;
  padding: 16px 0;
  justify-content: center;
  background-color: ${({ is_focused }) => (is_focused === 1 ? '#383839' : '#2a2b2c')};
`;
