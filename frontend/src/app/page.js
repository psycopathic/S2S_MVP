"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for App Router
import axios from "axios";

export default function Home() {
  const router = useRouter(); // initialize router
  const [affiliates, setAffiliates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliateName, setAffiliateName] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [revenue, setRevenue] = useState("");
  const [message, setMessage] = useState("");

  // Fetch affiliates & campaigns
  const fetchAffiliates = async () => {
    const res = await axios.get("http://localhost:4000/affiliate/getAll");
    setAffiliates(res.data);
    if (!affiliateId && res.data.length) setAffiliateId(res.data[0].id);
  };

  const fetchCampaigns = async () => {
    const res = await axios.get("http://localhost:4000/campaign");
    setCampaigns(res.data);
    if (!campaignId && res.data.length) setCampaignId(res.data[0].id);
  };

  useEffect(() => {
    fetchAffiliates();
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (affiliateName) {
        const resAffiliate = await axios.post("http://localhost:4000/affiliate", {
          name: affiliateName,
        });
        await fetchAffiliates();
        setAffiliateId(resAffiliate.data.id);
        setAffiliateName("");
      }

      if (campaignName) {
        const resCampaign = await axios.post("http://localhost:4000/campaign", {
          name: campaignName,
        });
        await fetchCampaigns();
        setCampaignId(resCampaign.data.id);
        setCampaignName("");
      }

      if (!revenue) {
        alert("Enter revenue amount first");
        return;
      }

      const click_id = crypto.randomUUID();

      await axios.get("http://localhost:4000/click", {
        params: { affiliate_id: affiliateId, campaign_id: campaignId, click_id },
      });

      await axios.get("http://localhost:4000/postback", {
        params: { affiliate_id: affiliateId, click_id, amount: revenue, currency: "USD" },
      });

      setMessage(`Click created with revenue $${revenue}`);
      setRevenue("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create click + revenue");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Affiliate Click & Revenue Generator</h1>

      {/* Dashboard button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-600"
      >
        Go to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4 w-full max-w-3xl">
        {/* Affiliate dropdown + new input */}
        <div className="flex items-center gap-2">
          <label className="mr-2">Affiliate:</label>
          <select
            value={affiliateId}
            onChange={(e) => setAffiliateId(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {affiliates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={affiliateName}
            onChange={(e) => setAffiliateName(e.target.value)}
            placeholder="New Affiliate"
            className="border px-2 py-1 rounded ml-2"
          />
        </div>

        {/* Campaign dropdown + new input */}
        <div className="flex items-center gap-2">
          <label className="mr-2">Campaign:</label>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="New Campaign"
            className="border px-2 py-1 rounded ml-2"
          />
        </div>

        {/* Revenue input */}
        <div className="flex items-center gap-2">
          <label className="mr-2">Revenue:</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="border px-2 py-1 rounded w-24"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Generate Click & Revenue
        </button>
      </form>

      {message && <p className="text-lg mt-4">{message}</p>}
    </main>
  );
}
