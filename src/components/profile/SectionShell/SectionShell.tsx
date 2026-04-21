import type { ReactNode } from 'react';
import styles from './section.module.css';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import type { SaveState } from '../../../utils/types';

interface Props {
  id: string;
  title: string;
  desc: string;
  children: ReactNode;
  saveState?: SaveState;
  onSave?: () => void;
}

const SAVE_STATUS_TEXT: Record<SaveState, string> = {
  idle: '',
  unsaved: 'Unsaved changes',
  saving: 'Saving...',
  saved: 'Saved!',
};

export const SectionShell = ({ id, title, desc, children, saveState = 'idle', onSave }: Props) => (
  <section id={id} className={styles.section}>
    <div className={styles.sectionMeta}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDesc}>{desc}</p>
    </div>
    <div className={styles.sectionFields}>
      {children}
      {onSave && (
        <div className={styles.sectionFooter}>
          {saveState !== 'idle' && (
            <span className={`${styles.saveStatus} ${styles[`saveStatus__${saveState}`]}`}>
              {SAVE_STATUS_TEXT[saveState]}
            </span>
          )}
          <PrimaryButton type="button" onClick={onSave} disabled={saveState === 'saving'}>
            {saveState === 'saving' ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </div>
      )}
    </div>
  </section>
);
