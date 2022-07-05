import React, { useCallback, useState } from "react";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/solid";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { storage } from "../../../../../apps/frontend/services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useCurrentUserQuery, useUpdateProfilePicMutation } from "@sprint/gql";

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
  const hiddenFileInput = React.useRef(null);
  const imageRef = ref(storage, `user-content/${userId}/profile-image`);

  const { data, loading, error } = useCurrentUserQuery();
  const [execProfilePicUpdate] = useUpdateProfilePicMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target.files[0]) {
      if (e.target.files[0].size > 5000000) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const promise = uploadBytes(imageRef, e.target.files[0])
        .then(() => {
          getDownloadURL(imageRef).then((url) => savePic(url));
        })
        .catch((error) => {
          toast.error("Error uploading profile picture");
          console.log(error.message);
        });
      toast.promise(promise, {
        pending: "Uploading your profile picture...",
        success: "Profile picture uploaded successfully",
        error: "Error uploading profile picture",
      });
    } else {
      console.log("no file");
    }
  };

  const savePic = useCallback(
    (url: string) => {
      const promise = execProfilePicUpdate({
        variables: {
          avatarUrl: url,
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateProfilePic: {
            avatarUrl,
            __typename: "User",
          },
        },
        update: (cache, { data: updated }) => {
          if (!updated?.updateProfilePic) {
            return;
          }

          cache.modify({
            id: cache.identify(data.currentUser),
            fields: {
              avatarUrl: () => updated.updateProfilePic.avatarUrl,
            },
          });
        },
      });

      toast.promise(promise, {
        error: "Failed to update your profile picture.",
        pending: "Updating profile picture...",
        success: "Successfully updated your profile picture!",
      });
    },
    [execProfilePicUpdate, avatarUrl, data?.currentUser],
  );

  //Click invisable input file
  const handleEdit = () => {
    hiddenFileInput?.current.click();
  };

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (loading || !data?.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-fit">
      <div className="p-1">
        <Image
          src={avatarUrl}
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
            accept="image/*"
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
