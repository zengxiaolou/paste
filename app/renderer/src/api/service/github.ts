import { GetReleaseRequest } from '@/api/types/github';
import useAxios from 'axios-hooks';
const baseURL = 'https://api.github.com/repos';

export const useGetRelease = (param: GetReleaseRequest) => {
  const [{ data, loading, error }, refetch] = useAxios({
    url: `${baseURL}/${param.repoOwner}/${param.repoName}/releases/latest`,
    method: 'GET',
  });
  return { data, loading, error, refetch };
};
