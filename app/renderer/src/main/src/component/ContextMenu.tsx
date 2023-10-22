import React, { FC, useContext } from 'react';
import { Menu } from '@arco-design/web-react';
import { Context } from '../Context';

const Item = Menu.Item;

interface props {
  id?: number;
}
export const ContextMenu: FC<props> = ({ id }) => {
  const { setDeletedId } = useContext(Context);
  const handleDelete = async () => {
    if (id) {
      const result = window.ipc.deleteRecord(id);
      if (result) {
        setDeletedId(id);
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
