import { Badge } from '../../components/Badge/Badge.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { JOBS_DIRECTIONS, JOBS_START_ROUTE, setJobsDirection, type JobsDirectionInfo } from '../../lib/jobsDirection.js';
import { resetJobs } from '../../lib/jobsStore.js';
import { navigate, useRoute } from '../../lib/router.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import { ComplexityRating } from '../SystemComms/ComplexityRating.js';
import styles from './WelcomePage.module.css';

/** Every direction signs in as David Smith, the admin, who can run bulk moves. */
const DIRECTION_PERSONA_ID = 'admin-user';


/**
 * WelcomePage — the start page after the password screen. On this branch it offers one card per Background Jobs
 * complexity direction instead of one per persona: the recommended A as a large card on top, then B to E. Picking one signs in as David
 * Smith with that direction and opens the Users list with every AD user ticked, ready to Move. It also stands in for any other page until someone is
 * picked; picking there keeps the page that was asked for.
 */
export function WelcomePage() {
  const route = useRoute();
  const { setPersonaId } = useAppShell();

  const pick = (direction: JobsDirectionInfo) => {
    resetJobs();
    setJobsDirection(direction.id);
    setPersonaId(DIRECTION_PERSONA_ID);
    if (route.name === 'welcome') navigate(JOBS_START_ROUTE);
  };

  return (
    <ChoicePage
      title="Welcome"
      columns={4}
      subtitle="Here are the Background Jobs directions from simplest to most complex"
      topEnd={
        <span className={styles.topActions}>
          <Tooltip label="Design review" placement="bottom">
            <IconButton
              icon="ClipboardText"
              ariaLabel="Design review"
              size="l"
              onClick={() => navigate('#/components-to-review')}
            />
          </Tooltip>
          <Tooltip label="Storybooks" placement="bottom">
            <IconButton
              icon={<img src="/logos/storybook.svg" alt="" className={styles.storybookLogo} />}
              ariaLabel="Storybooks"
              size="l"
              onClick={() => navigate('#/storybooks')}
            />
          </Tooltip>
        </span>
      }
    >
      {[...JOBS_DIRECTIONS.filter((d) => d.recommended), ...JOBS_DIRECTIONS.filter((d) => !d.recommended)].map((direction) => (
        <ChoiceCard
          key={direction.id}
          wide={direction.recommended}
          badge={
            direction.recommended ? (
              <Badge tone="info" strong icon="Star">
                Recommended
              </Badge>
            ) : undefined
          }
          visual={
            <span className={direction.recommended ? `${styles.shot} ${styles.shotWide}` : styles.shot}>
              <img src={direction.image} alt={`${direction.title}: ${direction.description}`} />
            </span>
          }
          title={direction.title}
          subtitle={
            <span className={styles.meta}>
              Option {direction.letter}
              <ComplexityRating value={direction.complexity} />
            </span>
          }
          cta={`Option ${direction.letter}`}
          onClick={() => pick(direction)}
        />
      ))}
    </ChoicePage>
  );
}
