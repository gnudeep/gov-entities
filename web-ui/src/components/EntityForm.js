import React, { Component } from 'react';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import Schema from './Schema.json';


class EntityForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            parent: this.props.selectedEntity
        }; 
        console.log(this.state)
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectedEntity !== nextProps.selectedEntity) {
            this.setState({ parent: nextProps.selectedEntity });
        }
    }

    handleChange = (e, { name, value }) => {
        if (name === 'parent') {
            this.props.selectEntity(value);
        }

        this.setState({[name]: value });
    }


    handleAdd = () => {
        const data = this.state;
        if (data.parent === null) {
            alert(JSON.stringify(this.state));
            return;
        }

        const update = this.props.fetchData;

        fetch('/entities', {
            method: 'post',
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
        const data = this.props.entities;
        let options = [{ key: -1, text: '-- None --', value: undefined}];
        for (let i = 0; i < data.length; i++) {
            let ent = data[i];
            options.push({ key: ent.id, text: ent.name, value: ent.id});
        }

        
        return(
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
                                    value={ this.state[ep.name] || (ep.name === 'parent') ? this.props.selectedEntity : '' }  
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
                                    onChange={ this.handleChange || '' }
                                    required={ ep.required }
                                />
                            )
                    })
                }
                <Form.Button content='Submit' onClick={ this.handleAdd } />
            </Form>
        );
    }


}

export default EntityForm;