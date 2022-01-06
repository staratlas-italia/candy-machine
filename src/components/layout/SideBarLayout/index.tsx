import React, { PropsWithChildren } from "react";
import { BaseLayout } from "~/components/layout/BaseLayout";
import { SideBar } from "~/components/layout/SideBarLayout/components/SideBar";

export const SideBarLayout = React.memo(
  ({ children }: PropsWithChildren<unknown>) => {
    return (
      <>
        <SideBar />
        <BaseLayout fluid>
          <div className="container lg:px-5 lg:pl-80 mx-auto">{children}</div>
        </BaseLayout>
      </>
    );
  }
);