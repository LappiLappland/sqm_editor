/* eslint-disable @typescript-eslint/ban-ts-comment */
import description from "./data/description";
import classes from "./classes/classes";
import briefing from "./data/briefing";
import overview from "./data/overview";
import { CHAR_TYPES } from "./types";

//This is kind of a state manager
//I don't think this app needs reactive state manager
//This state manager works in a bit weird, but very convenient way
//It uses string paths to refer to states
//It also only stores state, it is not reactive

const descriptionDefaultParams = JSON.parse(JSON.stringify(description.params));

const Mission = {
  description,
  descriptionDefaultParams,
  classes,
  briefing,
  overview,
};

export function getStorage() {
  return Mission;
}

function getDeepObjectWithProperty(properties: string[]) {
  let currentProperty = Mission;
  let previousProperty = Mission;
  for (let i = 0; i < properties.length; i++) {
    const item = properties[i];
    // eslint-disable-next-line no-prototype-builtins
    if (currentProperty.hasOwnProperty(item)) {
      previousProperty = currentProperty;
      /* @ts-ignore */
      currentProperty = currentProperty[item];
    } else {
      return null;
    }
  }
  return previousProperty;
}

//? Im not sure how to make typeScript belive that this is type safe
//? For now I've just made it ignore lines
export function storageChangeValue(path: string, value: unknown) {
  const proprts = path.split('/');

  const object = getDeepObjectWithProperty(proprts);
  if (!object) {
    const error = new Error(`Could not find path inside storage: ${object}`);
    throw error;
  }
  
  const property = proprts[proprts.length - 1];
  /* @ts-ignore */
  if (typeof object[property] !== typeof value) {
    /* @ts-ignore */
    if (typeof object[property] === 'boolean' && (value === '0' || value === '1')) {
      value = value === '0' ? false : true;
    } else {
      /* @ts-ignore */
      const error = new Error(`Invalid type for storage. Expected "${typeof object[property]}", but received "${typeof value}" from "${value}" for "${path}"`);
      throw error;
    }
  }
  let newValue = value;
  if (typeof value === 'string') {
    //Add first char which declares string type
    /* @ts-ignore */
    newValue = object[property][0] + value;
  }
  /* @ts-ignore */
  object[property] = newValue;

  //Console.log(getStorage());
}

export function storageCreateValue(path: string, newProperty: string, value: unknown, type?: CHAR_TYPES[] | CHAR_TYPES) {
  const proprts = path.split('/');

  const object = getDeepObjectWithProperty(proprts);
  if (!object) {
    const error = new Error(`Could not find path inside storage: ${object}`);
    throw error;
  }

  const property = proprts[proprts.length - 1];

  let newValue = value;
  if (typeof value === 'string') {
    if (!type || Array.isArray(type)) {
      const error = new Error("You have to set type for inserted string!");
      throw error;
    }
    //Add first char which declares string type
    /* @ts-ignore */
    newValue = type + value;
    /* @ts-ignore */
    object[property][newProperty] = newValue;
  }
  else if (Array.isArray(value) && Array.isArray(newValue)) {
    if (!type || !Array.isArray(type)) {
      const error = new Error("You have to set types array for inserted array!");
      throw error;
    }
    if (type.length !== value.length) {
      const error = new Error("Types array was shorther than inserted array!");
      throw error;
    }
    for (let i = 0; i < value.length; i++) {
      newValue[i] = type[i] + value[i];
    }
    //If index exists, then insert into that index
    /* @ts-ignore */
    if (+newProperty < object[property].length) {
      /* @ts-ignore */
      object[property].splice(newProperty, 0, newValue);
      console.log('wtf');
    } else {
      /* @ts-ignore */
      object[property][newProperty] = newValue;
      console.log('here');
    }
  }
  else {
    newValue = value;
    /* @ts-ignore */
    object[property][newProperty] = newValue;
  }
  /* @ts-ignore */
  //console.log(object[property], object[property].length, newProperty, +newProperty < object[property].length, value.length, value)
}

export function storageRemoveValue(path: string) {
  const proprts = path.split('/');

  const object = getDeepObjectWithProperty(proprts);
  if (!object) {
    const error = new Error(`Could not find path inside storage: ${object}`);
    throw error;
  }

  const property = proprts[proprts.length - 1];
  if (Array.isArray(object)) {
    object.splice(+property, 1);
  } else {
    /* @ts-ignore */
    delete object[property];
  }

}

export function storageGetValue(path: string) {
  const proprts = path.split('/');

  const object = getDeepObjectWithProperty(proprts);
  if (!object) {
    const error = new Error(`Could not find path inside storage: ${object} with path '${path}'`);
    throw error;
  }

  const property = proprts[proprts.length - 1];
  /* @ts-ignore */
  const returnValue = object[property];
  if (typeof returnValue === 'string') {
    return returnValue.slice(1);
  } else {
    return returnValue;
  }
}