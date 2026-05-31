"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CommunityBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-5%", "10%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["3%", "-8%"]);

  return (
    <div ref={ref} className="overflow-hidden py-20 select-none bg-[#0D1425]">
      <motion.p
        style={{ x: x1 }}
        className="font-serif text-[13vw] leading-none tracking-tight text-[#F4F5F8] whitespace-nowrap text-center"
      >
        Hilf der
      </motion.p>
      <motion.p
        style={{ x: x2 }}
        className="font-serif text-[13vw] leading-none tracking-tight italic text-[#E8553E] whitespace-nowrap text-center"
      >
        Community
      </motion.p>
      <motion.p
        style={{ x: x3 }}
        className="font-serif text-[13vw] leading-none tracking-tight text-[#F0A500] whitespace-nowrap text-center"
      >
        Hilf der
      </motion.p>
    </div>
  );
}
