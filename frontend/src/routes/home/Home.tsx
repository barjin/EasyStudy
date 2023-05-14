import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useState, useEffect } from 'react';

export function Home() {

    return (
      <>
            <Row>
                <h1>EasyStudy</h1>
                <p>A framework for Easy Deployment of User Studies on Recommender Systems</p>
                <Row>
                <Col cols="10">
                    <p>Contact information: <a href="mailto:patrik.dokoupil@matfyz.cuni.cz">Patrik Dokoupil</a> (Charles University), <a href="mailto:ladislav.peska@matfyz.cuni.cz">Ladislav Peska</a> (Charles University)</p>
                    <Button variant="primary" href="https://github.com/pdokoupil/easystudy">Github repository</Button>
                </Col>
                </Row>
            </Row>            
        </>
    );
}