import { CHAR_TYPES } from "../types";

export type GearClass = string[][]



const weapons: GearClass = [];
const magazines: GearClass = [];

export function generateGear(example: GearClass) {
  return example.map(array => [CHAR_TYPES.NUMBER+array[0],CHAR_TYPES.STRING+array[1]]);
}

export {weapons, magazines};