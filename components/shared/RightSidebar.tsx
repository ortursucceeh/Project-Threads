import { fetchRandomUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";
import { fetchRandomCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "../cards/CommunityCard";

const RightSidebar = async () => {
  const users = await fetchRandomUsers();
  const communities = await fetchRandomCommunities();

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-col justify-start flex-1">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
        <ul className="flex flex-col gap-3 mt-3">
          {communities.map((community) => (
            <UserCard
              id={community.id}
              username={community.username}
              name={community.name}
              image={community.image}
              personType="Community"
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-start flex-1">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <ul className="flex flex-col gap-3 mt-3">
          {users.map((user) => (
            <UserCard
              id={user.id}
              username={user.username}
              name={user.name}
              image={user.image}
              personType="User"
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RightSidebar;
