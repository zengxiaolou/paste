import moment from 'moment';
import { store } from '../components/singletons';
import { Settings } from '../const';

export const deleteOlderRecords = async () => {
  const deadline = store.get(Settings.DEADLINE) || 30;
  const ago = moment().subtract(deadline, 'days').format('YYYY-MM-DD');
};
