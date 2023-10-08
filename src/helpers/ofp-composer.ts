import { getStorage } from "../storage/storage"
import { CHAR_TYPES } from "../storage/types"
import { calculateValue, MathScope } from './math-number'
import { stringSplice } from "./strings";

interface hashMap {
  [key: string]: any,
}

const desc = getStorage().description;

function convertStorageValueToOFPstyle(value: string | boolean, scope: MathScope = {}) {
  let valueStr: string | null;
  if (typeof value === 'string') {
    const typeChar = value[0] as CHAR_TYPES;
    switch (typeChar) {
      case CHAR_TYPES.NUMBER:
        try {
          valueStr = calculateValue(value.slice(1), scope);
        } catch (err) {
          valueStr = '';
        }
        break;
      default:
        if (value.length > 1) valueStr = '"' + value.slice(1) + '"'
        else valueStr = '';
        break;
    }
  }
  else if (typeof value === 'boolean') valueStr = (+value)+'';
  else {
    const error = new Error('Unknown type found inside description.ext storage');
    throw error;
  }
  return valueStr;
}

function convertTableArrayToOFPstyle(array: string[][], whichIndex: number) {
  if (array.length === 0) return '{ }';
  let str = '{ ';
  array.forEach((item, i) => {
    const value = convertStorageValueToOFPstyle(item[whichIndex], {x: i+1, X: i+1});
    if (i === array.length-1) str = str + value + ' }'
    else str = str + value + ', '
  })
  return str;
}

function convertArrayToOFPstyle(array: string[]) {
  if (array.length === 0) return '{ }'
  let str = '{ ';
  array.forEach((item, i) => {
    const value = convertStorageValueToOFPstyle(item);
    if (i === array.length-1) str = str + value + ' }'
    else str = str + value + ', '
  })
  return str;
}

function composeParams() {
  const strings: string[] = [];
  for (const [key, value] of Object.entries(desc.params)) {
    if (key !== 'param1' && key !== 'param2') {
      let valueStr = convertStorageValueToOFPstyle(value as string | boolean);
      if (valueStr) strings.push(`${key}=${valueStr};`)
    }
  }
  strings.push('\n')
  return strings;
}

function composeParamMission(id: '1' | '2') {
  const strings: string[] = [];
  const param = id === '1' ? desc.params.param1 : desc.params.param2;
  if (param.titleParam.length > 1) {

    if (param.array.find(item => item[2].length === 1)) {
      return [[],[`Param${id}: values has null value! Please enter at least something.`]]
    }

    strings.push(`titleParam${id} = ${convertStorageValueToOFPstyle(param.titleParam)};`);
    
    const values = convertTableArrayToOFPstyle(param.array, 2)
    strings.push(`valuesParam${id}[] = ${values};`)

    const defaultValueStr = param.array[+(param.defaultParam.slice(1))];
    const defaultValue = defaultValueStr ? convertStorageValueToOFPstyle(defaultValueStr[2]) : '0';
    strings.push(`defValueParam${id} = ${defaultValue};`)

    const texts = convertTableArrayToOFPstyle(param.array, 1)
    strings.push(`textsParam${id}[] = ${texts};`)

  }
  if (strings.length > 0) strings.push('\n')
  return [strings,[]];
}

function composeIdentity() {
  const identities = desc.cfgIdentities;
  if (identities.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};
  strings.push('class cfgIdentities\n{')
  identities.forEach(cls => {
    let identity = '';
    const className = cls.className.slice(1);
    if (hashMap[className]) {
      errors.push(`cfgIdentities: class ${className} already exists! Please, make className unique.`);
    } else {
      hashMap[className] = true;
      const name = convertStorageValueToOFPstyle(cls.name);
      const face = convertStorageValueToOFPstyle(cls.face);
      const glasses = convertStorageValueToOFPstyle(cls.glasses);
      const speaker = convertStorageValueToOFPstyle(cls.speaker);
      const pitch = convertStorageValueToOFPstyle(cls.pitch);
  
      identity = identity + `\tclass ${className}\n\t{\n`;
      identity = identity + `\t\t\tname = ${name};\n`;
      identity = identity + `\t\t\tface = ${face};\n`;
      identity = identity + `\t\t\tglasses = ${glasses};\n`;
      identity = identity + `\t\t\tspeaker = ${speaker};\n`;
      identity = identity + `\t\t\tpitch = ${pitch};\n`;
      identity = identity + '\t};';
      strings.push(identity);
    }
  })
  strings.push('};\n')
  return [strings, errors];
}

function composeSounds() {
  const sounds = desc.cfgSounds;
  if (sounds.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};
  strings.push('class cfgSounds\n{')
  sounds.forEach(cls => {
    let sound = '';
    const className = cls.className.slice(1);

    if (hashMap[className]) {
      errors.push(`cfgSounds: class ${className} already exists! Please, make className unique.`);
    } else {
      hashMap[className] = true;
      let filePath = convertStorageValueToOFPstyle(cls.filePath);
      if (filePath.length > 0 && filePath[1] !== '/') filePath = stringSplice(filePath, 1, 0, '/');
      const forceTitles = convertStorageValueToOFPstyle(cls.forceTitles);
      const name = convertStorageValueToOFPstyle(cls.name);
      const pitch = convertStorageValueToOFPstyle(cls.pitch);
      const titlesFont = convertStorageValueToOFPstyle(cls.titlesFont);
      const titlesSize = convertStorageValueToOFPstyle(cls.titlesSize);
      const volume = convertStorageValueToOFPstyle(cls.volume);
      const titles = convertArrayToOFPstyle(cls.titles.flat());
  
      sound = sound + `\tclass ${className}\n\t{\n`;
      sound = sound + `\t\t\tname = ${name};\n`;
      sound = sound + `\t\t\tsound[] = { ${filePath}, ${volume}, ${pitch} };\n`;
      sound = sound + `\t\t\ttitles[] = ${titles};\n`;
      if (titlesFont) sound = sound + `\t\t\ttitlesFont = ${titlesFont};\n`;
      if (titlesSize) sound = sound + `\t\t\ttitlesSize = ${titlesSize};\n`;
      if (forceTitles) sound = sound + `\t\t\tforceTitles = ${forceTitles};\n`;
      sound = sound + '\t};';
      strings.push(sound);
    }
  })
  strings.push('};\n')
  return [strings, errors];
}

function composeMusic() {
  const tracks = desc.cfgMusic;
  if (tracks.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};
  strings.push('class cfgMusic\n{')
  tracks.forEach(cls => {
    let track = '';
    const className = cls.className.slice(1);
    if (hashMap[className]) {
      errors.push(`cfgMusic: class ${className} already exists! Please, make className unique.`);
    } else {
      hashMap[className] = true;
      let filePath = convertStorageValueToOFPstyle(cls.filePath);
      if (filePath.length > 0 && filePath[1] !== '/') filePath = stringSplice(filePath, 1, 0, '/');
      const name = convertStorageValueToOFPstyle(cls.name);
      const pitch = convertStorageValueToOFPstyle(cls.pitch);
      const volume = convertStorageValueToOFPstyle(cls.volume);
  
      track = track + `\tclass ${className}\n\t{\n`;
      track = track + `\t\t\tname = ${name};\n`;
      track = track + `\t\t\tsound[] = { ${filePath}, ${volume}, ${pitch} };\n`;
      track = track + '\t};';
      strings.push(track);
    }
  })
  strings.push('};\n')
  return [strings, errors];
}

function composeRadio() {
  const radios = desc.cfgRadio;
  if (radios.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};
  strings.push('class cfgRadio\n{')
  radios.forEach(cls => {
    let radio = '';
    const className = cls.className.slice(1);
    if (hashMap[className]) {
      errors.push(`cfgRadio: class ${className} already exists! Please, make className unique.`);
    } else {
      hashMap[className] = true;
      let filePath = convertStorageValueToOFPstyle(cls.filePath);
      if (filePath.length > 0 && filePath[1] !== '/') filePath = stringSplice(filePath, 1, 0, '/');
      const name = convertStorageValueToOFPstyle(cls.name);
      const pitch = convertStorageValueToOFPstyle(cls.pitch);
      const volume = convertStorageValueToOFPstyle(cls.volume);
      const title = convertStorageValueToOFPstyle(cls.title);
  
      radio = radio + `\tclass ${className}\n\t{\n`;
      radio = radio + `\t\t\tname = ${name};\n`;
      radio = radio + `\t\t\tsound[] = { ${filePath}, ${volume}, ${pitch} };\n`;
      radio = radio + `\t\t\ttitle = ${title};\n`;
      radio = radio + '\t};';
      strings.push(radio);
    }
  })
  strings.push('};\n')
  return [strings, errors];
}

function composeSFX() {
  const SFXs = desc.cfgSFX;
  if (SFXs.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};
  strings.push('class cfgSFX\n{');
  SFXs.forEach(cls => {
    let SFX = '';
    const className = cls.className.slice(1);
    if (hashMap[className]) {
      errors.push(`cfgSFX: class ${className} already exists! Please, make className unique.`);
    } else {
      hashMap[className] = true;
      const name = convertStorageValueToOFPstyle(cls.name);
      const empty = `\t\t\tempty[] = {"", 0, 0, 0, 0, 0, 0};\n`;
  
      SFX = SFX + `\tclass ${className}\n\t{\n`;
      SFX = SFX + `\t\t\tname = ${name};\n`;
  
      let sounds = '\t\t\tsounds[] = { ';
      cls.sounds.forEach((sound, index) => {
        if (sound[0].length > 0 && sound[0][1] !== '/') sound=[stringSplice(sound[0], 1, 0, '/'), sound[1], sound[2], sound[3], sound[4], sound[5], sound[6]];
        SFX = SFX + `\t\t\tsound${index}[] = ${convertArrayToOFPstyle(sound)};\n`;
        if (index === cls.sounds.length-1) sounds = sounds + `sound${index}`
        else sounds = sounds + `sound${index}, `;
      })
      sounds = sounds + ` };\n`;
  
      SFX = SFX + sounds;
      SFX = SFX + empty;
      SFX = SFX + '\t};';
      strings.push(SFX);
    }
  })
  strings.push('};\n')
  return [strings, errors];
}

function composeGear(type: 'weapons' | 'magazines') {
  const param = type === 'magazines' ? desc.magazines : desc.weapons;
  if (param.length === 0) return [[],[]]
  const strings: string[] = [];
  const errors: string[] = [];
  const hashMap: hashMap = {};

  strings.push(`class ${type}\n{`)
  param.forEach((cls, index) => {
    const className = cls[0].slice(1);
    const value = convertStorageValueToOFPstyle(cls[1]);
    if (hashMap[className]) {
      errors.push(`gear ${type}: class ${className} already exists! Please, make className unique.`);
    } 
    else if (!className) {
      errors.push(`gear ${type}: row ${index + 1} is empty!`);
    }
    else {
      hashMap[className] = true;
      strings.push(`\t\tclass ${className} { count = ${value || 0}; };`);
    }
  })
  strings.push(`};\n`)

  return [strings, errors];
}

export function composeDescription() {
  const paramsLines = composeParams();
  const [param1, param1Errors] = composeParamMission('1');
  const [param2, param2Errors] = composeParamMission('2');
  const [sounds, soundsErrors] = composeSounds();
  const [music, musicErrors] = composeMusic();
  const [radio, radioErrors] = composeRadio();
  const [SFX, SFXErrors] = composeSFX();
  const [identities, identitiesErrors] = composeIdentity();
  const [weapons, weaponsErrors] = composeGear('weapons');
  const [magazines, magazinesErrors] = composeGear('magazines');

  return [[...paramsLines, ...param1, ...param2, ...sounds, ...music,
  ...radio, ...SFX, ...identities, ...weapons, ...magazines],
  [...param1Errors, ...param2Errors, ...soundsErrors, ...musicErrors,
    ...radioErrors, ...SFXErrors, ...identitiesErrors, ...weaponsErrors, ...magazinesErrors]
  ]
}