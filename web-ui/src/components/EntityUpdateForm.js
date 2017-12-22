import React, { Component } from 'react';
import { Form, Button, Input, Dropdown } from 'semantic-ui-react';
import Schema from './Schema.json';

class EntityUpdateForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.selectedEntity
        }; 
    }

    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (this.state.id !== nextProps.selectedEntity) {
            this.setState({ id: nextProps.selectedEntity });
            this.fetchData(nextProps.selectedEntity);
        }
    }

    componentDidMount() {   
        this.fetchData(this.state.id);
    }


    fetchData = (id) => {
        fetch('/entities/' + id)
        .then(res => res.json())
        .then(
            (result) => {
                result.original_start = result.start;
                this.setState(result);
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    // Form handlers
    handleChange = (e, { name, value }) => {
        if (name === 'id') {
            this.props.selectEntity(value);
        }
        
        this.setState({ [name]: value });
    }
    
    handleDelete = () => {
        const { id } = this.state;
        if (id === null) {
            alert('Please select an Entity to delete');
            return;
        }

        const update = this.props.fetchData;
        
        fetch('/entities/' + id, {
            method: 'delete'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            update();
        });
    }

    handleUpdate = (e, name) => {
        const data = this.state;
        if (data.id === null) {
            alert(JSON.stringify(this.state));
            return;
        }

        const update = this.props.fetchData;

        fetch('/entities/' + data.id, {
            method: 'put',
            body: JSON.stringify(data)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            update();
        });

    }



    render() {
        const entities = this.props.entities;
        let options = [{ key: -1, text: '-- None --', value: undefined}];

        for (let i = 0; i < entities.length; i++) {
            let ent = entities[i];
            if (ent.id === this.state.id) continue;
            options.push({ key: ent.id, text: ent.name, value: ent.id});
        }

        return (
            <Form onSubmit={ this.handleSubmit }>
                {
                    Schema.properties.map( (ep) => {
                        if (ep.type === 'rel')
                            return (
                                <Form.Field
                                    control={ Dropdown }  
                                    key={ ep.name }                                         
                                    name={ ep.name }
                                    placeholder={ ep.name }
                                    label={ ep.label || ep.name } 
                                    options={ options } 
                                    value={ this.state[ep.name] }  
                                    onChange={ this.handleChange }
                                    required={ ep.required }
                                    search
                                    selection
                                 /> 
                            )
                        else
                            return (
                                <Form.Field
                                    control={ Input }
                                    key={ ep.name }
                                    name={ ep.name }
                                    placeholder={ ep.name }
                                    label={ ep.label || ep.name }                                    
                                    value={ this.state[ep.name] || '' } 
                                    onChange={ this.handleChange }
                                    required={ ep.required }
                                />
                            )
                    })
                }
                <Form.Field>
                    <Button content='Update' onClick={ this.handleUpdate } />
                    <Button negative content='Delete' onClick={ this.handleDelete } />
                </Form.Field>
            </Form>
        )
    }

    

}

export default EntityUpdateForm;