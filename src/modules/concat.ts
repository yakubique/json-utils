import { Inputs } from '../common';
import cct from 'lodash.concat';

export const ACTION = 'concat';

export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Secondary
];

export const ModifierValues: string[] = ['<unknown>'];

export function concat<T>(source: T[], secondary: T[]): any[] {
    return cct(source, secondary);
}
