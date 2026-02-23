import axios from "axios";


const getRandomAvatar = async () => {
  try {
    const res = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        query: "cat",
        client_id: import.meta.env.VITE_API_UNSPLASH_ACCESS_KEY,
      },
    });
    console.log("Full response:", res.data);        // check what comes back
    console.log("Avatar URL:", res.data.urls.regular); // check the URL
    return res.data.urls.regular;
  } catch (error) {
    console.log("Avatar Err : ", error);
    return "https://placekitten.com/200/200";
  }
};

export default getRandomAvatar;