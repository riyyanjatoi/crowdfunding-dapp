'use client';
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { CAMPAIGN_ABI } from "../constants/contracts"; 
import Link from "next/link";
import CampaignWithdraw from "./CampaignWithdraw";
import { useRef, useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

type CampaignCardProps = {
    campaignAddress: string;
    showAllCampaigns?: boolean; // If true, show all campaigns (for dashboard). If false, only show active campaigns (for main page)
    onHide?: (address: string) => void; // callback to hide campaign in dashboard
};

enum CampaignState {
    Active,
    Successful,
    Failed
}

export default function CampaignCard({ campaignAddress, showAllCampaigns = false, onHide }: CampaignCardProps) {
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const account = useActiveAccount();
    const { mutate: sendTransaction } = useSendTransaction();
    
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress,
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

    const { data: balance, isPending: isPendingBalance } = useReadContract({
        contract,
        method: "getContractBalance",
        params: [],
    });

    const { data: owner, isPending: isPendingOwner } = useReadContract({
        contract,
        method: "owner",
        params: [],
    });

    const { data: deadline, isPending: isPendingDeadline } = useReadContract({
        contract,
        method: "deadline",
        params: [],
    });

    const { data: campaignStatus } = useReadContract({
        contract,
        method: "getCampaignStatus",
        params: [],
    });

    const [isWithdrawn, setIsWithdrawn] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(`withdrawn_${campaignAddress}`) === 'true';
    });

    useEffect(() => {
        function handler(e: StorageEvent) {
            if (e.key === `withdrawn_${campaignAddress}`) {
                setIsWithdrawn(e.newValue === 'true');
            }
        }
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [campaignAddress]);

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
    const isDataLoading = isPendingName || isPendingDescription || isPendingGoal || isPendingBalance || isPendingOwner || isPendingDeadline;

    const enumStatus = Number(campaignStatus ?? CampaignState.Active) as CampaignState;
    const isCampaignSuccessful = enumStatus === CampaignState.Successful;
    const isCampaignFailed = enumStatus === CampaignState.Failed;

    const isCampaignWithdrawn = isCampaignSuccessful && isWithdrawn;

    const isCampaignActive = enumStatus === CampaignState.Active;

    const isCampaignExpired = deadline && BigInt(deadline.toString()) < BigInt(Math.floor(Date.now() / 1000));

    // Check if description overflows one line
    useEffect(() => {
        if (descriptionRef.current && campaignDescription) {
            const element = descriptionRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setShowSeeMore(isOverflowing);
        }
    }, [campaignDescription]);

    // Check if current user is the owner
    const isOwner = account?.address && owner && account.address.toLowerCase() === owner.toLowerCase();

    // Show status badge
    const getStatusBadge = () => {
        if (isCampaignWithdrawn) {
            return (
                <span className="inline-flex items-center space-x-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                        Withdrawn
                    </span>
                </span>
            );
        }
        if (isCampaignSuccessful) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
        }
        if (isCampaignFailed || isCampaignExpired) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Active</span>;
    };

    // Handle campaign hide (completed or expired)
    const handleHideCampaign = () => {
        if (!onHide || !(isCampaignExpired || isCampaignFailed || isCampaignWithdrawn)) return;

        if (!confirm("Hide this campaign from your dashboard? You can unhide it by clearing browser storage.")) {
            return;
        }
        setIsHiding(true);
        try {
            onHide(campaignAddress);
        } finally {
            setIsHiding(false);
        }
    };

    // Don't render the card on main page if campaign is not active
    if (!showAllCampaigns && !isCampaignActive) {
        return null;
    }

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow-md">
            {isDataLoading ? (
                <p>Loading campaign details...</p>
            ) : (
                <>
                    {/* You can now display the campaign name and description */}
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold truncate">{campaignName}</h2>
                        {getStatusBadge()}
                    </div>
                    <div className="text-gray-600 mb-4">
                        <div className="relative">
                            <p 
                                ref={descriptionRef}
                                className="line-clamp-1 overflow-hidden"
                            >
                                {campaignDescription}
                            </p>
                            {showSeeMore && (
                                <div className="mt-2">
                                    <Link 
                                        href={`/campaign/${campaignAddress}`}
                                        className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                                    >
                                        See more
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                                <div className="h-6 bg-green-600 rounded-full dark:bg-green-500 text-right" style={{ width: `${isCampaignSuccessful ? 100 : balancePercentage}%` }}>
                                    <span className="text-white text-xs font-semibold p-1">
                                        {/* Show Completed when goal reached */}
                                        {isCampaignSuccessful ? 'Completed' : `${balance?.toString()}$`}
                                    </span>
                                </div>
                                {(!isCampaignSuccessful && balancePercentage < 100) && (
                                    <p className="absolute top-0 right-2 text-gray-700 dark:text-white text-xs p-1 font-semibold">
                                        {balancePercentage}%
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                                {goalAmount?.toString()}$
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Link  
                            href={`/campaign/${campaignAddress}`}
                            passHref={true}>
                                <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">
                                    View Campaign
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>
                                </p> 
                            </Link>
                            
                            {/* Show hide button for expired or completed campaigns in dashboard (can't hide active) */}
                            {showAllCampaigns && (isCampaignExpired || isCampaignFailed || isCampaignWithdrawn) && onHide && (
                                <button
                                    onClick={handleHideCampaign}
                                    disabled={isHiding}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#722F37] rounded-lg hover:bg-[#5a232b] focus:ring-4 focus:outline-none focus:ring-[#5a232b] disabled:opacity-50"
                                >
                                    {isHiding ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Hiding...
                                        </>
                                    ) : (
                                        "Hide"
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Compact withdraw button for owner to avoid stretching card */}
                        {isOwner && <CampaignWithdraw campaignAddress={campaignAddress} compact />}
                    </div>
                </>
            )}
        </div>
    );
}