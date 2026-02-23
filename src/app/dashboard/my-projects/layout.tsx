import { ReactNode } from "react";

export default function MyProjectsLayout({
  children,
  create,
}: {
  children: ReactNode;
  create: ReactNode;
}) {
  return (
    <>
      {children}
      {create}
    </>
  );
}
