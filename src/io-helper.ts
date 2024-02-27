import * as core from '@actions/core';
import { Inputs, Types } from './common';

import * as diff from './modules/diff';
import * as sort from './modules/sort';
import * as pick from './modules/pick';
import * as get from './modules/get';
import { getBooleanInput, getOptional, isBlank } from '@yakubique/atils/dist';

export interface ActionInputs {
    input: string;
    secondary: string | undefined;
    action: string;
    type: string;
    key: string | undefined;
    modifier: string | undefined;
    fromFile: boolean;
    toFile: boolean;
}

const availableActions = [
    diff.ACTION,
    sort.ACTION,
    pick.ACTION,
    get.ACTION
];
const requirements: { [key: string]: Inputs[] } = {
    [diff.ACTION]: diff.RequiredFields,
    [sort.ACTION]: sort.RequiredFields,
    [pick.ACTION]: pick.RequiredFields,
    [get.ACTION]: get.RequiredFields
};
const modifiers: { [key: string]: string[] } = {
    [diff.ACTION]: diff.ModifierValues,
    [sort.ACTION]: sort.ModifierValues,
    [pick.ACTION]: pick.ModifierValues,
    [get.ACTION]: get.ModifierValues
};

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    const action = `${core.getInput(Inputs.Action, { required: true })}`;
    result.action = action;
    if (!availableActions.includes(action)) {
        throw new Error(`Unavailable action ${action}`);
    }

    const requiredFields = requirements[action];
    const modifierValues = modifiers[action];

    result.input = `${core.getInput(Inputs.Input, { required: requiredFields.includes(Inputs.Input) })}`;
    result.secondary = `${core.getInput(Inputs.Secondary, { required: requiredFields.includes(Inputs.Secondary) })}`;

    result.type = getOptional(Inputs.Type, Types.FlatJSON, { required: requiredFields.includes(Inputs.Type) });

    if (result.type == Types.NestedJSON || requiredFields.includes(Inputs.Key)) {
        result.key = core.getInput(Inputs.Key, { required: true });
    }

    let modifier = core.getInput(Inputs.Modifier, { required: requiredFields.includes(Inputs.Modifier) });
    if (isBlank(modifier)) {
        modifier = modifierValues[0];
    } else if (modifierValues.length > 0 && !modifierValues.includes(modifier.toUpperCase())) {
        throw new Error(`Unexpected modifier value: ${modifier}`);
    }
    result.modifier = modifier.toUpperCase();

    result.fromFile = getBooleanInput(Inputs.FromFile, { required: false });
    result.toFile = getBooleanInput(Inputs.ToFile, { required: false });

    return result;
}
