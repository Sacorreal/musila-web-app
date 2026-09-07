import React from 'react';
import { motion } from 'framer-motion';
import { GuestManagementList } from '@/src/domains/guests/components/GuestManagementList';

export function GuestManagementPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5"
    >
      <GuestManagementList />
    </motion.div>
  );
}
