import { useEffect, useState } from 'react';

type UseMediaQueryOptions = {
  defaultValue?: boolean;
};

const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = {},
): boolean => {
  const { defaultValue = false } = options;
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
