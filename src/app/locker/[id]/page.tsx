"use client";
import api from "@/libs/api";
import { encryptObjectValues } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { encrypt } from "tanmayo7lock";

interface FileData {
  fileName: string;
  url: string;
}

export default function Locker(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<FileData[]>([]);
  const [deleteLocker, setDeleteLocker] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);
  const [image, setImage] = useState<FormData>(new FormData());
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    setPageLoading(true);
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/`,
      encryptObjectValues({ name: id })
    );
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        setPageLoading(false);
        setExists(true);
      }
    } else {
      setPageLoading(false);
    }
  };

  const check_key = async () => {
    setPageLoading(true);
    const payload = {
      name: id,
      key: passkey,
    };
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_key`,
      encryptObjectValues(payload)
    );
    if (response.success) {
      const responseData = response.data as {
        status: number;
        name: string;
        data: { fileName: string; url: string }[];
      };
      if (responseData.status === 1) {
        setAuth(true);
        setName(responseData.name);
        setData(responseData.data);
        setPageLoading(false);
      }
    } else {
      console.log(response.error);
      setPageLoading(false);
    }
  };

  const delete_locker = async () => {
    setDeleteLoading(true);
    const payload = {
      name: id,
      passkey: passkey,
    };
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete`,
      encryptObjectValues(payload)
    );
    if (response.success) {
      if ((response.data as { status: number }).status === 1) {
        setDeleteLoading(false);
        redirect("/");
      } else {
        setDeleteLoading(false);
        console.log(response.error);
      }
    }
  };

  const addFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files && e.target.files[0]) {
      formData.append("file", e.target.files[0], e.target.files[0].name);
    }
    formData.append("name", encrypt(id));
    formData.append("passkey", encrypt(passkey));
    setImage(formData);
  };

  const uploadFile = async () => {
    setLoading(true);
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/`,
      image
    );
    if (response.success) {
      check_key();
      image.delete("file");
      setLoading(false);
    } else {
      console.log(response.error);
    }
  };

  const deleteFile = async (fileName: string) => {
    const payload = {
      name: id,
      passkey: passkey,
      fileName: fileName,
    };
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_file`,
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

  if (pageLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Image
          src="/assets/loading.svg"
          alt="loading"
          width={50}
          height={50}
          className="animate-spin"
        />
      </div>
    );
  }

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
        <div className="flex flex-col items-center bg-lightgrey rounded-lg p-10 gap-5 w-1/3 max-[602px]:w-[90%] max-[1165px]:w-1/2">
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
            <button
              className={`${deleteLoading ? "text-red-400" : "text-red-500"}`}
              onClick={delete_locker}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
            <button className="" onClick={() => setDeleteLocker(!deleteLocker)}>
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center flex-col gap-5">
      <div className="flex flex-col items-center gap-5 w-[80%] px-5 my-20 max-[602px]:w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-4xl">{name}</h1>

          <button
            className="bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition-all"
            onClick={() => setDeleteLocker(!deleteLocker)}
          >
            Delete
          </button>
        </div>

        <div className="flex flex-col items-start justify-center rounded-lg w-full">
          <p className="text-2xl p-5 pl-0 text-grey">
            {data.length} {data.length < 2 ? "file" : "files"}
          </p>
          <div className="grid grid-cols-3 gap-5 w-full max-[812px]:grid-cols-1 max-[1165px]:grid-cols-2">
            {data.length > 0 &&
              data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-4 w-full bg-lightgrey rounded-lg hover:shadow-md transition-all"
                >
                  <span className="flex gap-2 w-[80%]">
                    <Image
                      src="/assets/file.svg"
                      alt="file"
                      width={15}
                      height={15}
                    />
                    <p className="">
                      {item?.fileName.length > 10
                        ? `${item?.fileName.substring(0, 12)}...`
                        : item?.fileName}
                    </p>
                  </span>
                  <span className="flex gap-2">
                    <button
                      onClick={() => {
                        deleteFile(item?.fileName);
                      }}
                    >
                      <Image
                        src="/assets/delete.svg"
                        alt="delete"
                        width={15}
                        height={15}
                      />
                    </button>
                    <Link
                      href={item?.url}
                      download={item?.fileName}
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
        </div>

        {data.length < 10 ? (
          <span className="flex flex-col gap-5 items-center justify-center w-full">
            <label
              htmlFor="fileInput"
              className="border-grey border-dashed border-2 w-full rounded-lg relative cursor-pointer p-10"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justfiy-center flex-col gap-5">
                <Image
                  src="/assets/uploadFile.svg"
                  height={30}
                  width={30}
                  alt="Upload File"
                  className="h-14 w-auto"
                />
                {image.get("file") ? (
                  <p className="font-light">
                    {(image.get("file") as File)?.name}
                  </p>
                ) : (
                  <p>Click to upload a file</p>
                )}
              </div>
              <input
                className="border-2 border-grey border-dashed p-8 rounded-lg w-full z-10 flex items-center justify-center invisible"
                id="fileInput"
                type="file"
                onChange={(e) => {
                  addFiles(e);
                }}
                accept=".png,.svg,.jpg,.ico,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              />
            </label>
            {image.get("file") ? (
              <span className="w-full">
                <button
                  onClick={() => {
                    if (!loading) {
                      uploadFile();
                    }
                  }}
                  className={`${
                    loading ? "bg-grey cursor-not-allowed" : "bg-black"
                  } text-white py-4 px-8 rounded-lg hover:bg-grey transition-all w-full`}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </span>
            ) : (
              <button className="bg-grey text-white py-4 px-8 rounded-lg w-full">
                Select a file
              </button>
            )}
          </span>
        ) : (
          <p className="text-red-500 font-light">Limit reached</p>
        )}
        {deleteLocker && <DeleteLocker />}
      </div>
    </div>
  );
}
