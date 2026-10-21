import { useState } from "react";

export function ProvaFailClosed({ ativo }: { ativo: boolean }) {
  if (ativo) {
    const [valor] = useState(0);
    return <div>{valor}</div>;
  }
  return null;
}
