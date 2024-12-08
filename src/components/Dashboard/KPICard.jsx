import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from '../../utils/animations';

const KPICard = ({ 
  title, 
  current, 
  target, 
  previousPeriod, 
  unit = '', 
  icon: Icon,
  trend,
  achievedDate,
  isAchieved: propIsAchieved 
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const progress = Math.min((current / target) * 100, 100);
  const isAchieved = propIsAchieved ?? (current >= target);
  const trendPercentage = previousPeriod ? ((current - previousPeriod) / previousPeriod) * 100 : 0;

  useEffect(() => {
    if (isAchieved && !hasAnimated) {
      setShowCelebration(true);
      setHasAnimated(true);
      triggerConfetti().catch(console.warn);
    }
  }, [isAchieved, hasAnimated]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Achievement Badge */}
        <AnimatePresence>
          {isAchieved && (
            <motion.div
              initial={{ scale: 0, x: 50 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 50 }}
              className="absolute top-2 right-2 z-10"
            >
              <Badge className="bg-yellow-400 text-black font-semibold">
                Goal Achieved! 🎉
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Icon && (
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                </motion.div>
              )}
              <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
            </div>
            {trend && (
              <motion.div whileHover={{ y: -2 }}>
                <Badge className={trend > 0 ? 'bg-black text-white' : 'bg-gray-200 text-black'}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </Badge>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Current vs Target Display */}
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <motion.span 
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 1 }}
                animate={{ scale: showCelebration ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {current}{unit} <span className="text-sm text-gray-500">/ {target}{unit}</span>
              </motion.span>
              <span className="text-sm text-gray-500">
                {progress.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <Progress 
                value={progress} 
                className={`h-2 ${isAchieved ? 'bg-yellow-100' : 'bg-gray-100'}`}
                indicatorClassName={isAchieved ? 'bg-yellow-400' : 'bg-black'}
              />
              {isAchieved && (
                <motion.div
                  className="absolute inset-0 bg-yellow-400/20"
                  animate={{ opacity: [0.5, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* Previous Period Comparison */}
          {previousPeriod && (
            <motion.div 
              className="mt-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-600">vs Previous: </span>
              <span className={`font-medium ${trendPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trendPercentage > 0 ? '↑' : '↓'} {Math.abs(trendPercentage).toFixed(1)}%
              </span>
            </motion.div>
          )}

          {/* Achievement Date */}
          {achievedDate && (
            <div className="mt-2 text-xs text-gray-500">
              Achieved on: {new Date(achievedDate).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KPICard;
