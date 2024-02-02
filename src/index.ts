import * as core from '@actions/core';
import { ActionInputs, getInputs } from './io-helper';
import { Types } from "./common";
import * as difference from "./modules/diff";
import * as sort from "./modules/sort";

enum Outputs {
    result = 'result',
}

function setOutputs(response: any, log?: boolean) {
    let message = '';
    for (const key in Outputs) {
        const field: string = (Outputs as any)[key];
        if (log) {
            message += `\n  ${field}: ${JSON.stringify(response[field])}`;
        }
        core.setOutput(field, response[field]);
    }

    if (log) {
        core.info('Outputs:' + message);
    }
}

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();
        const input = JSON.parse(inputs.input) as any[]
        let secondary: any[] | undefined = undefined;

        core.info(JSON.stringify(inputs))

        let result: any[] = [];

        if (inputs.secondary) {
            secondary = JSON.parse(inputs.secondary) as any[];
        }


        if (inputs.type === Types.FlatJSON.toString()) {
            if (inputs.action === difference.ACTION) {
                result = difference.diff(input, secondary as any[], inputs.modifier)
            } else if (inputs.action === sort.ACTION) {
                result = sort.sort(input, inputs.modifier)
            }
        }

        if (inputs.type === Types.NestedJSON.toString()) {
            if (inputs.action === difference.ACTION) {
                result = difference.diffBy(input, secondary as any[], inputs.key as string, inputs.modifier);
            } else if (inputs.action === sort.ACTION) {
                result = sort.sortBy(input, inputs.key as string, inputs.modifier)
            }
        }

        setOutputs({ result })

        core.info('Success!');
    } catch (err: any) {
        core.setFailed(err.message);
    }
})();
