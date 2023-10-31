import React, { FC, MouseEvent, useState } from 'react';
import { IconStar, IconStarFill } from '@arco-design/web-react/icon';
import { Wrapper } from '../../../component/Wrapper';
import { ClipData } from '../../../types/type';
import { Message, Tooltip } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';

interface props {
  data: ClipData;
}

export const Collect: FC<props> = ({ data }) => {
  const [collection, setCollection] = useState<boolean>(data?.collection || false);
  const { t } = useTranslation();
  const handleUpdate = async (event: MouseEvent<SVGElement>, collection: boolean) => {
    event.stopPropagation();
    const res = await window.ipc.updateRecord({ ...data, collection, content: '', icon: '' });
    if (res) {
      Message.success(collection ? t('Collect success') : t('Cancel Collect'));
      setCollection(prevCollection => !prevCollection);
    }
  };

  return (
    <Tooltip content={t('Collect')}>
      <Wrapper style={{ fontSize: 16, cursor: 'pointer' }}>
        {collection ? (
          <IconStarFill style={{ color: 'gold' }} onClick={event => handleUpdate(event, false)} />
        ) : (
          <IconStar onClick={event => handleUpdate(event, true)} />
        )}
      </Wrapper>
    </Tooltip>
  );
};
