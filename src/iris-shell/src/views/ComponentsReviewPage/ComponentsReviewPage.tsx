import { FIGMA_FILES, MISSING_FROM_FIGMA, figmaNodeUrl } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { navigate } from '../../lib/router.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import styles from './ComponentsReviewPage.module.css';

/**
 * ComponentsReviewPage — opened from the welcome page. One card per component
 * the CRUD screens use that the ARS - Primary kit lacks; each opens its Figma node.
 */
export function ComponentsReviewPage() {
  return (
    <ChoicePage
      title="Components not in Figma"
      subtitle="Used by the screens but missing from the ARS - Primary kit. Each is drawn from the node linked on its card."
      topStart={
        <Button variant="secondary" iconLead="ArrowLeft" onClick={() => navigate('#/components-to-review')}>
          Back
        </Button>
      }
    >
      {MISSING_FROM_FIGMA.map((entry) => (
        <ChoiceCard
          key={entry.component}
          visual={<Icon name="PuzzlePiece" size="32px" className={styles.visual} />}
          title={entry.figmaName}
          subtitle={`${FIGMA_FILES[entry.file].name} · ${entry.figmaNodeId}`}
          description={entry.note}
          cta="Open in Figma"
          href={figmaNodeUrl(entry.file, entry.figmaNodeId)}
        />
      ))}
    </ChoicePage>
  );
}
