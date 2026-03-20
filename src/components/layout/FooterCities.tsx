"use client";

import { useState, useEffect } from "react";

const cities = [
  {
    name: "Toronto, Canada",
    timezone: "America/Toronto",
    email: "studio@houseofsingh.com",
  },
  {
    name: "Delhi, India",
    timezone: "Asia/Kolkata",
    email: "studio@houseofsingh.com",
  },
  {
    name: "London, UK",
    timezone: "Europe/London",
    email: null,
  },
];

function getTime(timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(new Date());
}

export default function FooterCities() {
  const [times, setTimes] = useState<string[]>(() =>
    cities.map((c) => getTime(c.timezone))
  );

  useEffect(() => {
    const update = () => setTimes(cities.map((c) => getTime(c.timezone)));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="footer-cities-grid">
      {cities.map((city, i) => {
        const [hours, minutes] = times[i].split(":");
        return (
          <div
            key={city.name}
            className={`footer-cities-col${i === 1 ? " footer-cities-col-mid" : ""}`}
          >
            <p className="footer-cities-name">{city.name}</p>
            <p className="footer-cities-time">
              {hours}
              <span className="footer-clock-colon">:</span>
              {minutes}
            </p>
            {city.email ? (
              <a
                href={`mailto:${city.email}`}
                className="footer-cities-contact"
              >
                {city.email}
              </a>
            ) : (
              <p className="footer-cities-contact footer-cities-soon">
                Coming soon
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
