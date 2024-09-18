import React, { useContext, useState, useCallback } from "react";
import { CityContext } from "../App";

function SelectCity({ fetchWeatherInfo }) {

    const cityData = useContext(CityContext);

    const [ cityButtonName, setCityButtonName ] = useState("Select City");
    const [ selectedCity, setSelectedCity ] = useState(null);

    console.log(cityData);


    function changeButtonLabel(city_name, city_state, city_country, city){
        setCityButtonName(city_name + ", " + city_state + ", " + city_country);
        setSelectedCity(city);
    }

    function handleSelectCity() {
        if (selectedCity) {
            cityData[1]([selectedCity]);
            cityData[2](false);
            fetchWeatherInfo();
        }
    }


    return (

        <div className="modal-city-select">
            <div className="inner-modal-city-select">
                <div>
                    <p>Which city would you like weather information for?</p>
                </div>
                    <div>
                    <div className="dropdown">
                        <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {cityButtonName}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {cityData && cityData[0].map((city) => {
                            return (
                                <a className="dropdown-item" 
                                    href="#"
                                    key={city.state}
                                    onClick={() => changeButtonLabel(city.city_name, city.state, city.country, city)}>
                                        {city.city_name}, {city.state}, {city.country}
                                </a>
                            );
                        })}
                        </div>
                        <button className="" type="button" onClick={() => handleSelectCity()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SelectCity;