import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";

import {
  getActiveUsers,
  getDashboardOverview,
  getUserTrends,
} from "../../../services/operations/dashboardAPI";
import ChartCard from "../charts/ChartCard";
import CustomAreaChart from "../charts/CustomAreaChart";
import CustomBarChart from "../charts/CustomBarChart";
import CustomDonutChart from "../charts/CustomDonutChart";
import KPICards from "./KPICards";

const ACTIVE_DAYS = 30;
const INACTIVE_AFTER_DAYS = 30;

const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: overviewRes } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
  });

  const { data: trendsRes } = useQuery({
    queryKey: ["dashboard", "user-trends", year],
    queryFn: () => getUserTrends({ year }),
  });

  const { data: activeRes } = useQuery({
    queryKey: ["dashboard", "active-users", ACTIVE_DAYS, INACTIVE_AFTER_DAYS],
    queryFn: () =>
      getActiveUsers({
        days: ACTIVE_DAYS,
        inactiveAfterDays: INACTIVE_AFTER_DAYS,
      }),
  });

  const overview = overviewRes?.data || {};
  const trends = trendsRes?.data || {};
  const active = activeRes?.data || {};

  const availableYears = trends.availableYears || trends.years || [year];

  const userGrowth = (trends.monthly || trends.months || []).map((m) => ({
    name: m.monthName || moment().month((m.month ?? 1) - 1).format("MMM"),
    value: m.newUsers ?? 0,
  }));

  const dau = (active.series || active.daily || []).map((d) => ({
    name: moment(d.date).format("DD MMM"),
    value: d.activeUsers ?? d.count ?? 0,
  }));

  const users = overview.users || {};
  const userDistributionData = [
    { name: "Active Students", value: users.active ?? 0 },
    { name: "Inactive Students", value: users.inactive ?? 0 },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="col-span-1 lg:col-span-4">
          <KPICards data={overview} />
        </div>

        <ChartCard
          className="col-span-1 lg:col-span-4"
          title={
            <span className="flex items-center justify-between gap-4">
              <span>New Students per Month</span>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </span>
          }
        >
          <CustomAreaChart data={userGrowth} color="var(--color-primary)" />
        </ChartCard>

        <ChartCard
          className="col-span-1 lg:col-span-2"
          title={`Daily Active Students (last ${ACTIVE_DAYS} days)`}
        >
          <CustomBarChart data={dau} color="var(--color-secondary)" />
        </ChartCard>

        <ChartCard
          className="col-span-1 lg:col-span-2"
          title="Active vs Inactive Students"
        >
          <CustomDonutChart
            data={userDistributionData}
            colors={["var(--color-primary)", "var(--color-secondary)"]}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
