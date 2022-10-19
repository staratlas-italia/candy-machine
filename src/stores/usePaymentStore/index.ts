import { Cluster, PublicKey } from "@solana/web3.js";
import invariant from "invariant";
import create from "zustand";
import { confirmPayment } from "~/network/payments/confirm";
import { fetchPaymentReference } from "~/network/payments/reference";
import { usePlayerStore } from "~/stores/usePlayerStore";
import { Faction } from "~/types";

type PaymentStore = {
  faction: Faction | null;
  reference: string | null;
  isConfirming: boolean;
  isFetchingReference: boolean;
  confirm: (_: {
    cluster: Cluster;
    publicKey: string;
    reference: string;
  }) => Promise<boolean | null>;
  fetchReference: (_: { cluster?: Cluster; publicKey: PublicKey }) => void;
};

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  faction: null,
  reference: null,
  isConfirming: false,
  isFetchingReference: false,
  confirm: async ({ cluster, publicKey, reference }) => {
    if (get().isConfirming) {
      return null;
    }

    set({ isConfirming: true });

    const response = await confirmPayment({
      cluster,
      publicKey: publicKey.toString(),
      reference,
    });

    if (!response.success) {
      return false;
    }

    if (response.verified) {
      return true;
    }

    set({ isConfirming: false });

    return null;
  },
  fetchReference: async ({ cluster, publicKey }) => {
    const faction = get().faction;

    if (get().isFetchingReference || !faction) {
      return null;
    }

    set({ isFetchingReference: true });

    const self = usePlayerStore.getState().self;

    invariant(
      self,
      "This hook is meant to be used inside a SelfRetriever component"
    );

    const response = await fetchPaymentReference({
      cluster,
      faction,
      publicKey: publicKey.toString(),
      userId: self._id.toString(),
    });

    const { reference } = response || {
      reference: null,
    };

    set({ isFetchingReference: false, reference });
  },
}));
