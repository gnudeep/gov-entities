import Schema from './Schema.json';


function array2json(array) {
    let map = {};
    for(var i = 0; i < array.length; i++) {
        var obj = array[i]
        if(!(obj.id in map)) {
            map[obj.id] = obj;
            map[obj.id].children = [];
        }

        if(typeof map[obj.id].name === 'undefined') {
            map[obj.id].id = obj.id;
            map[obj.id].name = obj.name;
            map[obj.id].attr = obj.attr;
            map[obj.id].parent= obj.parent;
        }

        var parent = obj.parent || '-';
        if(!(parent in map)) {
            map[parent] = {};
            map[parent].children = [];
        }

        map[parent].children.push(map[obj.id]);
    }
    return map['-'];
}

function array2graph(array, selected_rel) {
    let graph = {
        nodes: [],
        edges: []
    };

    for(let entity of array) {

        graph.nodes.push({
            id: entity.id,
            label: entity.name
        });

        for (let ep of Schema.properties) {
            if (ep.type === 'rel' && entity[ep.name] !== null && selected_rel[ep.name]) {                
                let parent = {id: entity[ep.name], type: ep.name};
        
                graph.edges.push({
                    from: parent.id,
                    to: entity.id,
                    label: (parent.type === 'parent') ? null : parent.type,
                    color: (parent.type === 'parent') ? {color:'blue'} : {color:'orange'},
                    smooth: (parent.type === 'parent') ? {} : { 
                        enabled: true,
                        type: "curvedCCW", 
                        forceDirection: "none", //'horizontal', 'vertical', 'none'
                        roundness: 0.1
                    }
                });
            }
        }
        
    }

    return graph;
}

export {array2json, array2graph};