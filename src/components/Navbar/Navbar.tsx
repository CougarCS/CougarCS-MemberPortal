import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { loadProfile } from '../../lib/profile';
import menuIcon from '../../assets/icon-menu.svg';
import styles from './Navbar.module.css';
import { UserDropdown } from './UserDropdown/UserDropdown';

const NAV_LINKS = [{ label: 'Home', href: '/home' }];

const DROPDOWN_NAV = [{ label: 'Profile', href: '/profile' }];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Vultorz');
  const [headshotUrl, setHeadshotUrl] = useState(
    'https://yzqdfdzetgwvgxxpulys.supabase.co/storage/v1/object/public/event-flyers/8e4a9032-f17a-4b65-b773-593346ea05c0.png',
  );

  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
            <Link key={link.href} to={link.href} className={styles.navbarLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <UserDropdown
          displayName={displayName}
          headshotUrl={headshotUrl}
          userEmail={user?.email}
          onSignOut={handleSignOut}
        />

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
