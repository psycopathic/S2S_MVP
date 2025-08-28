import fetch from "node-fetch";
import {UAParser} from "ua-parser-js";

export const userInformation = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    const parser = new UAParser(req.headers["user-agent"]);
    console.log(parser)
    const os = parser.getOS();
    const device = parser.getDevice();
    const browser = parser.getBrowser();

    let ipData = { ip, city: "Unknown", country: "Unknown" };

    try {
      const response = await fetch(`https://ipapi.co/json/`);
      if (response.ok) ipData = await response.json();
      else console.warn("IP API Error:", await response.text());
    } catch (err) {
      console.warn("Failed to fetch IP API:", err.message);
    }

    res.json({
      ip: ipData.ip,
      city: ipData.city,
      country: ipData.country_name,
      os,
      device: device.type || "Desktop",
      browser,
    });
  } catch (err) {
    console.error("Error in userInformation:", err);
    res.status(500).json({ error: "Error fetching user info" });
  }
};

export default userInformation;
