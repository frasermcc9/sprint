import { Emblems } from "@sprint/assets";
import { FCC, isValidEmblem, xpDetails } from "@sprint/common";
import Image from "next/image";

export interface UserCardProps {
  avatarUrl?: string;
  emblem?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
  onlyEmblem?: boolean;
}

export const UserCard: FCC<UserCardProps> = ({
  avatarUrl,
  emblem,
  firstName,
  lastName,
  xp,
  children,
  onlyEmblem,
}) => {
  const { level } = xpDetails(xp ?? 0);

  const emblemName = isValidEmblem(emblem)
    ? emblem
    : console.warn("Invalid emblem name", emblem);
  const emblemSrc = Emblems[emblemName ?? "Level1"];

  return (
    <div className="relative rounded-xl">
      <Image
        src={emblemSrc}
        height={80}
        width={320}
        className="rounded-xl"
        alt="background"
      />
      {onlyEmblem || (
        <div className="absolute top-0 left-0 z-10 flex flex-row items-center gap-x-2">
          <div className="rounded-xl shadow-lg">
            <img
              src={avatarUrl}
              className="h-20 rounded-full p-1"
              alt="avatar"
            />
          </div>
          <div className="font-palanquin flex flex-col text-white">
            <div className="font-bold">
              {firstName} {lastName}
            </div>
            <div className="text-sm font-semibold">Level {level}</div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default UserCard;
