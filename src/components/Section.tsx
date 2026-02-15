import React from 'react';

export function Section({ children }: React.PropsWithChildren) {
  return (
    <section className="max-w-6xl mx-auto px-2 min-h-full">{children}</section>
  );
}
