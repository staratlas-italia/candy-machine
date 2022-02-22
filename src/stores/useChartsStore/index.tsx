import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { ChartType, getApiRoute } from "~/utils/getRoute";

export type ChartData = {
  loading: boolean;
  data: { label: string; value: number }[];
};

type ApiStore = {
  charts: Partial<Record<ChartType, ChartData>>;
  fetchChart: (
    chart: ChartType,
    publicKey: string,
    signature: string,
    force?: boolean
  ) => void;
  refreshChart: () => void;
  clear: () => void;
};

export const useChartsStore = create<ApiStore>(
  devtools(
    (set, get) => ({
      charts: {},
      fetchChart: async (
        chart: ChartType,
        publicKey: string,
        signature: string,
        force: boolean = false
      ) => {
        const chartData = get().charts?.[chart];

        if (!force && chartData) {
          // Skip fetch if data already exists
          return;
        }

        set((state) => ({
          charts: { ...state.charts, [chart]: { loading: true } },
        }));

        const respose = await axios.post(getApiRoute(`/api/charts/${chart}`), {
          publicKey,
          signature,
        });

        set((state) => ({
          charts: {
            ...state.charts,
            [chart]: { ...respose.data, loading: false },
          },
        }));
      },
      refreshChart: () => {},
      clear: () => {},
    }),
    { name: "API_STORE" }
  )
);
