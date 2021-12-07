import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Flex } from "~/components/layout/Flex";
import { Wallet } from "~/components/Wallet";

export const LogoLink = () => {
  return (
    <Link href={`/`}>
      <span className="cursor-pointer">
        <Flex align="center">
          <Image
            priority
            src="/images/logo.png"
            height={72 * 0.7}
            width={200 * 0.7}
            alt={"Start Atlas Italia"}
          />
        </Flex>
      </span>
    </Link>
  );
};

export const Header = () => (
  <Flex
    py={4}
    px={10}
    color="gray-800"
    align="center"
    justify="between"
    grow={1}
  >
    <LogoLink />

    <Flex className="hidden">
      <Wallet />
    </Flex>
  </Flex>
);