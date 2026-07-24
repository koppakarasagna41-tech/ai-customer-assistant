import React from 'react';
import { Users, Activity, ShieldCheck, Server, Database, TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { StatMetric } from '../../types/dashboard';
import { Card, CardContent } from '../ui/Card';
import { StatCardSkeleton } from '../ui/Skeleton';

interface StatCardsProps {
  stats: StatMetric[];
  isLoading?: boolean;
}

const iconMap = {
  users: Users,
  activity: Activity,
  shield: ShieldCheck,
  server: Server,
  database: Database,
  dollar: DollarSign,
};

export const StatCards: React.FC<StatCardsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = iconMap[stat.iconName] || Activity;

        const isUp = stat.trend === 'up';
        const isDown = stat.trend === 'down';

        return (
          <Card key={stat.id} className="border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {stat.value}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isUp
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : isDown
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {isUp && <TrendingUp className="w-3 h-3" />}
                  {isDown && <TrendingDown className="w-3 h-3" />}
                  {!isUp && !isDown && <Minus className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {stat.period}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
