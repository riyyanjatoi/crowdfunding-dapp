'use client';
import { getContract } from "thirdweb";
import { useParams } from "next/navigation"; 
import { client } from "../../client"; 
import { sepolia } from "thirdweb/chains";
import { CAMPAIGN_ABI } from "../../constants/contracts"; 
import { lightTheme, useActiveAccount, useReadContract } from "thirdweb/react";
import TierCard from "../../components/TierCard";
import { useState } from "react";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"



export default function CampaignPage() {
    const account = useActiveAccount();
    const { campaignAddress } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress as string, 
        abi: CAMPAIGN_ABI, 
    });

    const { data: campaignName, isPending: isPendingName } = useReadContract({
            contract,
            method: "name",
            params: [],
    });
        
    const { data: campaignDescription, isPending: isPendingDescription } = useReadContract({
            contract,
            method: "description",
            params: [],
    });
    
    const { data: goalAmount, isPending: isPendingGoal } = useReadContract({
            contract,
            method: "goalAmount",
            params: [],
    });

    const { data: campainDeadline, isPending: isPendingDeadline } = useReadContract({
            contract,
            method: "deadline",
            params: [],
    });

    const deadLineDate = new Date(parseInt(campainDeadline?.toString() as string) * 1000);
    const dealineDatePassed = deadLineDate < new Date();

    const { data: balance, isPending: isPendingBalance } = useReadContract({
        contract,
        method: "getContractBalance",
        params: [],
    });

    const calculatePercentage = () => {
        if (!balance || !goalAmount) {
            return 0; // Return 0 if data is not yet loaded
        }
        const balanceBigInt = BigInt(balance.toString());
        const goalBigInt = BigInt(goalAmount.toString());

        if (goalBigInt === 0n) {
            return 100; // Avoid division by zero
        }
        
        const percentage = Number((balanceBigInt * 100n) / goalBigInt);
        return percentage > 100 ? 100 : percentage;
    };

    const balancePercentage = calculatePercentage();
    const isDataLoading = isPendingName || isPendingDescription || isPendingGoal || isPendingDeadline || isPendingBalance;
    
    const { data: tiers, isPending: isPendingTiers } = useReadContract({
    contract,
    method: "getTiers",
    params: [],
    });

    const { data: owner, isPending: isPendinOwner } = useReadContract({
    contract,
    method: "owner",
    params: [],
    });

    const { data: state, isPending: isPendingState } = useReadContract({
    contract,
    method: "state",
    params: [],
    });

    return (
        <div className = "mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center">
                {!isPendingName && (
                    <p className="text-4xl font-semibold">{campaignName}</p>
                )}
                {owner === account?.address && (
                    <div className="flex flex-row">
                        <button className="px-4 py-2 bg-violet-500 text-white rounded-md" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Done" : "Edit Campaign"}
                        
                        </button>
                    </div>
                )} 
            </div>
            <div className="mt-4">
                <p className="text-lg font-semibold">Description</p>
                <p className="text-gray-600">{campaignDescription}</p>
            </div>
            <div className="mb-4">
                <p className="text-lg font-semibold mt-4">Deadline</p>
                {!isPendingDeadline && (
                    <p>{deadLineDate.toDateString()}</p>
                )}
            </div>
             {!isPendingBalance && (
                <div className="mb-4">
                    <p className="text-lg font-semibold">Campaign Goal: ${goalAmount?.toString()}</p>
                    <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 mb-4">
                        <div className="h-6 bg-green-600 rounded-full dark:bg-green-500 text-right" style={{ width: `${balancePercentage?.toString()}%`}}>
                            <p className="text-white dark:text-white text-xs p-1">${balance?.toString()}</p>
                        </div>
                        <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
                            {balancePercentage >= 100 ? "" : `${balancePercentage?.toString()}%`}
                        </p>
                    </div>
                </div>
                
            )}

            <div className="">
                <p className = "text-lg font-semibold">Tiers</p>
                <div className="grid grid-cols-3 gap-4">
                    {isPendingTiers ? (
                        <p>Loading...</p>
                    ) : (
                        tiers && tiers.length > 0 ? (
                            tiers.map((tier, index) => (
                                <TierCard
                                    key={index}
                                    tier={tier}
                                    index={index}
                                    campaignAddress={campaignAddress as string}
                                    isEditing={isEditing}
                                />
                            ))

                        ) : (
                            !isEditing ? (
                                <p>No Tiers Available.</p>
                            ) : null
                        )
                    )}
                    { isEditing && (
                        <button className="max-w-sm flex flex-col text-center justify-center items-center font-semibold p-6 bg-violet-500 text-white rounded-md" onClick ={() => setIsModalOpen(true)}>
                           + Add Tier
                        </button>
                    )}


                </div>
            </div>
            {isModalOpen && (
                <CreateTierModal setIsModalOpen={setIsModalOpen} campaignAddress={campaignAddress as string} />
            )}

        </div>
    )
    

}

type CreateTierModalProps = {
    setIsModalOpen: (isOpen: boolean) => void;
    campaignAddress: string;
};

const CreateTierModal = ({ setIsModalOpen, campaignAddress }: CreateTierModalProps) => {
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<bigint>(1n);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Create a Funding Tier </p>
                    <button className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
                <div className="flex flex-col">
                    <label>Tier Name: </label>
                        <input 
                             type="text"
                             value= {tierName}
                             onChange= {(e) => setTierName(e.target.value)} 
                             placeholder="Tier Name"
                             className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <label>Tier Cost: </label>
                        <input 
                            type="number"
                            value= {tierAmount.toString()}
                            onChange= {(e) => setTierAmount(BigInt(e.target.value))} 
                            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <TransactionButton
                        transaction={async () => prepareContractCall({
                                contract,
                                method: "addTier",
                                params: [tierName, tierAmount],
                            })
                        }
                        onTransactionConfirmed={async () => {
                            alert("Tier created successfully!")
                            setIsModalOpen(false)
                        }}
                        theme={lightTheme()}
                    >
                        Add Tier
                    </TransactionButton>
                </div>
            </div>  
        </div>
    )
}