import test from "node:test";
import assert from "node:assert/strict";
import { ROUTES, createJourney, advanceMonth, getCurrent, validateJourney } from "./model.js";

const close = (actual, expected) => assert.ok(
  Math.abs(actual - expected) < 1e-9,
  `${actual} should equal ${expected}`,
);

function complete(route, months = 12) {
  let state = createJourney(route);
  for (let index = 0; index < months; index += 1) state = advanceMonth(state);
  return state;
}

test("a new journey starts with no invented money or units", () => {
  assert.deepEqual(createJourney(), {
    route: "meadow", month: 0, units: 0, contributed: 0, dividends: 0, history: [],
  });
  assert.equal(getCurrent(createJourney()), null);
});

for (const route of Object.keys(ROUTES)) {
  test(`${route}: every month's units and money reconcile`, () => {
    const state = complete(route);
    assert.equal(state.month, 12);
    assert.equal(state.contributed, 120);
    assert.equal(state.history.length, 12);
    let priorUnits = 0;
    let paidDividends = 0;
    for (const item of state.history) {
      close(item.unitsBefore, priorUnits);
      close(item.units, priorUnits + item.boughtUnits + item.reinvestedUnits);
      close(item.boughtUnits * item.price, 10);
      close(item.reinvestedUnits * item.price, item.dividend);
      close(item.value, item.units * item.price);
      close(item.gain, item.value - item.contributed);
      assert.equal(item.contributed, item.month * 10);
      if (item.month !== 6) assert.equal(item.dividend, 0);
      priorUnits = item.units;
      paidDividends += item.dividend;
    }
    close(state.dividends, paidDividends);
    close(state.units, priorUnits);
    assert.deepEqual(getCurrent(state), state.history[11]);
  });
}

test("a lower price buys more units with the same monthly contribution", () => {
  const state = complete("meadow", 2);
  assert.equal(state.history[0].boughtUnits, 2);
  assert.equal(state.history[1].boughtUnits, 2.5);
  assert.equal(state.history[1].unitsBefore, 2);
  // Before the next gift, the same two units are now worth only eight coins.
  assert.equal(state.history[1].unitsBefore * state.history[1].price, 8);
});

test("month 6 distribution and reinvestment create no free value", () => {
  const state = complete("meadow", 6);
  const record = getCurrent(state);
  assert.equal(record.beforePrice, 4.2);
  assert.equal(record.price, 4);
  close(record.dividend, record.unitsBefore * 0.2);
  close(record.unitsBefore * record.beforePrice,
    record.unitsBefore * record.price + record.dividend);
  close(record.unitsBefore * record.beforePrice,
    (record.unitsBefore + record.reinvestedUnits) * record.price);
  close(record.value, record.unitsBefore * record.beforePrice + 10);
  assert.ok(record.reinvestedUnits > 0);
});

test("the storm route still loses money after twelve regular contributions", () => {
  const storm = complete("storm");
  assert.ok(getCurrent(storm).value < storm.contributed);
  assert.ok(getCurrent(storm).gain < 0);
  assert.ok(getCurrent(complete("meadow")).gain > 0);
});

test("advancing cannot mutate an earlier state or add a thirteenth gift", () => {
  const original = complete("meadow", 5);
  const snapshot = JSON.stringify(original);
  const next = advanceMonth(original);
  assert.equal(JSON.stringify(original), snapshot);
  assert.equal(next.month, 6);
  const finished = complete("storm");
  assert.deepEqual(advanceMonth(finished), finished);
  assert.deepEqual(advanceMonth(advanceMonth(finished)), finished);
});

test("restoring a save rebuilds all derived values from route and month", () => {
  const expected = complete("storm", 8);
  const forged = { ...expected, units: 99999, contributed: 1, dividends: 500, history: [] };
  assert.deepEqual(validateJourney(forged), expected);
  assert.deepEqual(validateJourney({ route: "storm", month: 8 }), expected);
  assert.deepEqual(validateJourney(JSON.parse(JSON.stringify(expected))), expected);
});

test("malformed route and month values are rejected", () => {
  const invalid = [null, undefined, 7, "storm", [], {},
    { route: "__proto__", month: 1 }, { route: "toString", month: 1 },
    { route: "unknown", month: 1 }, { route: "meadow", month: -1 },
    { route: "meadow", month: 13 }, { route: "meadow", month: 1.5 },
    { route: "meadow", month: "2" }, { route: "meadow", month: NaN },
    { route: "meadow", month: Infinity }];
  for (const candidate of invalid) assert.equal(validateJourney(candidate), null);
  assert.throws(() => createJourney("unknown"), RangeError);
  assert.throws(() => createJourney(null), RangeError);
  assert.throws(() => advanceMonth({}), TypeError);
});
