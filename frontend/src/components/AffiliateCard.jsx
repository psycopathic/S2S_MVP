"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const AffiliateCard = ({ id }) => {
  const [affiliateData, setAffiliateData] = useState({ clicks: [], conversions: [] });
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch clicks & conversions for selected affiliate
  const fetchData = async (affiliateId) => {
    if (!affiliateId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/affiliate/${affiliateId}`);
      const data = res.data;

      // Ensure clicks & conversions arrays exist
      setAffiliateData({
        clicks: Array.isArray(data.clicks) ? data.clicks : [],
        conversions: Array.isArray(data.conversions) ? data.conversions : [],
      });

      // Calculate total revenue
      const total = (data.conversions || []).reduce(
        (sum, conv) => sum + parseFloat(conv.amount || 0),
        0
      );
      setTotalRevenue(total*87.46);
    } catch (error) {
      console.error(error);
      setAffiliateData({ clicks: [], conversions: [] });
      setTotalRevenue(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  if (loading) return <p className="text-center">Loading affiliate data...</p>;
  if (!id) return <p className="text-center">No affiliate selected.</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Affiliate Postback URLs</h1>
      <p className="mb-4 font-semibold">Total Revenue: Rs.{totalRevenue.toFixed(2)}</p>

      {affiliateData.clicks.length === 0 ? (
        <p>No clicks found for this affiliate.</p>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {affiliateData.clicks.map((click) => {
            // Find the conversion amount for this click (if any)
            const conv = affiliateData.conversions.find(c => c.click_id === click.click_id);
            const amount = conv ? conv.amount : 0;
            const currency = "Rupees"; // or dynamically set

            return (
              <div key={click.id} className="border p-4 rounded bg-gray-50">
                <p className="font-semibold mb-1">Click ID: {click.click_id}</p>
                <code className="text-blue-600 break-all">
                  https://affiliate-system.com/postback?affiliate_id={id}
                  &click_id={click.click_id}&amount={amount}&currency={currency}
                </code>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AffiliateCard;
