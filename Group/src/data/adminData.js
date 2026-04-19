// This file just stores the starting offers data
// In Phase 2, this will come from MongoDB instead

export const initialOffers = [
  {
    id: 1,
    title: "Royal Suite Escape",
    type: "Bundle",
    discount: 26,
    originalPrice: 799,
    pricePerNight: 599,
    expiryDate: "2026-04-01",
    active: true,
    badge: "Most Popular",
  },
  {
    id: 2,
    title: "Triple Room Deal",
    type: "Discount",
    discount: 45,
    originalPrice: 612,
    pricePerNight: 337,
    expiryDate: "2026-03-25",
    active: true,
    badge: "Limited Rooms",
  },
  {
    id: 3,
    title: "Honeymoon Paradise",
    type: "Package",
    discount: 30,
    originalPrice: 1333,
    pricePerNight: 899,
    expiryDate: "2026-04-15",
    active: true,
    badge: "Romantic",
  },
  {
    id: 4,
    title: "Business & Comfort",
    type: "Bundle",
    discount: 25,
    originalPrice: 519,
    pricePerNight: 389,
    expiryDate: "2026-03-30",
    active: true,
    badge: "Weekday Deal",
  },
  {
    id: 5,
    title: "Summer Splash Package",
    type: "Seasonal",
    discount: 32,
    originalPrice: 680,
    pricePerNight: 459,
    expiryDate: "2026-05-01",
    active: true,
    badge: "Summer Special",
  },
  {
    id: 6,
    title: "Weekend Family Fun",
    type: "Bundle",
    discount: 27,
    originalPrice: 750,
    pricePerNight: 549,
    expiryDate: "2026-04-20",
    active: true,
    badge: "Family",
  },
];

// All available offer types for the form dropdown
export const offerTypes = ["Bundle", "Discount", "Package", "Seasonal"];

// All available badges for the form dropdown
export const badgeOptions = [
  "Most Popular",
  "Limited Rooms",
  "Romantic",
  "Weekday Deal",
  "Summer Special",
  "Family",
];