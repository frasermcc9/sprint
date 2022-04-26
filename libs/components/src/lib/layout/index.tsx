import React from "react";
import cx from "classnames";

// const Header: React.FC = () => {
//   const { push } = useRouter();

//   return (
//     <div className="z-10 bg-neutral-800 p-4 shadow-lg">
//       <div className="mx-6 flex items-center justify-between sm:mx-10">
//         <button
//           className="h-auto w-auto bg-transparent sm:ml-0 "
//           onClick={() => push("/exchange")}
//         >
//           <AppLogo />
//         </button>
//         <div className="ml-auto">
//           <UserDropdown />
//         </div>
//       </div>
//     </div>
//   );
// };
interface PageProps {
  children?: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* <Header /> */}
      <div className="w-full max-w-6xl flex-grow self-center px-10">
        {children}
      </div>
    </div>
  );
};

const Layout = {
  Page,
} as const;

export { Layout };
