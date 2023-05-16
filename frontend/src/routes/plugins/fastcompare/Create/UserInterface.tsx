import { Form } from "react-bootstrap";
import { Collapsible } from '../Create';

export function UserInterface() {

    return (
        <Collapsible title="4. User interface">
            <Form.Group className="mb-3" controlId="formRecommendationSize">
                <Form.Label>Recommendations per page</Form.Label>
                <Form.Control name="k" type="number" placeholder="Enter recommendation size" defaultValue={10} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNumberOfIterations">
                <Form.Label>Number of pages</Form.Label>
                <Form.Control name="n_iterations" type="number" aria-label="Input number of study steps" defaultValue={5} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLayout">
                <Form.Label>Items layout</Form.Label>
                <Form.Select name="result_layout" aria-label="Select data source">
                    {
                        [
                            ["rows", 'Rows'],
                            ["row-single",  'Single row'],
                            ["row-single-scrollable", 'Single scrollable row'],
                            ["columns", 'Columns'],
                            ["column-single",  'Single column'],
                            ["max-columns", 'Maximum columns per width'],
                        ].map((a) => {
                            return <option value={a[0]}>{a[1]}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formShowFinalStats">
                <Form.Label>Show final statistics</Form.Label>
                <Form.Select name="show_final_statistics" aria-label="Select data source">
                    <option value="on">Yes</option>
                    <option value="off">No</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formShuffleAlgos">
                <Form.Label>Shuffle algorithms</Form.Label>
                <Form.Select name="shuffle_algorithms" aria-label="Select data source">
                    <option value="off">No</option>
                    <option value="on">Yes</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formShuffleRecs">
                <Form.Label>Shuffle recommendations</Form.Label>
                <Form.Select name="shuffle_recommendations" aria-label="Select data source">
                    <option value="off">No</option>
                    <option value="on">Yes</option>
                </Form.Select>
            </Form.Group>
        </Collapsible>
    );
}
