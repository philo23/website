import React from "react";

export function Button({ children, ...props }: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className="rounded inline-flex items-center h-10 px-4 bg-slate-500 text-white border-2 border-transparent hover:bg-slate-600 hover:text-white hover:border-white/30 hover:shadow-inner transition-all duration-200"
    >
      {children}
    </a>
  );
}
