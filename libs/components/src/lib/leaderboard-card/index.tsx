import React from "react";

export interface LeaderboardCardProps {
  avatarUrl?: string;
  emblem?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
  sleepRating: number;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({}) => {
  return <div></div>;
};

export default LeaderboardCard;
