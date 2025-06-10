export const GATE_TYPE = {
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
} as const;

export const GATE_TYPES = Object.values(GATE_TYPE);

export type GateType = typeof GATE_TYPE[keyof typeof GATE_TYPE];
