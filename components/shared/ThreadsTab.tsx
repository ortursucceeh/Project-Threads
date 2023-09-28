import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";
import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserReplies } from "@/lib/actions/user.actions";
import { TabsType } from "@/types/thread.types";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  tabType: TabsType;
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
  tabType,
}: Props) => {
  let result: any;
  const userInfo = await fetchUser(currentUserId);

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else if (tabType === "threads" && accountType === "User") {
    result = await fetchUserPosts(accountId);
  } else {
    result = await fetchUserReplies(accountId);
  }

  // console.log("result :>> ", result);

  if (!result) redirect("/");

  return (
    <section className="flex flex-col gap-10 mt-9">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User" && tabType === "threads"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          canDelete={userInfo._id.toString() === thread.author._id.toString()}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
