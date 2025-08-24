"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [affiliateId, setAffiliateId] = useState(1);
  const [affiliateName, setAffiliateName] = useState(""); // new affiliate name input
  const [campaignId, setCampaignId] = useState(1);
  const [campaignName, setCampaignName] = useState(""); // new campaign name input
  const [revenue, setRevenue] = useState(""); // input revenue
  const [message, setMessage] = useState("");

  const generateClickWithRevenue = async () => {
    if (!revenue) {
      alert("Enter revenue amount first");
      return;
    }

    try {
      // 1️⃣ Optionally create affiliate
      if (affiliateName) {
        const resAffiliate = await axios.post("http://localhost:4000/affiliate", {
          name: affiliateName,
        });
        setAffiliateId(resAffiliate.data.id);
        setAffiliateName("");
      }

      // 2️⃣ Optionally create campaign
      if (campaignName) {
        const resCampaign = await axios.post("http://localhost:4000/campaign", {
          name: campaignName,
        });
        setCampaignId(resCampaign.data.id);
        setCampaignName("");
      }

      const click_id = crypto.randomUUID();

      // 3️⃣ Generate click
      await axios.get("http://localhost:4000/click", {
        params: { affiliate_id: affiliateId, campaign_id: campaignId, click_id },
      });

      // 4️⃣ Immediately generate conversion (postback)
      await axios.get("http://localhost:4000/postback", {
        params: { affiliate_id: affiliateId, click_id, amount: revenue, currency: "USD" },
      });

      setMessage(`Click created with revenue $${revenue}`);
      setRevenue(""); // reset input
    } catch (err) {
      console.error(err);
      setMessage("Failed to create click + revenue");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Affiliate Click & Revenue Generator</h1>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2">Affiliate Name:</label>
          <select
            value={affiliateId}
            onChange={(e) => setAffiliateId(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value={1}>Affiliate 1</option>
            <option value={2}>Affiliate 2</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Campaign Name:</label>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value={1}>Campaign 1</option>
            <option value={2}>Campaign 2</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Revenue:</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="border px-2 py-1 rounded w-24"
          />
        </div>
      </div>

      <button
        onClick={generateClickWithRevenue}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
      >
        Generate Click & Revenue
      </button>

      {message && <p className="text-lg mt-4">{message}</p>}
    </main>
  );
}
