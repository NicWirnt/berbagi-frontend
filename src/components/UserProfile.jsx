import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";

import Spinner from "./Spinner";
import { createOrGetUser } from "../helper/fetchGoogleUser";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology,cars";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  const responseGoogle = async (response) => {
    const result = await createOrGetUser(response);
    localStorage.setItem("user", JSON.stringify(result));

    client.createIfNotExists(result).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-pict"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.username}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id ? (
                <button
                  type="button"
                  className="px-2 bg-red-500 rounded-lg opacity-50 hover:opacity-70 shadow-xl"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              ) : (
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    responseGoogle(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
//4.11.50 GOOGLE OAUTH LOGOUT
