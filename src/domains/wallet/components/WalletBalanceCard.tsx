"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Wallet, Users, User } from "lucide-react";
import { WalletBalanceDto } from "../types/wallet.types";
import { formatCOP } from "../utils/format-currency";

function AnimatedAmount({ target }: { target: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => formatCOP(Math.round(v)));

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  return <motion.span>{display}</motion.span>;
}

interface Props {
  balance?: WalletBalanceDto;
  isLoading: boolean;
}

export function WalletBalanceCard({ balance, isLoading }: Props) {
  if (isLoading || !balance) {
    return (
      <div
        className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6"
        role="status"
        aria-label="Cargando saldo"
      >
        <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
        <div className="mt-3 h-10 w-48 animate-pulse rounded bg-muted/40" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-14 w-full animate-pulse rounded-xl bg-muted/40" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-muted/40" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Saldo disponible
          </p>
          <p className="text-4xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
            <AnimatedAmount target={balance.availableBalance} />
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <Wallet className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Ingresos propios</p>
            <p className="truncate font-semibold text-foreground">{formatCOP(balance.totalEarnedOwn)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Como coautor</p>
            <p className="truncate font-semibold text-foreground">{formatCOP(balance.totalEarnedCoauthor)}</p>
          </div>
        </div>
      </div>

      {balance.totalReserved > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          {formatCOP(balance.totalReserved)} reservados en solicitudes de retiro en curso.
        </p>
      )}
    </motion.div>
  );
}
