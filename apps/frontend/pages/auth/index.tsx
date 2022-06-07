import { LoginPanel } from "@sprint/components";
import { useRouter } from "next/router";
import React from "react";

export function Index() {
  const router = useRouter();

  const randomImage =
    "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  return (
    <>
      <div
        style={{
          backgroundImage: "url(" + randomImage + ")",
        }}
        className={"absolute -z-10 h-screen w-screen bg-cover bg-no-repeat"}
      />
      <div className="flex h-screen w-screen items-center justify-center">
        <LoginPanel />
      </div>
    </>
  );
}

export default Index;
