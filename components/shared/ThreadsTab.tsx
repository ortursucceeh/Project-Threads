import {
  fetchUser,
  fetchUserPosts,
  fetchUserSaved,
} from "@/lib/actions/user.actions";
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
  userSaves: { _id: string }[];
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
  userSaves,
  tabType,
}: Props) => {
  let result: any;
  const userInfo = await fetchUser(currentUserId);

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else if (tabType === "threads" && accountType === "User") {
    result = await fetchUserPosts(accountId);
  } else if (tabType === "replies" && accountType === "User") {
    result = await fetchUserReplies(accountId);
  } else {
    result = await fetchUserSaved(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="flex flex-col gap-10 mt-9">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={currentUserId}
          currentUser_id={userInfo._id.toString()}
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
          likes={thread.likes}
          canDelete={userInfo._id.toString() === thread.author._id.toString()}
          isSaved={userSaves
            .map((thread) => thread._id)
            ?.includes(thread._id.toString())}
          isComment={tabType === "replies" ? true : false || thread.parentId}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
