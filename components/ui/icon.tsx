"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClick: () => void;
};

const Icon = ({ src, alt, width, height, onClick }: Props) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-contain cursor-pointer"
      onClick={onClick}
    />
  );
};

export default Icon;
