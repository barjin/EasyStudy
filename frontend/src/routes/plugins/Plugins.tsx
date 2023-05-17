import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getURL } from '../../utils/getRootURL';

export function Plugins() {
  const [availablePlugins, setAvailablePlugins] = useState<any[]|null>(null);
  const [filteredPlugins, setFilteredPlugins] = useState<any[]|null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch(getURL('loaded-plugins')).then(r => r.json()).then(r => {
        setAvailablePlugins(r);
    });
  }, []);

  useEffect(() => {
    setFilteredPlugins(availablePlugins);
  }, [availablePlugins]);

  return (
    <>
    <Container>
      <InputGroup className="mb-3">
        <InputGroup.Text>🔍️</InputGroup.Text>
        <Form.Control
          placeholder="Search for plugin"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredPlugins(availablePlugins?.filter(plugin => plugin.plugin_name.toLowerCase().includes(e.target.value.toLowerCase())) ?? null);
          }}
          value={searchTerm}
        />
      </InputGroup>
      <Table striped hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Author</th>
                <th>Version</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                filteredPlugins?.map((plugin, index) => {
                    return (
                        <tr key={index}>
                            <td><b>{plugin.plugin_name}</b></td>
                            <td>{plugin.plugin_description}</td>
                            <td>{plugin.plugin_author}</td>
                            <td>{plugin.plugin_version}</td>
                            <td>
                                <Link to={plugin['create_url']}>Create study</Link>
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    </Table>
    {
        filteredPlugins?.length === 0 && <Alert variant="warning">No plugins matching "{searchTerm}" found.</Alert>
    }
    {
        availablePlugins === null && <Alert variant="info">Loading plugins...</Alert>
    }
    </Container>
    </>
  );
}
