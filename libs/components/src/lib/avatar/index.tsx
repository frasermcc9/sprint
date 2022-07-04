import React, { useState } from "react";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/solid";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { storage } from "../../../../../apps/frontend/services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface AvatarProps {
  avatarUrl: string;
  showEdit?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarUrl, showEdit }) => {
  const [image, setImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(avatarUrl);
  const hiddenFileInput = React.useRef(null);

  const imageRef = ref(storage, "image");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file Changed");
    if (e.target.files[0]) {
      setImage(e.target.files[0]);

      console.log(e.target.files[0]);

      uploadBytes(imageRef, e.target.files[0])
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              setProfilePicture(url);
              console.log("Image Url:" + url);
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
