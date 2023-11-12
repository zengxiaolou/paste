import React, { useEffect, useState } from 'react';
import { Wrapper } from '@/component/Wrapper';
import { Checkbox } from '@arco-design/web-react';
import { Item, Label } from './CItem';
import i18n from '@/i18n/index';
import useLanguage from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import useGetStoreByKey from '@/hooks/useGetStoreByKey';
import { StoreKey } from '@/types/enum';

export const General = () => {
  const [language, setLanguage] = useState<string | undefined>();
  const [login, setLogin] = useState<boolean>();
  const [sound, setSound] = useState<boolean>();

  const { t } = useTranslation();
  const lng = useLanguage();
  const loginFlag = useGetStoreByKey(StoreKey.GENERAL_LOGIN) as boolean;
  const soundFlag = useGetStoreByKey(StoreKey.GENERAL_SOUND) as boolean;

  useEffect(() => {
    setLanguage(lng);
    setLogin(loginFlag);
    setSound(soundFlag);
  }, [lng, loginFlag, soundFlag]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    i18n.changeLanguage(selected).then();
    window.ipc.changeLanguage(selected);
    setLanguage(selected);
  };

  const handleLoginChange = (value: boolean) => {
    setLogin(value);
    window.ipc.changeLogin(value);
  };

  const handleSoundChange = (value: boolean) => {
    setSound(value);
    window.ipc.changeSound(value);
  };

  return (
    <Wrapper>
      <Item>
        <Label>{t('Launch')}:</Label>
        <Checkbox checked={login} onChange={handleLoginChange}>
          {t('Start at Login')}
        </Checkbox>
      </Item>
      <Item>
        <Label>{t('Sound')}:</Label>
        <Checkbox checked={sound} onChange={handleSoundChange}>
          {t('Enable Sound Effect')}
        </Checkbox>
      </Item>
      <Item>
        <Label>{t('Language')}:</Label>
        <select style={{ borderRadius: 8, marginLeft: 4 }} value={language} onChange={handleLanguageChange}>
          <option value="system">{t('system')}</option>
          <option value="zh">{t('Simplified Chinese')}</option>
          <option value="en">{t('English')}</option>
        </select>
      </Item>
      <Item>
        <Label>{t('Quit')}:</Label>
        <button style={{ borderRadius: 8, marginLeft: 4, cursor: 'pointer' }} onClick={() => window.ipc.quit()}>
          {t('Quite ECM')}
        </button>
      </Item>
    </Wrapper>
  );
};
