'use client';

import { getContract, isAddress, prepareContractCall } from "thirdweb";
import { client } from "../../client";
import { sepolia } from "thirdweb/chains";
import { CROWDFUNDING_FACTORY, CROWDFUNDING_FACTORY_ABI } from "../../constants/contracts";
import { useReadContract, useActiveAccount, useActiveWalletChain, useSendTransaction } from "thirdweb/react";
import CampaignCard from "../../components/CampaignCard";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hiddenCampaigns, setHiddenCampaigns] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("hiddenCampaigns") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hiddenCampaigns", JSON.stringify(hiddenCampaigns));
    }
  }, [hiddenCampaigns]);

  const contract = getContract({
    client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
    abi: CROWDFUNDING_FACTORY_ABI,
  });

  const { data, isLoading, refetch } = useReadContract({
    contract,
    method: "getUserCampaigns",
    params: [account?.address as string],
    enabled: !!account?.address && isAddress(account?.address) && activeChain?.id === sepolia.id,
  } as any);

  return (
    <div className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-semibold">Dashboard</p>
        <button
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
          onClick={() => setIsModalOpen(true)}
          disabled={!account?.address || !isAddress(account?.address) || activeChain?.id !== sepolia.id}
        >
          Create Campaign
        </button>
      </div>

      <p className="text-2xl font-semibold mb-4">My Campaigns:</p>
      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.length > 0 ? (
          data
            .filter((campaign: any) => !hiddenCampaigns.includes(campaign.campaignAddress.toLowerCase()))
            .map((campaign: any, index: number) => (
              <CampaignCard
                key={index}
                campaignAddress={campaign.campaignAddress}
                showAllCampaigns={true}
                onHide={(addr: string) => {
                  setHiddenCampaigns((prev) => [...prev, addr.toLowerCase()]);
                }}
              />
            ))
        ) : (
          <p>No campaigns found</p>
        )}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
          contract={contract}
        />
      )}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  refetch?: () => void;
  contract: any;
};

const CreateCampaignModal = ({ setIsModalOpen, refetch, contract }: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { mutate: sendTransaction } = useSendTransaction();
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);
  const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);

  // Get the factory contract instance
  const factoryContract = getContract({
    client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
    abi: CROWDFUNDING_FACTORY_ABI,
  });

  const handleDeployContract = async () => {
    console.log("Account:", account);
    console.log("Account Address:", account?.address);
    console.log("Is Valid Address:", account?.address ? isAddress(account.address) : false);
    console.log("Chain ID:", activeChain?.id);
    console.log("Contract Params:", {
      campaignName,
      campaignDescription,
      goalAmount,
      deadline,
      owner: account?.address,
    });

    if (!account || !account.address) {
      alert("Wallet not connected. Please connect your wallet.");
      return;
    }

    if (!isAddress(account.address)) {
      alert(`Invalid wallet address: ${account.address}. Please ensure a valid Ethereum address is connected.`);
      return;
    }

    if (activeChain?.id !== sepolia.id) {
      alert("Please switch to the Sepolia network.");
      return;
    }

    if (!campaignName || !campaignDescription) {
      alert("Please fill in campaign name and description.");
      return;
    }

    if (goalAmount <= 0) {
      alert("Goal amount must be greater than 0.");
      return;
    }

    if (deadline <= 0) {
      alert("Campaign duration must be greater than 0 days.");
      return;
    }

    setIsDeployingContract(true);

    try {
      // FIXED: Use factory contract directly with ABI - no publisher or deployment needed
      console.log("Creating campaign via factory contract...");
      
      // Convert goal amount to Wei
      const goalAmountWei = BigInt(Math.floor(goalAmount * 10 ** 18));
      
      // FIXED: Use prepareContractCall and useSendTransaction as per thirdweb documentation
      console.log("Creating campaign via factory contract...");
      
      // Prepare the contract call (goal amount in dollars, no Wei conversion)
      const transaction = prepareContractCall({
        contract,
        method: "function createCampaign(string _name, string _description, uint256 _goal, uint256 _durationInDays)",
        params: [campaignName, campaignDescription, BigInt(goalAmount), BigInt(deadline)],
      });
      
      // Send the transaction
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Campaign creation successful:", result);
          alert(`Campaign created successfully! Transaction hash: ${result.transactionHash}`);
          refetch?.();
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error("Campaign creation failed:", error);
          alert(`Failed to create campaign: ${error.message}`);
          setIsDeployingContract(false);
        }
      });
    } catch (error: any) {
      console.error("Detailed Error:", error);
      // ADDED: Enhanced error logging to help identify deployment failure causes
      console.error("Error stack:", error.stack);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
      });
      alert(`Failed to create campaign: ${error.message || "Unknown error"}`);
    } finally {
      // Don't close modal here - let the success/error callbacks handle it
      // Only reset loading state on error
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-white p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Campaign</p>
          <button
            className="text-sm px-4 py-2 bg-violet-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="flex flex-col">
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />

          <label>Campaign Description:</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Campaign Description"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />

          <label>Goal Amount (in dollars):</label>
          <input
            type="number"
            value={goalAmount || ""}
            onChange={(e) => setGoalAmount(parseFloat(e.target.value) || 0)}
            placeholder="Enter goal amount"
            min="0"
            step="0.01"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />

          <label>Campaign length (duration in days):</label>
          <input
            type="number"
            value={deadline || ""}
            onChange={(e) => setDeadline(parseInt(e.target.value) || 0)}
            placeholder="Enter number of days"
            min="0"
            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
          />
        </div>

        <button
          className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-md disabled:opacity-50 flex items-center justify-center"
          onClick={handleDeployContract}
          disabled={isDeployingContract || !account?.address || !isAddress(account?.address) || activeChain?.id !== sepolia.id}
        >
          {isDeployingContract ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Campaign...
            </>
          ) : (
            "Create Campaign"
          )}
        </button>
      </div>
    </div>
  );
};