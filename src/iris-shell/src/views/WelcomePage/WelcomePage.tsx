import { Avatar } from '../../components/Avatar/Avatar.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { PERSONAS, type Persona } from '../../lib/personas.js';
import { navigate, useRoute } from '../../lib/router.js';
import { ChoiceCard, ChoicePage } from '../ChoicePage/ChoicePage.js';
import styles from './WelcomePage.module.css';

/**
 * WelcomePage — the start page after the password screen. One big card per
 * persona (scenario). Picking one signs in as that persona and opens their
 * start page. It also stands in for any other page until someone is picked;
 * picking there keeps the page that was asked for.
 */
export function WelcomePage() {
  const route = useRoute();
  const { setPersonaId } = useAppShell();

  const pick = (persona: Persona) => {
    setPersonaId(persona.id);
    if (route.name === 'welcome') navigate(persona.navigation.defaultRoute);
  };

  return (
    <ChoicePage
      title="Welcome"
      subtitle="Choose a persona to start. Each one has their own scenario and navigation."
      topEnd={
        <Tooltip label="Storybooks" placement="bottom">
          <IconButton
            icon={<img src="/logos/storybook.svg" alt="" className={styles.storybookLogo} />}
            ariaLabel="Storybooks"
            size="l"
            onClick={() => navigate('#/storybooks')}
          />
        </Tooltip>
      }
    >
      {PERSONAS.map((persona) => (
        <ChoiceCard
          key={persona.id}
          visual={<Avatar name={persona.name} src={persona.avatar} size="l" aria-hidden />}
          title={persona.name}
          subtitle={persona.personaTitle}
          description={persona.scenario}
          cta={`Continue as ${persona.name.split(' ')[0]}`}
          onClick={() => pick(persona)}
        />
      ))}
    </ChoicePage>
  );
}
