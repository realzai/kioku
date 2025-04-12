import * as React from "react";
import type { HTMLAttributes } from "react";

export const Container: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`mx-auto max-w-6xl w-full p-4 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
};
