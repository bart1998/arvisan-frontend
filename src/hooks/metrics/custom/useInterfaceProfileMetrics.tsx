import cytoscape from 'cytoscape';
import { useMemo } from 'react';
import { InterfaceProfileCategory } from '../../../helpers/enums';
import useColorShading from '../../useColorShading';
import { DEFAULT_NODE_COLOR } from '../../../helpers/color';
import { ICategoryMetric } from '../../../helpers/metrics';

/**
 * Given a node, get its Interface profile categorization. This function cannot be generalized for
 * any layered-like architecture, because the Interface profile is based on the Application-layer
 * as its upper layer. We cannot use the (sub)layer-layers, because by architecture standards these
 * (sub)layers are only categorizations of module types, but have no true architectural value.
 *
 * @param node
 * @returns InterfaceProfileCategory
 * @returns null if node not on the "Module" layer
 */
export function getInterfaceProfileCategory(
  node: cytoscape.NodeSingular,
): InterfaceProfileCategory | null {
  const nodeProperties = node.data('properties.nodeProperties');
  try {
    let nodePropertiesObject;
    try {
      nodePropertiesObject = JSON.parse(nodeProperties);
    } catch (e) {
      console.error('Invalid JSON string:', nodeProperties);
      return null;
    }
    if (Object.keys(nodePropertiesObject).length === 0) return null;
    const category = nodePropertiesObject.InterfaceProfileCategory;
    if (!category) return null;
    return category;
  } catch (error) {
    console.error('Failed to parse node properties:', error);
    return null;
  }
}

const InterfaceProfileColor = {
  [InterfaceProfileCategory.EXTERNAL]: '#66FE66',
  [InterfaceProfileCategory.INTERNAL]: '#FBB347',
};

/**
 * Interface profile coloring object required for the coloring function of the graph
 */
export default function useInterfaceProfileMetrics() {
  const { shadeColorByDepth } = useColorShading();

  const coloring: ICategoryMetric = useMemo(() => ({
    name: 'Interface profile',
    context: 'graph',
    description: 'The Interface profile is a categorization of modules into groups. Hidden modules have no incoming or outgoing dependencies from/to other applications. Inbound modules only have incoming dependencies from other applications. Outbound modules only have outgoing dependencies to other applications. Transit modules have both. NOTE: this metric is only visible on the module layer.',
    nodeDetailsTitle: 'Interface profile',
    nodeDetailsValue: getInterfaceProfileCategory,
    type: 'category',
    colorFunction(node: cytoscape.NodeSingular) {
      const InterfaceProfile = getInterfaceProfileCategory(node);
      if (InterfaceProfile == null) return shadeColorByDepth(node, DEFAULT_NODE_COLOR);
      return InterfaceProfileColor[InterfaceProfile];
    },
    legend: new Map([
      [InterfaceProfileColor[InterfaceProfileCategory.EXTERNAL], 'External Interfaces component'],
      [InterfaceProfileColor[InterfaceProfileCategory.INTERNAL], 'Internal Interfaces component'],
    ]),
  }), [shadeColorByDepth]);

  return { coloring };
}
