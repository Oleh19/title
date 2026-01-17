export const BREAKPOINTS = {
  mobile: '(max-width: 600px)',
  tablet: '(min-width: 601px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

export const getBreakpoint = (name: BreakpointName): string => BREAKPOINTS[name];
