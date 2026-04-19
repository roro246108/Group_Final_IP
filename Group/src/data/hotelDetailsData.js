import hotel1 from "../assets/Images/Cairo_Branch.png";
import hotel2 from "../assets/Images/Ain_El_Sokhna_Branch.png";
import hotel3 from "../assets/Images/Sharm_Branch.png";
import hotel4 from "../assets/Images/Alex_Branch.png";
import hotel5 from "../assets/Images/cairo_interior.webp";
import hotel6 from "../assets/Images/Alex_interior.png";
import hotel7 from "../assets/Images/MrasaAlam_Branch.avif";


export const hotelDetailsData = {
  hotelName: "NovaNest Hotel",

  galleryImages: [hotel1, hotel2, hotel3, hotel4,hotel5,hotel6,hotel7],

   branches:[
  {
    title: "Cairo Branch",
    slug: "cairo-branch",
    description:
      "A sophisticated city escape in New Cairo, offering modern comfort, premium services, and easy access to shopping, dining, and business hubs.",
    image: hotel1,
    badge: "City",
    features: ["Business Hub", "Fine Dining", "Pool"],
  },
  {
    title: "Alexandria Branch",
    slug: "alexandria-branch",
    description:
      "A stylish Mediterranean retreat that blends seaside charm, cultural surroundings, and refined comfort in the heart of Alexandria.",
    image: hotel4,
    badge: "Coastal",
    features: ["Sea View", "City Access", "Dining"],
  },
  {
    title: "Marsa Alam Branch",
    slug: "marsa-alam-branch",
    description:
      "A tranquil luxury hideaway surrounded by natural beauty, ideal for guests seeking relaxation, beachfront serenity, and marine adventures.",
    image: hotel7,
    badge: "Nature",
    features: ["Coral Reefs", "Beachfront", "Relaxation"],
  },
  {
    title: "Ain El Sokhna Branch",
    slug: "ain-el-sokhna-branch",
    description:
      "A relaxing seaside destination with elegant hospitality, scenic Red Sea views, and a peaceful atmosphere perfect for weekend getaways.",
    image: hotel2,
    badge: "Beach",
    features: ["Sea View", "Private Beach", "Spa"],
  },
  {
    title: "Sharm El Sheikh Branch",
    slug: "sharm-el-sheikh-branch",
    description:
      "A vibrant coastal resort experience known for luxury stays, crystal-clear waters, and unforgettable leisure and adventure activities.",
    image: hotel3,
    badge: "Resort",
    features: ["Diving", "Resort Pool", "Activities"],
  },
  
   ],
  amenities: [
    {
      title: "High-Speed WiFi",
      description:
        "Complimentary fiber-optic internet throughout the property",
      icon: "wifi",
    },
    {
      title: "Infinity Pool",
      description: "Heated saltwater pool with panoramic ocean views",
      icon: "waves",
    },
    {
      title: "Fitness Center",
      description: "24/7 state-of-the-art gym with personal trainers",
      icon: "dumbbell",
    },
    {
      title: "Fine Dining",
      description: "3 restaurants featuring Michelin-starred chefs",
      icon: "utensils",
    },
    {
      title: "Valet Parking",
      description: "Complimentary valet and secure underground parking",
      icon: "car",
    },
    {
      title: "Full-Service Spa",
      description: "Massage, facial treatments, and wellness programs",
      icon: "sparkles",
    },
    {
      title: "Business Center",
      description: "Meeting rooms, printing, and secretarial services",
      icon: "briefcase",
    },
    {
      title: "Concierge",
      description: "24-hour concierge for reservations and experiences",
      icon: "concierge",
    },
  ],

  locations: [
  {
    id: 1,
    name: "Cairo Branch",
    city: "Cairo",
    address: "90th Street, New Cairo, Cairo, Egypt",
    airport: "Cairo International Airport - 30 minutes drive",
    attractions:
      "Point 90 Mall, Cairo Festival City, The American University in Cairo",
    mapPosition: [30.0185, 31.4905],
    mapsQuery: "90th Street, New Cairo, Cairo, Egypt",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 2,
    name: "Alexandria Branch",
    city: "Alexandria",
    address: "Corniche Road, Alexandria, Egypt",
    airport: "Borg El Arab Airport - 45 minutes drive",
    attractions:
      "Bibliotheca Alexandrina, Qaitbay Citadel, Stanley Bridge",
    mapPosition: [31.2156, 29.9553],
    mapsQuery: "Corniche Road, Alexandria, Egypt",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 3,
    name: "Sharm El Sheikh Branch",
    city: "Sharm El Sheikh",
    address: "Naama Bay, Sharm El Sheikh, Egypt",
    airport: "Sharm El Sheikh International Airport - 20 minutes drive",
    attractions:
      "Naama Bay, SOHO Square, Ras Mohammed National Park",
    mapPosition: [27.9158, 34.3299],
    mapsQuery: "Naama Bay, Sharm El Sheikh, Egypt",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 4,
    name: "Hurghada Branch",
    city: "Hurghada",
    address: "Village Road, Hurghada, Egypt",
    airport: "Hurghada International Airport - 15 minutes drive",
    attractions:
      "Hurghada Marina, El Gouna, Mahmya Island",
    mapPosition: [27.2579, 33.8116],
    mapsQuery: "Village Road, Hurghada, Egypt",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 5,
    name: "Marsa Alam Branch",
    city: "Marsa Alam",
    address: "Marsa Alam Road, Marsa Alam, Egypt",
    airport: "Marsa Alam International Airport - 25 minutes drive",
    attractions:
      "Abu Dabbab Beach, Wadi El Gemal, Port Ghalib",
    mapPosition: [25.0676, 34.8789],
    mapsQuery: "Marsa Alam Road, Marsa Alam, Egypt",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
  },
],
};