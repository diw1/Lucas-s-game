/**
 * A small, deterministic teaching model. Leaf coins, prices and distributions
 * are fictional. There are no fees, taxes, forecasts or real account details.
 */
export const ROUTES = Object.freeze({
  meadow: Object.freeze({
    labelZh: "起伏的一年",
    labelEn: "A bumpy year",
    prices: Object.freeze([5, 4, 6, 5, 3, 4.2, 5, 4, 6, 5, 4, 5]),
  }),
  storm: Object.freeze({
    labelZh: "逆风的一年",
    labelEn: "A stormy year",
    prices: Object.freeze([5, 4, 6, 5, 3, 4.2, 4, 3, 3.5, 3, 2.5, 2]),
  }),
});

const MONTHLY_CONTRIBUTION = 10;
const DISTRIBUTION_MONTH = 6;
const DISTRIBUTION_PER_UNIT = 0.2;
const MONTHS = 12;
const hasRoute = (route) => Object.prototype.hasOwnProperty.call(ROUTES, route);

export function createJourney(route = "meadow") {
  if (typeof route !== "string" || !hasRoute(route)) {
    throw new RangeError("Unknown journey route");
  }
  return { route, month: 0, units: 0, contributed: 0, dividends: 0, history: [] };
}

function nextCanonicalMonth(state) {
  if (state.month === MONTHS) return state;

  const month = state.month + 1;
  const beforePrice = ROUTES[state.route].prices[month - 1];
  const perUnit = month === DISTRIBUTION_MONTH ? DISTRIBUTION_PER_UNIT : 0;
  // Distribution moves value from each existing unit to cash. Reinvest that
  // cash at the ex-distribution price, before adding this month's new gift.
  const price = beforePrice - perUnit;
  const unitsBefore = state.units;
  const dividend = unitsBefore * perUnit;
  const reinvestedUnits = dividend / price;
  const boughtUnits = MONTHLY_CONTRIBUTION / price;
  const units = unitsBefore + reinvestedUnits + boughtUnits;
  const contributed = state.contributed + MONTHLY_CONTRIBUTION;
  const value = units * price;
  const record = {
    month,
    price,
    beforePrice,
    unitsBefore,
    units,
    contribution: MONTHLY_CONTRIBUTION,
    boughtUnits,
    dividend,
    reinvestedUnits,
    value,
    contributed,
    gain: value - contributed,
  };

  return {
    route: state.route,
    month,
    units,
    contributed,
    dividends: state.dividends + dividend,
    history: [...state.history, record],
  };
}

/**
 * Restore a save from its route and completed month only. Calculated values
 * are replayed instead of trusting modified/stale saved totals or history.
 * Unknown routes and non-integer/out-of-range months are rejected.
 */
export function validateJourney(raw) {
  if (
    raw === null ||
    typeof raw !== "object" ||
    Array.isArray(raw) ||
    typeof raw.route !== "string" ||
    !hasRoute(raw.route) ||
    !Number.isInteger(raw.month) ||
    raw.month < 0 ||
    raw.month > MONTHS
  ) return null;

  let state = createJourney(raw.route);
  for (let month = 0; month < raw.month; month += 1) {
    state = nextCanonicalMonth(state);
  }
  return state;
}

/** Advance exactly one month without mutating the caller's state. */
export function advanceMonth(state) {
  const canonical = validateJourney(state);
  if (!canonical) throw new TypeError("Invalid journey state");
  return nextCanonicalMonth(canonical);
}

export function getCurrent(state) {
  return Array.isArray(state?.history) && state.history.length > 0
    ? state.history[state.history.length - 1]
    : null;
}
