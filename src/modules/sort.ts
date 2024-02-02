import { Inputs } from "../common";
import orderBy from 'lodash.orderby';

export const ACTION = "sort";

export const RequiredFields: Inputs[] = [
    Inputs.Input
];

export enum SortModifiers {
    Ascending = 'ASC',
    Descending = 'DESC'
}

export const ModifierValues: string[] = [
    SortModifiers.Ascending,
    SortModifiers.Descending
].map(x => x.toString())

export function sort<T>(source: T[], order: string = SortModifiers.Ascending): T[] {
    return orderBy(source, [x => x], [order.toString().toLowerCase() as any])
}

export function sortBy<T>(source: T[], key: string, order: string = SortModifiers.Ascending): T[] {
    return orderBy(source, [key], [order.toString().toLowerCase() as any])
}
