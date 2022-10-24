import { captureException } from "@sentry/nextjs";
import { Cluster } from "@solana/web3.js";
import { pipe } from "fp-ts/function";
import { ReadPreference } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { attachClusterMiddleware } from "~/middlewares/attachCluster";
import { matchMethodMiddleware } from "~/middlewares/matchMethod";
import { matchSignatureMiddleware } from "~/middlewares/matchSignature";
import { useMongoMiddleware } from "~/middlewares/useMongo";
import { getMongoDatabase, mongoClient } from "~/pages/api/mongodb";
import { Self } from "~/types/api";

const handler = async ({ body }: NextApiRequest, res: NextApiResponse) => {
  const { cluster, publicKey, discordId } = body;

  const db = getMongoDatabase(cluster as Cluster);

  const userCollection = db.collection<Self>("users");

  const userWithSameDiscordId = await userCollection.findOne({
    discordId,
  });

  const currentUser = await userCollection.findOne({
    wallets: { $in: [publicKey] },
  });

  if (!currentUser) {
    res.status(200).json({
      success: false,
      error: `User not found.`,
    });

    return;
  }

  if (!userWithSameDiscordId) {
    const user = await userCollection.findOneAndUpdate(
      {
        _id: currentUser._id,
      },
      { $set: { discordId } }
    );

    if (!user) {
      res.status(200).json({
        success: false,
        error: `Cannot update user`,
      });

      return;
    }

    res.status(200).json({
      success: true,
      user: user.value,
    });
    return;
  }

  if (!currentUser._id.equals(userWithSameDiscordId._id)) {
    const transactionOptions = {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
      readPreference: ReadPreference.primary,
    } as const;

    const session = mongoClient.startSession();

    try {
      session.startTransaction(transactionOptions);

      await userCollection.deleteOne({
        wallets: { $in: [publicKey] },
      });

      // Merging the 2 different users
      const user = await userCollection.findOneAndUpdate(
        {
          discordId,
        },
        { $push: { wallets: publicKey } }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        user: user.value,
      });
    } catch (error) {
      captureException(error, { tags: { publicKey, api: "/self/link" } });

      // if (
      //   error instanceof MongoError &&
      //   error.hasErrorLabel("UnknownTransactionCommitResult")
      // ) {
      //   // add your logic to retry or handle the error
      // } else if (
      //   error instanceof MongoError &&
      //   error.hasErrorLabel("TransientTransactionError")
      // ) {
      //   // add your logic to retry or handle the error
      // } else {
      //   console.log(
      //     "An error occured in the transaction, performing a data rollback:" +
      //       error
      //   );
      // }

      await session.abortTransaction();

      res.status(200).json({
        success: false,
        error: `Error modifing the user`,
      });
    } finally {
      await session.endSession();
    }
  }
};

export default pipe(
  handler,
  useMongoMiddleware,
  matchMethodMiddleware(["POST"]),
  attachClusterMiddleware,
  matchSignatureMiddleware
);
