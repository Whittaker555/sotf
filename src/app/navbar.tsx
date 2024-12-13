"use client";
import { useSession } from "next-auth/react";
import LogIn from "./log-in-button";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    // <div className="flex justify-between items-center p-4 border-solid border-2 border-gray-800">
    <div className="flex flex-row border-gray-800">
      <div className="basis-11/12 text-2xl font-bold">Survival of the Fittest</div>
      <div className="flex space-x-4">
        {session && <span className="bold-txt">Signed In as {session?.user?.name}</span>}
        <LogIn />
      </div>
    </div>
  );
}
