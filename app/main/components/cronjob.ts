import { databaseManager, store } from '@/components/singletons';
import { RemoveItem, StoreKey } from '@/types/enum';
import { subtractDays } from '@/utils/time';

export const removeOldData = () => {
  const date: RemoveItem = store.get(StoreKey.ADVANCED_REMOVE);
  setTimeout(
    async () => {
      await databaseManager.deleteByCreatedAt(subtractDays(date));
    },
    60 * 60 * 1000
  );
};
