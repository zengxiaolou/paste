export const createTabs = (t: any) => {
  return [
    {
      title: t('All'),
      key: 'all',
    },
    {
      title: t('Collect'),
      key: 'collect',
    },
    {
      title: t('Today'),
      key: 'today',
    },
    {
      title: t('Text'),
      key: 'text',
    },
    {
      title: t('Image'),
      key: 'image',
    },
    {
      title: t('Link'),
      key: 'link',
    },
  ];
};
