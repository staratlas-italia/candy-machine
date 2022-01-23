import { useEffect } from "react";
import useSWR from "swr";
import { useShipContext } from "~/contexts/ShipsContext";
import { StarAtlasEntity } from "~/types";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useNullableShips = () => {
  const { update } = useShipContext();

  const { data, error } = useSWR<StarAtlasEntity[] | undefined>(
    "/api/ships",
    fetcher
  );

  useEffect(() => {
    if (data?.length) {
      update(data);
    }
  }, [data]);

  return {
    data,
    error,
    loading: !data && !error,
  };
};
