import React from "react";

export interface StandardHeaderProps {
  useController: typeof useStandardHeaderController;
}

export const StandardHeader: React.FC<StandardHeaderProps> = ({
  useController,
}) => {
  const {} = useController();

  return <div className="flex flex-row"></div>;
};

export const useStandardHeaderController = () => {
  return {};
};

export const useMockStandardHeaderController: typeof useStandardHeaderController =
  () => {
    return {};
  };

export default StandardHeader;
