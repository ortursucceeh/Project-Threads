"use client";

import { addLikeToThread, SavedThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  id: string;
  currentUserId: string;
  type: "like" | "bookmark";
  pathname?: string;
};

const Icon = ({
  src,
  alt,
  width,
  height,
  id,
  currentUserId,
  type = "like",
}: Props) => {
  const path = usePathname();

  const handleClick = () => {
    if (type === "like") {
      addLikeToThread(id, currentUserId, path);
    } else {
      saveThread(id, currentUserId, path);
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-contain cursor-pointer"
      onClick={handleClick}
    />
  );
};

export default Icon;
