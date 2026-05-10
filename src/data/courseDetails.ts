// Comprehensive course detail data with roadmaps, videos, and quizzes
export type Module = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  topic: string; // Used for AI quiz generation
};

export type RoadmapPhase = {
  week: string;
  title: string;
  skills: string[];
  project: string;
  icon: string;
};

export type CourseDetail = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  whatYoullLearn: string[];
  prerequisites: string[];
  modules: Module[];
  roadmap: RoadmapPhase[];
  instructor: string;
  instructorRole: string;
  ratings: number;
  totalStudents: string;
  creditsPerModule: number;
};

export const COURSE_DETAILS: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    title: "Aptitude Training",
    tagline: "Master Quantitative, Logical & Verbal Reasoning for top campus placements",
    description: "This comprehensive aptitude training program prepares you for top MNC placement tests, government exams, and competitive interviews. You will master quantitative reasoning, logical deduction, and verbal communication skills.",
    whatYoullLearn: [
      "Solve complex quantitative aptitude problems with speed and accuracy",
      "Master logical reasoning and critical thinking patterns",
      "Excel in verbal ability and reading comprehension",
      "Learn time management and exam strategy for competitive tests",
      "Practice real placement test papers from top MNCs",
    ],
    prerequisites: ["Basic arithmetic knowledge", "10+2 Mathematics"],
    modules: [
      { id: "m1", title: "Number Systems & Arithmetic", duration: "45 min", videoUrl: "https://www.youtube.com/embed/vHMQXoWwEKw", topic: "Number Systems and basic arithmetic operations" },
      { id: "m2", title: "Percentages & Ratios", duration: "50 min", videoUrl: "https://www.youtube.com/embed/kLYs01V83e4", topic: "Percentages, ratios, and proportions" },
      { id: "m3", title: "Logical Reasoning Patterns", duration: "55 min", videoUrl: "https://www.youtube.com/embed/9mBjLLNBEJc", topic: "Logical reasoning and pattern recognition" },
      { id: "m4", title: "Verbal Ability & Reading", duration: "40 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: "Verbal ability, grammar, and reading comprehension" },
    ],
    roadmap: [
      { week: "Week 1-2", title: "Quantitative Foundation", skills: ["Number systems", "HCF & LCM", "Averages", "Ratios"], project: "Solve 100 practice questions", icon: "🔢" },
      { week: "Week 3-4", title: "Speed & Accuracy", skills: ["Percentages", "Profit & Loss", "Time & Work", "Shortcut Methods"], project: "Timed mock test", icon: "⚡" },
      { week: "Week 5-6", title: "Logical Reasoning", skills: ["Syllogisms", "Blood Relations", "Seating Arrangement", "Data Interpretation"], project: "Full logical reasoning paper", icon: "🧠" },
      { week: "Week 7-8", title: "Verbal Mastery", skills: ["Grammar", "Reading Comprehension", "Para Jumbles", "Vocabulary"], project: "Full aptitude mock exam", icon: "📝" },
    ],
    instructor: "Dr. Priya Sharma",
    instructorRole: "Placement Training Expert | Ex-TCS",
    ratings: 4.8,
    totalStudents: "12,400+",
    creditsPerModule: 25,
  },
  "2": {
    id: "2",
    title: "Machine Learning with Python",
    tagline: "Build real ML models using Python, TensorFlow & Scikit-Learn",
    description: "A comprehensive hands-on machine learning course covering the full ML pipeline. From data preprocessing to model deployment, you will build real-world projects using Python, TensorFlow, and Scikit-Learn. Designed for aspiring data scientists and AI engineers.",
    whatYoullLearn: [
      "Master Python for data science and ML applications",
      "Build and train ML models using Scikit-Learn and TensorFlow",
      "Apply supervised, unsupervised, and reinforcement learning",
      "Perform feature engineering and model optimization",
      "Deploy ML models as REST APIs",
    ],
    prerequisites: ["Basic Python programming", "High school mathematics"],
    modules: [
      { id: "m1", title: "Python for ML & NumPy", duration: "60 min", videoUrl: "https://www.youtube.com/embed/aircAruvnKk", topic: "Python fundamentals for machine learning, NumPy arrays" },
      { id: "m2", title: "Supervised Learning", duration: "65 min", videoUrl: "https://www.youtube.com/embed/4sNMsMiCMRY", topic: "Supervised learning algorithms: linear regression, decision trees" },
      { id: "m3", title: "Neural Networks & Deep Learning", duration: "70 min", videoUrl: "https://www.youtube.com/embed/aircAruvnKk", topic: "Neural networks, backpropagation, and deep learning with TensorFlow" },
      { id: "m4", title: "Model Deployment with Flask", duration: "55 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: "Deploying ML models as REST APIs using Flask" },
    ],
    roadmap: [
      { week: "Week 1-2", title: "Python & Data Foundations", skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Data Cleaning"], project: "EDA on real dataset", icon: "🐍" },
      { week: "Week 3-5", title: "Core ML Algorithms", skills: ["Linear Regression", "Decision Trees", "SVM", "KNN", "Naive Bayes"], project: "Predictive model for house prices", icon: "🤖" },
      { week: "Week 6-8", title: "Deep Learning", skills: ["Neural Networks", "TensorFlow", "Keras", "CNN", "RNN"], project: "Image classification model", icon: "🧠" },
      { week: "Week 9-10", title: "Model Deployment", skills: ["Model Evaluation", "Hyperparameter Tuning", "Flask API", "Streamlit"], project: "Deploy ML app on cloud", icon: "🚀" },
    ],
    instructor: "Arjun Mehta",
    instructorRole: "ML Engineer | Ex-Google DeepMind",
    ratings: 4.9,
    totalStudents: "8,200+",
    creditsPerModule: 30,
  },
  "11": {
    id: "11",
    title: "Web Development",
    tagline: "Build modern full-stack web applications with React, Node.js & MongoDB",
    description: "A comprehensive full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world applications and deploy them to production. Perfect for beginners who want to launch a career in web development.",
    whatYoullLearn: [
      "Build responsive websites with HTML5, CSS3, and Tailwind CSS",
      "Create dynamic front-end applications using React and TypeScript",
      "Develop RESTful APIs with Node.js and Express",
      "Work with MongoDB databases and Mongoose ORM",
      "Deploy full-stack applications to cloud platforms",
    ],
    prerequisites: ["Basic computer skills", "Interest in technology"],
    modules: [
      { id: "m1", title: "HTML5 & CSS3 Fundamentals", duration: "50 min", videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU", topic: "HTML5 semantic elements, CSS3 properties, Flexbox and Grid layout" },
      { id: "m2", title: "JavaScript & ES6+", duration: "60 min", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", topic: "JavaScript fundamentals, ES6+ features, async/await, promises" },
      { id: "m3", title: "React & State Management", duration: "65 min", videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8", topic: "React components, hooks, state management, and routing" },
      { id: "m4", title: "Node.js, Express & MongoDB", duration: "60 min", videoUrl: "https://www.youtube.com/embed/ENrzD9HAZK4", topic: "Building RESTful APIs with Node.js, Express.js, and MongoDB" },
    ],
    roadmap: [
      { week: "Week 1-2", title: "Frontend Foundations", skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"], project: "Portfolio website", icon: "🎨" },
      { week: "Week 3-5", title: "JavaScript & React", skills: ["JavaScript ES6+", "DOM Manipulation", "React", "Hooks", "State Management"], project: "Interactive Todo App", icon: "⚛️" },
      { week: "Week 6-8", title: "Backend Development", skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Mongoose"], project: "Full-stack CRUD API", icon: "🖥️" },
      { week: "Week 9-10", title: "Deployment & DevOps", skills: ["Git & GitHub", "CI/CD", "Vercel", "MongoDB Atlas", "Environment Variables"], project: "Deploy social media clone", icon: "🚀" },
    ],
    instructor: "Rahul Verma",
    instructorRole: "Senior Full-Stack Developer | Ex-Flipkart",
    ratings: 4.7,
    totalStudents: "18,600+",
    creditsPerModule: 25,
  },
  "10": {
    id: "10",
    title: "Artificial Intelligence",
    tagline: "Master Deep Learning, NLP & Computer Vision from scratch to production",
    description: "An advanced AI course covering deep learning architectures, natural language processing, and computer vision. Build cutting-edge AI applications including chatbots, image recognition systems, and autonomous agents. Designed for serious AI practitioners.",
    whatYoullLearn: [
      "Design and train deep neural networks from scratch",
      "Build NLP systems including text classification and chatbots",
      "Apply computer vision for image recognition and object detection",
      "Implement reinforcement learning agents",
      "Deploy AI systems at scale using cloud platforms",
    ],
    prerequisites: ["Python programming", "Basic machine learning knowledge", "Linear algebra"],
    modules: [
      { id: "m1", title: "Deep Neural Networks", duration: "70 min", videoUrl: "https://www.youtube.com/embed/aircAruvnKk", topic: "Deep neural networks, activation functions, and backpropagation" },
      { id: "m2", title: "Natural Language Processing", duration: "65 min", videoUrl: "https://www.youtube.com/embed/rmVRLeJRkl4", topic: "NLP fundamentals, text processing, transformers, and BERT" },
      { id: "m3", title: "Computer Vision & CNNs", duration: "70 min", videoUrl: "https://www.youtube.com/embed/ArPaAX_PhIs", topic: "Computer vision, CNNs, object detection with YOLO" },
      { id: "m4", title: "AI in Production", duration: "55 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: "Deploying AI models using FastAPI and Docker" },
    ],
    roadmap: [
      { week: "Week 1-3", title: "Deep Learning Foundations", skills: ["TensorFlow 2.0", "Keras", "Neural Architectures", "Optimizers", "Regularization"], project: "Image classifier (ResNet)", icon: "🧬" },
      { week: "Week 4-6", title: "NLP & Language Models", skills: ["Tokenization", "Word Embeddings", "Transformers", "BERT", "Fine-tuning LLMs"], project: "Sentiment analysis system", icon: "💬" },
      { week: "Week 7-9", title: "Computer Vision", skills: ["CNNs", "Object Detection", "YOLO", "Image Segmentation", "GANs"], project: "Face recognition system", icon: "👁️" },
      { week: "Week 10-12", title: "Production AI Systems", skills: ["MLOps", "FastAPI", "Docker", "Model Monitoring", "CI/CD for AI"], project: "End-to-end AI SaaS application", icon: "🏭" },
    ],
    instructor: "Dr. Kavita Nair",
    instructorRole: "AI Research Scientist | Ex-Microsoft Research India",
    ratings: 4.9,
    totalStudents: "6,800+",
    creditsPerModule: 35,
  },
};

// Fallback generator for courses without specific detail
export function getDefaultCourseDetail(courseId: string, title: string, tools: string[], duration: string, level: string): CourseDetail {
  return {
    id: courseId,
    title,
    tagline: `Master ${title} with hands-on projects and expert guidance`,
    description: `This comprehensive ${title} training program is designed to take you from beginner to job-ready. Through hands-on projects, real-world case studies, and expert mentorship, you will gain the skills needed to excel in your career.`,
    whatYoullLearn: [
      `Master core concepts and fundamentals of ${title}`,
      `Work on real-world industry projects`,
      `Learn best practices and industry standards`,
      `Build a professional portfolio demonstrating your skills`,
      `Get career guidance and placement support`,
    ],
    prerequisites: ["Basic computer literacy", "Enthusiasm to learn"],
    modules: [
      { id: "m1", title: `Introduction to ${title}`, duration: "45 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: `Introduction and fundamentals of ${title}` },
      { id: "m2", title: `Core Concepts & Tools`, duration: "55 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: `Core concepts, tools and techniques in ${title}` },
      { id: "m3", title: `Hands-on Projects`, duration: "60 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: `Applied projects and case studies for ${title}` },
      { id: "m4", title: `Advanced Topics & Career`, duration: "50 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic: `Advanced ${title} concepts and career path guidance` },
    ],
    roadmap: [
      { week: "Week 1-2", title: "Foundation", skills: tools.slice(0, 2).concat(["Core Concepts", "Theory"]), project: "Setup and first project", icon: "🏗️" },
      { week: "Week 3-4", title: "Core Skills", skills: tools.concat(["Best Practices"]), project: "Hands-on project 1", icon: "🔧" },
      { week: "Week 5-6", title: "Intermediate Practice", skills: ["Advanced Techniques", "Problem Solving", "Industry Patterns"], project: "Real-world case study", icon: "📈" },
      { week: "Week 7-8", title: "Portfolio & Career", skills: ["Portfolio Building", "Interview Prep", "Industry Networking"], project: "Final capstone project", icon: "🎓" },
    ],
    instructor: "Expert Mentor",
    instructorRole: `Industry Professional | ${title} Specialist`,
    ratings: 4.7,
    totalStudents: "5,000+",
    creditsPerModule: 25,
  };
}
