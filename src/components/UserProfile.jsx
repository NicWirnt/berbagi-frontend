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

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-white-500 mr-4 text-black font-bold p-2 rounded-full w-20 outlinenone";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

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
                  className="p-2 bg-white rounded-full opacity-50 hover:opacity-70 shadow-xl"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  <AiOutlineLogout color="red" fontSize={30} />
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
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              saved
            </button>
          </div>
        </div>
        {pins?.length ? (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full text-xl mt-2">
            No Pins Found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
//4.11.50 GOOGLE OAUTH LOGOUT
