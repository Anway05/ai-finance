import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto my-24 md:my-28 px-4">{children}</div>;
};

export default MainLayout;
