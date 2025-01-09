"use client";
import api from "@/libs/api";
import { encryptObjectValues } from "@/libs/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { encrypt } from "tanmayo7lock";

export default function Locker(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
  const [deleteLocker, setDeleteLocker] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);
  const [image, setImage] = useState<FormData>(new FormData());

  useEffect(() => {
    const loadId = async () => {
      const resolvedId = (await props.params).id;
      setId(resolvedId);
    };

    loadId();
  }, [props.params]);

  useEffect(() => {
    if (!id) return;
    get_locker();
  }, [id]);

  const get_locker = async () => {
    const response = await api.post(
      `http://localhost:5000/api/get/`,
      encryptObjectValues({ name: id })
    );
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        setExists(true);
      }
    }
  };

  const check_key = async () => {
    const payload = {
      name: id,
      key: passkey,
    };
    const response = await api.post(
      `http://localhost:5000/api/check_key`,
      encryptObjectValues(payload)
    );
    if (response.success) {
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
    const payload = {
      name: id,
      passkey: passkey,
    };
    const response = await api.post(
      "http://localhost:5000/api/delete",
      encryptObjectValues(payload)
    );
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
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

  const deleteFile = async (fileName: string) => {
    const payload = {
      name: id,
      passkey: passkey,
      fileName: fileName,
    };
    const response = await api.post(
      "http://localhost:5000/api/delete_file",
      encryptObjectValues(payload)
    );
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        check_key();
      } else {
        console.log(response.error);
      }
    }
  };

  const addFiles = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    formData.append("name", encrypt(id));
    formData.append("passkey", encrypt(passkey));
    setImage(formData);
  };

  const uploadFile = async () => {
    const response = await api.post(`http://localhost:5000/api/upload/`, image);
    if (response.success) {
      check_key();
    } else {
      console.log(response.error);
    }
  };

  return (
    <div>
      <p>Locker {name}</p>
      {data.length > 0 &&
        data.map((item, index) => (
          <div key={index}>
            <Link href={item?.url} download={item?.url} target="_blank">
              {item?.fileName}
            </Link>
            <button onClick={() => deleteFile(item?.fileName)}>Delete</button>
          </div>
        ))}
      <button className="" onClick={() => setDeleteLocker(!deleteLocker)}>
        delete
      </button>
      <input
        type="file"
        onChange={(e) => {
          addFiles(e);
        }}
      />
      <button onClick={uploadFile}>Upload</button>
      {deleteLocker && <DeleteLocker />}
    </div>
  );
}
