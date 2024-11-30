import { addFollowedJobs } from "../redux/reducers/authReducer";

import userApi from "../apis/userApi";

export class UserHandlers {
    static getJobsFollowed = async (id: string, dispatch: any) => {
        if (id) {
          const api = `/getJobsFollowed?uid=${id}`;
    
          try {
            const res = await userApi.HandleUser(api);
    
            if (res && res.data) {
              dispatch(addFollowedJobs(res.data));
            }
          } catch (error) {
            console.log(error);
          }
        }
    }
}