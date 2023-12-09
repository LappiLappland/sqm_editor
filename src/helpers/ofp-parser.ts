import { generateIdentityClass, IdentityClass } from "../storage/data/cfgIdentities";
import { generateMusicClass, MusicClass } from "../storage/data/cfgMusic";
import { generateRadioClass, RadioClass } from "../storage/data/cfgRadio";
import { generateSFXClass, SFXClass } from "../storage/data/cfgSFX";
import { generateSoundClass, SoundClass } from "../storage/data/cfgSounds";
import { generateGear } from "../storage/data/gear";
import { getStorage, storageChangeValue } from "../storage/storage";
import { stringSplice } from "./strings";

const desc = getStorage().description;

function findClosingBrackets(text: string, startFrom: number) {
  startFrom = text.indexOf("{", startFrom);

  let startIndex = text.indexOf("{", startFrom + 1);
  let endIndex = text.indexOf("};", startFrom);

  if (startIndex === -1)
  {
    return endIndex;
  }

  while (startIndex < endIndex)
  {
    startIndex = text.indexOf("{", startIndex + 1);
    endIndex = text.indexOf("}", endIndex + 1);

    if (startIndex === -1)
    {
      break;
    }
  }

  return endIndex;
}

function getClass(text: string, className: string) {
  const findRegexString = `class( )+${className}`;
  const findRegex = new RegExp(findRegexString, 'i');
  const startClass = text.search(findRegex);
  if (startClass === -1) return null;
  const bracketStart = text.indexOf('{', startClass);
  const bracketEnd = findClosingBrackets(text, bracketStart);
  const classText = text.slice(bracketStart, bracketEnd);
  const extractedClassName = text.slice(startClass, bracketStart).replace('class', '').trim();
  return {
    className: extractedClassName,
    text: classText,
    start: startClass,
    end: bracketEnd,
  };
}

function getVariable(text: string, varName: string) {//|([^;]+)
  const varNameEscaped = varName.replace('[', '\\[').replace(']', '\\]');
  const findRegexString = `(${varNameEscaped})( )*=( )*([^;]+)(\n|;|$)`;
  const findRegex = new RegExp(findRegexString, 'i');
  const startVariable = text.match(findRegex);
  if (!startVariable) return '';
  const foundVariable = startVariable[4];
  const quoteStart = foundVariable.indexOf('"');
  const bracketsStart = foundVariable.indexOf('{');
  if (quoteStart !== -1 && (bracketsStart > quoteStart || bracketsStart === -1)) {
    const quoteEnd = foundVariable.lastIndexOf('"');
    return foundVariable.slice(quoteStart+1, quoteEnd);
  } else {
    return foundVariable;
  }
}

function stringOFPtoArray(text: string) {
  const startBracket = text.indexOf('{');
  const endBracket = text.indexOf('}');
  const arrayString = text.slice(startBracket+1, endBracket);
  const vars = arrayString.split(',');
  vars.forEach((item, index) => {
    const trimmed = item.trim();
    const quoteStart = trimmed.indexOf('"');
    if (quoteStart !== -1) {
      const quoteEnd = trimmed.lastIndexOf('"');
      vars[index] = trimmed.slice(quoteStart+1, quoteEnd);
    } else {
      vars[index] = trimmed;
    }
  });
  return vars;
}

function findCfgMusic(text: string) {
  const musicClass = getClass(text, 'cfgMusic');
  if (!musicClass) return null;

  let anyClass = getClass(musicClass.text, '');
 
  const musicClasses: MusicClass[] = [];

  while (anyClass) {
    musicClass.text = stringSplice(musicClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const name = getVariable(anyClass.text, 'name');
    const sound = getVariable(anyClass.text, 'sound[]');
    const soundArray = stringOFPtoArray(sound);
    
    const generatedClass = generateMusicClass({
      className: anyClass.className,
      name: name,
      keepName: false,
      filePath: soundArray[0],
      volume: soundArray[1].replace('db', ''),
      pitch: soundArray[2]
    });
    musicClasses.push(generatedClass);

    anyClass = getClass(musicClass.text, '');
  }
  return {
    defenition: musicClasses, 
    classStart: musicClass.start, 
    classEnd: musicClass.end,
  };
}

function findCfgSounds(text: string) {
  const soundClass = getClass(text, 'cfgSounds');
  if (!soundClass) return null;

  let anyClass = getClass(soundClass.text, '');
 
  const soundClasses: SoundClass[] = [];

  while (anyClass) {
    soundClass.text = stringSplice(soundClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const name = getVariable(anyClass.text, 'name');
    const sound = getVariable(anyClass.text, 'sound[]');
    const soundArray = stringOFPtoArray(sound);
    const titlesFont = getVariable(anyClass.text, 'titlesFont');
    const titlesSize = getVariable(anyClass.text, 'titlesSize');
    const forceTitles = getVariable(anyClass.text, 'forceTitles');
    const titles = getVariable(anyClass.text, 'titles[]');
    const titlesArray = stringOFPtoArray(titles);
    const titlesArrayTable: string[][] = [];

    if (titlesArray.length > 1) {
      for (let i = 0; i < titlesArray.length; i=i+2) {
        const time = titlesArray[i];
        const title = titlesArray[i+1];
        titlesArrayTable.push([time, title]);
      }
    }
    
    const generatedClass = generateSoundClass({
      className: anyClass.className,
      name: name,
      keepName: false,
      filePath: soundArray[0],
      volume: soundArray[1].replace('db', ''),
      pitch: soundArray[2],
      titlesFont: titlesFont,
      titlesSize: titlesSize,
      forceTitles: forceTitles === '1' ? true : false,
      titles: titlesArrayTable
    });

    soundClasses.push(generatedClass);

    anyClass = getClass(soundClass.text, '');
  }
  return {
    defenition: soundClasses, 
    classStart: soundClass.start, 
    classEnd: soundClass.end,
  };
}

function findCfgRadio(text: string) {
  const radioClass = getClass(text, 'cfgRadio');
  if (!radioClass) return null;

  let anyClass = getClass(radioClass.text, '');
 
  const radioClasses: RadioClass[] = [];

  while (anyClass) {
    radioClass.text = stringSplice(radioClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const name = getVariable(anyClass.text, 'name');
    const sound = getVariable(anyClass.text, 'sound[]');
    const soundArray = stringOFPtoArray(sound);
    const title = getVariable(anyClass.text, 'title');
    
    const generatedClass = generateRadioClass({
      className: anyClass.className,
      name: name,
      keepName: false,
      filePath: soundArray[0],
      volume: soundArray[1].replace('db', ''),
      pitch: soundArray[2],
      title: title,
    });
    radioClasses.push(generatedClass);

    anyClass = getClass(radioClass.text, '');
  }
  return {
    defenition: radioClasses, 
    classStart: radioClass.start, 
    classEnd: radioClass.end,
  };
}

function findCfgSFX(text: string) {
  const SFXClass = getClass(text, 'cfgSFX');
  if (!SFXClass) return null;

  let anyClass = getClass(SFXClass.text, '');
 
  const SFXClasses: SFXClass[] = [];

  while (anyClass) {
    SFXClass.text = stringSplice(SFXClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const name = getVariable(anyClass.text, 'name');
    const soundsList = getVariable(anyClass.text, 'sounds[]');
    const soundsListArray = stringOFPtoArray(soundsList);
    const soundsTable: string[][] = [];

    if (soundsListArray[0] !== "") {
      for (let i = 0; i < soundsListArray.length; i++) {
        const soundName = soundsListArray[i];
        const soundVar = getVariable(anyClass.text, soundName+'[]');
        const soundVarArray = stringOFPtoArray(soundVar);
        soundsTable.push(soundVarArray);
      }
    }

    const generatedClass = generateSFXClass({
      className: anyClass.className,
      name: name,
      keepName: false,
      sounds: soundsTable
    });
    SFXClasses.push(generatedClass);

    anyClass = getClass(SFXClass.text, '');
  }
  return {
    defenition: SFXClasses, 
    classStart: SFXClass.start, 
    classEnd: SFXClass.end,
  };
}

function findCfgIdentities(text: string) {
  const identitiesClass = getClass(text, 'cfgIdentities');
  if (!identitiesClass) return null;

  let anyClass = getClass(identitiesClass.text, '');
 
  const identitiesClasses: IdentityClass[] = [];

  while (anyClass) {
    identitiesClass.text = stringSplice(identitiesClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const name = getVariable(anyClass.text, 'name');
    const speaker = getVariable(anyClass.text, 'speaker');
    const pitch = getVariable(anyClass.text, 'pitch');
    const glasses = getVariable(anyClass.text, 'glasses');
    const face = getVariable(anyClass.text, 'face');
    
    const generatedClass = generateIdentityClass({
      className: anyClass.className,
      name: name,
      speaker: speaker,
      pitch: pitch,
      glasses: glasses,
      face: face,
    });
    identitiesClasses.push(generatedClass);

    anyClass = getClass(identitiesClass.text, '');
  }
  return {
    defenition: identitiesClasses, 
    classStart: identitiesClass.start, 
    classEnd: identitiesClass.end,
  };
}

function findGear(text: string, type: 'weapons' | 'magazines') {
  const gearClass = getClass(text, type);
  if (!gearClass) return null;

  let anyClass = getClass(gearClass.text, '');
 
  const gearClasses: string[][] = [];

  while (anyClass) {
    gearClass.text = stringSplice(gearClass.text, anyClass.start, anyClass.end-anyClass.start, '');
    const count = getVariable(anyClass.text, 'count');

    gearClasses.push([anyClass.className, count]);

    anyClass = getClass(gearClass.text, '');
  }
  return {
    defenition: generateGear(gearClasses), 
    classStart: gearClass.start, 
    classEnd: gearClass.end,
  };
}

//TODO: files should be preprocessed...
//TODO: remove coments
//TODO: defines and functions
// function preprocessFile(text: string) {
//   const regexDefine = new RegExp(/(?:#define\s+)([^\s]+)(?:\s+)([^\s]+)(?:\s*\n|$)/, 'ig');
//   let array;
//   while ((array = text.match(regexDefine)) !== null) {
//     //console.log(array[1], '->', array[2],'\n',array[0])
//     text = text.replaceAll(array[0], '').replaceAll(array[1], array[2]);
//   }
//   console.log(text);
//   return text;
// }

function removeAllClasses(text: string) {
  let anyClass = getClass(text, '');
  while (anyClass) {
    text = stringSplice(text, anyClass.start, anyClass.end-anyClass.start+1, '');
    anyClass = getClass(text, '');
  }
  return text;
}

function parseMissionParams(text: string) {
  for (const key of Object.keys(desc.params)) {
    if (key !== 'param1' && key !== 'param2') {
      const value = getVariable(text, key);
      storageChangeValue('description/params/'+key, value);
    }
  }
}

function parseParam(text: string, id: '1' | '2') {
  const title = getVariable(text, 'titleParam'+id);
  const values = getVariable(text, 'valuesParam'+id+'[]');
  const valuesArray = stringOFPtoArray(values);
  const texts = getVariable(text, 'textsParam'+id+'[]');
  const textsArray = stringOFPtoArray(texts);

  const defaultValue = getVariable(text, 'defValueParam'+id);
  const defaultIndex = valuesArray.findIndex((e) => e === defaultValue);
  const defaultIndexStr =  defaultIndex === -1 ? '0' : defaultIndex+'';

  const tableArray = valuesArray.map((value, index) => {
    return ['', '_'+textsArray[index], '$'+value];
  });

  storageChangeValue('description/params/param'+id+'/titleParam', title);
  storageChangeValue('description/params/param'+id+'/defaultParam', defaultIndexStr);
  storageChangeValue('description/params/param'+id+'/array', tableArray);
  console.log(valuesArray);

}

export default function parseDescription(text: string) {
  //Let cleanText = preprocessFile(text);
  let cleanText = text;
  const musicTracks = findCfgMusic(cleanText);
  if (musicTracks) {
    cleanText = stringSplice(cleanText, musicTracks.classStart, musicTracks.classEnd-musicTracks.classStart+1, '');
    desc.cfgMusic = musicTracks.defenition;
  }
  const sounds = findCfgSounds(cleanText);
  if (sounds) {
    cleanText = stringSplice(cleanText, sounds.classStart, sounds.classEnd-sounds.classStart+1, '');
    desc.cfgSounds = sounds.defenition;
  }
  const radio = findCfgRadio(cleanText);
  if (radio) {
    cleanText = stringSplice(cleanText, radio.classStart, radio.classEnd-radio.classStart+1, '');
    desc.cfgRadio = radio.defenition;
  }
  const sfx = findCfgSFX(cleanText);
  if (sfx) {
    cleanText = stringSplice(cleanText, sfx.classStart, sfx.classEnd-sfx.classStart+1, '');
    desc.cfgSFX = sfx.defenition;
  }
  const identities = findCfgIdentities(cleanText);
  if (identities) {
    cleanText = stringSplice(cleanText, identities.classStart, identities.classEnd-identities.classStart+1, '');
    desc.cfgIdentities = identities.defenition;
  }
  const weapons = findGear(cleanText, 'weapons');
  if (weapons) {
    cleanText = stringSplice(cleanText, weapons.classStart, weapons.classEnd-weapons.classStart+1, '');
    desc.weapons = weapons.defenition;
  }
  const magazines = findGear(cleanText, 'magazines');
  if (magazines) {
    cleanText = stringSplice(cleanText, magazines.classStart, magazines.classEnd-magazines.classStart+1, '');
    desc.magazines = magazines.defenition;
  }
  cleanText = removeAllClasses(text);
  parseMissionParams(text);
  parseParam(text, '1');
}