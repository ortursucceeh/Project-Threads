import Spinner from "@/components/ui/spinner";

const Loading = () => {
  return (
    <section className="py-24">
      <div className="container flex items-center justify-center">
        <Spinner />
      </div>
    </section>
  );
};

export default Loading;
