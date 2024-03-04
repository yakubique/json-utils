import { Inputs, UnknownModifier } from '../common';
import get from 'lodash.get';

export const ACTION = "get";

export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Key
];

export const ModifierValues: string[] = [UnknownModifier]

export function getBy<T>(source: T[], key: string): any[] {
    return source.map(x => get(x, key))
}
