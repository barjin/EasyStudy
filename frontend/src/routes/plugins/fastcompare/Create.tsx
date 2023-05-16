import { useState, ReactElement, createContext, useContext, useEffect, useCallback } from "react";
import { Alert, Form, Container, Row, Col, Collapse, Button } from "react-bootstrap";
import { getCSRFToken } from "../../../utils/getCSRFToken";
import { hydrate } from "../../../utils/hydrateFlatJSON";
import { DataLoaders } from "./Create/DataLoader";
import { PreferenceElicitations } from "./Create/PreferenceElicitation";
import { RecommendationAlgos } from "./Create/RecommendationAlgos";
import { UserInterface } from "./Create/UserInterface";

import { getURL } from "../../../utils/getRootURL";

const CollapsibleContext = createContext({
    open: '',
    setOpen: (x: string) => {},
})

export function Collapsible({title, variant, children}: { title: string, variant?: string, children: ReactElement<any, any> | ReactElement<any, any>[] }) {
    const [open, setOpen] = useState(false);
    const {open: openContext, setOpen: setOpenContext} = useContext(CollapsibleContext);

    useEffect(() => {
        setOpen(openContext === title);
    }, [openContext, title]);

    return (
        <>
            <Alert variant={variant ?? "info"} onClick={() => {
                setOpen(!open);
                setOpenContext(title);
            }} style={{"cursor": "pointer"}}>
                <h3>{title}</h3>
            </Alert>
            <Collapse in={open}>
                <div>
                    {children}
                </div>
            </Collapse>
        </>
    );
}

export function FastCompareCreate() {
    const [open, setOpen] = useState('1. Data source');

    const submitCallback = useCallback(async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);

        const response = await fetch(getURL('/create-user-study'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await getCSRFToken()
            },
            body: JSON.stringify({
                config: {
                    ...hydrate(Object.fromEntries([...formData.entries()])),
                    "data_loader_parameters": {},
                },
                parent_plugin: 'fastcompare'
            }),
            credentials: 'include'
        }).then(r => {
            window.location.href = r.url;
        });

        console.log(response);
    }, []);

    return (
        <>
        <h1>
            Create FastCompare user study
        </h1>
        <Alert>
            Note that study initialization takes some time. The user study is not available until initialization is finished (depends on the configuration, may take seconds or minutes if training more complex algorithms). 
        </Alert>
        <Container fluid="sm">
            <Row className="justify-content-md-center">
                <Col xs lg={8}>
                    <Form method="post" action="lalalala" onSubmit={submitCallback}>
                        <CollapsibleContext.Provider value={{open, setOpen}}>
                            <DataLoaders />
                            <PreferenceElicitations />
                            <RecommendationAlgos />
                            <UserInterface />
                            
                            <Collapsible title="Advanced" variant="secondary">
                            <Form.Group className="mb-3" controlId="formProlificCode">
                                <Form.Label>Prolific code</Form.Label>
                                <Form.Control type="string" placeholder="Enter prolific code" />
                            </Form.Group>
                            </Collapsible>
                        </CollapsibleContext.Provider>
                        <Button variant="primary" type="submit">
                            Create!
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
}