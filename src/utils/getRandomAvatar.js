import axios from "axios";

const API = import.meta.env.VITE_API_UNSPLASH_ACCESS_KEY;
const axiosInstance = axios.create({
  baseURL: "https://api.unsplash.com",
  timeout: 10000,
});

const commonParams = {
      client_id: API,
      content_filter: "high", // 🔥 prevents NSFW
    };


const getRandomAvatar = async (query) => {
  try {
    const res = await axiosInstance.get(`/photos/random`, {
      params: {
        ...commonParams,
        query: query || "cat",
      },
    });
    return res.data.urls.regular;
  } catch (error) {
    console.log("Avatar Err : ", error);
    return "https://placekitten.com/200/200";
  }
};


export const fetchUnsplashImages = async (query = "", perPage = 10) => {
  try {
    if(!API) {
      throw new Error("Unsplash API KEY Missing");
    }
    
    if(query){
      const res = await axiosInstance.get("/search/photos", { params : { ...commonParams, query, per_page : perPage, },})
      return res.data.results
    }else{
      const res = await axiosInstance.get("/photos/random",{params : {...commonParams, count : perPage}})
      return res.data;
    }
  } catch (error) {
    console.error("Unsplash Error:", error.response?.data || error.message);
    throw error;
  }
};


export default getRandomAvatar;