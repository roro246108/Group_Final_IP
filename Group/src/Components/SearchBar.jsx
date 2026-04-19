import React from "react";
import { useFormik } from "formik";
import { ChevronDown } from "lucide-react";
import * as Yup from "yup";

export default function SearchBar({
  filters = {},
  onSearch,
  onSearchClick,
  resultCount,
}) {
  const submitHandler = onSearchClick || onSearch;

  const validationSchema = Yup.object({
    branch: Yup.string().required("Branch is required"),
    checkIn: Yup.date().required("Check-in date is required"),
    checkOut: Yup.date()
      .required("Check-out date is required")
      .min(Yup.ref("checkIn"), "Check-out must be after check-in"),
    guests: Yup.string().required("Guests is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      branch: filters.branch || "Cairo Branch",
      checkIn: filters.checkIn || "",
      checkOut: filters.checkOut || "",
      guests:
        filters.guests && Number(filters.guests) > 0
          ? `${filters.guests} Guest${Number(filters.guests) > 1 ? "s" : ""}`
          : "1 Guest",
    },
    validationSchema,
    onSubmit: (values) => {
      const guestsNumber = parseInt(values.guests) || 1;

      submitHandler?.({
        destination: values.branch,
        branch: values.branch,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: guestsNumber,
        maxPrice: filters.maxPrice || 1000,
      });
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-[30px] bg-[#CBD9E6] p-5 md:p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1.1fr_1.1fr_1fr_1.1fr] items-start">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Branch
            </label>
            <div className="relative">
              <select
                name="branch"
                value={formik.values.branch}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full appearance-none rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
              >
                <option value="">Select branch</option>
                <option>Cairo Branch</option>
                <option>Alexandria Branch</option>
                <option>Marsa Alam Branch</option>
                <option>Sharm El Sheikh Branch</option>
                <option>Ain El Sokhna Branch</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#223a5e]"
              />
            </div>
            {formik.touched.branch && formik.errors.branch && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.branch}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Check-in
            </label>
            <input
              type="date"
              name="checkIn"
              value={formik.values.checkIn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
            />
            {formik.touched.checkIn && formik.errors.checkIn && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Check-out
            </label>
            <input
              type="date"
              name="checkOut"
              value={formik.values.checkOut}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
            />
            {formik.touched.checkOut && formik.errors.checkOut && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.checkOut}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Guests
            </label>
            <div className="relative">
              <select
                name="guests"
                value={formik.values.guests}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full appearance-none rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
              >
                <option value="">Select guests</option>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5 Guests</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#223a5e]"
              />
            </div>
            {formik.touched.guests && formik.errors.guests && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.guests}</p>
            )}
          </div>

          <div className="pt-7">
            <button
  type="submit"
  className="
    w-full 
    rounded-2xl 
    bg-[#314763] 
    py-4 
    font-semibold 
    text-white 
    transition-all duration-200 
    
    hover:bg-[#24364d] 
    hover:-translate-y-0.5 
    
    active:scale-95 
    active:translate-y-0.5 
    active:bg-[#1d2b3d]
  "
>
  Search Now
</button>
          </div>
        </div>
      </form>

      {typeof resultCount === "number" && (
        <div className="mt-3 pr-2 text-right text-sm text-[#6c7f95]">
          {resultCount} results
        </div>
      )}
    </div>
  );
}