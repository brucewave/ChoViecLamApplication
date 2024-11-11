import axiosClient from './axiosClient';

class JobAPI {
  HandleJob = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/jobs${url}`, {
      method: method ?? 'post',
      data,
    });
  };
  GetJobs = async () => {
    return await axiosClient(`/jobs`, {
      method: 'get',
    });
  };
}

const jobAPI = new JobAPI();
export default jobAPI;
