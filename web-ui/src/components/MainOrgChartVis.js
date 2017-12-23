import React, { Component } from 'react';

import Graph from 'react-graph-vis';
import '../../node_modules/vis/dist/vis.css';

import { array2graph } from './util';



class MainOrgChartVis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            network: {},
            selectedNode: this.props.selectedNode
        };
      }
    
    componentDidMount() {
        this.network.focus(this.state.selectedNode, {
            scale: 1,
            offset: {x:0, y: -100},
            animation: { duration: 1000 }
        });
        
    }

    getNetwork = (network) => {
        this.network = network;
    }

    handleSelectNode = (event) => {
        this.props.selectEntity(event.nodes[0]);
              
    }

    render() {
        const data = this.props.entities;

        const options = {
            autoResize: true,
            physics: false,
            layout: {
                improvedLayout:true,
                hierarchical: {
                  enabled:true,
                  levelSeparation: 240,
                  nodeSpacing: 400,
                  blockShifting: false,
                  edgeMinimization: true,
                  parentCentralization: true,
                  direction: 'UD',        // UD, DU, LR, RL
                  sortMethod: 'directed'   // hubsize, directed
                }            
            },
            edges: {
              color: "#000000",
              arrows: { to: true }
            },
            nodes: {
                shape: 'box',
                fixed: true,
                scaling: {
                    label: true
                },
                shadow: true,                              
                borderWidth: 1,
                borderWidthSelected: 2,
                brokenImage:undefined
            },
            interaction: {
                navigationButtons: true,
                keyboard: false,
                hover:true
            }
        };

        const events = {
          selectNode: this.handleSelectNode
        };

        return <Graph graph={array2graph(data, this.props.selectedRelationships)} getNetwork={ this.getNetwork } options={options} events={events} style={{ height: "700px" }} />;
    }

};


export default MainOrgChartVis;