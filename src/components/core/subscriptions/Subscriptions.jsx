import { useState } from "react";

import TabSelector from "../../common/TabSelector";
import PaymentList from "./PaymentList";
import Plans from "./Plans";
import SubscriptionList from "./SubscriptionList";

const tabs = [
  { title: "Subscription" },
  { title: "Payments" },
  { title: "Plans" },
];

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

      {selectedTab === 0 && <SubscriptionList />}
      {selectedTab === 1 && <PaymentList />}
      {selectedTab === 2 && <Plans />}
    </div>
  );
}

export default Subscriptions;
