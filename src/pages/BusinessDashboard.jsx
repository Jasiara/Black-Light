import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProfileCompletion from '../components/dashboard/ProfileCompletion';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import PromotionsCard from '../components/dashboard/PromotionsCard';
import ReviewsCard from '../components/dashboard/ReviewsCard';
import LocalInsights from '../components/dashboard/LocalInsights';
import MessagesCard from '../components/dashboard/MessagesCard';
import GrowthTips from '../components/dashboard/GrowthTips';
import CommunitySpotlight from '../components/dashboard/CommunitySpotlight';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  return (
    <DashboardLayout activeTab="dashboard">
      <div className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <ProfileCompletion completionPercentage={70} />
        </section>

        {/* Performance Overview */}
        <section className="overview-section">
          <PerformanceOverview />
        </section>

        {/* Promotions & Reviews */}
        <section className="promotions-reviews-section">
          <PromotionsCard />
          <ReviewsCard />
        </section>

        {/* Local Insights */}
        <section className="insights-section">
          <LocalInsights />
        </section>

        {/* Messages */}
        <section className="messages-section">
          <MessagesCard />
        </section>

        {/* Growth Tips */}
        <section className="growth-section">
          <GrowthTips />
        </section>

        {/* Community Spotlight */}
        <section className="community-section">
          <CommunitySpotlight />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
