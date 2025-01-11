import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-lightgrey text-grey text-center flex items-center justify-center flex-col py-10 px-5 font-light max-[602px]:text-sm">
      <p>
        Made by{" "}
        <Link
          className="text-black"
          href="https://zadescoxp.com"
          target="_blank"
        >
          @zadescoxp
        </Link>
      </p>

      <p>
        Vouz is an open source project, show your love and contribution on{" "}
        <Link
          className="text-black"
          href="https://github.com/zadescoxp/locker-frontend"
          target="_blank"
        >
          GitHub
        </Link>
      </p>
    </div>
  );
}
