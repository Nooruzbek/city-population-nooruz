import {Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from "@reach/combobox";
import "@reach/combobox/styles.css"
import React from "react";

function Autocomplete(props) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [cityUrl, setCityUrl] = React.useState("");
    const cities = useCitySearch(searchTerm);
    const population = usePopulationSearch(cityUrl);
    
    const handleSearchCity = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleChoosedCity = (event) =>{
       setCityUrl(event._links["city:item"].href);
    }

    return (
        <>
            <div>
                <span>City</span>
                <Combobox aria-label="Cities">
                    <ComboboxInput
                        onChange={handleSearchCity} />
                    {cities && (
                        <ComboboxPopover>
                            {cities.length > 0 ? (
                                <ComboboxList>
                                    {cities.slice(0, 5).map((city, index) => (
                                        <ComboboxOption
                                            key={index}
                                            value={city.matching_full_name}
                                            onClick={() => handleChoosedCity(city)} />
                                    ))}
                                </ComboboxList>
                            ) : (
                                <span style={{ display: "block", margin: 8 }}>
                                    No results found
                                </span>
                            )}
                        </ComboboxPopover>
                    )}
                </Combobox>
                <span>Population: </span>
                <label className = "population">{population}</label>
            </div>
        </>
    );
}

function useCitySearch(searchTerm) {
    const [cities, setCities] = React.useState([]);

    React.useEffect(() => {
      if (searchTerm.trim() !== "") {
        fetchCities(searchTerm).then((cities) => {
          setCities(cities);
        });
      }
    }, [searchTerm]);

    return cities;
  }

  function usePopulationSearch(url){
      const [populations, setPopulations] = React.useState([]);

      React.useEffect(()=> {
          if (url.trim() !== ""){
              fetchCityPopulation(url).then((populat) => {
                  setPopulations(populat);
              })
          }
      }, [url]);
      return populations;
  }


  async function fetchCities(value) {
    const res = await fetch("https://api.teleport.org/api/cities/?search=" + value);
      const result = await res.json();
      return result._embedded["city:search-results"];
  }

  async function fetchCityPopulation(url) {
    const res = await fetch(url);
      const result = await res.json();
      return result.population;
  }


export default Autocomplete;