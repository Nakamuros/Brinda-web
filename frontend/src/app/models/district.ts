/** Forma de `PublicDistrictResponse`: distrito con reparto y tarifa estimada de su zona. */
export interface District {
  id: number;
  name: string;
  zoneName: string;
  fee: number;
}
