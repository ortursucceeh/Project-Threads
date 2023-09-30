import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);
  let parentThread;

  if (thread?.parentId) {
    parentThread = await fetchThreadById(thread.parentId);
  }

  return (
    <section>
      {parentThread && (
        <>
          <div>
            <ThreadCard
              key={`${parentThread._id}_parent`}
              id={parentThread._id.toString()}
              currentUserId={user?.id || ""}
              parentId={parentThread.parentId}
              content={parentThread.text}
              author={parentThread.author}
              community={parentThread.community}
              createdAt={parentThread.createdAt}
              comments={parentThread.children}
              likes={parentThread.likes}
            />
          </div>
          <div className="thread-card_bar "></div>
          <p className="my-3 ml-5 p-2 text-light-3">
            Replying to{" "}
            <span className="text-primary-500">@{thread.author.name}</span>
          </p>
        </>
      )}

      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id.toString()}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id.toString()}
            id={childItem._id.toString()}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            likes={thread.likes}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
