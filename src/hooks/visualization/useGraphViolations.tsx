import { MutableRefObject, useContext, useEffect } from 'react';
import cytoscape from 'cytoscape';
import { VisibilityOptions } from '../../helpers/enums';
import { ViolationsContext } from '../../context';

export default function useGraphViolations(
  cy: MutableRefObject<cytoscape.Core | undefined>,
) {
  const { violations, visibility } = useContext(ViolationsContext);

  return useEffect(() => {
    if (!cy.current) return;

    const violationIds = {
      dependencyCycles: violations.dependencyCycles.map((c) => c.path.map((p) => p.id)).flat(),
      subLayers: violations.subLayers.map((s) => s.id),
    };

    const allIds = [...violationIds.dependencyCycles, ...violationIds.subLayers];
    const highlightIds: string[] = [];
    const visibleIds: string[] = [];
    if (visibility.dependencyCycles === VisibilityOptions.HIGHLIGHTED) {
      highlightIds.push(...violationIds.dependencyCycles);
    } else if (visibility.dependencyCycles === VisibilityOptions.VISIBLE) {
      visibleIds.push(...violationIds.dependencyCycles);
    }
    if (visibility.subLayers === VisibilityOptions.HIGHLIGHTED) {
      highlightIds.push(...violationIds.subLayers);
    } else if (visibility.subLayers === VisibilityOptions.VISIBLE) {
      visibleIds.push(...violationIds.subLayers);
    }

    cy.current.edges().forEach((e: cytoscape.EdgeSingular) => {
      e.removeClass('violation');
      e.removeClass('hidden');
      e.removeClass('deviation');

      const idWithRandom = e.id();
      const id = idWithRandom.split('--')[0] || '';
      const edgeLabel = e.data('interaction');

      if (highlightIds.includes(id) || edgeLabel === 'deviates') {
        e.addClass('deviation');
      }
      // Edge should be highlighted
      if (highlightIds.includes(id) || edgeLabel === 'violates') {
        e.addClass('violation');
      } else if (edgeLabel === 'violates_new') {
        e.addClass('violation'); // Violation class is red
      } else if (edgeLabel === 'violates_removed') {
        e.addClass('removed_violation');
      } else if (edgeLabel === 'violates_remaining') {
        // Do not assign a different color
      } else if (edgeLabel === 'calls_grey') {
        e.addClass('grey');
        // Edge is a violation and should not be made visible
      } else if (allIds.includes(id) && !visibleIds.includes(id)) {
        e.addClass('hidden');
      }

      // Edge is not a violation and should be made invisible
      if (!allIds.includes(id) && visibility.nonViolations === VisibilityOptions.INVISIBLE) {
        e.addClass('hidden');
      }
    });
  }, [cy, violations, visibility]);
}
