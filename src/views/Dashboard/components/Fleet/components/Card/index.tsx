import React from "react";
import { useIntl } from "react-intl";
import { Text } from "~/components/common/Text";
import { BlurBackground } from "~/components/layout/BlurBackground";
import { Flex } from "~/components/layout/Flex";
import { ColorName } from "~/components/layout/Pane";
import { Progress } from "~/components/Progress";
import { NormalizedShipStakingInfoExtended, StarAtlasEntity } from "~/types";
import { Heading } from "~/views/Dashboard/components/Fleet/components/Card/components/Heading";
import { Image } from "~/views/Dashboard/components/Fleet/components/Card/components/Image";

type Props = {
  ship?: StarAtlasEntity;
  stakeInfo?: NormalizedShipStakingInfoExtended;
};

const shipColors: { [key: string]: ColorName } = {
  "xx-small": "white",
  "x-small": "indigo-300",
  small: "yellow-500",
  medium: "green-500",
  large: "pink-600",
  capital: "purple-400",
  commander: "red-600",
};

export const Card = ({ ship, stakeInfo }: Props) => {
  const intl = useIntl();

  if (!ship) {
    return null;
  }

  return (
    <BlurBackground
      direction="col"
      className="overflow-hidden block flex-0 relative"
    >
      <Image src={ship?.image} alt={ship?.name} />

      <div className="relative pb-8 sm:pb-16 md:pb-10 lg:w-full">
        <main className="relative z-10 pt-5 mx-auto w-full px-4 sm:pt-12 sm:px-6 md:pt-10 lg:px-8">
          <div className="sm:text-center lg:text-left">
            <Heading
              color={shipColors[ship?.attributes?.class?.toLowerCase()]}
              title={ship?.name}
              subtitle={ship?.attributes?.class}
            />
            <div className="mt-3 sm:mt-5 sm:mx-auto md:mt-5 lg:mx-0">
              <Flex direction="row" className="w-full">
                <Flex justify="start" align="center">
                  <img src={`/images/icons/rocket-solid.svg`} className="h-5 w-5 text-white" />
                  <Text color="white" weight="semibold" size="xl" className="ml-2">
                    {stakeInfo?.shipQuantityInEscrow}
                  </Text>
                </Flex>
              </Flex>
              <Flex py={3} direction="col" className="space-y-4">
                <Progress
                  title={"Health"}
                  max={stakeInfo?.toolkitMaxReserve || 1}
                  level={
                    (stakeInfo?.toolkitMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.repairedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneToolkit || 1)
                  }
                  millisecondsToBurnOne={stakeInfo?.millisecondsToBurnOneToolkit || 0}
                />
                <Progress
                  title={"Fuel"}
                  max={stakeInfo?.fuelMaxReserve || 1}
                  level={
                    (stakeInfo?.fuelMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.fueledAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneFuel || 1)
                  }
                  millisecondsToBurnOne={stakeInfo?.millisecondsToBurnOneFuel || 0}
                />
                <Progress
                  title={"Food"}
                  max={stakeInfo?.foodMaxReserve || 1}
                  level={
                    (stakeInfo?.foodMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.fedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneFood || 1)
                  }
                  millisecondsToBurnOne={stakeInfo?.millisecondsToBurnOneFood || 0}
                />
                <Progress
                  title={"Ammo"}
                  max={stakeInfo?.armsMaxReserve || 1}
                  level={
                    (stakeInfo?.armsMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.armedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneArms || 1)
                  }
                  millisecondsToBurnOne={stakeInfo?.millisecondsToBurnOneArms || 0}
                />
              </Flex>
            </div>
          </div>
        </main>
      </div>
    </BlurBackground>
  );
};
