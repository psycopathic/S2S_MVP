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
  const [loading, setLoading] = useState(false);

  const removeDuplicates = (array, key) =>
    array.filter((item, index, self) => index === self.findIndex((i) => i[key] === item[key]));

  const fetchAffiliates = async () => {
    try {
      const res = await axios.get("http://localhost:4000/affiliate/getAll");
      const uniqueAffiliates = removeDuplicates(res.data, "id");
      setAffiliates(uniqueAffiliates);
      if (!affiliateId && uniqueAffiliates.length) setAffiliateId(uniqueAffiliates[0].id);
    } catch (err) {
      console.error("Failed to fetch affiliates", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:4000/campaign");
      const uniqueCampaigns = removeDuplicates(res.data, "id");
      setCampaigns(uniqueCampaigns);
      if (!campaignId && uniqueCampaigns.length) setCampaignId(uniqueCampaigns[0].id);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  };

  useEffect(() => {
    fetchAffiliates();
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let currentAffiliateId = affiliateId;
      let currentCampaignId = campaignId;

      // Add new affiliate if provided
      if (affiliateName.trim()) {
        const resAffiliate = await axios.post("http://localhost:4000/affiliate", {
          name: affiliateName.trim(),
        });
        currentAffiliateId = resAffiliate.data.id;
        setAffiliateId(currentAffiliateId);
        setAffiliateName("");
        await fetchAffiliates();
      }

      // Add new campaign if provided
      if (campaignName.trim()) {
        const resCampaign = await axios.post("http://localhost:4000/campaign", {
          name: campaignName.trim(),
        });
        currentCampaignId = resCampaign.data.id;
        setCampaignId(currentCampaignId);
        setCampaignName("");
        await fetchCampaigns();
      }

      if (!revenue) {
        alert("Enter revenue amount first");
        setLoading(false);
        return;
      }

      const click_id = crypto.randomUUID();

      await axios.get("http://localhost:4000/click", {
        params: { affiliate_id: currentAffiliateId, campaign_id: currentCampaignId, click_id },
      });

      await axios.get("http://localhost:4000/postback", {
        params: { affiliate_id: currentAffiliateId, click_id, amount: revenue, currency: "USD" },
      });

      setMessage(`Click created with revenue $${revenue} `);
      setRevenue("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create click + revenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">S2S - MVP</h1>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow cursor-pointer hover:bg-blue-600 transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/AffiliatePostback")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow cursor-pointer hover:bg-blue-600 transition"
        >
          Affiliate URL
        </button>
      </div>

      {/* Form */}
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
                const selectedAffiliate = affiliates.find((a) => a.id === selectedId);
                setAffiliateName(selectedAffiliate ? selectedAffiliate.name : "");
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
                const selectedCampaign = campaigns.find((c) => c.id === selectedId);
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
            disabled={loading}
            className={`px-6 py-2 rounded-md shadow transition w-full md:w-auto cursor-pointer ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Generate Click & Revenue"}
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
