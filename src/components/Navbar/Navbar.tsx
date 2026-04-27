import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/useAuth';
import { loadMe } from '../../lib/profile';
import { queryKeys, queryStaleTimes } from '../../lib/queryClient';
import menuIcon from '../../assets/icon-menu.svg';
import styles from './Navbar.module.css';
import { UserDropdown } from './UserDropdown/UserDropdown';

const NAV_LINKS = [{ label: 'Home', href: '/home' }];

const DROPDOWN_NAV = [{ label: 'Profile', href: '/profile' }];
const FALLBACK_NAME = 'Vultorz';
const FALLBACK_HEADSHOT =
  'https://yzqdfdzetgwvgxxpulys.supabase.co/storage/v1/object/public/event-flyers/8e4a9032-f17a-4b65-b773-593346ea05c0.png';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();

  const { data: me } = useQuery({
    queryKey: queryKeys.me,
    queryFn: loadMe,
    staleTime: queryStaleTimes.me,
    enabled: Boolean(user),
  });

  const displayName = me ? `${me.firstName} ${me.lastName}`.trim() || FALLBACK_NAME : FALLBACK_NAME;
  const headshotUrl = me?.headshotUrl || FALLBACK_HEADSHOT;

  const handleSignOut = async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: queryKeys.me });
    queryClient.removeQueries({ queryKey: queryKeys.profile });
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
