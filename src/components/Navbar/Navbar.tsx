import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { loadProfile } from '../../lib/profile';
import menuIcon from '../../assets/icon-menu.svg';
import userIcon from '../../assets/icon-user.svg';
import editIcon from '../../assets/icon-edit.svg';
import styles from './Navbar.module.css';

const NAV_LINKS = [{ label: 'Home', href: '/home' }];

const DROPDOWN_NAV = [{ label: 'Profile', href: '/profile' }];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Vultorz');
  const [headshotUrl, setHeadshotUrl] = useState(
    'https://yzqdfdzetgwvgxxpulys.supabase.co/storage/v1/object/public/event-flyers/8e4a9032-f17a-4b65-b773-593346ea05c0.png',
  );

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // this API call is huge. we should either use redux & load all profile data on any page mount
    // or, we can just create another endpoint. im leaning towards redux but lets revisit once UI is finalized
    loadProfile().then((data) => {
      if (!data) {
        return;
      }

      setDisplayName(`${data.firstName} ${data.lastName}`.trim());

      if (data.headshotUrl) {
        setHeadshotUrl(data.headshotUrl);
      }
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/login');
  };

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
    <div className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Link to="/home" className={styles.logoLink}>
          <div className={styles.fullLogo}>
            <img src="/goldCougar.svg" alt="Logo" className={styles.logoIcon} />
            <img src="/cougarCSText.svg" alt="CougarCS" className={styles.logoText} />
          </div>
        </Link>

        <nav className={styles.navbarLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`${styles.navbarLink} ${location.pathname === link.href ? styles.navbarLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
                  <p className={styles.dropdownUserEmail}>{user?.email ?? ''}</p>
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
                      src={editIcon}
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
                <button type="button" className={styles.dropdownSignOut} onClick={handleSignOut}>
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

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <img src={menuIcon} width="22" height="16" alt="" />
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu}>
          {[...NAV_LINKS, ...DROPDOWN_NAV].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={styles.mobileMenuItem}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className={`${styles.mobileMenuItem} ${styles.mobileSignOut}`}
            onClick={() => {
              setMenuOpen(false);
              handleSignOut();
            }}
          >
            Sign Out
          </button>
        </nav>
      )}
    </div>
  );
};
