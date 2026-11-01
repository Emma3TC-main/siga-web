export interface StockPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

/** Loads the finite page range advertised by the first backend response and deduplicates by id. */
export async function collectStockPages<T extends { id: string }>(
  fetchPage: (page: number) => Promise<StockPage<T>>,
): Promise<T[]> {
  const collected: T[] = [];
  const seen = new Set<string>();
  let requestedPage = 0;
  let expectedPages: number | undefined;

  while (expectedPages === undefined || requestedPage < expectedPages) {
    const data = await fetchPage(requestedPage);
    if (data.page !== requestedPage || data.size <= 0) {
      throw new Error('La paginación de inventario devolvió metadatos inconsistentes.');
    }
    expectedPages ??= Math.ceil(data.totalElements / data.size);

    for (const item of data.content) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      collected.push(item);
    }

    if (data.content.length === 0) break;
    requestedPage += 1;
  }
  return collected;
}
