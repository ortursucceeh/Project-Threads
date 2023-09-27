import UserCard from "@/components/cards/UserCard";
import Search from "@/components/forms/Search";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
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

  const result = await fetchUsers({
    userId: user.id,
    searchString: search,
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="mb-10 head-text">Users</h1>
      <Search placeholder="Search for users" search={search} />

      <div className="flex flex-col mt-14 gap-9">
        {result.users.length === 0 ? (
          <p className="no-result"></p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
