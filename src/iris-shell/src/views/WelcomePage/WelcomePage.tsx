import { Avatar } from '../../components/Avatar/Avatar.js';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo.js';
import { Icon } from '../../components/Icon/Icon.js';
import { useAppShell } from '../../lib/appShellContext.js';
import { PERSONAS, type Persona } from '../../lib/personas.js';
import { navigate, useRoute } from '../../lib/router.js';
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
    <div className={styles.page}>
      <main className={styles.content}>
        <header className={styles.intro}>
          <span className={styles.product}>
            <BrandLogo size="32px" />
            Active Roles
          </span>
          <h1 className={styles.title}>Welcome</h1>
          <p className={styles.subtitle}>
            Choose a persona to start. Each one has their own scenario and navigation.
          </p>
        </header>

        <ul className={styles.cards} role="list">
          {PERSONAS.map((persona) => (
            <li key={persona.id} className={styles.cardItem}>
              <button type="button" className={styles.card} onClick={() => pick(persona)}>
                <Avatar name={persona.name} src={persona.avatar} size="l" aria-hidden />
                <span className={styles.who}>
                  <span className={styles.name}>{persona.name}</span>
                  <span className={styles.personaTitle}>{persona.personaTitle}</span>
                </span>
                <span className={styles.scenario}>{persona.scenario}</span>
                <span className={styles.cta}>
                  Continue as {persona.name.split(' ')[0]}
                  <Icon name="ArrowRight" size="16px" className={styles.arrow} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
