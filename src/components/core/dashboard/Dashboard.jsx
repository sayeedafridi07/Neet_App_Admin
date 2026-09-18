import ChartCard from "../charts/ChartCard";
import CustomAreaChart from "../charts/CustomAreaChart";
import CustomBarChart from "../charts/CustomBarChart";
import CustomDonutChart from "../charts/CustomDonutChart";
import KPICards from "./KPICards";

const Dashboard = () => {
  const data = {
    period: "last month",
    kpis: {
      users: { current: 1248, trend: 12.5, isIncrease: true },
      admins: { current: 18, trend: 4.2, isIncrease: true },
      courses: { current: 36, trend: 8.7, isIncrease: true },
      programs: { current: 24, trend: 6.4, isIncrease: true },
      quizAttempts: { current: 4820, trend: 15.8, isIncrease: true },
    },
    userDistribution: [
      { name: "Active Users", value: 986 },
      { name: "Inactive Users", value: 262 },
    ],
  };

  const userDistributionData = [
    ...data.userDistribution,
  ];

  const userGrowth = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 210 },
    { name: "Mar", value: 240 },
    { name: "Apr", value: 260 },
    { name: "May", value: 300 },
    { name: "Jun", value: 340 },
    { name: "Jul", value: 410 },
  ];

  const dau = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 60 },
    { name: "Wed", value: 72 },
    { name: "Thu", value: 70 },
    { name: "Fri", value: 90 },
    { name: "Sat", value: 120 },
    { name: "Sun", value: 145 },
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
          <KPICards data={data?.kpis} period={data?.period} />
        </div>

        <ChartCard
          className="col-span-1 lg:col-span-4"
          title="User Growth Over Time"
        >
          <CustomAreaChart data={userGrowth} color="var(--color-primary)" />
        </ChartCard>

        <ChartCard
          className="col-span-1 lg:col-span-2"
          title="Daily Active Users"
        >
          <CustomBarChart data={dau} color="var(--color-secondary)" />
        </ChartCard>

        <ChartCard
          className="col-span-1 lg:col-span-2"
          title="Active vs Inactive Users"
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
