import { CHAR_TYPES } from "../types";

export interface IdentityClass {
  className: string,
  name: string,
  speaker: string,
  pitch: string,
  glasses: string,
  face: string,
}

export function createIdentityClass(): IdentityClass {
  return {
    className: CHAR_TYPES.STRING+'newPerson',
    name: CHAR_TYPES.STRING+'',
    speaker: CHAR_TYPES.STRING+'',
    pitch: CHAR_TYPES.NUMBER+'',
    glasses: CHAR_TYPES.STRING+'',
    face: CHAR_TYPES.STRING+'',
  };
}

export function generateIdentityClass(example: IdentityClass): IdentityClass {
  return {
    className: CHAR_TYPES.STRING+example.className,
    name: CHAR_TYPES.STRING+example.name,
    speaker: CHAR_TYPES.STRING+example.speaker,
    pitch: CHAR_TYPES.NUMBER+example.pitch,
    glasses: CHAR_TYPES.STRING+example.glasses,
    face: CHAR_TYPES.STRING+example.face,
  };
}

const cfgIdentities: IdentityClass[] = [];

export default cfgIdentities;