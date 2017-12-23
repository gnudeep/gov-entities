import React, { Component } from 'react';
import { Form, Checkbox, Header } from 'semantic-ui-react';
import Schema from './Schema.json';


class RelationshipSelector extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.selectedRelationships;
    }
    
    handleChange = (e, { name }) => {
        this.props.reload(name);
    }
  
    render() {
        return (
            <Form.Field>
            <Header size='small'>Relationships</Header>
            {
                Schema.properties.map( (ep) => {
                    if (ep.type === 'rel') {
                        return <Checkbox key={ ep.name } toggle label={ ep.label || ep.name } onChange={ this.handleChange } name={ ep.name } checked={ this.state[ep.name] } />;
                    }
                    return null;
                })
            }
            </Form.Field>
        )
    }
    
}

export default RelationshipSelector;