import { useCallback, useState } from "react";
import { Alert, Container, Row, Col, Form, Button } from "react-bootstrap"
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "react-router-dom";
import { hydrate } from "../utils/hydrateFlatJSON";
import { getCSRFToken } from "../utils/getCSRFToken";

import { getURL } from "../utils/getRootURL";

export function Join() {
    const informedConsentText = `
Before continuing with the research, you should be familiarize yourself and agree with the following statements:

- I familiarize myself with the aim and targets of the research project (see the section 'About' at the top) and I do not mind to contribute on it (i.e., the research topic does not go against my beliefs etc.). I agree that authors of the project may utilize my (anonymous) responses and my demographic data while presenting research outcomes - e.g. in scientific papers. I do not require any monetary compensation for my participation in the research. (Nonetheless, we will really appreciate your help! Plus, there is a good feeling for helping the science:-))

- We will never publish data that could breach your identity (we do not have such data anyway:-). We also neither share your e-mail address to third parties nor disclose it publicly (if you opt to provide it). In the prospective paper, we would like to publish an anonymized dataset of responses. The dataset should contain following information:
    - randomly generated ID of the participant (i.e. UID = 468201) demographic data of the participant
    - demographic data of the participant ( age group, education, machine learning familiarity)
    - participant's responses to individual tasks

- In the dataset, there will be no mapping between the ID of the user and their true identity (we do not have such data anyway)

- You can stop your participation at any time (just close the browser window:-). You can always revert your consent to use your responses - just write to us with your details (submitted e-mail, time when you started participation etc.) If you did submit your e-mail, but do not want to receive any new messages from us, just write us an email.

___

PS: any disputes (hopefully, none should arise:-) will be governed by the law and jurisdiction of Czech Republic     
`;

    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);

        fetch('http://localhost:5555/add-participant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await getCSRFToken()
            },
            credentials: 'include',
            body: JSON.stringify(hydrate(Object.fromEntries([...formData.entries()]))),
        }).then((response) => {
            if (response.status === 200) {
                window.location.href = searchParams.get('continuation_url') ?? '/error';
            }
        }).catch((error) => {
            setError(error.message);
        });
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                     <Alert>
                        <Alert.Heading>
                            About
                        </Alert.Heading>
                        <p>
                        This study aims to evaluate recommender systems and different presentation layouts of the recommendations. The study is expected to be completed in no more than 10-15 minutes.
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Row className="justify-content-md-center" onSubmit={onSubmit}>
                <Col md={6}>
                    <h2>Participant details</h2>
                    <Form className="joinForm">
                        <Form.Control type="hidden" name="lang" value="en" />
                        <Form.Control type="hidden" name="user_study_guid" value={String(searchParams.get('guid'))} />
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="user_email" type="email" placeholder="Enter email"/>
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select name="gender" aria-label="Select your gender">
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                                <option value="2">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formAgeGroup">
                            <Form.Label>Age group</Form.Label>
                            <Form.Select name="age_group" aria-label="Select your age group">
                                    <option value="0">0-15</option>
                                    <option value="16">16-20</option>
                                    <option value="21">21-30</option>
                                    <option value="29">31-40</option>
                                    <option value="41">41-50</option>
                                    <option value="51">51-65</option>
                                    <option value="65">65+</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formEducation">
                            <Form.Label>Your achieved education</Form.Label>
                            <Form.Select name="education" aria-label="Select your highest reached education">
                                <option value="0">No formal education</option>
                                <option value="1">Primary school</option>
                                <option value="2">High school</option>
                                <option value="3">Bachelor's degree</option>
                                <option value="4">Master's degree</option>
                                <option value="5">Doctoral degree</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFamiliarWithML">
                            <Form.Label>Are you familiar with machine learning?</Form.Label>
                            <Form.Select name="ml_familiar" aria-label="Are you familiar with machine learning">
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </Form.Select>
                        </Form.Group>
                        {
                            error && (
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            )
                        }
                        <Row className="justify-content-md-center">
                            <Col>
                                <h2>Informed consent</h2>
                                <ReactMarkdown children={informedConsentText}/>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <style>
                {
                    // this is hacky, should be rewritten
                    `.joinForm > div {
                        margin-bottom: 1rem;
                    }`
                }
            </style>
        </Container>

    );  
}