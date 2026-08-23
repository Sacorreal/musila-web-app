"use client";

import { motion } from "framer-motion";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { cn } from "@/src/shared/libs/cn";

interface HealthScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
  className?: string;
}

function tone(score: number): { stroke: string; text: string } {
  if (score >= 80) return { stroke: "#10b981", text: "text-emerald-500" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-500" };
  return { stroke: "#f43f5e", text: "text-rose-500" };
}

/** Gráfico de progreso circular (Health Score) sobre `recharts`, sin precedente previo en el repo. */
export function HealthScoreGauge({ score, label, size = 140, className }: HealthScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const { stroke, text } = tone(clamped);
  const data = [{ value: clamped }];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ? `${label}: ` : ""}${Math.round(clamped)}% completado`}
    >
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius="72%"
        outerRadius="100%"
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: "var(--muted)" }}
          dataKey="value"
          cornerRadius={999}
          isAnimationActive
          animationDuration={800}
          fill={stroke}
        />
      </RadialBarChart>
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className={cn("text-2xl font-black tabular-nums", text)}>{Math.round(clamped)}%</span>
        {label && <span className="max-w-[80px] text-center text-[11px] leading-tight text-muted-foreground">{label}</span>}
      </motion.div>
    </div>
  );
}
