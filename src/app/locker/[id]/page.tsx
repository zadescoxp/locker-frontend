"use client";
import api from "@/libs/api";
import { encryptObjectValues } from "@/libs/utils";
import Image from "next/image";
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
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-3xl">Locker not found</h1>
          <button
            className="bg-black text-white font-light py-4 px-8 rounded-lg"
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
        <div className="flex flex-col items-center bg-lightgrey rounded-lg p-10 gap-5 w-1/3">
          <h1 className="text-3xl">Enter passkey</h1>
          <input
            type="password"
            className="py-4 px-4 bg-white rounded-lg outline-none w-full font-light"
            placeholder="Enter your passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check_key()}
          />
          <button
            className="bg-black text-white font-light py-4 px-8 rounded-lg w-full"
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
      <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg flex flex-col gap-5">
          <p className="text-xl">Sure you want to delete it ?</p>
          <span className="flex gap-10 font-light">
            <button className="text-red-500" onClick={delete_locker}>
              Delete
            </button>
            <button className="" onClick={() => setDeleteLocker(!deleteLocker)}>
              Cancel
            </button>
          </span>
        </div>
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
    <div className="flex items-center justify-center flex-col gap-5">
      <div className="flex flex-col items-center gap-5 w-1/2 mt-40">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl">{name}</h1>

          <button
            className="bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition-all"
            onClick={() => setDeleteLocker(!deleteLocker)}
          >
            Delete
          </button>
        </div>

        <div className="flex flex-col items-start justify-center border-[1px] border-black rounded-lg w-full">
          <p className="text-2xl p-5">Files</p>
          {data.length > 0 &&
            data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 border-t-[1px] p-4 w-full border-grey"
              >
                <Link
                  href={item?.url}
                  download={item?.url}
                  target="_blank"
                  className="flex gap-2"
                >
                  <Image
                    src="/assets/file.svg"
                    alt="file"
                    width={15}
                    height={15}
                  />
                  {item?.fileName}
                </Link>
                <span className="flex gap-2">
                  <button onClick={() => deleteFile(item?.fileName)}>
                    <Image
                      src="/assets/delete.svg"
                      alt="delete"
                      width={15}
                      height={15}
                    />
                  </button>
                  <Link
                    href={item?.url}
                    download={item?.url}
                    target="_blank"
                    className="flex gap-2"
                  >
                    <Image
                      src="/assets/download.svg"
                      alt="file"
                      width={15}
                      height={15}
                    />
                  </Link>
                </span>
              </div>
            ))}
        </div>

        {/* <label htmlFor="fileInput">Upload</label> */}
        <span className="flex gap-5 items-center justify-center w-full">
          <input
            className="bg-lightgrey p-4 rounded-lg w-full"
            id="fileInput"
            type="file"
            onChange={(e) => {
              addFiles(e);
            }}
            accept="image/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
          />
          <button
            onClick={uploadFile}
            className="bg-black text-white py-4 px-8 rounded-lg"
          >
            Upload
          </button>
        </span>
        {deleteLocker && <DeleteLocker />}
      </div>
    </div>
  );
}
