import { CHAR_TYPES } from "../types";

export interface SoundClass {
  className: string,
  name: string,
  keepName: boolean,
  filePath: string,
  volume: string,
  pitch: string,
  titlesFont: string,
  titlesSize: string,
  forceTitles: boolean,
  titles: string[][],
}

export function createSoundClass(): SoundClass {
  return {
    className: CHAR_TYPES.STRING+'newSound',
    name: CHAR_TYPES.STRING+'',
    keepName: false,
    filePath: CHAR_TYPES.STRING+'',
    volume: CHAR_TYPES.NUMBER+'',
    pitch: CHAR_TYPES.NUMBER+'',
    titlesFont: CHAR_TYPES.STRING+'',
    titlesSize: CHAR_TYPES.NUMBER+'',
    forceTitles: false,
    titles: []
  };
}

export function generateSoundClass(example: SoundClass): SoundClass {
  
  const typedTitles = example.titles.map((array) => [CHAR_TYPES.NUMBER+array[0],CHAR_TYPES.STRING+array[1]]);
  
  return {
    className: CHAR_TYPES.STRING+example.className,
    name: CHAR_TYPES.STRING+example.name,
    keepName: example.keepName,
    filePath: CHAR_TYPES.STRING+example.filePath,
    volume: CHAR_TYPES.NUMBER+example.volume,
    pitch: CHAR_TYPES.NUMBER+example.pitch,
    titlesFont: CHAR_TYPES.STRING+example.titlesFont,
    titlesSize: CHAR_TYPES.NUMBER+example.titlesSize,
    forceTitles: example.forceTitles,
    titles: typedTitles
  };
}

const cfgSounds: SoundClass[] = [];

export default cfgSounds;