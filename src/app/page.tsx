"use client";
import api from "@/libs/api";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [lockerName, setLockerName] = useState("");
  const [passkey, setPasskey] = useState("");

  // POST request to the API
  const post = async ({ url, cred }: { url: string; cred: boolean }) => {
    setError(undefined);
    setMessage(undefined);
    let response = null;
    if (cred) {
      response = await api.post(url, {
        name: lockerName,
        passkey: passkey,
      });
    } else {
      response = await api.post(url, {
        name: lockerName,
      });
    }
    if (response?.success) {
      console.log(response);
      console.log(response.data);
      const data = response.data as { error?: string; message?: string };
      if (data.error) {
        setError(data.error);
      } else if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("Something went wrong");
      }
    } else {
      console.log(response?.error);
    }
  };

  // check if the name exists in the database
  const checkLocker = async () => {
    setLockerName(lockerName.replaceAll(" ", ""));
    if (lockerName) {
      post({ url: "http://localhost:5000/api/check", cred: false });
    }
  };

  // create a new locker
  const createLocker = async () => {
    if (passkey.length >= 5) {
      post({ url: "http://localhost:5000/api/locker", cred: true });
    }
  };

  return (
    <div className="w-screen flex items-center justify-center flex-col mb-20">
      <div className="w-full flex justify-center gap-20 text-sm py-7 border-b-2 border-[#e1e1e1]">
        <Link className="hover:text-[#e1e1e1] transition-all" href="/">
          LOCKER
        </Link>
        <Link className="hover:text-[#e1e1e1] transition-all" href="/">
          GITHUB
        </Link>
      </div>
      <div className="h-[80vh] flex items-start justify-center flex-col w-3/4 gap-y-5">
        <h1 className="text-7xl font-bold">GET A LOCKER FOR FREE</h1>
        <span className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Enter a name for your locker"
            className="py-4 px-4 bg-[#222222] outline-none text-md w-[90%]"
            value={lockerName}
            onChange={(e) => setLockerName(e.target.value)}
          />
          <button
            className="py-4 px-4 bg-white text-black outline-none hover:bg-[#e1e1e1] transition-all w-[10%]"
            onClick={checkLocker}
          >
            Let&apos;s Go
          </button>
        </span>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <small className="text-[#bdbdbd] text-sm">
          *All the lockers are destroyed after 24hrs
        </small>
      </div>

      <div className="flex items-center justify-center gap-20 fixed bottom-0 left-0 p-10 w-full">
        <p>
          Made by{" "}
          <Link
            href={"zadescoxp.com"}
            className="text-blue-500 hover:text-blue-700 transition-all"
          >
            Zade Scoxp
          </Link>
        </p>
        <p>
          The source code is avaiable on{" "}
          <Link
            href={""}
            className="text-blue-500 hover:text-blue-700 transition-all"
          >
            GITHUB
          </Link>
        </p>
      </div>
      {message && (
        <div className="h-screen w-screen flex items-center justify-center bg-[rgba(0,0,0,0.75)] fixed z-20">
          <div className="bg-[#111111] w-1/2 py-14 rounded-lg flex flex-col gap-5 items-center justify-center">
            <h1 className="text-5xl font-bold">PASSKEY</h1>
            <input
              type="text"
              placeholder="Enter your passkey"
              className="py-4 px-4 bg-[#222222] outline-none text-md w-[90%]"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <p className="text-red-500 text-sm">
              {passkey.length < 5
                ? "Passkey must be at least 5 characters"
                : ""}
            </p>
            <button
              className="py-4 px-4 bg-white text-black outline-none hover:bg-[#e1e1e1] transition-all w-[90%]"
              onClick={createLocker}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
