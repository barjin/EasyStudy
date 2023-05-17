import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Collapsible } from '../Create';
import { getURL } from "../../../../utils/getRootURL";


export function DataLoaders() {
    const [dataLoaders, setDataLoaders] = useState([]);

    useEffect(() => {
        fetch(getURL('fastcompare/available-data-loaders'))
            .then(response => response.json())
            .then(data => setDataLoaders(data));
    }, []);

    return (
        <Collapsible title="1. Data source">
            <Form.Group className="mb-3" controlId="formDataLoader">
                <Form.Label>Data Loader</Form.Label>
                <Form.Select name="selected_data_loader" aria-label="Select data source">
                    {
                        dataLoaders.map((dataLoader: any) => {
                            return <option value={dataLoader.name}>{dataLoader.name}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
        </Collapsible>
    );
}
