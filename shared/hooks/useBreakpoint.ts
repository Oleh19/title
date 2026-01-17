import useMediaQuery from './useMediaQuery';
import { getBreakpoint, type BreakpointName } from '../lib/breakpoints';

type UseBreakpointOptions = {
  defaultValue?: boolean;
};

const useBreakpoint = (
  name: BreakpointName,
  options: UseBreakpointOptions = {},
): boolean => {
  const query = getBreakpoint(name);
  return useMediaQuery(query, options);
};

export default useBreakpoint;
