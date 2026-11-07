import { CreditCard, Receipt } from "lucide-react";
import { useState } from "react";

import TabSelector from "../../common/TabSelector";
import Plans from "./Plans";

const tabs = [
  { title: "Subscription" },
  { title: "Payments" },
  { title: "Plans" },
];

function ComingSoon({ icon: IconComp, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
      <IconComp className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
      <h3 className="text-text text-lg font-medium sm:text-xl">{title}</h3>
      <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function Subscriptions() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <h1 className="font-roboto text-text mb-6 text-xl font-semibold md:text-3xl">
        Subscriptions
      </h1>

      <div className="mb-6 overflow-x-auto">
        <TabSelector
          options={tabs}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </div>

      {selectedTab === 0 && (
        <ComingSoon
          icon={CreditCard}
          title="No Subscriptions Yet"
          description="Student subscriptions will appear here."
        />
      )}
      {selectedTab === 2 && <Plans />}
      {selectedTab === 1 && (
        <ComingSoon
          icon={Receipt}
          title="No Payments Yet"
          description="Payment transactions will appear here."
        />
      )}
    </div>
  );
}

export default Subscriptions;
