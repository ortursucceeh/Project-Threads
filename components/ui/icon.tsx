"use client";

import { addLikeToThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  id: string;
  currentUserId: string;
  type: "like" | "save";
  pathname: string;
};

const Icon = ({
  src,
  alt,
  width,
  height,
  id,
  currentUserId,
  pathname,
}: Props) => {
  const path = usePathname();
  // console.log("currentUserId from icon:>> ", currentUserId);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-contain cursor-pointer"
      onClick={() => {
        addLikeToThread(id, currentUserId, path);
      }}
    />
  );
};

export default Icon;
