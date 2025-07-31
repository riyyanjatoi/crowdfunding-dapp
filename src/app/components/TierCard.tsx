'use client';
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { TransactionButton } from "thirdweb/react";
import { CAMPAIGN_ABI } from "../constants/contracts";


type Tier = {
    name: string;
    amount: bigint; // This is the amount to be sent
    backers: bigint;
}

type TierCardProps = {
    tier: Tier;
    index: number;
    campaignAddress: string; // The address of the campaign contract
    isEditing: boolean;
}

export default function TierCard({ tier, index, campaignAddress, isEditing }: TierCardProps) {
    const contract = getContract({
        client,
        chain: sepolia,
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
    });
return (
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow-md">
        
        <div>
            <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-semibold">{tier.name}</p>
                <p className="text-xl font-semibold text-violet-600">{tier.amount.toString()}$</p>
            </div>
        </div>

        <div className="mt-4">
            <div className="flex justify-between items-center"> 
                <p className="text-sm font-semibold text-gray-600">
                    {tier.backers.toString()} Backers
                </p>
                
                <TransactionButton 
                    transaction={() => prepareContractCall({
                        contract,
                        method: "fund",
                        params: [BigInt(index)],
                        value: tier.amount 
                    })}
                    onError={(error) => alert(`Error: ${error.message}`)}
                    onTransactionConfirmed={() => alert("Funded successfully!")}
                    
                    style={{
                        
                        backgroundColor: '#7c3aed', 
                        color: 'white',
                        padding: '8px 16px', 
                        borderRadius: '0.375rem', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontWeight: 'bold', 
                    }}  
                >
                    Select
                </TransactionButton>
                
            </div>
            {isEditing && (
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract,
                        method: "removeTier",
                        params: [BigInt(index)],
                    })}
                    onError={(error) => alert(`Error: ${error.message}`)}
                    onTransactionConfirmed={() => alert("Tier removed successfully!")}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      marginTop: "1rem",
                      backgroundColor: "red",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      textAlign: "center",
                    }}  
                >
                    Remove
                </TransactionButton>
            )}
        </div>
    </div>
);
}