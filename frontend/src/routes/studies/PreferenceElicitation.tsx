import { useEffect, useState, useCallback } from 'react'; 
import { Modal, Button, Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { useDebounce } from '../../hooks/useDebounce';
import { getCSRFToken } from '../../utils/getCSRFToken';
import { getURL } from '../../utils/getRootURL';
import { reportSelectedItem } from '../../utils/reporting';

export function Item({data, onClick, selected}: any) {
    return (
        <div style={{cursor: 'pointer', marginBottom: '20px'}}>
            <div style={{position: 'relative', height: '300px', width: '203px'}} onClick={onClick}>
                <img style={{height: '100%', boxShadow: '0px 0px 45px -16px rgba(143,143,143,1)'}} src={getURL(data.url)} />
                {
                    selected && (
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

export function PreferenceElicitation() {
    const [show, setShow] = useState(true);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 500);

    const [selected, setSelected] = useState<any[]>([]);

    const submit = useCallback(async () => {
        const url = new URL(getURL('fastcompare/send-feedback'), window.location.origin);
        url.searchParams.append('csrf_token', await getCSRFToken());
        url.searchParams.append('selectedMovies', selected.map(x => x.movie_id).join(','));

        setSubmitLoading(true);
        await fetch(url, {
            credentials: 'include'
        }).then(response => response.url).then(url => {
            window.location.href = url;
        });
    }, [selected]);

    const loadMoreItems = useCallback(() => {
        setMoreLoading(true);
        fetch(getURL('fastcompare/get-initial-data'), {
            credentials: 'include'
        }).then(response => response.json()).then(data => {
            setItems(data);
            setMoreLoading(false);
        });
    }, [items, setItems]);

    useEffect(() => {
        setSearchLoading(true);
        fetch(
            debouncedQuery !== '' ?
            getURL(`fastcompare/item-search?pattern=${debouncedQuery}&attrib=movie`) :
            getURL('fastcompare/get-initial-data'), {
            credentials: 'include'
        }).then(response => response.json()).then(data => {
            setItems(data);
            setSearchLoading(false);
        });
    }, [debouncedQuery]);

    useEffect(() => {
        loadMoreItems();
    }, []);

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Preference Elicitation</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col sm={12}>
                            <p>
                                During this phase, you simply select items that you have seen and that you like.
                            </p>
                            <Row className="justify-content-md-center">
                                <Col sm={8}>
                                    <img style={{margin: '10px'}} src="/static/Elicitation.svg" />                
                                </Col>
                            </Row>
                            <p>
                                It is advisable to select at least 5-10 items for the correct recommendation functionality.
                            </p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <span style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <h1 style={{display: 'inline-block'}}>Preference Elicitation</h1>
                <Button onClick={() => setShow(true)} as={'a'}>?</Button>
            </span>
            <InputGroup className="mb-3">
                <InputGroup.Text>{ searchLoading ? <Spinner animation="border" role="status"/> : '🔍️'}</InputGroup.Text>
                <Form.Control
                    placeholder="Search for an item"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
            </InputGroup>
            {
                items.reduce((acc: any, x: any, i: number) => {
                    if (i % 6 === 0) acc.push([]);
                    acc[acc.length - 1].push(x);
                    return acc;
                }
                , []).map((x: any) => (
                    <Row>
                        {
                            x.map((y: any) => (
                                <Col sm={2}>
                                    <Item {...{
                                        data: y,
                                        onClick: () => {
                                            if(selected.find(x => x.movie_id === y.movie_id)) {
                                                setSelected(selected.filter(z => z['movie_id'] !== y['movie_id']));
                                                reportSelectedItem(selected, { deselectedItem: y } as any);
                                            } else {
                                                setSelected([...selected, y]);
                                                reportSelectedItem([...selected, y], { selectedItem: y } as any);
                                            }
                                        },
                                        selected: selected.find(x => x.movie_id === y.movie_id)
                                    }} />
                                </Col>
                            ))
                            }
                    </Row>
                ))
            }
            <Row className='justify-content-md-center' style={{margin: '20px'}}>
                { moreLoading ? <Spinner animation="border" role="status"/> : null }
            </Row>
            <Row>
                <Button onClick={loadMoreItems} disabled={moreLoading}>
                 Load more items
                </Button>
                <Button onClick={submit} disabled={submitLoading}>
                    { submitLoading ? <Spinner animation="border" role="status"/> : 'Done!' }
                </Button>
            </Row>
        </>
    )
}