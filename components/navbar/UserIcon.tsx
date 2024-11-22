"use client";

import { LuUser2 } from "react-icons/lu";
import { useEffect, useState } from "react";

function UserIcon() {
  const [profileImage, setProfileImage] = useState<string>("");

  // If you need to fetch the profile image, do it in useEffect
  useEffect(() => {
    // TODO (@hudsonn): implement profile image fetching
    // const fetchImage = async () => {
    //   const image = await fetchProfileImage();
    //   setProfileImage(image);
    // };
    // fetchImage();
  }, []);

  if (profileImage) {
    return <img src={profileImage} className="w-6 h-6 rounded-full object-cover" alt="Profile" />;
  }

  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />;
}

export default UserIcon;
