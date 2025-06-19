import cytoscape from 'cytoscape';

const stylesheet: cytoscape.Stylesheet[] = [{
  selector: 'node',
  css: {
    height: 'label',
    width: 'label',
    'padding-top': '16',
    'border-color': 'black',
    'background-color': 'data(properties.color)',
    'border-width': 1,
    shape: 'round-rectangle',
    label: 'data(label)',
    'text-valign': 'center',
    'text-wrap': 'ellipsis',
  },
}, {
  selector: 'node:parent',
  css: {
    'text-valign': 'top',
    'font-size': '24',
  },
}, {
  selector: 'edge',
  css: {
    'target-arrow-shape': 'triangle',
    'target-arrow-color': 'black',
    'source-arrow-color': 'gray',
    'line-fill': 'linear-gradient',
    'line-gradient-stop-colors': ['gray', 'black'],
    'line-gradient-stop-positions': [0, 100],
    'curve-style': 'bezier',
    width: 1.5,
    'control-point-step-size': 200,
    'loop-sweep': '90deg',
  },
}, {
  selector: 'edge.violation, edge[properties.violation = "true"]',
  css: {
    'line-gradient-stop-colors': ['#FF8888', '#FF0000'],
    'target-arrow-color': '#FF0000',
    'source-arrow-color': '#FF8888',
  },
}, {
  selector: 'edge.removed_violation, edge[properties.removed_violation = "true"]',
  css: {
    'line-gradient-stop-colors': ['#A2FF88', '#55FF00'],
    'target-arrow-color': '#55FF00',
    'source-arrow-color': '#A2ff88',
  },
}, {
  selector: 'edge.grey, edge[properties.grey = "true"]',
  css: {
    'line-gradient-stop-colors': ['#D2D2D2', '#909090'],
    'target-arrow-color': '#909090',
    'source-arrow-color': '#D2D2D2',
  },
},{
selector: 'edge.deviation, edge[properties.violation = "true"]',
css: {
  'line-gradient-stop-colors': ['#FFC188', '#FF7C01'],
  'target-arrow-color': '#FF7C01',
  'source-arrow-color': '#FFC188',
}, }, {
  selector: 'node[properties.selected = "true"]',
  css: {
    'border-color': '#ff0000',
    'border-width': 4,
  },
}, {
  selector: 'edge.hidden',
  css: {
    visibility: 'hidden',
  },
}];

export default stylesheet;
