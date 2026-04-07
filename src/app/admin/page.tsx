"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Header from "@/components/layout/Header";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useVoting } from "@/hooks/useVoting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { isConnected, address } = useAccount();
  const [page] = useState<"admin">("admin");
  const { owner } = useVoting();
  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-muted-blue/30">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted-blue/10 border-2 border-muted-blue/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-soft-purple" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                  <p className="text-sm text-muted-blue mt-2">
                    Connect your wallet to access the admin panel.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <WalletConnectButton />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Not the contract owner
  if (!isOwner) {
    return (
      <div className="flex-1 flex flex-col">
        <Header activePage={page} onNavigate={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="text-center py-10">
                <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-muted-blue text-sm mb-2">
                  Only the contract owner can access this dashboard.
                </p>
                <p className="text-xs text-muted-blue mb-4">
                  Connected: <span className="text-yellow-500">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </p>
                {owner && (
                  <p className="text-xs text-muted-blue">
                    Owner: <span className="text-soft-purple">{owner.slice(0, 6)}...{owner.slice(-4)}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header activePage="admin" onNavigate={() => {}} />
      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-6">
        <AdminDashboard />
      </div>
    </div>
  );
}
