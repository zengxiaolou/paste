import React, { FC, useContext } from 'react';
import { Menu } from '@arco-design/web-react';
import { Context } from '../Context';
import { ClipData } from '../types/type';

const Item = Menu.Item;

interface props {
  record?: ClipData;
}
export const ContextMenu: FC<props> = ({ record }) => {
  const { setDeletedRecord } = useContext(Context);
  const handleDelete = async () => {
    console.log('🤮 ~ file:ContextMenu method:handleDelete line:14 -----', record);
    if (record) {
      const result = await window.ipc.deleteRecord(record.id, record.type);
      if (result) {
        setDeletedRecord(record);
      }
    }
  };
  return (
    <Menu>
      <Item key="delete" onClick={handleDelete}>
        删除
      </Item>
    </Menu>
  );
};
