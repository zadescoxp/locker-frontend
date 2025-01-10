import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center py-6 px-10">
      <Link href="/">
        <Image
          className="h-7 w-auto"
          src="assets/VOUZ.svg"
          height={100}
          width={500}
          alt="VOUZ"
        />
      </Link>

      <Link href="https://github.com/zadescoxp/locker-frontend" target="_blank">
        <Image
          className="h-6 w-auto"
          src="assets/github.svg"
          height={100}
          width={500}
          alt="GITHUB"
        />
      </Link>
    </div>
  );
}
