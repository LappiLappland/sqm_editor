import { CHAR_TYPES } from "../types";

interface overviewValue {
  content: any,
}

export interface imageSettings {
  src: string,
  width: string,
  height: string,
}

interface overviewI {
  title: string,
  image: imageSettings,
  description: overviewValue,
}

export function createBasicOverviewValue() {
  return {
    content: {},
  }
}

const overview: overviewI = {
  title: CHAR_TYPES.STRING+'',
  image: {
    src: CHAR_TYPES.STRING+'',
    width: CHAR_TYPES.NUMBER+'170',
    height: CHAR_TYPES.NUMBER+'64',
  },
  description: createBasicOverviewValue(),
}

export default overview;