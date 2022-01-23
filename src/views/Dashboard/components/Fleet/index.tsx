import { Heading } from "~/components/common/Heading";
import { EmptyView } from "~/components/EmptyView";
import { Flex } from "~/components/layout/Flex";
import { LoadingView } from "~/components/LoadingView";
import { usePlayerStore } from "~/stores/usePlayerStore";
import { Card } from "~/views/Dashboard/components/Fleet/components/Card";

export const Fleet = () => {
  const fleet = usePlayerStore((s) => s.fleet);

  return (
    <Flex direction="col" className="z-10 space-y-5">
      <Heading title="Fleet.Heading.title" />
      {fleet === null ? (
        <LoadingView />
      ) : !fleet?.length ? (
        <EmptyView
          image="/images/icons/rocket-solid.svg"
          title="No ships found"
        />
      ) : (
        <>
          <Flex
            justify="center"
            direction="col"
            className="grid grid-cols-1 xl:grid-cols-2 gap-5"
          >
            {fleet.map((fleetData) => (
              <Card key={fleetData?.ship?.mint} {...fleetData} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
};
