"use client";
import AffiliateCard from "@/components/AffiliateCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AffiliatePostback() {
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliates, setAffiliates] = useState([]);
  const router = useRouter();

  const fetchAffiliates = async () => {
    try {
      const res = await axios.get("http://localhost:4000/affiliate/getAll");
      setAffiliates(res.data);
      if (!affiliateId && res.data.length) setAffiliateId(res.data[0].id);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch affiliates in AffiliatePostback");
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      
      {/* Dropdown Section */}
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Select an Affiliate
        </h2>
        <select
          value={affiliateId}
          onChange={(e) => setAffiliateId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        >
          {affiliates.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button Section (Centered) */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow cursor-pointer hover:bg-blue-600 transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow cursor-pointer hover:bg-blue-600 transition"
        >
          HOME
        </button>
      </div>

      {/* Links Section */}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
          All Postback Links
        </h1>
        <div className="w-full">
          <AffiliateCard id={affiliateId} />
        </div>
      </div>
    </div>
  );
}
