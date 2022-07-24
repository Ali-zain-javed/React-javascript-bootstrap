import axios from "axios";
//get All Users
export const GET_USERS = async (page) => {
  try {
    let response = await axios(`https://reqres.in/api/users?page=${page}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
      "Content-Type": "application/x-www-form-urlencoded",
    });
    return response;
  } catch (err) {
    throw err;
  }
};
