import { ReactNode } from "react";

export default function ProjectLayout({
  children,
  taskModal,
}: {
  children: ReactNode;
  taskModal: ReactNode;
}) {
  return (
    <>
      {children}
      {taskModal}
    </>
  );
}
