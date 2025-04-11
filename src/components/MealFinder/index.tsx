"use client";

import { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { fetchResponse } from "../../utils/aiWebSearch";
import { useSession } from "next-auth/react";

export default function MealFinder() {
  const { pending } = useFormStatus();
  const [distanceValue, setDistanceValue] = useState(25);
  const [priceValue, setPriceValue] = useState(50);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mysteryFilter, setMysteryFilter] = useState("");
  const isMounted = useRef(true);
  const homeLocation = { lat: 44.669591, lng: -63.613833 };
  const { data: session } = useSession();

  const sessionId = session?.user?.id;
  const isPremiumUser = () => session?.user?.isPremium ?? false;

  useEffect(() => {
    isMounted.current = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted.current) {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        () => {
          if (isMounted.current) {
            setError("Failed to get location");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const nearbyResponse = await fetch(
        `/api/nearby?lat=${homeLocation.lat}&lng=${homeLocation.lng}&radius=${
          distanceValue * 1000
        }&type=restaurant&maxprice=${priceValue}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!nearbyResponse.ok) throw new Error("Failed to fetch places");
      const nearbyResponseData = await nearbyResponse.json();
      const transformed = nearbyResponseData.map((place: any) => ({
        name: place.name,
        location: place.geometry.location,
      }));

      if (isPremiumUser()) {
        await fetch(`/api/ai-web-search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantsData: transformed,
            searchData: mysteryFilter,
          }),
        });
      }

      if (isMounted.current) {
        setPlaces(nearbyResponseData);
        const randomPlace = nearbyResponseData[Math.floor(Math.random() * nearbyResponseData.length)];

        if (randomPlace) {
          const xray = randomPlace.plus_code.compound_code.replace("+", "%2B").replace(/\s+/g, "");
          const googleMapsUrl = `https://www.google.com/maps/dir/${homeLocation.lat},${homeLocation.lng}/${xray}`;
          window.open(googleMapsUrl, "_blank");
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Failed to load places");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const formClassName = !location
    ? "flex flex-col space-y-6 rounded-md bg-red-100 dark:bg-red-900 p-6 shadow-md border-2 border-red-500 dark:border-red-400"
    : "flex flex-col space-y-6 rounded-md bg-gray-50 dark:bg-gray-900 p-6 shadow-md";

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <form onSubmit={handleSubmit} className={formClassName}>
        <div className="flex flex-col space-y-4">
          <label htmlFor="location" className="font-semibold text-gray-700 dark:text-gray-200">
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location ? `${location.lat}, ${location.lng} ✅` : "Please allow location access ❌"}
            readOnly
            className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-800 dark:text-white"
            disabled={pending}
          />

          <label htmlFor="distance" className="font-semibold text-gray-700 dark:text-gray-200">
            Distance: {distanceValue} Kilometers
          </label>
          <input
            type="range"
            id="distance"
            min="1"
            max="25"
            value={distanceValue}
            onChange={(e) => setDistanceValue(Number(e.target.value))}
            disabled={pending}
            className="w-full accent-blue-600 dark:accent-blue-400"
          />

          <label htmlFor="MysteryPlus+ Filter" className="font-semibold text-gray-700 dark:text-gray-200">
            ✨ MysteryPlus+ AI Filter ✨
          </label>
          <input
            type="text"
            id="MysteryPlus+ Filter"
            value={
              isPremiumUser()
                ? mysteryFilter
                : "Subscribe to MysteryPlus+ to use custom AI filters!"
            }
            onChange={(e) => isPremiumUser() && setMysteryFilter(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-800 dark:text-white"
            disabled={!isPremiumUser()}
          />

          <label htmlFor="price" className="font-semibold text-gray-700 dark:text-gray-200">
            Price:
          </label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPriceValue(val)}
                disabled={pending}
                aria-pressed={priceValue === val}
                className={`px-4 py-2 border rounded transition-colors duration-200 ${
                  priceValue === val
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-white text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                } border-gray-300 dark:border-gray-700`}
              >
                {val === 0 ? "Any" : "$".repeat(val)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!location}
          className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Go!"}
        </button>
      </form>
    </div>
  );
}
