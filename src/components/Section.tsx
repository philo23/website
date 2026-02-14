import React from "react";

export function Section({ children }: React.PropsWithChildren) {
  return (
    <section className="container mx-auto min-h-full">
      {children}
    </section>
  );
}
