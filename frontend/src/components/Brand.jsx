import React from 'react';
import { motion } from 'motion/react';

export default function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-small' : ''}`}>
    <motion.div className="brand-icon" initial={{ rotate: -18, scale: .8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} aria-hidden="true">
      <span className="brand-icon-diagonal"/><span className="brand-icon-dot"/>
    </motion.div>
    <span className="brand-word">task<span>flow</span><sup>®</sup></span>
  </div>;
}
