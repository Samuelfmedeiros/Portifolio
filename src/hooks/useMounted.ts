"use client";

import { useEffect, useState } from "react";

/**
 * useMounted — gate de SSR para animações framer-motion.
 *
 * Pitfall família #418/#50/#142: `initial={{opacity:0}}` (ou `animate`
 * condicionado a mounted) serializa opacity:0 no HTML do servidor — o conteúdo
 * só existe após hidratação (e nunca, com JS bloqueado/atrasado). Padrão
 * correto: SSR e 1º render client nascem VISÍVEIS (`initial:false`); a
 * animação de entrada só roda no cliente após o mount.
 *
 * Uso:
 *   const mounted = useMounted();
 *   <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} ... />
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
