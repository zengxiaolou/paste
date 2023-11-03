import React, { useEffect, useState } from 'react';
import { Wrapper } from '../../../component/Wrapper';
import { Button, Checkbox } from '@arco-design/web-react';
import { Item, Label } from './CItem';
import i18n from '../../../i18n/index';
import useLanguage from '../../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import useLogin from '../../../hooks/useLogin';

export const General = () => {
  const [language, setLanguage] = useState<string | undefined>();
  const [login, setLogin] = useState<boolean>();

  const { t } = useTranslation();
  const lng = useLanguage();
  const loginFlag = useLogin();

  useEffect(() => {
    setLanguage(lng);
    setLogin(loginFlag);
  }, [lng, loginFlag]);

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
        <Checkbox>{t('Enable Sound Effect')}</Checkbox>
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
        <Button size="small" style={{ borderRadius: 8, marginLeft: 4 }}>
          {t('Quite ECM')}
        </Button>
      </Item>
    </Wrapper>
  );
};
