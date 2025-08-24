"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliateName, setAffiliateName] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [revenue, setRevenue] = useState("");
  const [message, setMessage] = useState("");

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
        const resAffiliate = await axios.post(
          "http://localhost:4000/affiliate",
          { name: affiliateName }
        );
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
        params: {
          affiliate_id: affiliateId,
          campaign_id: campaignId,
          click_id,
        },
      });

      await axios.get("http://localhost:4000/postback", {
        params: {
          affiliate_id: affiliateId,
          click_id,
          amount: revenue,
          currency: "USD",
        },
      });

      setMessage(`Click created with revenue $${revenue}`);
      setRevenue("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create click + revenue");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
        S2S - MVP
      </h1>

      {/* Dashboard button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-green-500 text-white px-6 py-2 rounded-md mb-6 shadow cursor-pointer hover:bg-green-600 transition"
      >
        Dashboard
      </button>

      {/* Form Card */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Affiliate Section */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="font-medium w-24">Affiliate:</label>
            <select
              value={affiliateId}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setAffiliateId(selectedId);

                // Auto-fill affiliateName when existing affiliate is selected
                const selectedAffiliate = affiliates.find(
                  (a) => a.id === selectedId
                );
                setAffiliateName(
                  selectedAffiliate ? selectedAffiliate.name : ""
                );
              }}
              className="border px-3 py-2 rounded w-full md:w-auto flex-1"
            >
              <option value="">Select an Existing Affiliate</option>
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
              placeholder="Enter new Affiliate"
              className="border px-3 py-2 rounded w-full md:w-64"
            />
          </div>

          {/* Campaign Section */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="font-medium w-24">Campaign:</label>
            <select
              value={campaignId}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setCampaignId(selectedId);

                // Auto-fill campaignName when an existing campaign is selected
                const selectedCampaign = campaigns.find(
                  (c) => c.id === selectedId
                );
                setCampaignName(selectedCampaign ? selectedCampaign.name : "");
              }}
              className="border px-3 py-2 rounded w-full md:w-auto flex-1"
            >
              <option value="">Select an Existing Campaign</option>
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
              placeholder="Enter new Campaign"
              className="border px-3 py-2 rounded w-full md:w-64"
            />
          </div>

          {/* Revenue Section */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="font-medium w-24">Revenue:</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Enter amount"
              className="border px-3 py-2 rounded w-full md:w-64"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition w-full md:w-auto cursor-pointer"
          >
            Generate Click & Revenue
          </button>
        </form>
      </div>

      {/* Message Box */}
      {message && (
        <div className="w-full max-w-3xl bg-gray-100 border-l-4 border-blue-500 p-4 rounded shadow text-center text-gray-800">
          {message}
        </div>
      )}
    </main>
  );
}
