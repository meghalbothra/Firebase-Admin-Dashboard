import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, AlertTriangle, ChevronDown } from 'lucide-react';

const Layout = ({ children, fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-6">
      {children}
    </div>
  );
};

const AlertConfiguration = ({ fullPage = false }) => {
  const [isAlertEnabled, setIsAlertEnabled] = useState(true);
  const [threshold, setThreshold] = useState("1");
  const [percentile, setPercentile] = useState("85");
  const [isFocused, setIsFocused] = useState(false);

  const percentiles = [
    { value: "50", label: "50th percentile" },
    { value: "75", label: "75th percentile" },
    { value: "85", label: "85th percentile" },
    { value: "90", label: "90th percentile" },
    { value: "95", label: "95th percentile" }
  ];

  const Switch = ({ checked, onCheckedChange }) => (
    <motion.div
      className={`relative inline-flex items-center h-7 rounded-full w-14 cursor-pointer transition-colors duration-200 ease-in-out ${
        checked ? 'bg-blue-500' : 'bg-slate-600'
      }`}
      onClick={() => onCheckedChange(!checked)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="inline-block w-5 h-5 transform rounded-full bg-white shadow-lg"
        animate={{ x: checked ? '28px' : '4px' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.div>
  );

  const Select = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <motion.div
          className="border border-slate-600/50 bg-slate-800/90 rounded-lg px-4 py-2.5 text-white cursor-pointer flex items-center justify-between min-w-[200px]"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.9)' }}
          animate={{ borderColor: isOpen ? 'rgba(59, 130, 246, 0.5)' : 'rgba(71, 85, 105, 0.5)' }}
        >
          <span className="text-gray-200">for the {value}th percentile</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bg-slate-800 border border-slate-600/50 rounded-lg mt-2 w-full z-10 overflow-hidden shadow-xl backdrop-blur-lg"
            >
              {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  onClick: () => {
                    onValueChange(child.props.value);
                    setIsOpen(false);
                  },
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SelectItem = ({ value, children, onClick }) => (
    <motion.div
      onClick={onClick}
      className="px-4 py-2.5 cursor-pointer text-gray-200"
      whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${!fullPage ? 'max-w-2xl' : ''} bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-slate-700/50`}
    >
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-blue-500/10 rounded-xl"
        >
          <AlertTriangle className="w-6 h-6 text-blue-400" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Alert Configuration</h2>
      </div>

      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center justify-between bg-slate-700/20 p-5 rounded-xl backdrop-blur-sm border border-slate-600/30"
          whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Bell className="w-5 h-5 text-blue-400" />
            </motion.div>
            <span className="text-gray-200 text-lg">Duration Alert</span>
          </div>
          <Switch
            checked={isAlertEnabled}
            onCheckedChange={setIsAlertEnabled}
          />
        </motion.div>

        <AnimatePresence>
          {isAlertEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div 
                className="flex items-center gap-6 bg-slate-700/10 p-5 rounded-xl border border-slate-600/30"
                whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.2)' }}
              >
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="relative flex items-center gap-4 flex-wrap">
                  <motion.div
                    animate={{ scale: isFocused ? 1.02 : 1 }}
                    className="relative"
                  >
                    <motion.input
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-28 bg-slate-800 border border-slate-600/50 rounded-lg px-4 py-2.5 text-right text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-shadow duration-200"
                      min="0"
                    />
                    <span className="ml-3 text-gray-400 text-lg">sec</span>
                  </motion.div>
                  <Select value={percentile} onValueChange={setPercentile}>
                    {percentiles.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        for the {p.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 bg-blue-500/10 rounded-xl border border-blue-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">
                    Alert will trigger when duration exceeds {threshold} seconds at the {percentile}th percentile
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  return <Layout fullPage={fullPage}>{content}</Layout>;
};

export default AlertConfiguration;