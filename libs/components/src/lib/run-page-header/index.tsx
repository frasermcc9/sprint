import { useRouter } from "next/router";
import React from "react";
import { useEmoji } from "../hooks";

export const RunPageHeader: React.FC = ({}) => {
  const Shoe = useEmoji("👟", "32px");

  const { push } = useRouter();

  return (
    <div
      className="relative w-10 cursor-pointer"
      onClick={() => push("/run/active")}
    >
      <Shoe className="absolute" />
      <Shoe className="absolute scale-50 animate-ping opacity-50" />
    </div>
  );
};

export default RunPageHeader;
