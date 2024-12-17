import { findCountryByCode } from "@/utils/countries";

function CountryFlagAndName({ countryCode }: { countryCode: string }) {
  const country = findCountryByCode(countryCode) || findCountryByCode("US")!;

  const countryName = country.name.length > 20 ? `${country.name.substring(0, 20)}...` : country.name;

  return (
    <span className="flex justify-between items-center gap-2 text-sm">
      {country.flag} {countryName}
    </span>
  );
}

export default CountryFlagAndName;
