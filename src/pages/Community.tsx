import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Users,
  Trophy,
  Heart,
  Share2,
  Clock,
  Star,
} from "lucide-react";
import { communityAPI } from "../utils/api";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  subject: string;
  replies: any[];
  likes: string[];
  views: number;
  createdAt: string;
}

interface StudyGroup {
  _id: string;
  name: string;
  description: string;
  subject: string;
  members: any[];
  maxMembers: number;
  activityLevel: string;
  creator: {
    name: string;
  };
}

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallbackDiscussions = [
    {
      _id: "1",
      title: "Need help with Quadratic Equations",
      content: "I'm struggling with understanding the discriminant in quadratic equations. Can someone explain it in simple terms?",
      author: { name: "Alex Chen" },
      subject: "Mathematics",
      replies: [],
      likes: [],
      views: 24,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "2",
      title: "Photosynthesis experiment results",
      content: "Just completed the photosynthesis experiment. Here are my observations and some questions about the process.",
      author: { name: "Sarah Johnson" },
      subject: "Science",
      replies: [],
      likes: [],
      views: 18,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "3",
      title: "Tips for memorizing historical dates",
      content: "What are your best strategies for remembering important dates in history? I've tried several methods but...",
      author: { name: "Mike Rodriguez" },
      subject: "Social Science",
      replies: [],
      likes: [],
      views: 32,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const fallbackStudyGroups = [
    {
      _id: "1",
      name: "Math Masters",
      description: "Collaborative problem-solving and concept discussions",
      subject: "Mathematics",
      members: Array(45).fill({}),
      maxMembers: 50,
      activityLevel: "Very Active",
      creator: { name: "John Doe" },
    },
    {
      _id: "2",
      name: "Science Explorers",
      description: "Experiment sharing and scientific discussions",
      subject: "Science",
      members: Array(38).fill({}),
      maxMembers: 50,
      activityLevel: "Active",
      creator: { name: "Jane Smith" },
    },
  ];

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === "discussions") {
          try {
            const response = await communityAPI.getDiscussions();
            if (response.data.success && response.data.data.length > 0) {
              setDiscussions(response.data.data);
            } else {
              setDiscussions(fallbackDiscussions);
            }
          } catch (error) {
            console.error('Error fetching discussions:', error);
            setDiscussions(fallbackDiscussions);
          }
        } else if (activeTab === "groups") {
          try {
            const response = await communityAPI.getStudyGroups();
            if (response.data.success && response.data.data.length > 0) {
              setStudyGroups(response.data.data);
            } else {
              setStudyGroups(fallbackStudyGroups);
            }
          } catch (error) {
            console.error('Error fetching study groups:', error);
            setStudyGroups(fallbackStudyGroups);
          }
        }
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [activeTab]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "Very Active":
        return "text-green-600 bg-green-100";
      case "Active":
        return "text-blue-600 bg-blue-100";
      case "Moderate":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const tabs = [
    {
      id: "discussions",
      label: "Discussions",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      id: "groups",
      label: "Study Groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Community</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Community</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with fellow students, share knowledge, and grow together in
            our learning community
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                label: "Active Students",
                value: "2,500+",
                icon: <Users className="h-8 w-8" />,
              },
              {
                label: "Discussions",
                value: discussions.length.toString(),
                icon: <MessageCircle className="h-8 w-8" />,
              },
              {
                label: "Study Groups",
                value: studyGroups.length.toString(),
                icon: <Users className="h-8 w-8" />,
              },
              {
                label: "Achievements",
                value: "500+",
                icon: <Trophy className="h-8 w-8" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === "discussions" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Recent Discussions
                    </h2>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                      Start New Discussion
                    </button>
                  </div>

                  <div className="space-y-6">
                    {discussions.map((discussion) => (
                      <div
                        key={discussion._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {discussion.title}
                              </h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {discussion.subject}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-4">
                              {discussion.content.substring(0, 150)}...
                            </p>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>By {discussion.author.name}</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimeAgo(discussion.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replies.length} replies</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{discussion.likes.length} likes</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <button
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Like discussion"
                              title="Like discussion"
                            >
                              <Heart className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                              aria-label="Share discussion"
                              title="Share discussion"
                            >
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "groups" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Study Groups
                    </h2>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                      Create Group
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {studyGroups.map((group) => (
                      <div
                        key={group._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {group.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {group.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {group.subject}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getActivityColor(
                              group.activityLevel
                            )}`}
                          >
                            {group.activityLevel}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{group.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{group.members.length} members</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                            Join Group
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === "achievements" || activeTab === "leaderboard") && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {activeTab === "achievements" ? "Achievements" : "Leaderboard"}
                  </h2>
                  <p className="text-gray-600">
                    This section is coming soon! Stay tuned for exciting updates.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Connect with thousands of students, share knowledge, and achieve
            academic success together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subjects"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              Join Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;