import { Price } from "~/components/common/Price";
import { Flex } from "~/components/layout/Flex";
import { ColorName } from "~/components/layout/Pane";
import { Currency } from "~/types";

type Param = Record<string, unknown> & {
  accessor: string;
  color?: ColorName;
  currency: Currency;
  name: string;
};

export const buildPriceColumn = ({
  accessor,
  currency,
  name,
  ...rest
}: Param) => ({
  Header: name,
  accessor,
  ...rest,
  Cell: ({ cell }) => (
    <Flex justify="end">
      <Price currency={currency} value={cell.value} />
    </Flex>
  ),
});

export const buildAtlasPriceColumn = ({
  accessor,
  atlasValue,
  name,
}: Omit<Param, "currency"> & { atlasValue: number }) => ({
  Header: name,
  accessor,
  Cell: ({ cell }) => (
    <Flex justify="end">
      {cell.value ? (
        <Flex direction="col" className="space-y-1">
          <Price currency={"ATLAS"} value={cell.value} />
          <Flex>
            ( <Price currency={"USDC"} value={cell.value * atlasValue} /> )
          </Flex>
        </Flex>
      ) : (
        "-"
      )}
    </Flex>
  ),
});
