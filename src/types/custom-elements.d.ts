import type { ComponentPropsWithoutRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "w3m-button": ComponentPropsWithoutRef<"button">;
    }
  }
}
