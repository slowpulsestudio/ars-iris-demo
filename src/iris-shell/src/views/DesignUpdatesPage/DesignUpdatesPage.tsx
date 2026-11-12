import { DESIGN_UPDATES, FIGMA_FILES } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { navigate, personaHash } from '../../lib/router.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import styles from './DesignUpdatesPage.module.css';

/** The persona the prototype links open as. */
const PROTOTYPE_PERSONA = 'admin-user';

/**
 * DesignUpdatesPage — opened from the Design review hub. One card per thing the prototype does
 * beyond Figma, with a recommendation for what to draw. Each card opens the prototype, as Figma
 * has nothing to show; the subtitle names the Figma frame it departs from.
 */
export function DesignUpdatesPage() {
  return (
    <ChoicePage
      title="Design update recommendations"
      subtitle="What the prototype does beyond Figma, and what to draw in Figma so the design matches."
      topStart={
        <Button variant="secondary" iconLead="ArrowLeft" onClick={() => navigate('#/components-to-review')}>
          Back
        </Button>
      }
    >
      {DESIGN_UPDATES.map((entry) => (
        <ChoiceCard
          key={entry.title}
          visual={<Icon name="PencilSimple" size="32px" className={styles.visual} />}
          title={entry.title}
          subtitle={entry.file && entry.figmaNodeId ? `${FIGMA_FILES[entry.file].name} · ${entry.figmaNodeId}` : 'Not in Figma'}
          description={`${entry.note} Recommendation: ${entry.recommendation}`}
          cta="Open in prototype"
          href={personaHash(PROTOTYPE_PERSONA, entry.prototype)}
        />
      ))}
    </ChoicePage>
  );
}
