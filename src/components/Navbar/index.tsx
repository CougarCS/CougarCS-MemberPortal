import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Profile', href: '/profile' },
  { label: 'Dashboard', href: '/dashboard' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Link to="/profile" className={styles.logoLink}>
          <div className={styles.fullLogo}>
            <img src="/cougarLogo.svg" alt="Logo" className={styles.logoIcon} />
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

        <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
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
