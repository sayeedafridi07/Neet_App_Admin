import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import Icon from "../../common/Icon";

const KPICards = ({ data }) => {
  const navigate = useNavigate();
  const { isSuperAdmin } = usePermissions();
  
  const num = (v) =>
    typeof v === "number" ? v : (v?.total ?? v?.count ?? 0);
  const formatINR = (paise = 0) =>
    `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const kpiCardsConfig = [
    {
      title: "Total Students",
      value: num(data?.users),
      subText: `${data?.users?.newThisMonth ?? 0} new this month`,
      route: "students",
    },
    ...(isSuperAdmin
      ? [
          {
            title: "Total Admins",
            value: num(data?.admins),
            route: "admins",
          },
        ]
      : []),
    {
      title: "Active Subscribers",
      value: num(data?.activeSubscribers),
      route: "/",
    },
    {
      title: "Quiz Attempts",
      value: num(data?.quizAttempts),
      route: "/",
    },
    {
      title: "Revenue",
      value: formatINR(data?.revenue?.total ?? data?.totalRevenue ?? 0),
      subText: `${formatINR(data?.revenue?.thisMonth ?? data?.thisMonthRevenue ?? 0)} this month`,
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

            {card.subText && (
              <span className="text-textSecondary text-xs font-medium">
                {card.subText}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;