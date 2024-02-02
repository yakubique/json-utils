import difference from 'lodash.difference';
import differenceBy from 'lodash.differenceby';
import { Inputs } from "../common";

export const ACTION = "diff"
export const RequiredFields: Inputs[] = [
    Inputs.Input,
    Inputs.Secondary
];

export enum DiffModifiers {
    Left = 'LEFT',
    Right = 'RIGHT'
}

export const ModifierValues: string[] = [
    DiffModifiers.Left,
    DiffModifiers.Right,
].map(x => x.toString());

export function diff<T>(left: T[], right: T[], direction: string = DiffModifiers.Left): T[] {
    if (direction === DiffModifiers.Left) {
        return difference(left, right);
    } else if (direction === DiffModifiers.Right) {
        return difference(right, left);
    }

    return difference(left, right);
}

export function diffBy<T>(left: T[], right: T[], key: string, direction: string = DiffModifiers.Left): T[] {
    if (direction === DiffModifiers.Left) {
        return differenceBy(left, right, key);
    } else if (direction === DiffModifiers.Right) {
        return differenceBy(right, left, key);
    }

    return differenceBy(left, right, key);
}
