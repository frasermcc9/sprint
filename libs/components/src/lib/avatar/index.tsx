import React from "react";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/solid";

export interface AvatarProps {
  avatarUrl: string;
  showEdit?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarUrl, showEdit }) => {
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
          <PencilIcon className="h-6 w-6 p-0.5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
