"use client";
import Feature from "@/components/features";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import api from "@/libs/api";
import { encryptObjectValues } from "@/libs/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [lockerName, setLockerName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  // POST request to the API
  const post = async ({ url, cred }: { url: string; cred: boolean }) => {
    setLoading(true);
    const payload = {
      name: lockerName,
      passkey: passkey,
    };
    setError(undefined);
    setMessage(undefined);
    let response = null;
    if (cred) {
      response = await api.post(url, encryptObjectValues(payload));
    } else {
      response = await api.post(url, encryptObjectValues({ name: lockerName }));
    }
    if (response?.success) {
      const data = response.data as {
        error?: string;
        message?: string;
        status?: number;
      };

      if (data.status === 2) {
        redirect(`/locker/${lockerName}`);
      }

      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else if (data.message) {
        setMessage(data.message);
        setLoading(false);
      } else {
        setError("Something went wrong");
        setLoading(false);
      }

      setLoading(false);
    }
  };

  // check if the name exists in the database
  const checkLocker = async () => {
    setLockerName(lockerName.replaceAll(" ", ""));
    if (lockerName) {
      post({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check`,
        cred: false,
      });
    }
  };

  // create a new locker
  const createLocker = async () => {
    setLoading(true);
    if (passkey.length >= 5 && passkey === confirmPasskey) {
      post({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locker`,
        cred: true,
      });
      setLoading(false);
      redirect(`/locker/${lockerName}`);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="flex items-center justify-center flex-col gap-y-5 h-[80vh] max-[1165px]:gap-y-3">
        <div className="flex items-center justify-center gap-10 text-5xl max-[1165px]:text-3xl max-[602px]:text-xl max-[602px]:gap-3">
          <h1 className="flex items-center justify-center gap-2 max-[602px]:gap-1">
            CREATE{" "}
            <Image
              src="/assets/emoji/pencil.png"
              height={40}
              width={40}
              alt="Pencil"
              className="max-[1165px]:w-auto max-[1165px]:h-7 max-[602px]:h-5"
            />
          </h1>

          <h1 className="flex items-center justify-center gap-2 max-[602px]:gap-1">
            SECURE
            <Image
              src="/assets/emoji/secure.png"
              height={40}
              width={40}
              alt="Lock"
              className="max-[1165px]:w-auto max-[1165px]:h-7 max-[602px]:h-5"
            />
          </h1>

          <h1 className="flex items-center justify-center gap-2 max-[602px]:gap-1">
            SHARE
            <Image
              src="/assets/emoji/share.png"
              height={40}
              width={40}
              alt="Share"
              className="max-[1165px]:w-auto max-[1165px]:h-7 max-[602px]:h-5"
            />
          </h1>
        </div>

        <h1 className="text-grey font-light text-2xl max-[1165px]:text-lg max-[602px]:text-sm">
          Open Source File Sharing Platform
        </h1>

        <span className="flex items-center justify-center gap-5 font-light w-1/2 max-[1165px]:w-[90%] max-[1165px]:text-sm max-[602px]:w-full max-[602px]:gap-2">
          <p className="max-[602px]:hidden">vouz.tech/</p>
          <input
            type="text"
            placeholder="Enter a name for your locker"
            className="py-4 px-4 bg-lightgrey outline-none w-[60%] rounded-lg max-[602px]:px-5"
            value={lockerName}
            onChange={(e) => {
              setLockerName(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && checkLocker()}
          />
          <button
            className="py-4 px-8 bg-black text-white outline-none hover:bg-grey transition-all rounded-lg max-[602px]:px-5"
            onClick={checkLocker}
          >
            {loading ? (
              <Image
                className="h-5 w-auto animate-spin max-[602px]:h-4"
                src="/assets/loading-light.svg"
                height={10}
                width={10}
                alt="Loading"
              />
            ) : (
              "Let's Go"
            )}
          </button>
        </span>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
      </div>

      <Feature />
      <Footer />

      {message && (
        <div className="h-screen w-screen flex items-center justify-center bg-[rgba(0,0,0,0.75)] fixed z-20 top-0 left-0">
          <div className="relative bg-white w-1/3 max-[602px]:w-[96%] py-14 rounded-lg flex flex-col gap-5 items-center justify-center">
            <button
              className="absolute top-6 right-9"
              onClick={() => setMessage("")}
            >
              <Image
                src="/assets/close.svg"
                height={20}
                width={20}
                alt="close"
              />
            </button>
            <h1 className="text-3xl">Passkey</h1>
            <input
              type="password"
              placeholder="Enter your passkey"
              className="py-4 px-4 bg-lightgrey outline-none text-md w-[90%] rounded-lg"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createLocker()}
            />
            <input
              type="password"
              placeholder="Confirm your passkey"
              className={`py-4 px-4 bg-lightgrey outline-none text-md w-[90%] rounded-lg ${
                passkey === confirmPasskey
                  ? "border-green-500 border-[1px]"
                  : "border-red-500 border-[1px]"
              }`}
              value={confirmPasskey}
              onChange={(e) => setConfirmPasskey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createLocker()}
            />
            <span className="w-[90%] flex items-start flex-col">
              <p className="text-sm">
                {passkey !== confirmPasskey ? "Passkeys do not match" : ""}
              </p>
              <p className="text-sm">
                {passkey.length < 5
                  ? "Passkey must be at least 5 characters"
                  : ""}
              </p>
            </span>
            <button
              className={`py-4 px-4 ${
                passkey.length >= 5 && passkey === confirmPasskey
                  ? "bg-black"
                  : "bg-grey"
              } text-white outline-none hover:bg-grey transition-all w-[90%] rounded-lg flex items-center justify-center`}
              onClick={() => {
                if (passkey.length >= 5 && passkey === confirmPasskey) {
                  createLocker();
                }
              }}
            >
              {loading ? (
                <Image
                  className="h-5 w-auto animate-spin max-[602px]:h-4"
                  src="/assets/loading-light.svg"
                  height={10}
                  width={10}
                  alt="Loading"
                />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
