// Ordem dos cards da seção de projetos.
//
// Samuel 14/11/2026: "Card do TatuEngine vai ficar em primeiro" (antes era
// DogWalk). A ordem vive aqui — e não inline em page.tsx — porque `sort` com
// pares de `if` só garante UM primeiro lugar: com dois nomes na disputa o
// segundo vira o primeiro dependendo da ordem de entrada do Map. Uma lista
// explícita de prioridade ordena N nomes e é testável sem renderizar a página.

export const PROJECT_PRIORITY = ["TatuEngine", "DogWalk"] as const;

type Named = { name: string };

/**
 * Ordena por PROJECT_PRIORITY e mantém a ordem original para o resto.
 * Não muta a entrada.
 */
export function orderProjects<T extends Named>(projects: readonly T[]): T[] {
  return [...projects].sort((a, b) => {
    const ia = (PROJECT_PRIORITY as readonly string[]).indexOf(a.name);
    const ib = (PROJECT_PRIORITY as readonly string[]).indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return 0;
  });
}
