export function hydrate(input: any) {
    const out: any = {};
    for (const [key, value] of Object.entries(input)){
        const keys = key.split('.');
        let current = out;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k]) {
                if(!isNaN(Number(keys[i+1]))){
                    current[k] = [];
                } else {
                    current[k] = {};
                }
            }
            
            current = current[k];
        }

        // cast to number if possible
        if(!isNaN(Number(value))){
            current[keys[keys.length - 1]] = Number(value);
        } else if(['on', 'true', 'off', 'false'].includes(value as string)) {
            current[keys[keys.length - 1]] = ['on', 'true'].includes(value as string);
        } else {
            current[keys[keys.length - 1]] = value;
        }
    }

    return out;
}