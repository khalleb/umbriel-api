/* eslint-disable no-restricted-syntax */
export function getValueByProperty(object: any, path: string): any {
  if (typeof object !== 'object' || typeof path !== 'string') {
    return 'NOT FOUND';
  }
  return '';
}

export function removeProperty(objects: any, nameProperty: string): any {
  const newObject = Object.keys(objects).reduce((object: any, key: string) => {
    if (key !== nameProperty) {
      object[key] = objects[key];
    }
    return object;
  }, {});
  return newObject;
}

function isObject(object: any): boolean {
  return object != null && object.constructor.name === 'Object';
}

function objectIsEmpty(object: any): boolean {
  if (isObject(object)) {
    return Object.keys(object).length === 0;
  }
  return false;
}

function isArray(object: any): boolean {
  return !!object && object.constructor === Array && Array.isArray(object);
}

function arrayIsEmpty(object: any): boolean {
  if (isArray(object)) {
    return object == null || object.length == null || object.length <= 0;
  }
  return false;
}

export function cleanObject(object: any): any {
  if (!object) {
    return object;
  }

  if (!isObject(object) && !isArray(object)) {
    return object;
  }

  const newObject: any = {};

  for (const [key, value] of Object.entries<any>(object)) {
    if (value && value !== undefined && value !== null && value !== 'null' && value !== 'undefined' && value !== '') {
      if (isObject(value)) {
        if (!objectIsEmpty(value)) {
          const objectNew = cleanObject(value);
          if (objectNew && !objectIsEmpty(objectNew)) {
            newObject[key] = objectNew;
          }
        }
      } else if (isArray(value)) {
        if (!arrayIsEmpty(value)) {
          newObject[key] = value.map((element: any) => {
            return cleanObject(element);
          });
        }
      } else {
        let valueAux = value;
        if (typeof valueAux === 'string') {
          valueAux = valueAux.trim();
        }
        if (valueAux) {
          newObject[key] = valueAux;
        }
      }
    }
  }
  object = newObject;
  return object;
}
