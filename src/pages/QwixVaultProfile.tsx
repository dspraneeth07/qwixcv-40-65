
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/context/BlockchainContext';
import { useAuth } from '@/context/AuthContext';
import { getUserDocumentsByOwner } from '@/utils/blockchainDocuments';

const QwixVaultProfile = () => {
  const { account, isConnected, connectWallet, getUserQwixVaultId } = useBlockchain();
  const { user } = useAuth();
  
  // Generate the QwixVault ID based on authenticated user
  const qwixVaultId = getUserQwixVaultId(); // Get vault ID from context
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">QwixVault Profile</h1>
      
      {isConnected && account ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Status:</strong> Connected</p>
              <p className="mb-2"><strong>Address:</strong> {account}</p>
              <p className="mb-2"><strong>QwixVault ID:</strong> {qwixVaultId || 'Not assigned'}</p>
              <p><strong>Documents:</strong> {getUserDocumentsByOwner(account).length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p className="mb-2"><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="outline">View Documents</Button>
              <Button variant="outline">View Certificates</Button>
              <Button variant="outline">Manage Account</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Connect your wallet to access your QwixVault Profile.</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QwixVaultProfile;
