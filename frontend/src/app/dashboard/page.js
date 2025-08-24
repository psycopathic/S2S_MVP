"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [affiliateId, setAffiliateId] = useState(1);
  const [data, setData] = useState({ clicks: [], conversions: [] });
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchDashboard = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/affiliate/${id}`);
      console.log(res.data.conversions);
      setData(res.data);

      // calculate total revenue
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
    fetchDashboard(affiliateId);
  }, [affiliateId]);

  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Affiliate:</label>
        <select
          value={affiliateId}
          onChange={(e) => setAffiliateId(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value={1}>Affiliate 1</option>
          <option value={2}>Affiliate 2</option>
        </select>
      </div>

      <div className="mb-4 text-lg font-semibold">
        Total Revenue: Rs.{totalRevenue.toFixed(2)}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Clicks Table */}
          <div className="mb-6 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-2">Clicks</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Click ID</th>
                  <th className="border px-2 py-1">Campaign ID</th>
                  <th className="border px-2 py-1">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.clicks.map((click) => (
                  <tr key={click.id}>
                    <td className="border px-2 py-1">{click.click_id}</td>
                    <td className="border px-2 py-1">{click.campaign_id}</td>
                    <td className="border px-2 py-1">{click.currency}</td>
                    <td className="border px-2 py-1">
                      {new Date(click.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conversions Table */}
          <div className="w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-2">Conversions</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Click ID</th>
                  <th className="border px-2 py-1">Revenue</th>
                  <th className="border px-2 py-1">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.conversions.map((conv) => (
                  <tr key={conv.id}>
                    <td className="border px-2 py-1">{conv.click_id}</td>
                    <td className="border px-2 py-1">{conv.amount}</td>
                    <td className="border px-2 py-1">
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
