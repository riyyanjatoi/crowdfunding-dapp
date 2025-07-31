'use client';

// React and Thirdweb hooks
import { useState, useEffect, useMemo } from "react";
import { getContract } from "thirdweb";
import { useActiveAccount, useReadContract, TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb/transaction";
// Project-specific imports
import { client } from "../client"; // Adjust path as needed
import { sepolia } from "thirdweb/chains"; // Adjust path as needed
import { CAMPAIGN_ABI } from "../constants/contracts"; // The individual campaign ABI
// The 'ethers' library
import { ethers } from "ethers";


// Component's props definition
type CampaignWithdrawProps = {
    campaignAddress: string;
    compact?: boolean; // when true, render a minimal button-only version (for dashboard cards)
};

// Enum to make campaign state more readable
enum CampaignState {
    Active,
    Successful,
    Failed
}

export default function CampaignWithdraw({ campaignAddress, compact = false }: CampaignWithdrawProps) {
    const account = useActiveAccount();
    const [ethPriceInUsd, setEthPriceInUsd] = useState<number | null>(null);

    const campaignContract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
    });

    const { data: owner } = useReadContract({ contract: campaignContract, method: "owner" });
    const { data: campaignState } = useReadContract({ contract: campaignContract, method: "getCampaignStatus" });
    const { data: balanceInWei, refetch: refetchBalance } = useReadContract({ contract: campaignContract, method: "getContractBalance" });

    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                if (data.ethereum?.usd) {
                    setEthPriceInUsd(data.ethereum.usd);
                }
            } catch (error) {
                console.error("Failed to fetch ETH price:", error);
            }
        };
        fetchEthPrice();
    }, []);

    const isOwner = account && owner && account.address.toLowerCase() === owner.toLowerCase();
    const isSuccessful = campaignState === CampaignState.Successful;
    const hasBalance = balanceInWei && balanceInWei > 0n;

    // Memoized balance calculations to avoid recomputation on every render
    const balanceInEth = useMemo(
        () => balanceInWei ? Number(ethers.formatEther(balanceInWei)) : 0,
        [balanceInWei]
    );

    const balanceInUsd = useMemo(
        () => ethPriceInUsd ? (balanceInEth * ethPriceInUsd).toFixed(2) : "0.00",
        [balanceInEth, ethPriceInUsd]
    );

    // Show nothing unless all conditions are met
    if (!isOwner || !isSuccessful || !hasBalance) {
        return null;
    }

    const button = (
        <TransactionButton
            transaction={() => {
                return prepareContractCall({
                    contract: campaignContract,
                    method: "withdraw",
                    params: [],
                });
            }}
            onTransactionConfirmed={() => {
                alert("Withdrawal successful!");
                refetchBalance();
            }}
            onError={(error) => {
                alert(`Withdrawal failed: ${error.message}`);
            }}
            style={{
                backgroundColor: '#16A34A',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
            }}
        >
            Withdraw ${balanceInUsd}
        </TransactionButton>
    );

    if (compact) {
        return <div className="mt-4">{button}</div>;
    }

    return (
        <div className="mt-8 p-6 bg-green-100 border border-green-400 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-800">Admin Action: Withdraw Funds</h3>
            <p className="text-green-700 mt-2 mb-4">
                Congratulations! Your campaign was successful. You can now withdraw the collected funds.
            </p>
            {button}
        </div>
    );
}