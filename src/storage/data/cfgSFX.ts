import { CHAR_TYPES } from "../types";

export interface SFXClass {
  className: string,
  name: string,
  keepName: boolean,
  sounds: string[][]
}

export function createSFXClass(): SFXClass {
  return {
    className: CHAR_TYPES.STRING+'newSFX',
    name: CHAR_TYPES.STRING+'',
    keepName: false,
    sounds: [],
  }
}

export function generateSFXClass(example: SFXClass): SFXClass {

  const typedSounds = example.sounds.map((element) => {
    const newElement = [...element];
    newElement[0] = CHAR_TYPES.STRING+newElement[0]
    newElement[1] = CHAR_TYPES.NUMBER+newElement[1]
    newElement[2] = CHAR_TYPES.NUMBER+newElement[2]
    newElement[3] = CHAR_TYPES.NUMBER+newElement[3]
    newElement[4] = CHAR_TYPES.NUMBER+newElement[4]
    newElement[5] = CHAR_TYPES.NUMBER+newElement[5]
    newElement[6] = CHAR_TYPES.NUMBER+newElement[6]
    return newElement;
  });

  return {
    className: CHAR_TYPES.STRING+example.className,
    name: CHAR_TYPES.STRING+example.name,
    keepName: example.keepName,
    sounds: typedSounds,
  }
}

const cfgSFX: SFXClass[] = [];

export default cfgSFX;