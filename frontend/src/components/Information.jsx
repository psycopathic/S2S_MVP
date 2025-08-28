


'use client';

import { useState, useEffect } from "react";
import {UAParser} from "ua-parser-js";

export default function Information() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function getUserData() {
      try {
        const parser = new UAParser(navigator.userAgent);
        const os = parser.getOS();
        const device = parser.getDevice();
        const browser = parser.getBrowser();
        
        let ip = "Unknown";
        let city = "Unknown";
        let country = "Unknown";
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          // console.log("data", ipData);
          ip = ipData.ip;

        
          const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
         
          const locData = await locRes.json();
      

        } catch (err) {
          console.warn("Failed to fetch IP info:", err);
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              let locationName = "Unknown Location";
              try {
                const geoRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                );
                // console.log(geoRes)
                const geoData = await geoRes.json();
                // console.log(geoData)
                locationName = geoData.display_name || "Unknown Location";
              } catch (geoErr) {
                console.warn("Reverse geocoding failed:", geoErr);
              }

              setUserInfo({
                ip,
                os,
                device,
                locationName,
              });
            },
            (error) => {
              console.warn("Geolocation error:", error.code, error.message);
              setUserInfo({ ip, city, country, os, device, browser });
            },
            { timeout: 10000 }
          );
        } else {
          setUserInfo({ ip, city, country, os, device, browser });
        }
      } catch (err) {
        console.error("Failed to get user info:", err);
      }
    }

    getUserData();
  }, []);

  if (!userInfo) return <p>Loading...</p>;

  return (
    <div className="border border-gray-300 p-4 rounded shadow-2xl">
      <h1 className="font-bold underline text-center">User Information</h1>
      <ul className="">
        <li><span className="font-bold">IP:</span> {userInfo.ip}</li>
        <li><span className="font-bold">Country (IP-based):</span> {userInfo.country}</li>
        <li><span className="font-bold">OS: </span>{userInfo.os.name} {userInfo.os.version}</li>
        <li><span className="font-bold">Device:</span> {userInfo.device.type || "Desktop"} {userInfo.device.model ? `(${userInfo.device.model})` : ""}</li>

        {userInfo.locationName && <li><span className="font-bold">Exact Location (GPS):</span> {userInfo.locationName}</li>}
      </ul>
    </div>
  );
}
