// ... (Imports remains same)

const GLOBAL_MARKETS = [
  { id: "THA", name: "Thailand", currency: "THB", localIdName: "Thai ID" },
  { id: "CHN", name: "China", currency: "CNY", localIdName: "Resident ID" },
  { id: "SGP", name: "Singapore", currency: "SGD", localIdName: "NRIC" },
  { id: "TUR", name: "Turkey", currency: "TRY", localIdName: "Kimlik" },
  { id: "ARE", name: "UAE", currency: "AED", localIdName: "Emirates ID" },
  { id: "SAU", name: "Saudi Arabia", currency: "SAR", localIdName: "Iqama" },
  { id: "USA", name: "USA", currency: "USD", localIdName: "SSN" },
  { id: "GBR", name: "UK", currency: "GBP", localIdName: "NIN" },
  { id: "JPN", name: "Japan", currency: "JPY", localIdName: "My Number" },
  { id: "KOR", name: "S. Korea", currency: "KRW", localIdName: "Resident Reg" },
  { id: "DEU", name: "Germany", currency: "EUR", localIdName: "ID Card" },
  { id: "FRA", name: "France", currency: "EUR", localIdName: "ID Card" },
  { id: "ITA", name: "Italy", currency: "EUR", localIdName: "Codice Fiscale" },
  { id: "CAN", name: "Canada", currency: "CAD", localIdName: "SIN" },
  { id: "AUS", name: "Australia", currency: "AUD", localIdName: "TFN" },
  { id: "MYS", name: "Malaysia", currency: "MYR", localIdName: "MyKad" },
  { id: "IDN", name: "Indonesia", currency: "IDR", localIdName: "KTP" },
  { id: "VNM", name: "Vietnam", currency: "VND", localIdName: "Citizen ID" },
  { id: "HKG", name: "Hong Kong", currency: "HKD", localIdName: "HKID" },
  { id: "CHE", name: "Switzerland", currency: "CHF", localIdName: "ID Card" },
];

export default function Register() {
  // ... (Hooks remains same)

  const handleRegistration = async () => {
    // Basic Validation
    if (!email || !password || !idNumber) {
      Alert.alert("SECURITY BREACH", "All identity fields are mandatory for global access.");
      return;
    }

    try {
      const registrationData = {
        market: selectedCountry.name,
        iso: selectedCountry.id,
        currency: selectedCountry.currency,
        verification: {
          method: verificationType,
          id: idNumber, // This is crucial for Forgot Password later
          origin: verificationType === "passport" ? passportOrigin : selectedCountry.name,
          timestamp: new Date().toISOString(),
        },
      };
      
      // Strict DB Entry
      await register(email, password, role, registrationData);
      router.replace(role === "owner" ? "/(owner)/home" : "/(customer)/home");
    } catch (error) {
      Alert.alert("REGISTRY ERROR", error.message);
    }
  };
  
  // UI remains the same as previous high-end gold theme
}
