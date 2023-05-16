import { ReactElement, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Collapsible } from '../Create';
import { renderParameter } from "./PreferenceElicitation";

import { getURL } from "../../../../utils/getRootURL";

function Algorithm({ algorithms, index }: { algorithms: any[], index: number }) {
    const [picked, setPicked] = useState<string>(algorithms?.[0]?.name);

    if(!picked && algorithms[0]?.name) {
        setPicked(algorithms?.[0]?.name);
    }

    return (
        <>
            <Form.Control name={`algorithm_parameters.${index}.name`} type="hidden" value={picked} />
            <Form.Control name={`algorithm_parameters.${index}.displayed_name`} type="text" placeholder="Displayed name" defaultValue={`Algorithm no. ${index + 1}`} style={{margin: '10px 0px'}}/>
            <Form.Select name={`selected_algorithms.${index}`} onChange={e => setPicked(e.target.value)}>
                {
                    algorithms.map((algorithm: any) => {
                        return <option value={algorithm.name}>{algorithm.name}</option>
                    })
                }
            </Form.Select>
            <div style={{paddingLeft: '3rem'}}>
            {
                (algorithms.find((a: any) => a.name === picked) as any)
                    ?.parameters
                    .map((x: any) => renderParameter(x, `algorithm_parameters.${index}.`))
            }
            </div>
        </>
    )
}

export function RecommendationAlgos() {
    const [numberOfAlgorithms, setNumberOfAlgorithms] = useState(2); // [2, 3]
    const [algorithms, setAlgorithms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5555/fastcompare/available-algorithms')
            .then(response => response.json())
            .then(data => {
                setAlgorithms(data);
            });
    }, []);

    return (
        <Collapsible title="3. Recommendation algorithms">
            <Form.Group className="mb-3" controlId="formNumberOfAlgorithms">
                <Form.Label>Number of algorithms to compare</Form.Label>
                <Form.Select name="n_algorithms_to_compare" onChange={(e) => setNumberOfAlgorithms(Number(e.target.value))} >
                    <option value="2">2</option>
                    <option value="3">3</option>
                </Form.Select>
            </Form.Group>
            {
                [...Array(numberOfAlgorithms)].map((_, i, a) => (
                    <Form.Group className="mb-3" controlId="formNumberOfAlgorithms">
                        {/* <Form.Label>{i+1}. algorithm</Form.Label> */}
                        <Algorithm algorithms={algorithms} index={i} />
                        {
                            i !== a.length - 1 && <div style={{textAlign: 'center', padding:'20px'}} />
                        }
                    </Form.Group>
                )) as unknown as ReactElement<any, any>
            } 
        </Collapsible>
    );
}
