import jwt_decode from "jwt-decode";

export const createOrGetUser = async (response) => {
  const decoded = jwt_decode(response.credential);
  const { name, picture, sub } = decoded;

  const doc = {
    _id: sub,
    _type: "user",
    username: name,
    image: picture,
  };

  return doc;
};
