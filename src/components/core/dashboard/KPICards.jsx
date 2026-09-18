import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import Icon from "../../common/Icon";

const KPICards = ({ data, period }) => {
  const navigate = useNavigate();
  const { isSuperAdmin } = usePermissions();
  
  const kpiCardsConfig = [
    {
      title: "Total Users",
      value: data?.users?.current || 0,
      trend: `${data?.users?.trend || 0}%`,
      trendText: `vs ${period}`,
      isPositive: data?.users?.isIncrease ?? true,
      route: "students",
    },
    ...(isSuperAdmin ? [{
      title: "Total Admins",
      value: data?.admins?.current || 0,
      trend: `${data?.admins?.trend || 0}%`,
      trendText: `vs ${period}`,
      isPositive: data?.admins?.isIncrease ?? true,
      route: "admins",
    }] : []),
    {
      title: "Total Courses",
      value: data?.courses?.current || 0,
      trend: `${data?.courses?.trend || 0}%`,
      trendText: `vs ${period}`,
      isPositive: data?.courses?.isIncrease ?? true,
      route: "/",
    },
    {
      title: "Total Programs",
      value: data?.programs?.current || 0,
      trend: `${data?.programs?.trend || 0}%`,
      trendText: `vs ${period}`,
      isPositive: data?.programs?.isIncrease ?? true,
      route: "/",
    },
    {
      title: "Quiz Attempts",
      value: data?.quizAttempts?.current || 0,
      trend: `${data?.quizAttempts?.trend || 0}%`,
      trendText: `vs ${period}`,
      isPositive: data?.quizAttempts?.isIncrease ?? true,
      route: "/",
    },
  ];

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
      {kpiCardsConfig.map((card, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            {/* Top Row: Smaller Title and Icon */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-text">
                {card.title}
              </h3>
              <button onClick={() => {
                navigate(card.route);
              }} className="w-10 h-10 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300">
                <Icon name="ArrowUpRight" size={16} />
              </button>
            </div>

            {/* Middle: Scaled down Value */}
            <div className="my-2">
              <p className="text-5xl font-bold text-primary tracking-tight">
                {card.value}
              </p>
            </div>

            {/* Bottom: Compact Trend Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-0.5 text-xs font-bold ${card.isPositive
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                <span>{card.trend}</span>
                <Icon
                  name={card.isPositive ? "TrendingUp" : "TrendingDown"}
                  size={14}
                />
              </div>
              <span className="text-textSecondary text-xs font-medium">
                {card.trendText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;