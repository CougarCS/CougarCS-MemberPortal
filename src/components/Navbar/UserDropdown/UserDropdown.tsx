import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import userIcon from '../../../assets/icon-user.svg';
import editIcon from '../../../assets/icon-edit.svg';
import styles from './UserDropdown.module.css';

const DROPDOWN_NAV = [{ label: 'Profile', href: '/profile' }];

interface UserDropdownProps {
  displayName: string;
  headshotUrl: string;
  userEmail?: string;
  onSignOut: () => void;
}

export const UserDropdown = ({
  displayName,
  headshotUrl,
  userEmail,
  onSignOut,
}: UserDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderAvatar = (wrapperClass: string, iconSize: number) => (
    <div className={wrapperClass}>
      {headshotUrl ? (
        <img src={headshotUrl} alt="" className={styles.avatarImg} />
      ) : (
        <img src={userIcon} width={iconSize} height={iconSize} alt="" />
      )}
    </div>
  );

  return (
    <div className={styles.avatarWrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={() => setDropdownOpen((o) => !o)}
        aria-label="Open account menu"
        aria-expanded={dropdownOpen}
      >
        {renderAvatar(styles.avatar, 18)}
      </button>

      {dropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownUser}>
            {renderAvatar(styles.dropdownAvatar, 22)}
            <div className={styles.dropdownUserInfo}>
              {displayName && <p className={styles.dropdownUserName}>{displayName}</p>}
              <p className={styles.dropdownUserEmail}>{userEmail}</p>
            </div>
          </div>

          <hr className={styles.dropdownDivider} />

          <div className={styles.dropdownNav}>
            {DROPDOWN_NAV.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={styles.dropdownNavItem}
                onClick={() => setDropdownOpen(false)}
              >
                <img
                  src={userIcon}
                  width="16"
                  height="16"
                  alt=""
                  className={styles.dropdownNavIcon}
                />
                {link.label}
              </Link>
            ))}
          </div>

          <hr className={styles.dropdownDivider} />

          <div className={styles.dropdownActions}>
            <button type="button" className={styles.dropdownSignOut} onClick={onSignOut}>
              <img
                src={editIcon}
                width="16"
                height="16"
                alt=""
                className={styles.dropdownNavIcon}
              />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
