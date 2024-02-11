import { Inputs } from "../common";
import pick from 'lodash.pick';

export const ACTION = "pick";

export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Key
];

export const ModifierValues: string[] = ['<unknown>']

export function pickBy<T>(source: T[], key: string): any[] {
    return source.map(x => pick(x, key))
}
