'use client';
import Image from "next/image";
import Link from "next/link";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { lightTheme } from "thirdweb/react";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav className="bg-slate-100 border-b-2 border-b-slate-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left Section: Logo + Nav Links */}
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Image
              src="/crowd-funding.png"
              alt="Crowd Funding"
              width={50}
              height={50}
              style={{ filter: "drop-shadow(0px 0px 24px #a726a9a8)" }}
            />

            {/* Nav Links */}
            <div className="ml-7 flex items-center space-x-5">
              <Link href="/">
                <p className="rounded-md px-3 py-2 text-md font-bold text-slate-700">
                  Campaigns
                </p>
              </Link>
              {account && (
                <Link href={`/dashboard/${account.address}`}>
                  <p className="rounded-md px-3 py-2 text-md  font-bold text-slate-700">
                    Dashboard
                  </p>
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Connect Button */}
          <div className="flex items-center justify-end">
            <ConnectButton
              client={client}
              theme={lightTheme()}
              detailsButton={{
                style: { maxHeight: "50px" }
              }}
            />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
