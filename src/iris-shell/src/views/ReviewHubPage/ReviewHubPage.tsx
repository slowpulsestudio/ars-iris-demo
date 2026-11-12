import { DESIGN_UPDATES, MISSING_FROM_FIGMA } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { navigate } from '../../lib/router.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import styles from './ReviewHubPage.module.css';

/** ReviewHubPage — opened from the welcome page: the design review pages, like the Storybooks page. */
export function ReviewHubPage() {
  return (
    <ChoicePage
      title="Design review"
      subtitle="What to check against the Figma files."
      topStart={
        <Button variant="secondary" iconLead="ArrowLeft" onClick={() => navigate('#/welcome')}>
          Back
        </Button>
      }
    >
      <ChoiceCard
        visual={<Icon name="PencilSimple" size="32px" className={styles.visual} />}
        title="Design update recommendations"
        subtitle={`${DESIGN_UPDATES.length} to draw`}
        description="Things the prototype does beyond Figma, and what to draw in Figma so the design matches."
        cta="Open the list"
        onClick={() => navigate('#/components-to-review/recommendations')}
      />
      <ChoiceCard
        visual={<Icon name="PuzzlePiece" size="32px" className={styles.visual} />}
        title="Components not in Figma"
        subtitle={`${MISSING_FROM_FIGMA.length} to review`}
        description="Components the screens use that the ARS - Primary kit lacks, each linked to its node in the CRUD file."
        cta="Open the list"
        onClick={() => navigate('#/components-to-review/missing')}
      />
      <ChoiceCard
        visual={<Icon name="ClipboardText" size="32px" className={styles.visual} />}
        title="Design review tasks"
        subtitle="By flow"
        description="Screens to compare with Figma and design decisions to confirm. Ticking an item updates docs/review-notes.md."
        cta="Open the checklist"
        onClick={() => navigate('#/components-to-review/tasks')}
      />
      <ChoiceCard
        visual={<Icon name="NotePencil" size="32px" className={styles.visual} />}
        title="Figma tidy-up"
        subtitle="Fix in Figma"
        description="Spelling, quote style and places where the Figma files disagree, for you to fix in Figma. Ticking an item updates docs/figma-tidy-up.md."
        cta="Open the list"
        onClick={() => navigate('#/components-to-review/tidy-up')}
      />
    </ChoicePage>
  );
}
