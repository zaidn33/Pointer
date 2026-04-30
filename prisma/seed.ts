import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Canadian credit card catalog
// ---------------------------------------------------------------------------

type SeedCard = {
  name: string;
  issuer: string;
  network: string;
  cardType: string;
  annualFee: number | null;
  rewardProgram: string | null;
  baseEarnRate: number | null;
  categoryRules: { category: string; multiplier: number }[];
  isVerified?: boolean;
  externalId?: string | null;
  sourceUrl?: string | null;
  extractionNotes?: string | null;
  confidence?: number | null;
};

const cards: SeedCard[] = [
  // ── American Express ────────────────────────────────────────────────
  {
    name: "Amex Cobalt Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 155.88,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 5 },
      { category: "dining", multiplier: 5 },
      { category: "streaming", multiplier: 3 },
      { category: "transit", multiplier: 2 },
      { category: "travel", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "Amex Gold Rewards Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 250,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "Amex Platinum Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 799,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
    ],
  },
  {
    name: "Amex SimplyCash Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1.25,
    categoryRules: [],
  },
  {
    name: "Amex SimplyCash Preferred Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 119.88,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 2 },
      { category: "groceries", multiplier: 2 },
    ],
  },
  {
    name: "Amex Aeroplan Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "transit", multiplier: 1.5 },
    ],
  },
  {
    name: "Amex Aeroplan Reserve Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 599,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "Amex Green Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1,
    categoryRules: [],
  },
  {
    name: "Marriott Bonvoy Amex Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Marriott Bonvoy",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "dining", multiplier: 2 },
    ],
  },
  {
    name: "Amex Business Gold Rewards Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Business",
    annualFee: 199,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "fuel", multiplier: 2 },
      { category: "advertising", multiplier: 2 },
    ],
  },
  {
    name: "Amex Business Platinum Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Business",
    annualFee: 799,
    rewardProgram: "Membership Rewards",
    baseEarnRate: 1.25,
    categoryRules: [
      { category: "travel", multiplier: 3 },
    ],
  },

  // ── RBC ─────────────────────────────────────────────────────────────
  {
    name: "RBC Avion Visa Infinite",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 1.5 },
    ],
  },
  {
    name: "RBC Avion Visa Infinite Privilege",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 399,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1.25,
    categoryRules: [
      { category: "travel", multiplier: 2 },
    ],
  },
  {
    name: "RBC Ion+ Visa",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 48,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 1.5 },
      { category: "transit", multiplier: 1.5 },
      { category: "dining", multiplier: 1.5 },
    ],
  },
  {
    name: "RBC Cashback Mastercard",
    issuer: "RBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
    ],
  },
  {
    name: "RBC Cashback Preferred Visa",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 99,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "RBC WestJet World Elite Mastercard",
    issuer: "RBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 119,
    rewardProgram: "WestJet Dollars",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "dining", multiplier: 1.5 },
    ],
  },
  {
    name: "RBC Rewards+ Visa",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "RBC Rewards",
    baseEarnRate: 1,
    categoryRules: [],
  },
  {
    name: "RBC Avion Visa Infinite Business",
    issuer: "RBC",
    network: "Visa",
    cardType: "Business",
    annualFee: 120,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 1.5 },
    ],
  },

  // ── TD ──────────────────────────────────────────────────────────────
  {
    name: "TD Aeroplan Visa Infinite",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 139,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 1.5 },
      { category: "gas", multiplier: 1.5 },
    ],
  },
  {
    name: "TD Aeroplan Visa Infinite Privilege",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 599,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 1.5 },
      { category: "gas", multiplier: 1.5 },
      { category: "travel", multiplier: 2.5 },
    ],
  },
  {
    name: "TD Cash Back Visa Infinite",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 89,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 3 },
      { category: "groceries", multiplier: 2 },
    ],
  },
  {
    name: "TD First Class Travel Visa Infinite",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 139,
    rewardProgram: "TD Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
    ],
  },
  {
    name: "TD Rewards Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "TD Rewards",
    baseEarnRate: 1,
    categoryRules: [],
  },
  {
    name: "TD Platinum Travel Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 89,
    rewardProgram: "TD Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
    ],
  },
  {
    name: "TD Cash Back Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 1 },
      { category: "gas", multiplier: 1 },
    ],
  },
  {
    name: "TD Aeroplan Visa Business",
    issuer: "TD",
    network: "Visa",
    cardType: "Business",
    annualFee: 120,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 1.5 },
    ],
  },

  // ── CIBC ────────────────────────────────────────────────────────────
  {
    name: "CIBC Aventura Visa Infinite",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 139,
    rewardProgram: "Aventura",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "gas", multiplier: 1.5 },
      { category: "groceries", multiplier: 1.5 },
    ],
  },
  {
    name: "CIBC Aventura Visa Infinite Privilege",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 499,
    rewardProgram: "Aventura",
    baseEarnRate: 1.5,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
    ],
  },
  {
    name: "CIBC Aventura Gold Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 79,
    rewardProgram: "Aventura",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 1.5 },
      { category: "groceries", multiplier: 1.5 },
    ],
  },
  {
    name: "CIBC Aeroplan Visa Infinite",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 139,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 1.5 },
      { category: "gas", multiplier: 1.5 },
    ],
  },
  {
    name: "CIBC Aeroplan Visa Infinite Privilege",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 599,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2.5 },
      { category: "groceries", multiplier: 1.5 },
      { category: "gas", multiplier: 1.5 },
    ],
  },
  {
    name: "CIBC Dividend Visa Infinite",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 4 },
      { category: "groceries", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "CIBC Dividend Platinum Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 1 },
    ],
  },
  {
    name: "CIBC Costco Mastercard",
    issuer: "CIBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "dining", multiplier: 3 },
      { category: "gas", multiplier: 2 },
      { category: "groceries", multiplier: 1 },
    ],
  },
  {
    name: "CIBC Aventura Visa Business",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Business",
    annualFee: 149,
    rewardProgram: "Aventura",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
    ],
  },

  // ── Scotiabank ──────────────────────────────────────────────────────
  {
    name: "Scotiabank Passport Visa Infinite",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Personal",
    annualFee: 150,
    rewardProgram: "Scene+",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "Scotiabank Gold American Express",
    issuer: "Scotiabank",
    network: "Amex",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Scene+",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 5 },
      { category: "dining", multiplier: 3 },
      { category: "entertainment", multiplier: 3 },
    ],
  },
  {
    name: "Scotia Momentum Visa Infinite",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 4 },
      { category: "gas", multiplier: 2 },
      { category: "drugstore", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "Scotia Momentum No-Fee Visa",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 1 },
    ],
  },
  {
    name: "Scotiabank Scene+ Visa",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Scene+",
    baseEarnRate: 1,
    categoryRules: [],
  },
  {
    name: "Scotiabank Value Visa",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Personal",
    annualFee: 29,
    rewardProgram: null,
    baseEarnRate: 0.5,
    categoryRules: [],
  },
  {
    name: "Scotiabank Passport Visa Infinite Business",
    issuer: "Scotiabank",
    network: "Visa",
    cardType: "Business",
    annualFee: 199,
    rewardProgram: "Scene+",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
    ],
  },

  // ── BMO ─────────────────────────────────────────────────────────────
  {
    name: "BMO Eclipse Visa Infinite",
    issuer: "BMO",
    network: "Visa",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 5 },
      { category: "dining", multiplier: 3 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "BMO Eclipse Visa Infinite Privilege",
    issuer: "BMO",
    network: "Visa",
    cardType: "Personal",
    annualFee: 250,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 5 },
      { category: "dining", multiplier: 5 },
      { category: "travel", multiplier: 3 },
    ],
  },
  {
    name: "BMO CashBack Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [],
  },
  {
    name: "BMO CashBack World Elite Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 3 },
      { category: "gas", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "BMO AIR MILES World Elite Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "AIR MILES",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 3 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "BMO Rewards World Elite Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 150,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 2 },
    ],
  },

  // ── MBNA ────────────────────────────────────────────────────────────
  {
    name: "MBNA Rewards World Elite Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "MBNA Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 2 },
      { category: "groceries", multiplier: 2 },
    ],
  },
  {
    name: "MBNA Alaska Airlines World Elite Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 99,
    rewardProgram: "Alaska Mileage Plan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 1.5 },
    ],
  },
  {
    name: "MBNA Smart Cash Platinum Plus Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
    ],
  },

  // ── National Bank ───────────────────────────────────────────────────
  {
    name: "National Bank World Elite Mastercard",
    issuer: "National Bank",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 150,
    rewardProgram: "NB Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2.5 },
      { category: "dining", multiplier: 2 },
    ],
  },
  {
    name: "National Bank Syncro Mastercard",
    issuer: "National Bank",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
  },

  // ── Tangerine ───────────────────────────────────────────────────────
  {
    name: "Tangerine Money-Back Credit Card",
    issuer: "Tangerine",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "Tangerine World Mastercard",
    issuer: "Tangerine",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 2 },
      { category: "dining", multiplier: 2 },
    ],
  },

  // ── PC Financial ────────────────────────────────────────────────────
  {
    name: "PC Financial World Elite Mastercard",
    issuer: "PC Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "PC Optimum",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 3 },
    ],
  },
  {
    name: "PC Financial World Mastercard",
    issuer: "PC Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "PC Optimum",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 2.5 },
    ],
  },
  {
    name: "PC Financial Mastercard",
    issuer: "PC Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "PC Optimum",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
    ],
  },

  // ── Canadian Tire / Triangle ────────────────────────────────────────
  {
    name: "Triangle World Elite Mastercard",
    issuer: "Canadian Tire",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "CT Money",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "gas", multiplier: 1.5 },
    ],
  },
  {
    name: "Triangle Mastercard",
    issuer: "Canadian Tire",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "CT Money",
    baseEarnRate: 0.5,
    categoryRules: [],
  },

  // ── Rogers ──────────────────────────────────────────────────────────
  {
    name: "Rogers World Elite Mastercard",
    issuer: "Rogers",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1.5,
    categoryRules: [],
  },
  {
    name: "Rogers Platinum Mastercard",
    issuer: "Rogers",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
  },

  // ── HSBC ────────────────────────────────────────────────────────────
  {
    name: "HSBC World Elite Mastercard",
    issuer: "HSBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 149,
    rewardProgram: "Travel Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 3 },
      { category: "dining", multiplier: 1.5 },
    ],
  },
  {
    name: "HSBC Premier World Elite Mastercard",
    issuer: "HSBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Travel Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 6 },
      { category: "dining", multiplier: 3 },
    ],
  },

  // ── Desjardins ──────────────────────────────────────────────────────
  {
    name: "Desjardins Odyssey Gold Visa",
    issuer: "Desjardins",
    network: "Visa",
    cardType: "Personal",
    annualFee: 110,
    rewardProgram: "Odyssey",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "Desjardins Cash Back World Elite Visa",
    issuer: "Desjardins",
    network: "Visa",
    cardType: "Personal",
    annualFee: 99,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 2 },
    ],
  },
  {
    name: "Desjardins Cash Back Visa",
    issuer: "Desjardins",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 1 },
    ],
  },

  // ── Brim ────────────────────────────────────────────────────────────
  {
    name: "Brim World Elite Mastercard",
    issuer: "Brim Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Brim Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 2 },
    ],
  },
  {
    name: "Brim Mastercard",
    issuer: "Brim Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Brim Rewards",
    baseEarnRate: 1,
    categoryRules: [],
  },

  // ── Neo ─────────────────────────────────────────────────────────────
  {
    name: "Neo Financial Mastercard",
    issuer: "Neo Financial",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
  },

  // ── Wealthsimple ───────────────────────────────────────────────────
  {
    name: "Wealthsimple Cash Card",
    issuer: "Wealthsimple",
    network: "Visa",
    cardType: "Prepaid",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
  },

  // ── KOHO ────────────────────────────────────────────────────────────
  {
    name: "KOHO Prepaid Visa",
    issuer: "KOHO",
    network: "Visa",
    cardType: "Prepaid",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "dining", multiplier: 2 },
      { category: "transit", multiplier: 2 },
    ],
  },
  {
    name: "KOHO Premium Prepaid Visa",
    issuer: "KOHO",
    network: "Visa",
    cardType: "Prepaid",
    annualFee: 108,
    rewardProgram: "Cashback",
    baseEarnRate: 2,
    categoryRules: [],
  },

  // ── Simplii ─────────────────────────────────────────────────────────
  {
    name: "Simplii Financial Cash Back Visa",
    issuer: "Simplii Financial",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "dining", multiplier: 4 },
      { category: "groceries", multiplier: 1.5 },
      { category: "gas", multiplier: 1.5 },
    ],
  },
];

const REVIEW_NOTES = "Reward data needs review before verification.";

function reviewCard(input: {
  name: string;
  issuer: string;
  network: string;
  cardType: string;
}): SeedCard {
  const externalKey = `${input.issuer}:${input.name}`
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    ...input,
    annualFee: null,
    rewardProgram: null,
    baseEarnRate: null,
    categoryRules: [],
    isVerified: false,
    externalId: `manual-review:${externalKey}`,
    extractionNotes: REVIEW_NOTES,
    confidence: 0.2,
  };
}

function trustedCard(input: SeedCard): SeedCard {
  return {
    ...input,
    isVerified: true,
    confidence: input.confidence ?? 0.9,
    extractionNotes: input.extractionNotes ?? null,
  };
}

const pendingReviewCards: SeedCard[] = [
  // RBC
  trustedCard({
    name: "RBC Avion Visa Platinum",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 120,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1,
    categoryRules: [],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/travel/rbc-visa-platinum-avion.html",
  }),
  trustedCard({
    name: "RBC British Airways Visa Infinite",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 165,
    rewardProgram: "Avios",
    baseEarnRate: 1,
    categoryRules: [
      { category: "british_airways", multiplier: 3 },
      { category: "dining", multiplier: 2 },
      { category: "food_delivery", multiplier: 2 },
    ],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/travel/rbc-british-airways-visa-infinite.html",
  }),
  reviewCard({ name: "RBC RateAdvantage Visa", issuer: "RBC", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "RBC Visa Classic Low Rate Option", issuer: "RBC", network: "Visa", cardType: "Personal" }),
  trustedCard({
    name: "RBC Visa Platinum",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/no-fee/rbc-visa-platinum.html",
  }),
  trustedCard({
    name: "RBC U.S. Dollar Visa Gold",
    issuer: "RBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 65,
    rewardProgram: "Avion Rewards",
    baseEarnRate: 1,
    categoryRules: [],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/travel/rbc-us-dollar-visa-gold.html",
    extractionNotes: "Annual fee is charged in USD; stored as numeric fee amount for catalog comparison.",
  }),
  reviewCard({ name: "More Rewards RBC Visa", issuer: "RBC", network: "Visa", cardType: "Personal" }),
  trustedCard({
    name: "WestJet RBC Mastercard",
    issuer: "RBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 39,
    rewardProgram: "WestJet Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel_westjet", multiplier: 1.5 },
      { category: "dining", multiplier: 1.5 },
      { category: "food_delivery", multiplier: 1.5 },
      { category: "streaming", multiplier: 1.5 },
      { category: "digital_games", multiplier: 1.5 },
    ],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/travel/westjet-rbc-mastercard.html",
  }),
  trustedCard({
    name: "RBC Cash Back Preferred World Elite Mastercard",
    issuer: "RBC",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 99,
    rewardProgram: "Cashback",
    baseEarnRate: 1.5,
    categoryRules: [],
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-preferred-world-elite-mastercard.html",
    extractionNotes: "Earns 1.5% on the first $25,000 in qualifying purchases and 1% thereafter; Pointer currently stores the headline base earn rate.",
  }),

  // TD
  trustedCard({
    name: "TD Aeroplan Visa Platinum",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 89,
    rewardProgram: "Aeroplan",
    baseEarnRate: 0.67,
    categoryRules: [
      { category: "gas", multiplier: 1 },
      { category: "electric_vehicle_charging", multiplier: 1 },
      { category: "groceries", multiplier: 1 },
      { category: "travel_air_canada", multiplier: 1 },
    ],
    sourceUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-platinum-card",
    extractionNotes: "Base earn is 1 Aeroplan point per $1.50 on other purchases, represented as 0.67 points per $1.",
  }),
  trustedCard({
    name: "TD Low Rate Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Personal",
    annualFee: 25,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/low-rate",
  }),
  reviewCard({ name: "TD U.S. Dollar Visa", issuer: "TD", network: "Visa", cardType: "Personal" }),
  trustedCard({
    name: "TD Business Travel Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Business",
    annualFee: 149,
    rewardProgram: "TD Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel_td", multiplier: 9 },
      { category: "dining", multiplier: 6 },
      { category: "electric_vehicle_charging", multiplier: 6 },
      { category: "transit", multiplier: 6 },
      { category: "streaming", multiplier: 6 },
      { category: "digital_games", multiplier: 6 },
      { category: "recurring", multiplier: 6 },
    ],
    sourceUrl: "https://www.td.com/ca/en/business-banking/small-business/credit-cards/business-travel-visa-card",
  }),
  trustedCard({
    name: "TD Business Cash Back Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Business",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "gas", multiplier: 2 },
      { category: "electric_vehicle_charging", multiplier: 2 },
      { category: "transit", multiplier: 2 },
      { category: "office_supplies", multiplier: 2 },
      { category: "streaming", multiplier: 2 },
      { category: "digital_games", multiplier: 2 },
      { category: "recurring", multiplier: 2 },
    ],
    sourceUrl: "https://www.td.com/ca/en/business-banking/small-business/credit-cards/business-cash-back-visa-card",
  }),
  trustedCard({
    name: "TD Business Select Rate Visa",
    issuer: "TD",
    network: "Visa",
    cardType: "Business",
    annualFee: 0,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.td.com/ca/en/business-banking/small-business/credit-cards",
  }),
  reviewCard({ name: "TD Emerald Flex Rate Visa", issuer: "TD", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "TD Venture Line of Credit Visa", issuer: "TD", network: "Visa", cardType: "Personal" }),

  // CIBC
  trustedCard({
    name: "CIBC Aventura Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Aventura",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 1 },
      { category: "electric_vehicle_charging", multiplier: 1 },
      { category: "groceries", multiplier: 1 },
      { category: "drugstore", multiplier: 1 },
      { category: "travel_cibc_rewards", multiplier: 1 },
    ],
    sourceUrl: "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/aventura-visa-card.html",
  }),
  trustedCard({
    name: "CIBC Aeroplan Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1,
    categoryRules: [
      { category: "gas", multiplier: 1 },
      { category: "electric_vehicle_charging", multiplier: 1 },
      { category: "groceries", multiplier: 1 },
      { category: "travel_air_canada", multiplier: 1 },
    ],
    sourceUrl: "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/aeroplan-visa-card.html",
  }),
  reviewCard({ name: "CIBC Adapta Mastercard", issuer: "CIBC", network: "Mastercard", cardType: "Personal" }),
  trustedCard({
    name: "CIBC Dividend Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 1 },
      { category: "electric_vehicle_charging", multiplier: 1 },
      { category: "transit", multiplier: 1 },
      { category: "dining", multiplier: 1 },
      { category: "recurring", multiplier: 1 },
      { category: "travel_cibc_expedia", multiplier: 1 },
    ],
    sourceUrl: "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-card.html",
  }),
  trustedCard({
    name: "CIBC Dividend Visa for Students",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Student",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "groceries", multiplier: 2 },
      { category: "gas", multiplier: 1 },
      { category: "electric_vehicle_charging", multiplier: 1 },
      { category: "transit", multiplier: 1 },
      { category: "recurring", multiplier: 1 },
      { category: "travel_cibc_expedia", multiplier: 1 },
    ],
    sourceUrl: "https://www.cibc.com/en/personal-banking/credit-cards/cash-back-cards.html",
  }),
  reviewCard({ name: "CIBC Aventura Visa for Students", issuer: "CIBC", network: "Visa", cardType: "Student" }),
  reviewCard({ name: "CIBC Aeroplan Visa for Students", issuer: "CIBC", network: "Visa", cardType: "Student" }),
  reviewCard({ name: "CIBC U.S. Dollar Aventura Gold Visa", issuer: "CIBC", network: "Visa", cardType: "Personal" }),
  trustedCard({
    name: "CIBC Select Visa",
    issuer: "CIBC",
    network: "Visa",
    cardType: "Personal",
    annualFee: 29,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/select-visa-card.html",
  }),
  reviewCard({ name: "CIBC Aeroplan Visa Business", issuer: "CIBC", network: "Visa", cardType: "Business" }),
  reviewCard({ name: "CIBC bizline Visa", issuer: "CIBC", network: "Visa", cardType: "Business" }),
  reviewCard({ name: "CIBC Costco World Mastercard", issuer: "CIBC", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "CIBC Adapta Mastercard for Students", issuer: "CIBC", network: "Mastercard", cardType: "Student" }),

  // Scotiabank
  reviewCard({ name: "Scotiabank American Express Card", issuer: "Scotiabank", network: "Amex", cardType: "Personal" }),
  reviewCard({ name: "Scotiabank Platinum American Express Card", issuer: "Scotiabank", network: "Amex", cardType: "Personal" }),
  reviewCard({ name: "Scotiabank Passport Visa Infinite Privilege", issuer: "Scotiabank", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Scotia Momentum Visa Card", issuer: "Scotiabank", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Scotia Momentum Visa Card for Students", issuer: "Scotiabank", network: "Visa", cardType: "Student" }),
  reviewCard({ name: "Scotia Momentum No-Fee Visa Card for Students", issuer: "Scotiabank", network: "Visa", cardType: "Student" }),
  reviewCard({ name: "Scotiabank American Express Card for Students", issuer: "Scotiabank", network: "Amex", cardType: "Student" }),
  reviewCard({ name: "Scotia Momentum Mastercard", issuer: "Scotiabank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Scotiabank GM Visa Card", issuer: "Scotiabank", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Scotiabank GM Visa Infinite Card", issuer: "Scotiabank", network: "Visa", cardType: "Personal" }),

  // BMO
  trustedCard({
    name: "BMO Ascend World Elite Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 150,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "travel", multiplier: 5 },
      { category: "dining", multiplier: 3 },
      { category: "entertainment", multiplier: 3 },
      { category: "recurring", multiplier: 3 },
    ],
    sourceUrl: "https://www.bmo.com/en-ca/main/personal/credit-cards/bmo-ascend-world-elite-mastercard/",
  }),
  reviewCard({ name: "BMO AIR MILES Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "BMO Eclipse Rise Visa Card", issuer: "BMO", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "BMO Preferred Rate Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "BMO Prepaid Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Prepaid" }),
  reviewCard({ name: "BMO Rewards Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Personal" }),
  trustedCard({
    name: "BMO CashBack Business Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Business",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.75,
    categoryRules: [
      { category: "gas", multiplier: 1.5 },
      { category: "office_supplies", multiplier: 1.5 },
      { category: "telecom", multiplier: 1.5 },
    ],
    sourceUrl: "https://www.bmo.com/popups/main/business/credit-cards/bmo-cashback-no-fee-business-mastercard/terms-and-conditions-en.html",
  }),
  trustedCard({
    name: "BMO Rewards Business Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Business",
    annualFee: 120,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1.5,
    categoryRules: [
      { category: "gas", multiplier: 3 },
      { category: "office_supplies", multiplier: 3 },
      { category: "telecom", multiplier: 3 },
    ],
    sourceUrl: "https://www.bmo.com/popups/main/business/credit-cards/bmo-rewards-business-mastercard/terms-and-conditions-en.html",
  }),
  reviewCard({ name: "BMO AIR MILES Business Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Business" }),
  trustedCard({
    name: "BMO World Elite Business Mastercard",
    issuer: "BMO",
    network: "Mastercard",
    cardType: "Business",
    annualFee: 149,
    rewardProgram: "BMO Rewards",
    baseEarnRate: 1.5,
    categoryRules: [
      { category: "gas", multiplier: 4 },
      { category: "office_supplies", multiplier: 4 },
      { category: "telecom", multiplier: 4 },
    ],
    sourceUrl: "https://www.bmo.com/main/business/credit-cards/bmo-rewards-world-elite-business-mastercard/",
  }),
  reviewCard({ name: "BMO Support Our Troops Mastercard", issuer: "BMO", network: "Mastercard", cardType: "Personal" }),

  // American Express
  trustedCard({
    name: "Marriott Bonvoy Business American Express Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Business",
    annualFee: 150,
    rewardProgram: "Marriott Bonvoy",
    baseEarnRate: 2,
    categoryRules: [
      { category: "marriott", multiplier: 5 },
      { category: "gas", multiplier: 3 },
      { category: "dining", multiplier: 3 },
      { category: "travel", multiplier: 3 },
    ],
    sourceUrl: "https://www.americanexpress.com/ca/en/business/small-business/benefits/marriott-bonvoy-business-card/",
  }),
  trustedCard({
    name: "American Express Aeroplan Business Reserve Card",
    issuer: "American Express",
    network: "Amex",
    cardType: "Business",
    annualFee: 599,
    rewardProgram: "Aeroplan",
    baseEarnRate: 1.25,
    categoryRules: [
      { category: "travel_air_canada", multiplier: 3 },
      { category: "hotel", multiplier: 2 },
      { category: "car_rental", multiplier: 2 },
    ],
    sourceUrl: "https://www.americanexpress.com/en-ca/credit-cards/aeroplan-business-reserve-card/",
  }),
  reviewCard({ name: "American Express Business Edge Card", issuer: "American Express", network: "Amex", cardType: "Business" }),

  // MBNA
  trustedCard({
    name: "MBNA Rewards Platinum Plus Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "MBNA Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "dining", multiplier: 2 },
      { category: "groceries", multiplier: 2 },
      { category: "digital_media", multiplier: 2 },
      { category: "membership", multiplier: 2 },
      { category: "utilities", multiplier: 2 },
    ],
    sourceUrl: "https://www.mbna.ca/en/credit-cards/rewards/mbna-rewards-mastercard",
  }),
  trustedCard({
    name: "MBNA True Line Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.mbna.ca/en/credit-cards/low-interest/true-line-mastercard",
  }),
  trustedCard({
    name: "MBNA True Line Gold Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 39,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.mbna.ca/en/credit-cards/low-interest/true-line-gold-mastercard",
  }),
  trustedCard({
    name: "Amazon.ca Rewards Mastercard",
    issuer: "MBNA",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Amazon.ca Rewards",
    baseEarnRate: 1,
    categoryRules: [
      { category: "amazon", multiplier: 1.5 },
      { category: "whole_foods", multiplier: 1.5 },
      { category: "foreign_currency", multiplier: 1 },
    ],
    sourceUrl: "https://www.mbna.ca/en/credit-cards/retail-store/amazon-rewards-mastercard",
    extractionNotes: "Prime members earn 2.5% at Amazon.ca and Whole Foods and on eligible foreign currency transactions; non-Prime baseline is stored.",
  }),

  // National Bank
  reviewCard({ name: "National Bank Regular Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "National Bank MC1 Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  trustedCard({
    name: "National Bank Allure Mastercard",
    issuer: "National Bank",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [],
    sourceUrl: "https://www.nbc.ca/personal/mastercard-credit-cards/allure.html",
    extractionNotes: "Earns 1 point per $2 spent, with $10 cashback per 1,000 points.",
  }),
  reviewCard({ name: "National Bank Echo Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  trustedCard({
    name: "National Bank mycredit Mastercard",
    issuer: "National Bank",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [
      { category: "dining", multiplier: 1 },
      { category: "recurring", multiplier: 1 },
    ],
    sourceUrl: "https://www.nbc.ca/personal/mastercard-credit-cards/my-credit.html",
  }),
  reviewCard({ name: "National Bank Edition Cashback Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "National Bank Ovation Gold Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "National Bank Platinum Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "National Bank Escapade Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "National Bank World Mastercard", issuer: "National Bank", network: "Mastercard", cardType: "Personal" }),

  // Desjardins
  reviewCard({ name: "Desjardins Flexi Visa", issuer: "Desjardins", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Desjardins Cash Back Mastercard", issuer: "Desjardins", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Desjardins Bonus Visa", issuer: "Desjardins", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Desjardins Odyssey World Elite Mastercard", issuer: "Desjardins", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Desjardins Cash Back World Elite Mastercard", issuer: "Desjardins", network: "Mastercard", cardType: "Personal" }),

  // Rogers
  trustedCard({
    name: "Rogers Red Mastercard",
    issuer: "Rogers",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [{ category: "foreign_currency", multiplier: 2 }],
    sourceUrl: "https://www.rogersbank.com/en/Rogers-Red-Annual-Value",
    extractionNotes: "Base earn varies by eligible Rogers/Fido/Shaw/Comwave service status; Pointer stores the non-service base rate and U.S. dollar bonus.",
  }),
  trustedCard({
    name: "Rogers Red World Elite Mastercard",
    issuer: "Rogers",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1.5,
    categoryRules: [{ category: "foreign_currency", multiplier: 3 }],
    sourceUrl: "https://www.rogersbank.com/en/rogers_red_worldelite_mastercard_details/",
    extractionNotes: "Base earn varies by eligible Rogers/Fido/Shaw service status; Pointer stores the non-service base rate and U.S. dollar bonus.",
  }),
  trustedCard({
    name: "Rogers Red World Legend Mastercard",
    issuer: "Rogers",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 495,
    rewardProgram: "Cashback",
    baseEarnRate: 2,
    categoryRules: [],
    sourceUrl: "https://www.rogersbank.com/en/rogers_red_worldlegend_mastercard_details",
  }),

  // Neo Financial
  reviewCard({ name: "Neo World Mastercard", issuer: "Neo Financial", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Neo World Elite Mastercard", issuer: "Neo Financial", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Neo Secured Mastercard", issuer: "Neo Financial", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Neo Secured World Mastercard", issuer: "Neo Financial", network: "Mastercard", cardType: "Personal" }),
  reviewCard({ name: "Neo Secured World Elite Mastercard", issuer: "Neo Financial", network: "Mastercard", cardType: "Personal" }),

  // Capital One
  trustedCard({
    name: "Capital One Aspire Travel Platinum Mastercard",
    issuer: "Capital One",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Capital One Rewards",
    baseEarnRate: 1,
    categoryRules: [],
    sourceUrl: "https://www.mastercard.ca/en-ca/banks/capital-one/",
  }),
  trustedCard({
    name: "Capital One Aspire Cash Platinum Mastercard",
    issuer: "Capital One",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
    sourceUrl: "https://www.mastercard.ca/en-ca/banks/capital-one/",
  }),
  trustedCard({
    name: "Capital One Guaranteed Mastercard",
    issuer: "Capital One",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.mastercard.ca/en-ca/banks/capital-one/",
  }),
  trustedCard({
    name: "Capital One Guaranteed Secured Mastercard",
    issuer: "Capital One",
    network: "Mastercard",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: null,
    baseEarnRate: 0,
    categoryRules: [],
    sourceUrl: "https://www.mastercard.ca/en-ca/banks/capital-one/",
  }),

  // Home Trust
  trustedCard({
    name: "Home Trust Preferred Visa",
    issuer: "Home Trust",
    network: "Visa",
    cardType: "Personal",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 1,
    categoryRules: [],
    sourceUrl: "https://www.hometrust.ca/credit-cards/preferred-visa-card/",
  }),
  reviewCard({ name: "Home Trust Secured Visa", issuer: "Home Trust", network: "Visa", cardType: "Personal" }),
  reviewCard({ name: "Home Trust Equityline Visa", issuer: "Home Trust", network: "Visa", cardType: "Personal" }),

  // Prepaid / wallet-style cards
  trustedCard({
    name: "EQ Bank Card",
    issuer: "EQ Bank",
    network: "Mastercard",
    cardType: "Prepaid",
    annualFee: 0,
    rewardProgram: "Cashback",
    baseEarnRate: 0.5,
    categoryRules: [],
    sourceUrl: "https://www.eqbank.ca/personal-banking/payments/card/fees-features",
  }),
  reviewCard({ name: "PC Money Account", issuer: "PC Financial", network: "Mastercard", cardType: "Prepaid" }),
  reviewCard({ name: "Neo Financial Everyday Account", issuer: "Neo Financial", network: "Mastercard", cardType: "Prepaid" }),
  reviewCard({ name: "Nextwave Titanium+ Prepaid Mastercard", issuer: "Nextwave", network: "Mastercard", cardType: "Prepaid" }),
  reviewCard({ name: "Cash Passport Prepaid Mastercard", issuer: "Cash Passport", network: "Mastercard", cardType: "Prepaid" }),
];

const catalogCards: SeedCard[] = [...cards, ...pendingReviewCards];

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding ${catalogCards.length} Canadian credit cards...`);

  // Clean up stale / test cards that don't match the canonical catalog
  const staleIssuers = ["Pointer Test", "American Express Canada", "TD Canada Trust"];
  await prisma.card.updateMany({
    where: {
      OR: [
        { issuer: { in: staleIssuers } },
        { name: "ZZZ Pointer Temp Card" },
      ],
    },
    data: {
      isActive: false,
      isVerified: false,
      extractionNotes: "Test or stale catalog entry hidden from user-facing catalog.",
    },
  });
  console.log("Hid stale/test entries");

  let created = 0;
  let updated = 0;

  for (const c of catalogCards) {
    const isVerified = c.isVerified ?? true;
    const result = await prisma.card.upsert({
      where: {
        name_issuer: { name: c.name, issuer: c.issuer },
      },
      update: {
        network: c.network,
        cardType: c.cardType,
        annualFee: c.annualFee,
        rewardProgram: c.rewardProgram,
        baseEarnRate: c.baseEarnRate,
        isActive: true,
        isVerified,
        externalId: c.externalId,
        sourceUrl: c.sourceUrl,
        extractionNotes: c.extractionNotes ?? null,
        confidence: c.confidence,
      },
      create: {
        name: c.name,
        issuer: c.issuer,
        network: c.network,
        cardType: c.cardType,
        annualFee: c.annualFee,
        rewardProgram: c.rewardProgram,
        baseEarnRate: c.baseEarnRate,
        isActive: true,
        isVerified,
        externalId: c.externalId,
        sourceUrl: c.sourceUrl,
        extractionNotes: c.extractionNotes ?? null,
        confidence: c.confidence,
      },
    });

    // Keep category rules exactly aligned with the canonical seed entry.
    await prisma.cardCategoryRule.deleteMany({ where: { cardId: result.id } });
    for (const rule of c.categoryRules) {
      await prisma.cardCategoryRule.create({
        data: {
          cardId: result.id,
          category: rule.category,
          multiplier: rule.multiplier,
        },
      });
    }

    // Check if this was a create or update (simple heuristic: updatedAt ~ createdAt means new)
    const diff = result.updatedAt.getTime() - result.createdAt.getTime();
    if (diff < 2000) {
      created++;
    } else {
      updated++;
    }
  }

  console.log(`Done - ${created} created, ${updated} updated, ${catalogCards.length} total in catalog seed`);

  // Deactivate any old cards that aren't in the canonical seed
  const canonicalKeys = new Set(catalogCards.map((c) => `${c.name}|||${c.issuer}`));
  const allCards = await prisma.card.findMany({ select: { id: true, name: true, issuer: true } });
  const staleIds = allCards
    .filter((c) => !canonicalKeys.has(`${c.name}|||${c.issuer}`))
    .map((c) => c.id);
  if (staleIds.length > 0) {
    await prisma.card.updateMany({
      where: { id: { in: staleIds } },
      data: {
        isActive: false,
        isVerified: false,
        extractionNotes: "Inactive because it is not in the canonical seed catalog.",
      },
    });
    console.log(`Deactivated ${staleIds.length} stale card(s) not in canonical catalog`);
  }

  // ── Merchant seed ──────────────────────────────────────────────────
  type SeedMerchant = {
    name: string;
    primaryCategory: string;
    aliases: string[];
  };

  const merchants: SeedMerchant[] = [
    // Dining
    { name: "Starbucks", primaryCategory: "dining", aliases: ["starbucks coffee"] },
    { name: "Tim Hortons", primaryCategory: "dining", aliases: ["tims", "tim horton s"] },
    { name: "McDonald's", primaryCategory: "dining", aliases: ["mcdonalds", "mcdonald"] },
    { name: "Uber Eats", primaryCategory: "dining", aliases: ["ubereats"] },
    { name: "Skip The Dishes", primaryCategory: "dining", aliases: ["skipthedishes", "skip"] },
    { name: "DoorDash", primaryCategory: "dining", aliases: ["door dash"] },

    // Groceries
    { name: "Loblaws", primaryCategory: "groceries", aliases: ["loblaws great food"] },
    { name: "No Frills", primaryCategory: "groceries", aliases: ["nofrills"] },
    { name: "Metro", primaryCategory: "groceries", aliases: [] },
    { name: "Sobeys", primaryCategory: "groceries", aliases: [] },
    { name: "Walmart", primaryCategory: "groceries", aliases: [] },
    { name: "Costco", primaryCategory: "groceries", aliases: [] },
    { name: "Real Canadian Superstore", primaryCategory: "groceries", aliases: ["superstore"] },

    // Drugstore
    { name: "Shoppers Drug Mart", primaryCategory: "drugstore", aliases: ["shoppers", "sdm"] },

    // Gas
    { name: "Petro-Canada", primaryCategory: "gas", aliases: ["petro canada"] },
    { name: "Shell", primaryCategory: "gas", aliases: [] },
    { name: "Esso", primaryCategory: "gas", aliases: [] },
    { name: "Canadian Tire Gas", primaryCategory: "gas", aliases: ["canadian tire gas bar"] },

    // Transit
    { name: "Uber", primaryCategory: "transit", aliases: ["uber rides"] },

    // Streaming
    { name: "Netflix", primaryCategory: "streaming", aliases: [] },
    { name: "Spotify", primaryCategory: "streaming", aliases: [] },

    // Travel
    { name: "Air Canada", primaryCategory: "travel", aliases: ["aircanada"] },
    { name: "WestJet", primaryCategory: "travel", aliases: ["west jet"] },
    { name: "Marriott", primaryCategory: "travel", aliases: [] },
    { name: "Airbnb", primaryCategory: "travel", aliases: [] },
  ];

  console.log(`Seeding ${merchants.length} merchants…`);

  for (const m of merchants) {
    const merchant = await prisma.merchant.upsert({
      where: { name: m.name },
      update: { primaryCategory: m.primaryCategory },
      create: { name: m.name, primaryCategory: m.primaryCategory },
    });

    // Recreate aliases cleanly each run
    await prisma.merchantAlias.deleteMany({ where: { merchantId: merchant.id } });
    for (const alias of m.aliases) {
      await prisma.merchantAlias.create({
        data: { merchantId: merchant.id, alias },
      });
    }
  }

  console.log(`Done — ${merchants.length} merchants seeded`);

  // Report issuer coverage
  const issuers = await prisma.card.groupBy({
    by: ["issuer"],
    _count: true,
    where: { isActive: true },
    orderBy: { _count: { issuer: "desc" } },
  });
  console.log("Issuers covered:");
  for (const row of issuers) {
    console.log(`  ${row.issuer}: ${row._count} card(s)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
