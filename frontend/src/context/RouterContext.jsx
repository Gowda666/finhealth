import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext();

export function RouterProvider({ children }) {
  // Normalize initial path, e.g. /analyze or /
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    if (path.startsWith('/analyze')) return '/analyze';
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/analyze')) {
        setCurrentPath('/analyze');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, options = {}) => {
    if (typeof window === 'undefined') return;

    // Handle hash links (e.g. #how-it-works) on the home page
    if (to.startsWith('/#') || to.startsWith('#')) {
      const hash = to.includes('#') ? to.substring(to.indexOf('#')) : '';
      if (currentPath !== '/') {
        window.history.pushState({}, '', '/' + hash);
        setCurrentPath('/');
      } else {
        window.history.pushState({}, '', hash);
      }
      if (hash) {
        const elem = document.querySelector(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      return;
    }

    const target = to.startsWith('/analyze') ? '/analyze' : '/';
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
    setCurrentPath(target);

    if (!options.preventScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({ to, children, className = '', activeClassName = '', onClick, ...props }) {
  const { currentPath, navigate } = useRouter();
  const isActive = currentPath === to;

  const handleClick = (e) => {
    // allow normal handling for cmd/ctrl click to open in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
