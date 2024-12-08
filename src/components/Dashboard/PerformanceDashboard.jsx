import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import BulletChart from './BulletChart';
import { 
  Target, 
  Users, 
  Send, 
  UserCheck, 
  Building2, 
  Trophy,
  Clock
} from 'lucide-react';

// KPI targets based on industry standards
const KPI_TARGETS = {
  cvsSourced: 50,
  screeningsConducted: 25,
  submissionsToClients: 15,
  inHouseInterviews: 10,
  clientInterviews: 5,
  placementsMade: 2,
  timeToFill: 30
};

const getOverallScore = (metrics) => {
  const kpis = Object.keys(KPI_TARGETS);
  const scores = kpis.map(kpi => {
    const actual = metrics[kpi];
    const target = KPI_TARGETS[kpi];
    return Math.min((actual / target) * 100, 100); // Cap at 100%
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getImprovementSuggestions = (metrics) => {
  const suggestions = [];
  
  Object.entries(KPI_TARGETS).forEach(([kpi, target]) => {
    const actual = metrics[kpi];
    const percentage = (actual / target) * 100;
    
    if (percentage < 70) {
      const increase = Math.ceil(target - actual);
      const readableKpi = kpi.replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase());
        
      suggestions.push({
        kpi: readableKpi,
        message: `Increase ${readableKpi} by ${increase} to meet the target of ${target}.`
      });
    }
  });
  
  return suggestions;
};

const PerformanceDashboard = ({ weeklyMetrics, selectedWeek }) => {
  const [selectedView, setSelectedView] = useState('overview');
  const overallScore = getOverallScore(weeklyMetrics);
  const suggestions = getImprovementSuggestions(weeklyMetrics);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <BulletChart
              title="CVs Sourced"
              actual={weeklyMetrics.cvsSourced}
              target={KPI_TARGETS.cvsSourced}
              maxValue={75}
              icon={Target}
            />
            <BulletChart
              title="Screenings"
              actual={weeklyMetrics.screeningsConducted}
              target={KPI_TARGETS.screeningsConducted}
              maxValue={40}
              icon={Users}
            />
            <BulletChart
              title="Client Submissions"
              actual={weeklyMetrics.submissionsToClients}
              target={KPI_TARGETS.submissionsToClients}
              maxValue={25}
              icon={Send}
            />
            <BulletChart
              title="In-House Interviews"
              actual={weeklyMetrics.inHouseInterviews}
              target={KPI_TARGETS.inHouseInterviews}
              maxValue={15}
              icon={UserCheck}
            />
            <BulletChart
              title="Client Interviews"
              actual={weeklyMetrics.clientInterviews}
              target={KPI_TARGETS.clientInterviews}
              maxValue={10}
              icon={Building2}
            />
            <BulletChart
              title="Placements"
              actual={weeklyMetrics.placementsMade}
              target={KPI_TARGETS.placementsMade}
              maxValue={5}
              icon={Trophy}
            />
            <BulletChart
              title="Time to Fill"
              actual={weeklyMetrics.timeToFill}
              target={KPI_TARGETS.timeToFill}
              maxValue={45}
              icon={Clock}
              unit=" days"
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Weekly Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">Overall Performance Score</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          overallScore >= 90 ? "bg-black" :
                          overallScore >= 70 ? "bg-yellow-500" :
                          "bg-gray-300"
                        )}
                        style={{ width: `${overallScore}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(overallScore)}%
                  </span>
                </div>
              </div>

              {/* Areas for Improvement */}
              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-600">Recommended Actions</h3>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-yellow-500" />
                        <p className="text-sm text-gray-600">{suggestion.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {Object.entries(weeklyMetrics).some(([kpi, value]) => 
                value >= KPI_TARGETS[kpi]
              ) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-600">Achievements</h3>
                  <div className="space-y-2">
                    {Object.entries(weeklyMetrics)
                      .filter(([kpi, value]) => value >= KPI_TARGETS[kpi])
                      .map(([kpi, value], index) => {
                        const readableKpi = kpi.replace(/([A-Z])/g, ' $1')
                          .toLowerCase()
                          .replace(/^./, str => str.toUpperCase());
                        const percentage = Math.round((value / KPI_TARGETS[kpi]) * 100);
                        
                        return (
                          <div 
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-black" />
                            <p className="text-sm text-gray-600">
                              {readableKpi}: Achieved {percentage}% of target
                            </p>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
