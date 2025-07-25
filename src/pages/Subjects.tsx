import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, FileText, HelpCircle } from "lucide-react";
import { subjectsAPI } from "../utils/api";

interface Subject {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  grade: string;
  chapters: any[];
  totalStudents: number;
  averageRating: number;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback subjects data
  const fallbackSubjects = [
    {
      _id: "1",
      name: "Science",
      slug: "science",
      description: "Explore the wonders of physics, chemistry, and biology through interactive experiments and engaging content.",
      color: "from-learnkins-purple-500 to-learnkins-purple-600",
      icon: "🔬",
      grade: "8th",
      chapters: [],
      totalStudents: 1250,
      averageRating: 4.8,
      topics: ["Physics", "Chemistry", "Biology", "Environmental Science"],
    },
    {
      _id: "2",
      name: "Mathematics",
      slug: "mathematics",
      description: "Master mathematical concepts from basic arithmetic to advanced problem-solving techniques.",
      color: "from-learnkins-blue-500 to-learnkins-blue-600",
      icon: "📊",
      grade: "8th",
      chapters: [],
      totalStudents: 1180,
      averageRating: 4.7,
      topics: ["Algebra", "Geometry", "Statistics", "Number Theory"],
    },
    {
      _id: "3",
      name: "Social Science",
      slug: "social-science",
      description: "Understand history, geography, civics, and economics through engaging stories and interactive maps.",
      color: "from-learnkins-green-500 to-learnkins-green-600",
      icon: "🌍",
      grade: "8th",
      chapters: [],
      totalStudents: 980,
      averageRating: 4.6,
      topics: ["History", "Geography", "Civics", "Economics"],
    },
    {
      _id: "4",
      name: "English",
      slug: "english",
      description: "Develop reading, writing, and communication skills through literature and creative exercises.",
      color: "from-learnkins-orange-500 to-learnkins-orange-600",
      icon: "📚",
      grade: "8th",
      chapters: [],
      totalStudents: 1050,
      averageRating: 4.9,
      topics: ["Grammar", "Literature", "Creative Writing", "Comprehension"],
    },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching subjects from API...');
        
        const response = await subjectsAPI.getAll('8th');
        console.log('Subjects API response:', response.data);
        
        if (response.data.success && response.data.data.length > 0) {
          setSubjects(response.data.data);
        } else {
          console.log('No subjects from API, using fallback data');
          setSubjects(fallbackSubjects);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        console.log('Using fallback subjects data');
        setSubjects(fallbackSubjects);
        setError('Unable to load subjects from server. Showing demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-learnkins-blue-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">SUBJECTS</h1>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Link to="/" className="hover:text-learnkins-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Subjects</span>
          </div>
          {error && (
            <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Subject
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover engaging content tailored for middle school students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={subject._id || index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} p-8 text-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{subject.icon}</div>
                    <div className="text-4xl font-bold opacity-20">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-lg opacity-90">{subject.description}</p>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Course Info:
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Grade: {subject.grade}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {subject.totalStudents} Students
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        ⭐ {subject.averageRating}/5
                      </span>
                    </div>
                    
                    {(subject as any).topics && (
                      <div className="flex flex-wrap gap-2">
                        {(subject as any).topics.map((topic: string, topicIndex: number) => (
                          <span
                            key={topicIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Play className="h-4 w-4" />
                        <span>Videos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>Notes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HelpCircle className="h-4 w-4" />
                        <span>Q&A</span>
                      </div>
                    </div>

                    <Link
                      to={`/subjects/${subject.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-learnkins-blue-600 text-white font-semibold rounded-lg hover:bg-learnkins-blue-700 transition-colors duration-300 group-hover:bg-learnkins-blue-700"
                    >
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Study Tips for Success
            </h2>
            <p className="text-xl text-gray-600">
              Make the most of your learning experience with these helpful tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create a Study Schedule",
                description:
                  "Set aside specific times for each subject to maintain consistency.",
                icon: "⏰",
              },
              {
                title: "Take Regular Breaks",
                description:
                  "Use the Pomodoro technique: 25 minutes study, 5 minutes break.",
                icon: "☕",
              },
              {
                title: "Practice Regularly",
                description:
                  "Complete quizzes and exercises to reinforce your learning.",
                icon: "💪",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subjects;