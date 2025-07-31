'use client';
import { getContract } from "thirdweb";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import { useReadContract } from "thirdweb/react";
import { CROWDFUNDING_FACTORY_ABI } from "./constants/contracts"; 
import CampaignCard from "./components/CampaignCard"; 

export default function Home() {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
    abi: CROWDFUNDING_FACTORY_ABI, 
  });

  // 3. Simplify the method and add error logging
  const { data: campaigns, isPending, error } = useReadContract({
    contract,
    method: "getAllCampaigns",
    params: [],
  });

  // 4. Add console logs for debugging
  // This will help to see the state of the data and any errors in the console.
  if (isPending) {
    console.log("Loading campaigns...");
  }
  if (error) {
    console.error("Error fetching campaigns:", error);
  }
  if (campaigns) {
    console.log("Campaigns fetched:", campaigns);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaigns</h1>
        {/* Add loading and error states to the UI */}
        {isPending && <p>Loading campaigns...</p>}
        {error && <p>Error loading campaigns. Check the console for details.</p>}
        <div className="grid grid-cols-3 gap-4">
          {!isPending && campaigns && (
            campaigns.length > 0 ? (
               campaigns.map((_campaign, index) => (
              
                <CampaignCard
                  key={index}
                  campaignAddress={_campaign.campaignAddress}
                />
            ))
          ) : (
              <p>No campaigns found</p>
            )
          )}
        </div>
      </div>
    </main>
  );
}