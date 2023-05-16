import { useEffect, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { Collapsible } from '../Create';

export function renderParameter(x: any, prefix = '') {
    return (
        <div style={{marginTop: '10px'}}>
            <Form.Label style={{fontWeight: '200'}}>{x.help[0].toUpperCase() + x.help.slice(1)}</Form.Label>
            {
                ['int', 'float'].includes(x.type) ?
                    <Form.Control name={`${prefix}${x.name}`} type="number" placeholder={x.help} defaultValue={x.default} /> :
                    <Alert variant="danger">Unknown type {x.type}</Alert>
            }
        </div>
    );
}

export function PreferenceElicitations() {
    const [preferenceElicitations, setPreferenceElicitations] = useState([]);
    const [picked, setPicked] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:5555/fastcompare/available-preference-elicitations')
            .then(response => response.json())
            .then(data => {
                setPreferenceElicitations(data);
                setPicked(data[0].name);
            });
    }, []);

    return (
        <Collapsible title="2. Preference elicitation">
            <Form.Group className="mb-3" controlId="formPreferenceElicitation">
                <Form.Label>Preference Elicitation method</Form.Label>
                <Form.Select name="selected_preference_elicitation" aria-label="Select preference elicitation method" onChange={e => setPicked(e.target.value)} value={picked!}>
                    {
                        preferenceElicitations.map((preferenceElicitation: any) => {
                            return <option 
                                value={preferenceElicitation.name}
                            >{preferenceElicitation.name}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPreferenceElicitation" style={{paddingLeft: '3rem'}}>
                    {
                        (preferenceElicitations.find((p: any) => p.name === picked) as any)
                            ?.parameters
                            .map((x: any) => renderParameter(x, 'preference_elicitation_parameters.'))
                    }
            </Form.Group>
        </Collapsible>
    );
}
