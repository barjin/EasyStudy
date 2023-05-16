import Container from 'react-bootstrap/Container';

import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getURL } from '../../utils/getRootURL';

export function Finish() {
  const [results, setResults] = useState<any | null>(null);

  useEffect(() => {
    fetch(getURL('utils/finish-data'), {
        credentials: 'include',
    }).then(r => r.json()).then(r => {
        setResults(r);
    }).catch(e => {
        console.log(e);
    });
   }, []);

  return (
    <>
    <Container>
        <h1>Thank you!</h1>
        <Table striped bordered hover>
            <thead>
             {[ 'Algorithm Name', 'Number of Selected Items', 'Number of shown items', 'Average Rating'].map((e, i) => <th key={i}>{e}</th>)}
            </thead>
                <tbody>
                {
                    results && 
                     (<>
                        {Array(Object.keys(results['n_avg_rating_per_algorithm']).length).fill(0).map((_, i) => {
                        return (
                            <tr key={i}>
                                <td>{Object.keys(results['n_avg_rating_per_algorithm'])[i] as string}</td>
                                <td>{Object.values(results['n_selected_per_algorithm'])[i] as string}</td>
                                <td>{results['n_recommended'] / Object.keys(results['n_avg_rating_per_algorithm']).length}</td>
                                <td>{Object.values(results['n_avg_rating_per_algorithm'])[i] as string}</td>
                            </tr>
                        )
                        })}
                     <tr>
                        <td>
                            <b>Total</b>
                        </td>
                        <td>
                            {results['n_selected']}
                        </td>
                        <td>
                            {results['n_recommended']}
                        </td>
                        <td>
                            {Math.floor((Object.values(results['n_avg_rating_per_algorithm']) as number[]).reduce((a: number, b: number) => a + b, 0) / Object.keys(results['n_avg_rating_per_algorithm']).length * 10) / 10}
                        </td>
                     </tr>
                    </>)
                }
                </tbody>
            </Table>
    </Container>
    </>
  );
}
