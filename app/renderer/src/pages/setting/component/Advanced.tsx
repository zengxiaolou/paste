import { Wrapper } from '@/component/Wrapper';
import React, { useEffect, useState } from 'react';
import { Item, Label } from './CItem';
import styled from 'styled-components';
import { RemoveItem, RemoveItemMap, StoreKey } from '@/types/enum';
import { translateMapToObject } from '@/utils/func';
import { useTranslation } from 'react-i18next';
import useGetStoreByKey from '@/hooks/useGetStoreByKey';
import useResizeWindow from '@/hooks/useResizeWindow';

export const Advanced = () => {
  const [selected, setSelected] = useState<number>(RemoveItem.TWO_MONTHS);
  const { t } = useTranslation();
  const item = useGetStoreByKey(StoreKey.ADVANCED_REMOVE) as RemoveItem;
  useResizeWindow(230);
  const handleChange = async (value: string) => {
    const res = await window.ipc.changeRemoveItem(Number(value));
    res && setSelected(Number(value));
  };

  useEffect(() => {
    setSelected(item);
  }, [item]);

  return (
    <Wrapper>
      <Item>
        <ULabel>{t('Remove History Items')}:</ULabel>
        <select value={selected} onChange={event => handleChange(event.target.value)}>
          {translateMapToObject(RemoveItemMap).map(item => (
            <option value={item.key}>{t(item.label)}</option>
          ))}
        </select>
      </Item>
    </Wrapper>
  );
};

const ULabel = styled(Label)`
  width: 160px;
`;
