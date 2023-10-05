import InfiniteScrollThreads from "@/components/shared/InfiniteScrollThreads";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await fetchThreads(1, 15);
  const user = await currentUser();

  // console.log(result);

  return (
    <div key={Math.random()}>
      <h1 className="text-left head-text">Home</h1>
      <section className="flex flex-col gap-10 mt-9">
        {result.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <InfiniteScrollThreads
            initialThreads={result.threads}
            currentUserId={user?.id || ""}
          />
        )}
      </section>
    </div>
  );
}
