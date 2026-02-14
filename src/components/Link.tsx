import React from "react";
import clsx from "clsx";

export function Link({ className, children, ...props }: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={clsx(
        "inline-flex items-center underline text-blue-600 hover:text-blue-900 transition-all duration-200",
        className
      )}
    >
      {children}
    </a>
  );
}
