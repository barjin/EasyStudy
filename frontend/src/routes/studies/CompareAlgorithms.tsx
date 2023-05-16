import { useEffect, useState, createContext, useContext, useCallback } from 'react'; 
import { Modal, Button, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { getURL } from '../../utils/getRootURL';

function Item({data}: any) {
    const { selected, setSelected } = useContext(SelectedContext);
    const variant = useContext(VariantContext);

    const onClick = useCallback(() => {
        if(selected?.find((x: any) => x.movie_id === data.movie_id)) {
            setSelected(selected?.filter((x: any) => x.movie_id !== data.movie_id));
        } else {
            setSelected([...selected, {...data, variant}]);
        }
    }, [selected, setSelected, data, variant]);

    return (
        <div style={{cursor: 'pointer', marginBottom: '20px'}}>
            <div style={{position: 'relative', height: '300px', width: '203px'}} onClick={onClick}>
                <img style={{height: '100%', boxShadow: '0px 0px 45px -16px rgba(143,143,143,1)'}} src={getURL(data.url)} />
                {
                    selected?.find((x: any) => x.movie_id === data.movie_id) && (
                        <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: 0, left: 0, fontSize: '300%'}}>
                            👍️
                        </div>
                    )
                }
            </div>
            <span style={{display: 'block', fontSize:'110%', fontWeight: '700'}}>{/^(.*?)\(\d{4}\)/.exec(data.movie)?.[1].replace(', The', '')}</span>
            <span>{/\((\d{4})\)/.exec(data.movie)?.[1]}</span>
        </div>
    )
}

function SingleRowLayout({items}: {items: any}) {
    return (
        <Row>
            {
                items.map((x: any) => 
                <Col key={x.movie_id}>
                    <Item key={x.movie_id} data={x} />
                </Col>)
            }
        </Row>
    );
}

function SingleScrollableRowLayout({items}: {items: any}) {
    return (
        <Row>
            <Col>
                <div style={{display: 'flex', flexDirection: 'row', overflowX: 'scroll'}}>
                    {
                        items.map((x: any) => 
                        <Col md={2} key={x.movie_id} style={{margin: '10px'}}>
                            <Item key={x.movie_id} data={x} />
                        </Col>)
                    }
                </div>
            </Col>
        </Row>
    );
}

function RowsLayout({items, rowWidth=6}: {items: any, rowWidth?: number}) {
    const rows = [];

    for(let i = 0; i < items.length; i += rowWidth){
        rows.push(items.slice(i, i + rowWidth));
    }

    return (
        <>
            {rows.map((row: any) => {
                return (<Row>
                    {
                        row.map((x: any) =>
                        <Col sm={Math.floor(12/rowWidth)} key={x.movie_id}>
                            <Item key={x.movie_id} data={x} />
                        </Col>)
                    }
                </Row>)
            })}
        </>
    );
}

function ColumnsLayout({items}: {items: any}) {
    return (
        <RowsLayout items={items} rowWidth={Math.ceil(items.length / 6)} />
    );
}

function SingleColumnLayout({items}: {items: any}) {
    return (
        <RowsLayout items={items} rowWidth={1} />
    );
}

function MaxColumnsLayout({items}: {items: any}) {
    return (
        <RowsLayout items={items} rowWidth={2} />
    );
}

const SelectedContext = createContext<any | null>({
    selected: [],
    setSelected: (x: any) => {}
});

const VariantContext = createContext<number>(-1);

function Rating({rating, setRating}: {rating: number, setRating: (value: number) => void}) {

    rating ??= 0;

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <span style={{fontSize: '200%', marginRight: '10px'}}>Rate the list:</span>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {
                    Array(5).fill(0).map((_, i) => {
                        return (
                            <span style={{fontSize: '200%', cursor: 'pointer'}} onClick={() => setRating(i+1)}>{i+1 > rating ? '🤍' : '❤️'}</span>
                        )
                    })
                }
            </div>
        </div>
    )
}

export function CompareAlgorithms() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState<any | null>(null);
    const [selected, setSelected] = useState<any | null>([]);
    const [ratings, setRatings] = useState<any | null>([3,3,3]);
    const [compare, setCompare] = useState<any | null>('third');
    const [loading, setLoading] = useState(true);

    const setRating = useCallback((index: number, rating: number) => {
        const newRatings = [...ratings];
        newRatings[index] = rating;
        setRatings(newRatings);
    }, [ratings, setRatings]);

    useEffect(() => {
        fetch(getURL('fastcompare/compare-algorithms/data'), {
            credentials: 'include'
        }).then(response => response.json()).then(data => {
            setData(data);
            if(data.iteration === 1) {
                setShow(true);
            }
            setLoading(false);
        });
    }, []);

    const submit = useCallback(() => {
        const url = new URL(getURL('fastcompare/algorithm-feedback'), window.location.origin);
        const selected_movies = selected.map((x: any) => x.movie_idx).join(',');
        const selected_movie_variants = selected.map((x: any) => x.variant).join(',');

        url.searchParams.append('selected_movies', selected_movies);
        url.searchParams.append('selected_movie_variants', selected_movie_variants);
        url.searchParams.append('nothing', selected.length === 0 ? 'true' : 'false');
        url.searchParams.append('cmp', compare);
    
        for(let i = 0; i < ratings.length; i++) {
            url.searchParams.append(`ar_${i+1}`, ratings[i]);
        }
        url.searchParams.append('next_compare', '');

        setLoading(true);
        fetch(url.toString(), {
            credentials: 'include'
        }).then(response => response.url).then(url => {
            window.location.href = url;
            setLoading(false);
        });
    }, [selected, compare, ratings]);

    const finish = useCallback(() => {
        const url = new URL(getURL('fastcompare/finish-user-study?finish_compare='), window.location.origin);

        fetch(url.toString(), {
            credentials: 'include'
        }).then(response => response.url).then(url => {
            window.location.href = url;
        });
    }, []);

    return (
        <>
            <Modal size="lg" show={show} onHide={() => {
                setShow(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Comparing recommendations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            <p>
                                Now that we know your preferences, we can proceed to the next step.
                            </p>
                            <p>
                                You will be presented with two/three lists of items.
                            </p>
                            <p>
                                Your task is - again - to <b>pick the items in each list that you like the most.</b>
                            </p>
                            <p>
                                Now for the twist - when you're done with picking the individual items, you review the entire lists based on the recommendations they gave you and <b>grade them on a scale from 1 to 5.</b>
                            </p>
                            <p>
                                Ultimately, you will be asked to compare the lists with each other and tell us, <b>which of the lists</b> gave you the best recommendations.
                            </p>
                            <Row className="justify-content-md-center">
                                <Col sm={8}>
                                    <img style={{margin: '10px'}} src="/static/Recommenders.svg" />                
                                </Col>
                            </Row>
                            <p>
                                This part of the study will take approximately 10 minutes.
                            </p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            {
                !data || loading ? (
                    <Spinner animation="border" role="status"/>
                ) : (
                    <>
                        <span style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <h1 style={{display: 'inline-block'}}>Comparing recommendations {data.iteration} / {data.MIN_ITERATION_TO_CANCEL}</h1>
                            <Button onClick={() => setShow(true)} as={'a'}>?</Button>
                        </span>
                        <SelectedContext.Provider value={{selected, setSelected}}>
                        <div style={{display: 'flex', flexDirection: data.result_layout.includes('row') ? 'column' : 'row', justifyContent: 'space-between'}}>
                        {
                            Object.entries(data.movies)
                                .sort((a: any, b: any) => a[1].order - b[1].order)
                                .map(([key, value]: any, i: number) => {
                                    return (
                                        <VariantContext.Provider value={i}>
                                        <div style={{display:'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center'}}>
                                        <Row key={key}>
                                            <Col sm={12}>
                                                <h2>{key}</h2>
                                                {
                                                    (() => {
                                                        switch(data.result_layout){
                                                            case 'rows':
                                                                return <RowsLayout items={value.movies} />
                                                            case 'row-single':
                                                                return <SingleRowLayout items={value.movies} />
                                                            case 'row-single-scrollable':
                                                                return <SingleScrollableRowLayout items={value.movies} />
                                                            case 'columns':
                                                                return <ColumnsLayout items={value.movies} />
                                                            case 'column-single':
                                                                return <SingleColumnLayout items={value.movies} />
                                                            case 'max-columns':
                                                                return <MaxColumnsLayout items={value.movies} />
                                                            default:
                                                                return (
                                                                    <>
                                                                        <Alert variant="danger">
                                                                            Unknown layout: {data.result_layout}
                                                                        </Alert>
                                                                        <SingleRowLayout items={value.movies} />
                                                                    </>
                                                                )
                                                        }
                                                    })()
                                                }
                                            </Col>
                                        </Row>
                                        <Row style={{margin: '2rem'}}>
                                            <Col sm={12}>
                                                <Rating rating={ratings[i]} setRating={(value: number) => setRating(i, value)} />
                                            </Col>
                                        </Row>
                                        </div>
                                        </VariantContext.Provider>
                                    );
                                })
                        }
                        </div>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Which algorithm gave you better recommendations?</Form.Label>
                            <Form.Select aria-label="Default select example" value={compare} onChange={(e) => {
                                setCompare(e.target.value);
                            }} >
                                {
                                    (() => {
                                        const algoNames = Object.entries(data.movies)
                                        .sort((a: any, b: any) => a[1].order - b[1].order).map(([x]) => x);

                                        return (
                                            <>
                                                <option value='first'>{algoNames[0]} was significantly better.</option>
                                                <option value='second'>{algoNames[0]} was slightly better.</option>
                                                <option value='third'>Both were equally good.</option>
                                                <option value='fourth'>{algoNames[1]} was slightly better.</option>
                                                <option value='fifth'>{algoNames[1]} was significantly better.</option>
                                            </>
                                        )
                                    })()
                                }
                            </Form.Select>
                        </Form.Group>
                        </SelectedContext.Provider>
                    </>
                )
            }
            {
                data && data?.iteration === data?.MIN_ITERATION_TO_CANCEL ? (
                    <Button variant="success" onClick={finish}>
                        Finish user study
                    </Button>
                ) : <Button onClick={submit}>Next</Button>
            }
        </>
    )
}