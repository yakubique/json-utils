import { Inputs } from "../common";
import pick from 'lodash.pick';

export const ACTION = "pick";

export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Key
];

export const ModifierValues: string[] = ['<unknown>']

export function pickBy<T>(source: T[], key: string): any[] {
    let keys = key.includes(',') ? key.split(',').filter(Boolean) : [key];

    return source.map(x => pick(x, keys))
}
