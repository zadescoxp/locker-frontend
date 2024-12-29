"use client";
import api from "@/libs/api";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function Locker(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
  const [deleteLocker, setDeleteLocker] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);

  useEffect(() => {
    const loadId = async () => {
      const resolvedId = (await props.params).id;
      setId(resolvedId);
    };

    loadId();
  }, [props.params]);

  useEffect(() => {
    get_locker();
  }, [id]);

  const get_locker = async () => {
    const response = await api.post(`http://localhost:5000/api/get/`, {
      name: id,
    });
    console.log(response.data);
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        setExists(true);
      }
    }
  };

  const check_key = async () => {
    const response = await api.post(`http://localhost:5000/api/check_key`, {
      name: id,
      key: passkey,
    });
    if (response.success) {
      console.log(response.data);
      const responseData = response.data as {
        status: number;
        name: string;
        data: string[];
      };
      if (responseData.status === 1) {
        setAuth(true);
        setName(responseData.name);
        setData(responseData.data);
      }
    } else {
      console.log(response.error);
    }
  };

  const delete_locker = async () => {
    const response = await api.post("http://localhost:5000/api/delete", {
      name: id,
      passkey: passkey,
    });
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        console.log("deleted");
        redirect("/");
      } else {
        console.log(response.error);
      }
    }
  };

  if (!exists) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Locker not found</h1>
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => redirect("/")}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
  if (!auth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Enter passkey</h1>
          <input
            type="password"
            className="py-4 px-4 bg-[#222222]"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check_key()}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={check_key}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  const DeleteLocker = () => {
    return (
      <div className="">
        <p>Sure you want to delete it</p>
        <span>
          <button className="" onClick={delete_locker}>
            Delete
          </button>
          <button className="" onClick={() => setDeleteLocker(!deleteLocker)}>
            Cancel
          </button>
        </span>
      </div>
    );
  };

  return (
    <div>
      <p>Locker {name}</p>
      <ul>
        {data.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
      <button className="" onClick={() => setDeleteLocker(!deleteLocker)}>
        delete
      </button>

      {deleteLocker && <DeleteLocker />}
    </div>
  );
}
