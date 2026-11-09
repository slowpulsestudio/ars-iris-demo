import { Button } from '../../components/Button/Button.js';
import { navigate } from '../../lib/router.js';
import { STORYBOOKS } from '../../lib/storybooks.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import styles from './StorybooksPage.module.css';

/**
 * StorybooksPage — opened from the Storybook button on the welcome page.
 * One card per Storybook; each opens in a new browser tab.
 */
export function StorybooksPage() {
  return (
    <ChoicePage
      title="Storybooks"
      subtitle="See the components this prototype is built from."
      topStart={
        <Button variant="secondary" iconLead="ArrowLeft" onClick={() => navigate('#/welcome')}>
          Back
        </Button>
      }
    >
      {STORYBOOKS.map((storybook) => (
        <ChoiceCard
          key={storybook.id}
          visual={<img src="/logos/storybook.svg" alt="" className={styles.logo} />}
          title={storybook.name}
          subtitle={storybook.subtitle}
          description={storybook.description}
          cta={`Open ${storybook.name}`}
          href={storybook.href}
        />
      ))}
    </ChoicePage>
  );
}
