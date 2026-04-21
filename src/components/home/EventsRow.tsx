import { useRef } from 'react';
import styles from './EventsRow.module.css';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  flyerUrl?: string;
}

interface Props {
  events: Event[];
}

const CARD_STEP = 264;

export const EventsRow = ({ events }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction === 'right' ? CARD_STEP : -CARD_STEP,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.label}>Upcoming Events</h2>
        <div className={styles.arrows}>
          <button
            className={styles.arrowBtn}
            onClick={() => scroll('left')}
            aria-label="Scroll events left"
            type="button"
          >
            &#8249;
          </button>
          <button
            className={styles.arrowBtn}
            onClick={() => scroll('right')}
            aria-label="Scroll events right"
            type="button"
          >
            &#8250;
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <div className={styles.flyer}>
              {event.flyerUrl && (
                <img
                  src={event.flyerUrl}
                  alt={`${event.title} flyer`}
                  className={styles.flyerImg}
                />
              )}
            </div>
            <div className={styles.cardBody}>
              <p className={styles.date}>{event.date}</p>
              <p className={styles.date}>{event.time}</p>
              <p className={styles.title}>{event.title}</p>
              <p className={styles.desc}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
