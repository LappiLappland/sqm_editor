import { Parser } from "expr-eval";

export const numberRegex = /^[+-]?([0-9]*[.]?)[0-9]*$/;
export const mathRegex = /^[0-9xX+*/^%-]*$/;

export type MathScope = {[a: string]: number | string}; 

export function calculateValue(formula: string, scope: MathScope) {
  if (!formula) return '';
  // const getDB = 'getDB(x) = 10^(x*(1/20));'
  // formula = getDB + formula.replaceAll('d', 'getDB(d)');
  try {
    const calculated = Parser.evaluate(formula, scope);
    return ''+calculated;
  } catch (e) {
    return '#MathError';
  }
}