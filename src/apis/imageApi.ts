import axiosClient from './axiosClient';
class ImageAPI {
  HandleImage = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/upload${url}`, {
      method: method ?? 'post',
      data,
    });
  };
}

const imageAPI = new ImageAPI();
export default imageAPI;
