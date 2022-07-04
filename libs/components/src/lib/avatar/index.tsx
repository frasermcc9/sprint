import React, { useState } from "react";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/solid";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { storage } from "../../../../../apps/frontend/services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface AvatarProps {
  avatarUrl: string;
  showEdit?: boolean;
  userId: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  showEdit,
  userId,
}) => {
  const [profilePicture, setProfilePicture] = useState(avatarUrl);
  const hiddenFileInput = React.useRef(null);

  const imageRef = ref(storage, `user-content/${userId}/profile-image`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      uploadBytes(imageRef, e.target.files[0])
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              setProfilePicture(url);
              console.log("Profile Image Url:" + url);
            })
            .catch((error) => {
              console.log(error.message, "error getting the image url");
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      console.log("no file");
    }
  };

  //Click invisable input file
  const handleEdit = () => {
    hiddenFileInput?.current.click();
  };

  return (
    <div className="relative w-fit">
      <div className="p-1">
        <Image
          src={profilePicture}
          className="rounded-full"
          alt="Avatar"
          width="72px"
          height="72px"
        />
      </div>
      {showEdit && (
        <div className="absolute top-0 right-0 rounded-full bg-indigo-600">
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <PencilIcon
            className="h-6 w-6 p-0.5 text-white"
            onClick={handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
