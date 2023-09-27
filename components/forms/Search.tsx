"use client";

import {
  useEffect,
  useRef,
  useState,
  useDeferredValue,
  ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  placeholder: string;
  search?: string;
};

function Search({ placeholder, search }: Props) {
  const router = useRouter();
  const initialRender = useRef(true);

  const [searchValue, setSearchValue] = useState(search);
  const defferedValue = useDeferredValue(searchValue);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (searchValue) {
      router.push(`?search=${searchValue}`);
    } else {
      router.push("?");
    }
  }, [searchValue]);

  return (
    <div className="flex gap-2 px-4 bg-dark-2 rounded-xl">
      <Image
        src="/assets/search.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain cursor-pointer opacity-60"
      />
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-transparent outline-none text-light-1"
      />
    </div>
  );
}

export default Search;
