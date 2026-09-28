/** Espera artificial que reproduce la latencia percibida del prototipo. Solo la usan los repositorios demo. */
export function simulateLatency(ms: number): Promise<void> {
  return ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}
