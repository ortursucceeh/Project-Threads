import CommunityCard from "@/components/cards/CommunityCard";
import Search from "@/components/forms/Search";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) redirect("/onboarding");
  const search = (searchParams.search || "") as string;

  const result = await fetchCommunities({
    searchString: search,
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="mb-10 head-text">Communities</h1>
      <Search placeholder="Search for communities" search={search} />

      <div className="flex flex-wrap mt-14 gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result"></p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
