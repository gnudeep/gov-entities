import React, { Component } from 'react';
import { Container, Header, Grid, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { Menu, Tab } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

// App components
import RelationshipSelector from './RelationshipSelector';
import MainOrgChartVis from './MainOrgChartVis';
import EntityForm from './EntityForm';
import EntityUpdateForm from './EntityUpdateForm';
import Map from './Map';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: null,
      error: null,
      data:  {},
      selected_rel: {parent: true},
      selectedEntity: 1,
      selectedParents: [0]
    };
  }

  componentDidMount() {   
    this.fetchData();
  }

  updateRelationshipSelection = (name) => {
    let selected_rel = this.state.selected_rel;
    selected_rel[name] = !selected_rel[name];

		this.setState({
      selected_rel: selected_rel
		});
  }

  selectEntity = (id) => {
    this.setState({
      selectedEntity: id
    });

    let idx = this.state.selectedParents.indexOf(id);
    if (idx !== -1) {
      this.state.selectedParents.length = this.state.selectedParents.indexOf(id);
    }
    
    this.state.selectedParents.push(id);
    this.fetchData();
  }

  fetchData = () => {
    const parents = this.state.selectedParents.join(',');
    console.log(parents);
    fetch("/entities?parents=" + parents)
    .then(res => res.json())
    .then(
      (result) => {
          this.setState({
            isLoaded: true,
            data: result
          });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render() {
    const { error, isLoaded, data } = this.state;

    const panes = [
      {
        menuItem: <Menu.Item key='update'>Update Entity</Menu.Item>,
        render: () => <Container fluid><hr /><EntityUpdateForm entities={ data } fetchData={ this.fetchData } selectedEntity={ this.state.selectedEntity } selectEntity={ this.selectEntity } /></Container>,
      },
      {
        menuItem: { key: 'add', icon: 'users', content: 'Add Entity' },
        render: () => <Container fluid><hr /><EntityForm entities={ data } fetchData={ this.fetchData } selectedEntity={ this.state.selectedEntity } selectEntity={ this.selectEntity } /></Container>,
      },
      {
        menuItem: { key: 'history', icon: 'history', content: 'History' },
        render: () => <Container fluid height="300px"><hr /><Header as='h3' icon textAlign='center'>Entity history</Header></Container>,
      }
    ]



    if (error) {
      return <div>Error: { error.message }</div>;
    } else if (!isLoaded) {
        return <div>     
                <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>            
                </Segment>
            </div>
		}
	
		return(
			<div className="App">
				<header className="App-header">
					<Header as='h1' icon textAlign='center'>Sri Lankan Government [ 2015-01-09 - Now ]</Header>
				</header>
				
				<Grid>
					<Grid.Row columns={ 2 }>

						<Grid.Column width={ 12 }>
							<RelationshipSelector selected_rel={ this.state.selected_rel } reload={ this.updateRelationshipSelection } />
							<MainOrgChartVis entities={ data } fetchData={ this.fetchData } selected_rel={ this.state.selected_rel } selected={ this.selectedEntity } selectEntity={ this.selectEntity } />
						</Grid.Column>
						
						<Grid.Column width={ 4 }>
							<Tab panes={ panes } />
							
							<hr />
							<hr />
						</Grid.Column>
              {/*<Map />*/}
					</Grid.Row>
				</Grid>
			</div>
		);

  }
}

export default App;