import * as core from '@actions/core';
import { ActionInputs, getInputs } from './io-helper';
import { Types } from './common';
import * as difference from './modules/diff';
import * as sort from './modules/sort';
import * as pick from './modules/pick';
import * as get from './modules/get';
import { buildOutput, inputJson, outputJson } from '@yakubique/atils/dist';

enum Outputs {
    result = 'result',
}

const setOutputs = buildOutput(Outputs);

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();
        let input = inputJson(inputs.input, inputs.fromFile) as any[];

        let secondary: any[] | undefined = undefined;
        let result: any[] = [];

        if (inputs.secondary) {
            secondary = inputJson(inputs.secondary, inputs.fromFile);
        }

        if (inputs.action === pick.ACTION) {
            result = pick.pickBy(input, inputs.key as string);
        } else if (inputs.action === get.ACTION) {
            result = get.getBy(input, inputs.key as string);
        }

        if (inputs.type === Types.FlatJSON.toString()) {
            if (inputs.action === difference.ACTION) {
                result = difference.diff(input, secondary as any[], inputs.modifier);
            } else if (inputs.action === sort.ACTION) {
                result = sort.sort(input, inputs.modifier);
            }
        }

        if (inputs.type === Types.NestedJSON.toString()) {
            if (inputs.action === difference.ACTION) {
                result = difference.diffBy(input, secondary as any[], inputs.key as string, inputs.modifier);
            } else if (inputs.action === sort.ACTION) {
                result = sort.sortBy(input, inputs.key as string, inputs.modifier);
            }
        }

        setOutputs({ result: outputJson(result, inputs.toFile) });

        core.info('Success!');
    } catch (err: any) {
        core.setFailed(err.message);
    }
})();
