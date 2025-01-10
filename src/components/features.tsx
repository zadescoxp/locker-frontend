import Image from "next/image";

export default function Feature() {
  return (
    <div className="flex flex-col items-center justify-start px-5 gap-5 w-screen pb-40">
      <h1 className="text-3xl">Features</h1>
      <div className="flex items-center justify-between gap-x-10 w-[80%] bg-lightgrey">
        <div className="w-1/2 flex items-center justify-center">
          <ol className="flex flex-col gap-5 items-start justify-center text-xl px-5">
            <li>
              <h1>No Login Required 🚫</h1>
              <p className="text-sm font-light">
                Share files effortlessly without creating an account. Simply
                create a locker with a unique passkey.
              </p>
            </li>
            <li>
              <h1>Secure Lockers 🔒</h1>
              <p className="text-sm font-light">
                Each locker is protected by its own passkey, ensuring only
                authorized access.
              </p>
            </li>
            <li>
              <h1>Easily Shareable 🔗</h1>
              <p className="text-sm font-light">
                Share your locker by providing its name and passkey—quick and
                simple!
              </p>
            </li>
            <li>
              <h1>Open Source 🌐</h1>
              <p className="text-sm font-light">
                Vouz is fully open-source, inviting contributions, feedback, and
                new ideas from the community.
              </p>
            </li>
          </ol>
        </div>
        <div className="relative w-1/2 h-[70vh]">
          <Image
            fill
            objectFit="cover"
            src="/assets/features.jpg"
            alt="Feature"
          />
        </div>
      </div>
    </div>
  );
}
