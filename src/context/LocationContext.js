import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const LocationContext = createContext({});

/**
 * GLOBAL LOCATION & GEOFENCING SYSTEM
 * Manages City-level restrictions across 20 markets.
 */
export const LocationProvider = ({ children }) => {
  const [locationData, setLocationData] = useState(null);
  const { marketISO, userData } = useAuth();

  /**
   * SYNC: Profile Location
   * Automatically initializes location from user profile data.
   */
  useEffect(() => {
    if (userData?.city) {
      setLocationData({
        city: userData.city,
        isoCode: marketISO,
        address: userData.address || "",
      });
    }
  }, [userData, marketISO]);

  /**
   * LOGISTICS VALIDATION
   * Verifies if a restaurant or service is within the operational range.
   */
  const validateDeliveryRange = (targetCity) => {
    if (!locationData?.city) return false;
    return locationData.city.toLowerCase() === targetCity.toLowerCase();
  };

  const updateLocation = (newLocation) => {
    setLocationData((prev) => ({ ...prev, ...newLocation }));
  };

  return (
    <LocationContext.Provider
      value={{
        locationData,
        setLocationData: updateLocation,
        validateDeliveryRange,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
