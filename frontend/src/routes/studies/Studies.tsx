import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useInterval } from '../../hooks/useInterval';

import { getURL } from '../../utils/getRootURL';

export function Studies() {
  const [userStudies, setUserStudies] = useState<any[] | null>(null);
  const [filteredStudies, setFilteredStudies] = useState<any[]|null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useInterval(() => {
    fetch(getURL('existing-user-studies'), {
        credentials: 'include',
    }).then(r => r.json()).then(r => {
        setUserStudies(r);
    }).catch(e => {
        console.log(e);
        setUserStudies([]);
    });
  }, 5000);

    useEffect(() => {
        setFilteredStudies(userStudies?.filter(study => Object.values(study).join(' ').toLowerCase().includes(searchTerm.toLowerCase())) ?? null)
    }, [userStudies, searchTerm]);


  return (
    <>
    <Container>
        <InputGroup className="mb-3">
        <InputGroup.Text>🔍️</InputGroup.Text>
        <Form.Control
          placeholder="Search for a user study"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={searchTerm}
        />
      </InputGroup>
      <Table striped hover>
        <thead>
            <th>Active</th>
            <th>Parent plugin</th>
            <th>Author</th>
            <th>GUID</th>
            <th>Participants</th>
            <th>Link</th>
        </thead>
        <tbody>
            {
                filteredStudies?.map((study, index) => {
                    return (
                        <tr key={index}>
                            <td><b>{study.active ? '✅' : '❌'}</b></td>
                            <td>{study.parent_plugin}</td>
                            <td>{study.creator}</td>
                            <td>{study.guid}</td>
                            <td>{study.participants}</td>
                            <td>{!study.initialized ? <Spinner /> : <a href={study.join_url}>Join study</a>}</td>
                        </tr>
                    );
                })
            }
        </tbody>
    </Table>
    {
        userStudies?.length === 0 && (
            <Alert variant="info">
                You have no studies yet. <Link to="/plugins">Browse plugins</Link> to create a study.
            </Alert>
        )
    }
    {
        userStudies && userStudies?.length !== 0 && filteredStudies?.length === 0 && <Alert variant="warning">No user studies matching "{searchTerm}" found.</Alert>
    }
    {
        userStudies === null && <Alert variant="info">Loading studies...</Alert>
    }
    </Container>
    </>
  );
}
