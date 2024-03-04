import { Inputs } from '../common';
import batch from 'lodash.chunk';

export const ACTION = 'chunk';

export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Modifier
];

export const ModifierValues: string[] = [];

export function chunk<T>(source: T[], size: number): any[] {
    return batch(source, size);
}
