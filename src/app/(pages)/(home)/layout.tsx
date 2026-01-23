import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren): React.JSX.Element => {
  return (
    <div className="relative mx-auto max-w-400 px-10 flex flex-col min-h-svh justify-center">
      <h1 className="text-3xl font-bold pt-6 absolute top-0">
        Expense Tracker
      </h1>
      <div className="w-full ">{children}</div>
    </div>
  );
};

export default Layout;
