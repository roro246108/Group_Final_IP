import React from "react";
import Navbar from "../Components/Navbar";
import GallerySection from "../Components/GallerySection";
import BranchesSection from "../Components/BranchesSection";
import AmenitiesSection from "../Components/AmenitiesSection";
import PrimeLocationSection from "../Components/PrimeLocationSection";
import {
  locations,
  hotelName,
  galleryImages,
  branchDetails,
  hotelAmenities,
} from "../data/hotels";
import Footer from "../Components/Footer";

export default function HotelDetails() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <GallerySection images={galleryImages} />
      <BranchesSection branches={branchDetails} />
      <AmenitiesSection amenities={hotelAmenities} />
      <PrimeLocationSection hotelName={hotelName} locations={locations} />

      <Footer />
    </div>
  );
}