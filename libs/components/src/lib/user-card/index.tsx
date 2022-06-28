import { FCC, xpDetails } from "@sprint/common";
import React from "react";

export interface UserCardProps {
  avatarUrl?: string;
  backgroundUrl?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
}

export const UserCard: FCC<UserCardProps> = ({
  avatarUrl,
  backgroundUrl,
  firstName,
  lastName,
  xp,
  children,
}) => {
  const { level } = xpDetails(xp ?? 0);

  return (
    <div className="relative h-20 rounded-xl">
      <img
        src={backgroundUrl}
        className="h-20 w-80 rounded-xl"
        alt="background"
      />
      <div className="absolute top-0 left-0 z-10 flex flex-row items-center gap-x-2">
        <div className="rounded-xl shadow-lg">
          <img src={avatarUrl} className="h-20 rounded-full p-1" alt="avatar" />
        </div>
        <div className="font-palanquin flex flex-col text-white">
          <div className="font-bold">
            {firstName} {lastName}
          </div>
          <div className="text-sm font-semibold">Level {level}</div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default UserCard;
