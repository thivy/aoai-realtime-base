"use server";

export const callWeather = async (location: string) => {
  return {
    location,
    weather: "Sunny",
    temperature: "25°C",
  };
};
