import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import shareVideo from "../assets/share.mp4";
import berbagi_logo from "../assets/berbagi_logo.png";
import { createOrGetUser } from "../helper/fetchGoogleUser";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    const result = await createOrGetUser(response);
    localStorage.setItem("user", JSON.stringify(result));

    client.createIfNotExists(result).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay">
          <div className="py-5">
            <img src={berbagi_logo} width="200px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                responseGoogle(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
