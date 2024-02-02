import * as core from '@actions/core';
import { Inputs, Types } from "./common";

import * as diff from './modules/diff';

function isBlank(value: any): boolean {
    return value === null || value === undefined || (value.length !== undefined && value.length === 0);
}

export function isNotBlank(value: any): boolean {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
}

export interface ActionInputs {
    input: string;
    secondary: string | undefined;
    action: string;
    type: string;
    key: string | undefined;
    modifier: string | undefined;
}

const availableActions = [
    diff.ACTION
];
const requirements: { [key: string]: Inputs[] } = {
    [diff.ACTION]: diff.RequiredFields,
}
const modifiers: { [key: string]: string[] } = {
    [diff.ACTION]: diff.ModifierValues,
}

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    const action = `${core.getInput(Inputs.Action, { required: true })}`;
    result.action = action;
    if (!availableActions.includes(action)) {
        throw new Error(`Unavailable action ${action}`)
    }

    const requiredFields = requirements[action];
    const modifierValues = modifiers[action];

    result.input = `${core.getInput(Inputs.Input, { required: requiredFields.includes(Inputs.Input) })}`
    result.secondary = `${core.getInput(Inputs.Secondary, { required: requiredFields.includes(Inputs.Secondary) })}`

    const typeVar = core.getInput(Inputs.Type, { required: requiredFields.includes(Inputs.Type) })
    if (isBlank(typeVar)) {
        result.type = Types.FlatJSON
    } else {
        result.type = typeVar
    }

    if (result.type == Types.NestedJSON || requiredFields.includes(Inputs.Key)) {
        result.key = core.getInput(Inputs.Key, { required: true })
    }

    let modifier = core.getInput(Inputs.Modifier, { required: requiredFields.includes(Inputs.Modifier) })
    if (isBlank(modifier)) {
        modifier = modifierValues[0];
    } else if (!modifierValues.includes(modifier)) {
        throw new Error(`Unexpected modifier value: ${modifier}`)
    }
    result.modifier = modifier;

    return result;
}
