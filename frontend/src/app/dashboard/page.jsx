"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [affiliates, setAffiliates] = useState([]);
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliateName, setAffiliateName] = useState("");
  const [data, setData] = useState({ clicks: [], conversions: [] });
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const router = useRouter();

  const fetchAffiliates = async () => {
    try {
      const res = await axios.get("http://localhost:4000/affiliate/getAll");

      // Remove duplicate affiliates based on name
      const uniqueAffiliates = res.data.filter(
        (a, index, self) =>
          index === self.findIndex((obj) => obj.name === a.name)
      );

      setAffiliates(uniqueAffiliates);
      if (!affiliateId && uniqueAffiliates.length)
        setAffiliateId(uniqueAffiliates[0].id);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch affiliates");
    }
  };

  const fetchDashboard = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/affiliate/${id}`);
      setData(res.data);

      const total = res.data.conversions.reduce(
        (sum, conv) => sum + parseFloat(conv.amount || 0),
        0
      );
      setTotalRevenue(total);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  useEffect(() => {
    if (affiliateId) fetchDashboard(affiliateId);
  }, [affiliateId]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center underline">
        Affiliate Dashboard
      </h1>

      {/* buttons  */}
       <div className="flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={() => router.push("/AffiliatePostback")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow cursor-pointer hover:bg-blue-600 transition"
        >
          Affiliate URL
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow cursor-pointer hover:bg-blue-600 transition"
        >
          HOME
        </button>
      </div>

      {/* Affiliate Selector */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6">
        <label className="block font-semibold mb-2">Choose Affiliate:</label>
        <select
          value={affiliateId}
          onChange={(e) => setAffiliateId(Number(e.target.value))}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        >
          {affiliates.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Total Revenue */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6 text-center">
        <p className="text-lg font-semibold text-gray-700">Total Revenue</p>
        <p className="text-2xl font-bold text-green-600">
          Rs. {totalRevenue.toFixed(2)}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-lg">Loading...</p>
      ) : (
        <>
          {/* Clicks Table */}
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 underline">
              Clicks
            </h2>
            <table className="w-full text-center border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Click ID</th>
                  <th className="border px-4 py-2">Campaign</th>
                  <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.clicks.map((click) => (
                  <tr key={click.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{click.click_id}</td>
                    <td className="border px-4 py-2">
                      {click.campaign_id || click.campaign_name}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(click.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conversions Table */}
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 underline">
              Conversions
            </h2>
            <table className="w-full text-center border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Click ID</th>
                  <th className="border px-4 py-2">Amount (Rs.)</th>
                  <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.conversions.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{conv.click_id}</td>
                    <td className="border px-4 py-2">{conv.amount}</td>
                    <td className="border px-4 py-2">
                      {new Date(conv.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
