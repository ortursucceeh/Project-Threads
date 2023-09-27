"use client";

import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const pathname = usePathname();
  return (
    <Image
      src="/assets/delete.svg"
      alt="Delete"
      width={24}
      height={24}
      className="object-contain cursor-pointer"
      onClick={() => deleteThread(id, pathname)}
    />
  );
};

export default DeleteButton;
