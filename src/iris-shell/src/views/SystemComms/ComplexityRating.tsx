import { Icon } from '../../components/Icon/Icon.js';
import styles from './ComplexityRating.module.css';

const MAX = 5;

/** A 1 to 5 complexity rating: five gears, the first `value` lit in the brand colour, the rest dimmed. */
export function ComplexityRating({ value }: { value: number }) {
  return (
    <span className={styles.rating} role="img" aria-label={`Complexity ${value} of ${MAX}`} title={`Complexity ${value} of ${MAX}`}>
      {Array.from({ length: MAX }, (_, i) => (
        <Icon key={i} name="Gear" size="16px" className={i < value ? styles.on : styles.off} />
      ))}
    </span>
  );
}
