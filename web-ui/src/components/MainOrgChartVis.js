import React, { Component } from 'react';

import Graph from 'react-graph-vis';
import '../../node_modules/vis/dist/vis.css';

import { array2graph } from './util';



class MainOrgChartVis extends Component {
    
    render() {
        const data = this.props.entities;

        const options = {
            autoResize: true,
            layout: {
                improvedLayout:true,
                hierarchical: {
                  enabled:true,
                  levelSeparation: 300,
                  nodeSpacing: 100,
                  blockShifting: false,
                  edgeMinimization: true,
                  parentCentralization: true,
                  direction: 'LR',        // UD, DU, LR, RL
                  sortMethod: 'directed'   // hubsize, directed
                }            
            },
            edges: {
              color: "#000000",
              arrows: {
                  to: true
              }
            },
            nodes:{
                shape: 'box',
                fixed: false,
                scaling: {
                    label: true
                  },
                  shadow: true,                              
                borderWidth: 1,
                borderWidthSelected: 2,
                brokenImage:undefined
              },
              "physics": false,
            configure: {
                enabled: false,
                showButton: true
            },
            interaction: {
                navigationButtons: true,
                keyboard: false,
                hover:true
            }
        };
          
        const selectEntity = this.props.selectEntity;
        const events = {
          selectNode: function(event) {
              
              var { nodes } = event;
              selectEntity(nodes[0]);
              //console.log("Selected nodes:");
              //console.log(nodes);
              //console.log("Selected edges:");
              //console.log(edges);
            }
          };

        return <Graph graph={array2graph(data, this.props.selected_rel)} focus={this.props.selectedEntity} options={options} events={events} style={{ height: "700px", width: "100%" }} />;
    }

};


export default MainOrgChartVis;