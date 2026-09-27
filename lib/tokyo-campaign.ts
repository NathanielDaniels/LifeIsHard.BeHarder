/**
 * Tokyo Marathon 2027 campaign: the facts every Tokyo surface shares.
 *
 * Figures mirror Patrick's live GoFundMe (checked 2026-09-27). If he edits the
 * budget there, edit it here; `assertBudgetAddsUp` fails the build otherwise.
 */

export const TOKYO_RACE_DATE_ISO = "2027-03-07";
export const TOKYO_RACE_DATE_LABEL = "March 7, 2027";
/** Midnight local time on race day. Zero-padded month avoids the Safari parse bug. */
const RACE_DAY = new Date(2027, 2, 7);

export const GOFUNDME_URL = "https://www.gofundme.com/f/Patwingit2Tokyo";
export const GOFUNDME_DONATE_URL = `${GOFUNDME_URL}/donate`;
/** Patrick's personal Dare2Tri fundraiser, the same page used in the Chicago emails. */
export const DARE2TRI_URL = "https://give.dare2tri.org/fundraiser/6928347";
export const INSTAGRAM_URL = "https://www.instagram.com/patwingit";
export const HASHTAG = "#PatWingIt2Tokyo";

export const CHICAGO_FINISH = "4:17:17";
export const CHICAGO_FINISH_SECONDS = 4 * 3600 + 17 * 60 + 17;

export type MajorState = "earned" | "next" | "open";

/** The six original Abbott World Marathon Majors, in race-calendar order. */
export const MAJORS: { city: string; state: MajorState; note?: string }[] = [
  { city: "Tokyo", state: "next", note: "Next" },
  { city: "Boston", state: "open" },
  { city: "London", state: "open" },
  { city: "Berlin", state: "open" },
  { city: "Chicago", state: "earned", note: CHICAGO_FINISH },
  { city: "New York", state: "open" },
];

/** Patrick's budget, labels verbatim from the GoFundMe. */
export const RECEIPTS = [
  { label: "Airfare", amount: 1500 },
  { label: "Lodging", amount: 1200 },
  { label: "Transportation", amount: 400 },
  { label: "Food/Nutrition", amount: 500 },
  { label: "Equipment and baggage", amount: 500 },
  { label: "Insurance", amount: 150 },
  { label: "Race-week expenses", amount: 250 },
  { label: "Contingency for unexpected costs", amount: 1000 },
] as const;

export const FUNDRAISING_GOAL = 5500;

function assertBudgetAddsUp() {
  const total = RECEIPTS.reduce((sum, r) => sum + r.amount, 0);
  if (total !== FUNDRAISING_GOAL) {
    throw new Error(`Tokyo receipts total ${total} but the goal is ${FUNDRAISING_GOAL}`);
  }
}
assertBudgetAddsUp();

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Whole days from `now` to race day, never negative. */
export function daysToTokyo(now = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((RACE_DAY.getTime() - today.getTime()) / 86_400_000));
}
