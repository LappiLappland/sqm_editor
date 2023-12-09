import { CHAR_TYPES } from "../types";

export interface RadioClass {
  className: string,
  name: string,
  title: string,
  keepName: false,
  filePath: string,
  volume: string,
  pitch: string,
}

export function createRadioClass(): RadioClass {
  return {
    className: CHAR_TYPES.STRING+'newRadio',
    name: CHAR_TYPES.STRING+'',
    title: CHAR_TYPES.STRING+'',
    keepName: false,
    filePath: CHAR_TYPES.STRING+'',
    volume: CHAR_TYPES.NUMBER+'',
    pitch: CHAR_TYPES.NUMBER+'',
  };
}

export function generateRadioClass(example: RadioClass): RadioClass {
  return {
    className: CHAR_TYPES.STRING+example.className,
    name: CHAR_TYPES.STRING+example.name,
    title: CHAR_TYPES.STRING+example.title,
    keepName: example.keepName,
    filePath: CHAR_TYPES.STRING+example.filePath,
    volume: CHAR_TYPES.NUMBER+example.volume,
    pitch: CHAR_TYPES.NUMBER+example.pitch,
  };
}

const cfgRadio: RadioClass[] = [];

export default cfgRadio;