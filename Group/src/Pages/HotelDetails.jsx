import React from "react";
import Navbar from "../Components/Navbar";
import GallerySection from "../Components/GallerySection";
import BranchesSection from "../Components/BranchesSection";
import AmenitiesSection from "../Components/AmenitiesSection";
import PrimeLocationSection from "../Components/PrimeLocationSection";
import { hotelDetailsData } from "../data/hotelDetailsData";
import Footer from "../Components/Footer";

export default function HotelDetails() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <GallerySection images={hotelDetailsData.galleryImages} />
      <BranchesSection branches={hotelDetailsData.branches} />
      <AmenitiesSection amenities={hotelDetailsData.amenities} />
      <PrimeLocationSection
        hotelName={hotelDetailsData.hotelName}
        locations={hotelDetailsData.locations}
      />
      <Footer />
    </div>
  );
}