import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  LogOut,
  BookOpen,
  Clock,
  Trash2,
  ChevronRight,
  Loader2,
  X,
  Target,
  User,
  Play,
  Sparkles,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { useUser } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import ThemeToggle from '../../components/ThemeToggle';
import Navbar from '../../components/Navbar';
import KnowledgeGapHeatmap from '../../components/KnowledgeGapHeatmap';
import WeakConceptsPanel from '../../components/WeakConceptsPanel';

// Role-driven theming for stronger contrast and personality on session cards
const roleThemes = {
  Frontend: {
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 45%, #8b5cf6 100%)',
    glow: '0 30px 80px -38px rgba(99, 102, 241, 0.55)',
    chipBg: 'rgba(224, 242, 254, 0.14)',
    chipText: '#e2f3ff',
  },
  Backend: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 35%, #ec4899 100%)',
    glow: '0 30px 80px -38px rgba(249, 115, 22, 0.55)',
    chipBg: 'rgba(255, 237, 213, 0.16)',
    chipText: '#fff5e6',
  },
  'Full Stack': {
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #0ea5e9 100%)',
    glow: '0 30px 80px -38px rgba(14, 165, 233, 0.55)',
    chipBg: 'rgba(226, 232, 240, 0.18)',
    chipText: '#e5ecff',
  },
  Data: {
    gradient: 'linear-gradient(135deg, #fb7185 0%, #c084fc 50%, #6366f1 100%)',
    glow: '0 30px 80px -38px rgba(192, 132, 252, 0.55)',
    chipBg: 'rgba(255, 228, 235, 0.16)',
    chipText: '#ffe9f3',
  },
  DevOps: {
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #22d3ee 45%, #60a5fa 100%)',
    glow: '0 30px 80px -38px rgba(34, 211, 238, 0.55)',
    chipBg: 'rgba(209, 250, 229, 0.16)',
    chipText: '#e6fff5',
  },
  'UI/UX': {
    gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #10b981 100%)',
    glow: '0 30px 80px -38px rgba(168, 85, 247, 0.55)',
    chipBg: 'rgba(237, 233, 254, 0.16)',
    chipText: '#f6f0ff',
  },
  Mobile: {
    gradient: 'linear-gradient(135deg, #fb7185 0%, #f97316 50%, #fcd34d 100%)',
    glow: '0 30px 80px -38px rgba(249, 115, 22, 0.55)',
    chipBg: 'rgba(255, 228, 230, 0.18)',
    chipText: '#fff5f7',
  },
  'AI/ML': {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 55%, #22c55e 100%)',
    glow: '0 30px 80px -38px rgba(6, 182, 212, 0.55)',
    chipBg: 'rgba(207, 250, 254, 0.16)',
    chipText: '#e0fbff',
  },
  Product: {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 45%, #a78bfa 100%)',
    glow: '0 30px 80px -38px rgba(99, 102, 241, 0.55)',
    chipBg: 'rgba(226, 232, 240, 0.16)',
    chipText: '#e8edff',
  },
  default: {
    gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 60%, #0b1222 100%)',
    glow: '0 30px 80px -38px rgba(17, 24, 39, 0.55)',
    chipBg: 'rgba(255, 255, 255, 0.12)',
    chipText: '#f8fafc',
  },
};

const getRoleTheme = (role) => {
  for (const key of Object.keys(roleThemes)) {
    if (role.includes(key)) return roleThemes[key];
  }
  return roleThemes.default;
};

// Default sample sessions with AI-generated questions
export const defaultSessions = [
  {
    _id: 'default-1',
    role: 'Frontend Developer',
      experience: '2 Years',
      focusAreas: ['React.js', 'DOM manipulation', 'CSS Flexbox'],
      questions: [
        { question: 'What is the Virtual DOM in React and how does it improve performance?', answer: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to minimize direct DOM manipulation by batching updates and only re-rendering changed elements, which significantly improves performance.' },
        { question: 'Explain the difference between CSS Flexbox and CSS Grid.', answer: 'Flexbox is one-dimensional (row or column), ideal for layouts in a single direction. Grid is two-dimensional (rows and columns), better for complex layouts. Flexbox excels at distributing space along a single axis, while Grid handles both axes simultaneously.' },
        { question: 'What are React Hooks and why were they introduced?', answer: 'React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to simplify component logic, improve code reusability, and eliminate the need for class components in most cases.' },
        { question: 'How does event delegation work in JavaScript?', answer: 'Event delegation uses event bubbling to handle events at a parent level rather than attaching listeners to each child. This improves performance and handles dynamically added elements automatically.' },
        { question: 'What is the purpose of useEffect in React?', answer: 'useEffect handles side effects in functional components like data fetching, subscriptions, or DOM manipulation. It runs after render and can optionally clean up when component unmounts or dependencies change.' },
        { question: 'Explain CSS specificity and how it affects styling.', answer: 'CSS specificity determines which styles apply when multiple rules target the same element. Inline styles have highest priority, followed by IDs, classes/attributes, and elements. Understanding specificity prevents styling conflicts.' },
        { question: 'What is the difference between controlled and uncontrolled components in React?', answer: 'Controlled components have their state managed by React (value controlled by state). Uncontrolled components store their own state internally (accessed via refs). Controlled components provide more control and validation.' },
        { question: 'How do you optimize React app performance?', answer: 'Use React.memo for component memoization, useMemo/useCallback for expensive computations, lazy loading with React.lazy, code splitting, virtualization for long lists, and avoid unnecessary re-renders by proper state management.' },
        { question: 'What is the box model in CSS?', answer: 'The CSS box model consists of content, padding, border, and margin. By default, width/height apply to content only. box-sizing: border-box includes padding and border in the width/height calculation.' },
        { question: 'Explain the concept of closure in JavaScript.', answer: 'A closure is a function that has access to variables from its outer scope even after the outer function has returned. Closures enable data privacy, function factories, and maintain state in functional programming.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-2',
      role: 'Backend Developer',
      experience: '3 Years',
      focusAreas: ['Node.js', 'Express', 'REST APIs', 'MongoDB'],
      questions: [
        { question: 'What is middleware in Express.js and how is it used?', answer: 'Middleware functions have access to request, response, and next(). They execute in order, can modify req/res objects, end request-response cycle, or call next middleware. Used for logging, authentication, parsing, error handling.' },
        { question: 'Explain the difference between SQL and NoSQL databases.', answer: 'SQL databases are relational with fixed schemas, ACID compliant, use structured query language. NoSQL databases are non-relational, schema-flexible, horizontally scalable, better for unstructured data and high-volume applications.' },
        { question: 'What are the principles of RESTful API design?', answer: 'REST principles: stateless client-server communication, uniform interface (HTTP methods), resource-based URLs, representation through JSON/XML, cacheable responses, layered system architecture.' },
        { question: 'How does indexing improve database performance?', answer: 'Indexes create data structures (B-trees) that allow faster data retrieval without scanning entire tables. Trade-off: faster reads but slower writes. Index frequently queried columns and foreign keys.' },
        { question: 'What is the event loop in Node.js?', answer: 'Event loop handles asynchronous operations in Node.js. It continuously checks the call stack and callback queue. When stack is empty, it moves callbacks to stack for execution, enabling non-blocking I/O operations.' },
        { question: 'Explain JWT authentication and its benefits.', answer: 'JWT (JSON Web Token) is a self-contained token for authentication. Benefits: stateless (no server-side session storage), scalable, works across domains, includes user info in payload, signed for security.' },
        { question: 'What is database normalization and why is it important?', answer: 'Normalization organizes data to reduce redundancy and improve integrity. Forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). Prevents update anomalies and saves storage.' },
        { question: 'How do you handle errors in Express.js?', answer: 'Use error-handling middleware with 4 parameters (err, req, res, next). Place it after all routes. Use try-catch for async routes, create custom error classes, centralize error handling for consistency.' },
        { question: 'What is connection pooling in databases?', answer: 'Connection pooling maintains a pool of reusable database connections instead of creating new ones per request. Improves performance by reducing connection overhead and manages concurrent database access efficiently.' },
        { question: 'Explain CORS and how to handle it in Express.', answer: 'CORS (Cross-Origin Resource Sharing) controls resource sharing between different origins. Configure using cors middleware, specify allowed origins, methods, headers. Essential for API security and browser-server communication.' },
        { question: 'What are Promises and async/await in JavaScript?', answer: 'Promises represent eventual completion of async operations with states: pending, fulfilled, rejected. Async/await is syntactic sugar over Promises, making async code look synchronous and easier to read/debug.' },
        { question: 'How do you implement rate limiting in APIs?', answer: 'Use rate limiting middleware (express-rate-limit) to restrict requests per IP/user within time window. Prevents abuse, DDoS attacks, ensures fair resource usage. Configure limits based on endpoint sensitivity.' },
        { question: 'What is the difference between authentication and authorization?', answer: 'Authentication verifies identity (who you are) using credentials like passwords, tokens. Authorization determines access rights (what you can do) based on roles/permissions. Both essential for security.' },
        { question: 'Explain database transactions and ACID properties.', answer: 'Transactions are atomic units of work. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\'t interfere), Durability (changes persist). Critical for data integrity.' },
        { question: 'What is the purpose of environment variables?', answer: 'Environment variables store configuration separately from code (API keys, DB URLs, ports). Benefits: security (no hardcoded secrets), flexibility (different configs per environment), easier deployment and maintenance.' },
        { question: 'How do you optimize MongoDB queries?', answer: 'Create appropriate indexes, use projection to return only needed fields, limit results, use aggregation pipeline efficiently, avoid $where operator, monitor with explain(), implement query pagination.' },
        { question: 'What is the difference between PUT and PATCH in REST APIs?', answer: 'PUT replaces entire resource with new representation (send all fields). PATCH partially updates resource (send only changed fields). Use PUT for full updates, PATCH for partial modifications.' },
        { question: 'Explain the concept of microservices architecture.', answer: 'Microservices break applications into small, independent services that communicate via APIs. Benefits: scalability, independent deployment, technology diversity, fault isolation. Challenges: complexity, distributed system management.' },
        { question: 'What is caching and how do you implement it?', answer: 'Caching stores frequently accessed data in fast-access storage (Redis, memory). Reduces database load and latency. Implement at API level, database queries, or CDN. Use cache invalidation strategies for consistency.' },
        { question: 'How do you secure REST APIs?', answer: 'Use HTTPS, implement authentication (JWT, OAuth), validate/sanitize inputs, rate limiting, CORS configuration, SQL injection prevention, avoid exposing sensitive data, use secure headers, implement logging/monitoring.' }
      ],
      createdAt: '2025-05-01T00:00:00Z',
      updatedAt: '2025-05-01T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-3',
      role: 'Full Stack Developer',
      experience: '4 Years',
      focusAreas: ['MERN stack', 'deployment strategies', 'authentication'],
      questions: [
        { question: 'Explain the MERN stack and benefits of using it.', answer: 'MERN (MongoDB, Express, React, Node.js) is a JavaScript full-stack. Benefits: single language across stack, JSON data flow, strong ecosystem, fast development, active community support.' },
        { question: 'What are the best practices for deploying Node.js applications?', answer: 'Use process managers (PM2), environment variables, reverse proxy (nginx), HTTPS, logging, monitoring, CI/CD pipelines, containerization (Docker), load balancing, automated backups.' },
        { question: 'How do you implement authentication in MERN stack?', answer: 'Use JWT for stateless auth: backend generates signed tokens, frontend stores in localStorage/httpOnly cookies, include in request headers, middleware validates tokens, implement refresh tokens for security.' },
        { question: 'What is state management and when to use Redux?', answer: 'State management handles app-wide data. Use Redux for complex apps with shared state across many components, time-travel debugging needs, or middleware requirements. For simpler apps, Context API suffices.' },
        { question: 'Explain Docker and its benefits for deployment.', answer: 'Docker containerizes applications with dependencies into portable images. Benefits: consistent environments, easy scaling, isolation, version control, works across platforms, simplifies CI/CD.' },
        { question: 'What is server-side rendering vs client-side rendering?', answer: 'SSR renders HTML on server (better SEO, faster initial load). CSR renders in browser (interactive, faster navigation). Next.js offers hybrid approach with SSR/SSG benefits.' },
        { question: 'How do you handle file uploads in MERN applications?', answer: 'Use Multer middleware for parsing multipart/form-data, store files in cloud storage (AWS S3, Cloudinary), validate file types/sizes, generate unique names, return URLs to frontend.' },
        { question: 'What are Web Sockets and when to use them?', answer: 'WebSockets enable real-time bidirectional communication between client-server. Use for chat apps, live notifications, collaborative tools, real-time dashboards. Use Socket.io library in Node.js.' },
        { question: 'Explain CI/CD and its importance.', answer: 'CI/CD automates code integration, testing, and deployment. CI merges code frequently with automated tests. CD automatically deploys to production. Benefits: faster releases, fewer bugs, reliable deployments.' },
        { question: 'How do you optimize MERN application performance?', answer: 'Backend: database indexing, caching (Redis), query optimization, compression. Frontend: code splitting, lazy loading, CDN, image optimization, memoization. Use monitoring tools to identify bottlenecks.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-4',
      role: 'Data Analyst',
      experience: '2 Years',
      focusAreas: ['SQL', 'Excel', 'Data Visualization', 'Power BI'],
      questions: [
        { question: 'What is the difference between WHERE and HAVING clauses in SQL?', answer: 'WHERE filters rows before grouping, works with individual records. HAVING filters after grouping, works with aggregated data. Use WHERE for row-level filtering, HAVING for group-level filtering.' },
        { question: 'Explain the concept of data normalization.', answer: 'Data normalization structures data to reduce redundancy and improve integrity. Process involves organizing data into tables and establishing relationships. Levels include 1NF, 2NF, 3NF, each reducing different types of redundancy.' },
        { question: 'What are the different types of JOINs in SQL?', answer: 'INNER JOIN: matching rows from both tables. LEFT JOIN: all from left, matching from right. RIGHT JOIN: all from right, matching from left. FULL OUTER JOIN: all rows from both. CROSS JOIN: cartesian product.' },
        { question: 'How do you handle missing data in analysis?', answer: 'Methods: deletion (if minimal), imputation (mean/median/mode), forward/backward fill for time series, prediction models, or flag as separate category. Choice depends on data type and analysis requirements.' },
        { question: 'What is the purpose of pivot tables in Excel?', answer: 'Pivot tables summarize large datasets by grouping, aggregating, and reorganizing data. Enable quick analysis, filtering, and visualization without formulas. Useful for finding patterns and creating dynamic reports.' },
        { question: 'Explain the difference between descriptive and inferential statistics.', answer: 'Descriptive statistics summarize data (mean, median, mode, charts). Inferential statistics make predictions about populations from samples (hypothesis testing, confidence intervals, regression).' },
        { question: 'What are DAX functions in Power BI?', answer: 'DAX (Data Analysis Expressions) is a formula language for calculations in Power BI. Includes functions for aggregation, filtering, time intelligence, and complex calculations across tables and relationships.' },
        { question: 'How do you ensure data quality in analysis?', answer: 'Validate data completeness, accuracy, consistency. Check for duplicates, outliers, missing values. Verify data types, ranges, formats. Document assumptions, transformations. Use data profiling tools and establish quality metrics.' },
        { question: 'What is the difference between correlation and causation?', answer: 'Correlation shows statistical relationship between variables. Causation means one variable directly causes changes in another. Correlation doesn\'t imply causation - need controlled experiments or additional evidence.' },
        { question: 'Explain VLOOKUP and INDEX-MATCH in Excel.', answer: 'VLOOKUP searches vertical column for value, returns data from specified column. INDEX-MATCH is more flexible: INDEX returns value at position, MATCH finds position. INDEX-MATCH works left, faster for large datasets.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-5',
      role: 'DevOps Engineer',
      experience: '5 Years',
      focusAreas: ['CI/CD', 'Docker', 'Kubernetes', 'AWS'],
      questions: [
        { question: 'What is containerization and how does Docker work?', answer: 'Containerization packages applications with dependencies into isolated containers. Docker uses images (blueprints) to create containers (running instances). Benefits: portability, consistency, resource efficiency, fast deployment.' },
        { question: 'Explain Kubernetes architecture and its components.', answer: 'Kubernetes orchestrates containers. Components: Master (API server, scheduler, controller manager, etcd) and Nodes (kubelet, kube-proxy, pods). Manages deployment, scaling, networking, and self-healing of containerized applications.' },
        { question: 'What is Infrastructure as Code (IaC)?', answer: 'IaC manages infrastructure through code rather than manual processes. Tools: Terraform, CloudFormation. Benefits: version control, reproducibility, automation, consistency across environments, faster provisioning.' },
        { question: 'How do you implement blue-green deployment?', answer: 'Blue-green deployment maintains two identical environments. Blue (current), green (new version). Deploy to green, test, switch traffic. Enables zero-downtime deployments, easy rollback, reduced risk.' },
        { question: 'What are the key AWS services for DevOps?', answer: 'EC2 (compute), S3 (storage), RDS (database), Lambda (serverless), ECS/EKS (containers), CloudWatch (monitoring), CodePipeline (CI/CD), IAM (security), CloudFormation (IaC), Route53 (DNS).' },
        { question: 'Explain the concept of immutable infrastructure.', answer: 'Immutable infrastructure replaces servers rather than updating them. Once deployed, never modified. Deploy new version, switch traffic, destroy old. Benefits: consistency, predictability, easy rollback.' },
        { question: 'What is the difference between horizontal and vertical scaling?', answer: 'Horizontal scaling adds more machines/instances (scale out). Vertical scaling increases resources of existing machine (scale up). Horizontal preferred for cloud: better redundancy, unlimited scaling, cost-effective.' },
        { question: 'How do you monitor applications in production?', answer: 'Use monitoring tools (CloudWatch, Prometheus, Grafana), log aggregation (ELK stack), APM tools (New Relic, Datadog), set up alerts, track metrics (CPU, memory, latency, error rates), implement health checks.' },
        { question: 'What is a service mesh and why use it?', answer: 'Service mesh (Istio, Linkerd) manages service-to-service communication in microservices. Provides traffic management, security, observability, resilience without changing application code. Essential for complex microservice architectures.' },
        { question: 'Explain GitOps and its benefits.', answer: 'GitOps uses Git as single source of truth for infrastructure and applications. Automated deployments from Git changes. Benefits: audit trail, easy rollback, consistency, declarative infrastructure, collaboration through PRs.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-6',
      role: 'UI/UX Designer',
      experience: '3 Years',
      focusAreas: ['Figma', 'user journey', 'wireframing', 'accessibility'],
      questions: [
        { question: 'What is the difference between UI and UX design?', answer: 'UI (User Interface) focuses on visual elements, layout, colors, typography, buttons. UX (User Experience) focuses on overall user journey, usability, problem-solving, research. UI is how it looks, UX is how it works.' },
        { question: 'Explain the design thinking process.', answer: 'Design thinking: Empathize (understand users), Define (problem statement), Ideate (brainstorm solutions), Prototype (create testable versions), Test (gather feedback). Iterative process focused on user-centered solutions.' },
        { question: 'What are the key principles of accessible design?', answer: 'WCAG principles: Perceivable (alternative text, captions), Operable (keyboard navigation, sufficient time), Understandable (readable, predictable), Robust (compatible with assistive technologies). Include color contrast, clear labels.' },
        { question: 'How do you conduct user research?', answer: 'Methods: user interviews, surveys, usability testing, A/B testing, analytics review, persona creation, journey mapping. Combine quantitative (metrics) and qualitative (insights) data for comprehensive understanding.' },
        { question: 'What is the purpose of wireframing?', answer: 'Wireframes are low-fidelity layouts showing structure, content hierarchy, functionality without visual design. Benefits: quick iteration, focus on UX over aesthetics, stakeholder alignment, cost-effective early feedback.' },
        { question: 'Explain Figma\'s component system and its benefits.', answer: 'Figma components are reusable design elements with variants and properties. Benefits: consistency across designs, easy updates (change once, apply everywhere), faster workflow, design system foundation, team collaboration.' },
        { question: 'What is information architecture in UX design?', answer: 'Information architecture organizes and structures content for findability and usability. Includes site maps, navigation systems, labeling, categorization. Goal: help users find information efficiently and understand relationships.' },
        { question: 'How do you measure UX success?', answer: 'Metrics: task completion rate, time on task, error rate, satisfaction scores (SUS, NPS), conversion rates, retention, engagement. Combine quantitative metrics with qualitative feedback for holistic view.' },
        { question: 'What are design systems and why are they important?', answer: 'Design systems are collections of reusable components, patterns, guidelines, and documentation. Benefits: consistency, faster design/development, scalability, reduced decision fatigue, better collaboration between teams.' },
        { question: 'Explain the concept of mobile-first design.', answer: 'Mobile-first designs for smallest screens first, then progressively enhances for larger screens. Benefits: focus on essential content, better performance, faster load times, better user experience on mobile devices.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-7',
      role: 'Mobile App Developer',
      experience: '2 Years',
      focusAreas: ['React Native', 'Flutter', 'performance optimization'],
      questions: [
        { question: 'What is React Native and how does it work?', answer: 'React Native uses JavaScript to build native mobile apps. Bridges JavaScript code to native components. Benefits: code reusability across platforms, hot reloading, large ecosystem, near-native performance.' },
        { question: 'Explain the difference between React Native and Flutter.', answer: 'React Native: JavaScript, uses native components, larger community. Flutter: Dart, renders its own widgets, better performance, consistent UI. Both enable cross-platform development with different trade-offs.' },
        { question: 'How do you optimize React Native app performance?', answer: 'Use FlatList for lists, optimize images, remove console logs, use PureComponent/memo, avoid inline functions, enable Hermes, reduce bridge traffic, implement code splitting, profile with React DevTools.' },
        { question: 'What is the difference between async storage and state management?', answer: 'AsyncStorage persists data on device (survives app restarts). State management (Redux, Context) handles in-memory app state. Use AsyncStorage for persistence, state management for runtime data flow.' },
        { question: 'Explain the navigation patterns in React Native.', answer: 'React Navigation provides: Stack (push/pop screens), Tab (bottom tabs), Drawer (side menu). Navigation enables deep linking, passing params between screens, custom transitions, nested navigators.' },
        { question: 'How do you handle different screen sizes in mobile apps?', answer: 'Use flexible layouts (Flexbox), percentage-based dimensions, responsive utilities, test on multiple devices, implement platform-specific code when needed, use dimension API for calculations.' },
        { question: 'What are native modules and when to use them?', answer: 'Native modules bridge JavaScript to native code (Java/Kotlin, Objective-C/Swift). Use when React Native APIs insufficient: hardware access, performance-critical operations, third-party native SDKs integration.' },
        { question: 'Explain app state management lifecycle in React Native.', answer: 'App states: active (foreground), background (suspended), inactive (transition). Use AppState API to detect changes, handle tasks accordingly: pause operations, save data, manage connections.' },
        { question: 'How do you implement push notifications?', answer: 'Use Firebase Cloud Messaging or similar services. Register device token, configure backend to send notifications, handle foreground/background states, implement notification actions, request permissions properly.' },
        { question: 'What is code push and its benefits?', answer: 'Code push (Microsoft AppCenter) enables OTA updates for JavaScript/assets without app store approval. Benefits: quick bug fixes, A/B testing, gradual rollouts, no review wait time, instant updates.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-8',
      role: 'AI/ML Engineer',
      experience: '1 Year',
      focusAreas: ['Python', 'scikit-learn', 'model deployment', 'NLP'],
      questions: [
        { question: 'What is the difference between supervised and unsupervised learning?', answer: 'Supervised learning uses labeled data to predict outcomes (classification, regression). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction). Supervised needs training labels, unsupervised discovers hidden structures.' },
        { question: 'Explain overfitting and how to prevent it.', answer: 'Overfitting occurs when model learns training data too well, including noise, performing poorly on new data. Prevention: cross-validation, regularization (L1/L2), dropout, more training data, early stopping, simpler models.' },
        { question: 'What is the purpose of feature engineering?', answer: 'Feature engineering creates, transforms, and selects relevant features from raw data to improve model performance. Includes scaling, encoding categorical variables, creating interaction terms, handling missing values, feature extraction.' },
        { question: 'How does gradient descent work?', answer: 'Gradient descent optimizes model parameters by iteratively moving toward minimum loss. Calculates gradient (derivative) of loss function, updates parameters opposite to gradient direction. Variants: batch, stochastic, mini-batch.' },
        { question: 'What are common NLP preprocessing techniques?', answer: 'Tokenization (splitting text), lowercasing, removing stopwords, stemming/lemmatization, handling punctuation, removing special characters, handling emojis, sentence segmentation. Choice depends on task requirements.' },
        { question: 'Explain the bias-variance tradeoff.', answer: 'Bias: error from wrong assumptions (underfitting). Variance: error from sensitivity to training data (overfitting). Tradeoff: reducing one increases the other. Goal: find balance that minimizes total error.' },
        { question: 'What is cross-validation and why use it?', answer: 'Cross-validation splits data into k folds, trains on k-1, validates on 1, repeats k times. Provides better performance estimate than single split, reduces overfitting risk, maximizes use of limited data.' },
        { question: 'How do you evaluate classification models?', answer: 'Metrics: accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix. Choice depends on problem: precision for spam detection, recall for disease diagnosis, balanced for general classification. Consider class imbalance.' },
        { question: 'What is transfer learning in deep learning?', answer: 'Transfer learning uses pre-trained models on new tasks. Fine-tune last layers while keeping base layers frozen. Benefits: requires less data, faster training, better performance, especially useful with limited datasets.' },
        { question: 'Explain model deployment best practices.', answer: 'Containerize with Docker, version models (MLflow), monitor performance, implement A/B testing, handle scaling, ensure reproducibility, set up logging, create APIs (Flask/FastAPI), automate retraining pipeline, manage model drift.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    },
    {
      _id: 'default-9',
      role: 'Product Manager',
      experience: '4 Years',
      focusAreas: ['Roadmapping', 'user stories', 'KPIs', 'stakeholder communication'],
      questions: [
        { question: 'How do you prioritize features in a product roadmap?', answer: 'Use frameworks: RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must, Should, Could, Won\'t), Value vs Effort matrix. Consider business goals, user needs, technical feasibility, competitive landscape, resource constraints.' },
        { question: 'What is the difference between OKRs and KPIs?', answer: 'OKRs (Objectives and Key Results) set ambitious goals with measurable outcomes, reviewed quarterly. KPIs (Key Performance Indicators) track ongoing metrics for business health. OKRs drive change, KPIs monitor status.' },
        { question: 'How do you write effective user stories?', answer: 'Use format: "As a [user], I want [goal], so that [benefit]." Include acceptance criteria, definition of done, priority. Keep stories small, focused, independent, testable. Add context but avoid implementation details.' },
        { question: 'Explain your approach to stakeholder management.', answer: 'Identify stakeholders, understand their interests and influence. Regular communication, set expectations, provide visibility into progress, align on priorities, manage conflicts diplomatically, build trust, listen actively, document decisions.' },
        { question: 'What metrics do you track for product success?', answer: 'Engagement: DAU/MAU, session length, feature adoption. Business: revenue, conversion rate, churn, CAC, LTV. Quality: bugs, performance, satisfaction scores. Choose metrics aligned with product goals and stage.' },
        { question: 'How do you conduct competitive analysis?', answer: 'Research competitors: features, pricing, positioning, strengths/weaknesses. Use SWOT analysis, feature comparison matrices. Monitor updates, reviews, market trends. Identify opportunities for differentiation and gaps to fill.' },
        { question: 'Explain your process for gathering user feedback.', answer: 'Methods: user interviews, surveys, usability testing, analytics, customer support data, social listening, beta programs. Combine qualitative insights with quantitative data. Synthesize findings into actionable insights.' },
        { question: 'What is an MVP and how do you define it?', answer: 'MVP (Minimum Viable Product) is the simplest version that delivers core value and enables learning. Identify key problem, essential features, build minimal solution, release to early adopters, gather feedback, iterate.' },
        { question: 'How do you handle conflicting priorities from stakeholders?', answer: 'Understand underlying needs, align with company goals, present data-driven rationale, facilitate discussion, find compromise, document decisions with reasoning, communicate transparently, escalate when necessary.' },
        { question: 'What is your approach to product discovery?', answer: 'Research problem space: user interviews, market analysis, data analysis. Define hypotheses, prototype solutions, validate with users, test assumptions. Iterate based on feedback before committing to full development.' }
      ],
      createdAt: '2025-04-30T00:00:00Z',
      updatedAt: '2025-04-30T00:00:00Z',
      isDefault: true
    }
  ];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading: userLoading } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    focusAreas: '',
  });
  const [readinessScore, setReadinessScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showKnowledgeGaps, setShowKnowledgeGaps] = useState(false);

  useEffect(() => {
    // Wait for user context to finish loading before checking authentication
    if (userLoading) return;
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSessions();
    fetchReadinessScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, userLoading]);

  // Refresh score when returning to dashboard (e.g., from InterviewPrep)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        fetchReadinessScore();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        fetchReadinessScore();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.sessions.getAll);
      if (response.data.success) {
        const userSessions = response.data.sessions;
        // Always combine user sessions with default sessions
        setSessions([...defaultSessions, ...userSessions]);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      // Show default sessions on error
      setSessions(defaultSessions);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadinessScore = async () => {
    setScoreLoading(true);
    try {
      console.log('🔄 Fetching readiness score...');
      const response = await axiosInstance.get(API_PATHS.analytics.readinessScore);
      if (response.data.success) {
        console.log('📊 Readiness score received:', {
          score: response.data.score,
          breakdown: response.data.breakdown,
          stats: response.data.stats
        });
        setReadinessScore(response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch readiness score:', error);
    } finally {
      setScoreLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const focusAreasArray = formData.focusAreas
        ? formData.focusAreas.split(',').map((area) => area.trim())
        : [];

      const response = await axiosInstance.post(API_PATHS.sessions.create, {
        role: formData.role,
        experience: formData.experience,
        focusAreas: focusAreasArray,
      });

      if (response.data.success) {
        setSessions([response.data.session, ...sessions]);
        setShowCreateForm(false);
        setFormData({ role: '', experience: '', focusAreas: '' });
        // Refresh readiness score after creating a session
        fetchReadinessScore();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to create session. Please try again.';

      if (error.response?.status === 429) {
        alert(
          'AI service is temporarily busy. Please wait 10-15 seconds and try again.'
        );
      } else {
        alert(errorMessage);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    // Prevent deleting default sessions
    if (sessionId.startsWith('default-')) {
      alert('Sample sessions cannot be deleted. Create your own session to practice!');
      return;
    }

    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await axiosInstance.delete(API_PATHS.sessions.delete(sessionId));
      setSessions(sessions.filter((s) => s._id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customSessions = sessions.filter((s) => !s.isDefault);
  const latestCustomSession = customSessions[0];
  const firstName = user?.name?.split(' ')[0] || 'there';
  const totalQuestionsPracticed = sessions.reduce(
    (acc, session) => acc + (session.questions?.length || 0),
    0
  );
  const pinnedQuestions = sessions.reduce((acc, session) => {
    if (!session.questions) return acc;
    return acc + session.questions.filter((q) => q.isPinned).length;
  }, 0);

  const formatMonthDay = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const lastSessionReference = latestCustomSession || sessions[0];
  const lastSessionLabel = lastSessionReference
    ? formatMonthDay(lastSessionReference.updatedAt || lastSessionReference.createdAt) || 'N/A'
    : 'N/A';
  const lastSessionSubtext = lastSessionReference
    ? lastSessionReference.role
    : 'Sample template ready';

  const highlightCards = [
    {
      title: latestCustomSession ? 'Resume last session' : 'Create your first session',
      description: latestCustomSession
        ? `${latestCustomSession.role} • ${latestCustomSession.questions?.length || 0} questions`
        : 'Let AI craft a tailored question set in seconds.',
      icon: Play,
      accent: 'from-indigo-500/10 to-indigo-500/5',
      actionLabel: latestCustomSession ? 'Resume practice' : 'Start building',
      onClick: latestCustomSession
        ? () => navigate(`/interview/${latestCustomSession._id}`)
        : () => setShowCreateForm(true),
    },
    {
      title: 'Spin up a fresh AI set',
      description: 'Pick a role, refine focus, and generate new prompts instantly.',
      icon: Sparkles,
      accent: 'from-orange-500/10 to-rose-500/10',
      actionLabel: 'Create session',
      onClick: () => setShowCreateForm(true),
    },
    {
      title: 'Review streaks & stats',
      description: pinnedQuestions
        ? `${pinnedQuestions} pinned questions waiting to revisit.`
        : 'Head to your profile for progress, streaks, and achievements.',
      icon: TrendingUp,
      accent: 'from-emerald-500/10 to-teal-500/10',
      actionLabel: 'Open profile',
      onClick: () => navigate('/profile'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-orange-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-900 dark:text-slate-100">
      <Navbar onLogoClick={() => navigate('/dashboard')}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="text-right hidden sm:block"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
          <p className="text-xs text-gray-800 dark:text-gray-400">{user?.email}</p>
        </motion.div>
        <motion.button
          onClick={() => navigate('/profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 btn-ghost rounded-xl transition-colors group"
          title="View Profile"
        >
          <User className="w-5 h-5 text-black dark:text-gray-300 group-hover:text-orange-600" />
        </motion.button>
        <ThemeToggle />
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 btn-ghost rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-black dark:text-gray-300" />
        </motion.button>
      </Navbar>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        <div className="absolute -z-10 inset-0 opacity-60">
          <div className="absolute w-72 h-72 bg-orange-400/20 blur-3xl rounded-full -top-10 -left-10" />
          <div className="absolute w-72 h-72 bg-indigo-400/15 blur-3xl rounded-full top-20 right-0" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] mb-12 bg-gradient-to-br from-orange-500 via-rose-500 to-indigo-600 text-white p-8 md:p-12 shadow-[0_35px_80px_rgba(234,88,12,0.35)]"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-16 -left-10 w-56 h-56 bg-white/25 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-4">Interview prep hub</p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Welcome back, {firstName}! Keep the momentum going.
              </h1>
              <p className="text-white/85 text-lg max-w-2xl">
                Resume a saved session, launch a fresh AI interview, or review your streaks without worrying about light/dark readability.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 rounded-2xl bg-white text-orange-600 font-semibold text-base shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate new session
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 rounded-2xl border border-white/40 text-white font-semibold text-base bg-white/10 backdrop-blur flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  View profile insights
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowKnowledgeGaps(!showKnowledgeGaps)}
                  className="px-6 py-3 rounded-2xl border border-white/40 text-white font-semibold text-base bg-white/10 backdrop-blur flex items-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  {showKnowledgeGaps ? 'Hide' : 'Show'} Knowledge Gaps
                </motion.button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1 min-w-[240px]">
              {[
                { label: 'Custom sessions', value: customSessions.length },
                { label: 'Questions logged', value: totalQuestionsPracticed },
                { label: 'Pinned to review', value: pinnedQuestions },
                { label: 'Templates ready', value: defaultSessions.length },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-2xl bg-white/15 border border-white/20">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">{metric.label}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Knowledge Gap Heatmap */}
        <AnimatePresence>
          {showKnowledgeGaps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <KnowledgeGapHeatmap />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weak Concepts Panel - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-12"
        >
          <WeakConceptsPanel />
        </motion.div>

        {/* Interview Readiness Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="glass-card p-8 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Target className="w-7 h-7 text-orange-600" />
                  Interview Readiness Score
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your personalized interview preparation score based on accuracy, coverage, consistency, and depth.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!scoreLoading && readinessScore && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchReadinessScore}
                      className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      title="Refresh score"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowScoreModal(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
                    >
                      View Details
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {scoreLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Calculating your readiness score...</span>
              </div>
            ) : readinessScore ? (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Circular Progress */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(readinessScore.score / 100) * 553} 553`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">{readinessScore.score}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">out of 100</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{readinessScore.insights.level}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{readinessScore.insights.message}</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
                  {[
                    { label: 'Accuracy', value: readinessScore.breakdown.accuracy, max: 40, color: 'from-orange-500 to-pink-500' },
                    { label: 'Coverage', value: readinessScore.breakdown.coverage, max: 25, color: 'from-pink-500 to-purple-500' },
                    { label: 'Consistency', value: readinessScore.breakdown.consistency, max: 20, color: 'from-purple-500 to-indigo-500' },
                    { label: 'Depth', value: readinessScore.breakdown.depth, max: 15, color: 'from-indigo-500 to-blue-500' },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {metric.value} / {metric.max}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Unable to load readiness score. Please try refreshing.</p>
              </div>
            )}
          </div>
        </motion.div>
        {/* Your Sessions Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 drop-shadow-sm">Your Sessions</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: BookOpen,
                value: sessions.length,
                label: 'Total Sessions',
                subtext: `${customSessions.length} custom saved`,
                color: 'orange',
                delay: 0,
              },
              {
                icon: Target,
                value: totalQuestionsPracticed,
                label: 'Questions Practiced',
                subtext: 'Across every role',
                color: 'blue',
                delay: 0.1,
              },
              {
                icon: Clock,
                value: lastSessionLabel,
                label: 'Last Session',
                subtext: lastSessionSubtext,
                color: 'green',
                delay: 0.2,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                orange: 'from-orange-100 to-orange-50 text-orange-600',
                blue: 'from-blue-100 to-blue-50 text-blue-600',
                green: 'from-green-100 to-green-50 text-green-600',
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl p-6 border border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/60 shadow-lg shadow-black/5 dark:shadow-black/40"
                >
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 15% 20%, rgba(15,23,42,0.06) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(15,23,42,0.05) 0, transparent 38%)',
                    }}
                  />
                  <div className="relative flex items-center justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color]} rounded-xl flex items-center justify-center shadow-md ring-1 ring-black/5 dark:ring-white/40`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 font-semibold">
                      Summary
                    </span>
                  </div>
                  <h3 className="relative text-4xl font-extrabold leading-tight mb-1 text-slate-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="relative text-base font-semibold text-slate-700 dark:text-slate-200 leading-snug mb-1">
                    {stat.label}
                  </p>
                  <p className="relative text-sm text-slate-500 dark:text-slate-300">{stat.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {highlightCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.title}
                  type="button"
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={card.onClick}
                  className="text-left"
                >
                  <div className={`h-full p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gradient-to-br ${card.accent} backdrop-blur-sm shadow-sm flex flex-col gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-900 dark:text-white" />
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Quick Action
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-300 inline-flex items-center gap-2">
                      {card.actionLabel}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

        {/* Session Cards Grid Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end items-center mb-6"
        >
          <motion.button
            onClick={() => setShowCreateForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 btn-primary text-white font-semibold rounded-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            New Session
          </motion.button>
        </motion.div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <BookOpen className="w-10 h-10 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first interview prep session to get started!
            </p>
            <motion.button
              onClick={() => setShowCreateForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/30"
            >
              <Plus className="w-5 h-5" />
              Create Session
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Default Sessions Section */}
            {defaultSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sample Sessions</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {defaultSessions.length} Templates
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {defaultSessions.map((session, index) => {
                const roleInitials = {
                  'Frontend Developer': 'FD',
                  'Backend Developer': 'BD',
                  'Full Stack Developer': 'FS',
                  'Data Analyst': 'DA',
                  'Data Scientist': 'DS',
                  'DevOps Engineer': 'DE',
                  'UI/UX Designer': 'UD',
                  'Mobile App Developer': 'MA',
                  'AI/ML Engineer': 'AE',
                  'Product Manager': 'PM',
                };

                const getInitials = (role) => {
                  return roleInitials[role] || role.substring(0, 2).toUpperCase();
                };

                const formatDate = (dateString) => {
                  const date = new Date(dateString);
                  const day = date.getDate();
                  const month = date.toLocaleString('en', { month: 'short' });
                  const year = date.getFullYear();
                  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                  return `${day}${suffix} ${month} ${year}`;
                };

                const theme = getRoleTheme(session.role);

                return (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => navigate(`/interview/${session._id}`)}
                    style={{ background: theme.gradient, boxShadow: theme.glow }}
                    className="relative overflow-hidden rounded-2xl p-6 border border-white/10 elevated-hover transition-all duration-300 cursor-pointer backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/10 via-white/0 to-black/20" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0, transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12) 0, transparent 30%)' }} />

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session._id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>

                    <div className="relative flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/25 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white font-semibold">
                        {getInitials(session.role)}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-lg font-semibold text-white leading-tight mb-1">
                          {session.role}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-1">
                          {session.focusAreas && session.focusAreas.length > 0
                            ? session.focusAreas.join(', ')
                            : 'General preparation'}
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-wrap gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border border-white/15"
                        style={{ background: theme.chipBg, color: theme.chipText }}
                      >
                        Exp: {session.experience}
                      </span>
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border border-white/15"
                        style={{ background: theme.chipBg, color: theme.chipText }}
                      >
                        {session.questions.length} Q&A
                      </span>
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border border-white/15"
                        style={{ background: theme.chipBg, color: theme.chipText }}
                      >
                        {formatDate(session.updatedAt || session.createdAt)}
                      </span>
                    </div>

                    <p className="relative text-sm text-white/90 leading-relaxed">
                      Preparing for {session.role.toLowerCase()} interviews with comprehensive Q&A practice
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
            )}

            {/* User Created Sessions Section */}
            {sessions.filter(s => !s.isDefault).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-600 to-orange-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Sessions</h2>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    {sessions.filter(s => !s.isDefault).length} Custom
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {sessions.filter(s => !s.isDefault).map((session, index) => {
                      const roleInitials = {
                        'Frontend Developer': 'FD',
                        'Backend Developer': 'BD',
                        'Full Stack Developer': 'FS',
                        'Data Analyst': 'DA',
                        'Data Scientist': 'DS',
                        'DevOps Engineer': 'DE',
                        'UI/UX Designer': 'UD',
                        'Mobile App Developer': 'MA',
                        'AI/ML Engineer': 'AE',
                        'Product Manager': 'PM',
                      };

                      const getInitials = (role) => {
                        return roleInitials[role] || role.substring(0, 2).toUpperCase();
                      };

                      const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        const day = date.getDate();
                        const month = date.toLocaleString('en', { month: 'short' });
                        const year = date.getFullYear();
                        return `${day} ${month} ${year}`;
                      };

                      const theme = getRoleTheme(session.role);

                      return (
                        <motion.div
                          key={session._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => navigate(`/interview/${session._id}`)}
                          style={{ background: theme.gradient, boxShadow: theme.glow }}
                          className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 group elevated-hover backdrop-blur-xl border border-white/10"
                        >
                          <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/10 via-white/0 to-black/20" />
                          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.16) 0, transparent 34%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.12) 0, transparent 30%)' }} />

                          {!session.isDefault && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session._id);
                              }}
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute top-4 right-4 p-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10 shadow-sm z-10 group-hover:opacity-100 opacity-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}

                          <div className="relative flex items-center gap-4 mb-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                              className="w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl shadow-md flex items-center justify-center font-bold text-white text-lg"
                            >
                              {getInitials(session.role)}
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white text-lg line-clamp-1">
                                {session.role}
                              </h3>
                            </div>
                          </div>

                          <div className="relative flex items-center gap-3 mb-3 text-sm text-white/90 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/15" style={{ background: theme.chipBg, color: theme.chipText }}>
                              <span className="font-medium">Exp:</span> {session.experience}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/15" style={{ background: theme.chipBg, color: theme.chipText }}>
                              <span className="font-medium">{session.questions.length}</span> Q&A
                            </span>
                          </div>

                          <div className="relative flex items-center justify-between text-xs text-white/90 mb-3">
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/15" style={{ background: theme.chipBg, color: theme.chipText }}>
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(session.updatedAt || session.createdAt)}
                            </span>
                          </div>

                          <p className="relative text-sm text-white/90 leading-relaxed line-clamp-2">
                            Preparing for {session.role.toLowerCase()} interviews with comprehensive Q&A practice
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-black/50 w-full max-w-lg relative"
            >
              <motion.button
                onClick={() => setShowCreateForm(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="p-8 pb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Session</h2>
                <p className="text-gray-600 dark:text-gray-400">Generate AI-powered interview questions</p>
              </div>

              <form onSubmit={handleCreateSession} className="px-8 pb-8">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Role *</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    required
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 2 years, 5+ years, Entry level"
                    required
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus Areas <span className="text-gray-500 dark:text-gray-400">(Optional)</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={formData.focusAreas}
                    onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:bg-slate-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate multiple areas with commas</p>
                </div>

                <motion.button
                  type="submit"
                  disabled={creating}
                  whileHover={!creating ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!creating ? { scale: 0.98 } : {}}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-orange-400 disabled:to-orange-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                      Generating Questions...
                    </>
                  ) : (
                    'Create Session'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Readiness Score Details Modal */}
      <AnimatePresence>
        {showScoreModal && readinessScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowScoreModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-gray-200 dark:border-gray-700 px-8 py-6 rounded-t-3xl">
                <motion.button
                  onClick={() => setShowScoreModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Readiness Score Insights</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Detailed breakdown of your interview preparation metrics</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Current Score */}
                <div className="text-center py-6 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-center gap-4">
                    <Target className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">Current Score</p>
                      <p className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        {readinessScore.score}
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mt-4">{readinessScore.insights.level}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{readinessScore.insights.message}</p>
                </div>

                {/* Stats Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Sessions', value: readinessScore.stats.totalSessions },
                      { label: 'Questions Answered', value: `${readinessScore.stats.answeredQuestions} / ${readinessScore.stats.totalQuestions}` },
                      { label: 'Accuracy Rate', value: `${readinessScore.stats.accuracyRate}%` },
                      { label: 'Unique Roles', value: readinessScore.stats.uniqueRoles },
                      { label: 'Focus Areas', value: readinessScore.stats.uniqueFocusAreas },
                      { label: 'Pinned Questions', value: readinessScore.stats.pinnedQuestions },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Components */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Score Components</h3>
                  <div className="space-y-6">
                    {[
                      { 
                        label: 'Accuracy Score', 
                        value: readinessScore.breakdown.accuracy, 
                        max: 40, 
                        color: 'from-orange-500 to-pink-500',
                        description: 'Based on your correct answer rate and self-assessment accuracy'
                      },
                      { 
                        label: 'Coverage Score', 
                        value: readinessScore.breakdown.coverage, 
                        max: 25, 
                        color: 'from-pink-500 to-purple-500',
                        description: 'Diversity of roles and focus areas you\'ve practiced'
                      },
                      { 
                        label: 'Consistency Score', 
                        value: readinessScore.breakdown.consistency, 
                        max: 20, 
                        color: 'from-purple-500 to-indigo-500',
                        description: 'Regular practice habits and recent activity streak'
                      },
                      { 
                        label: 'Depth Score', 
                        value: readinessScore.breakdown.depth, 
                        max: 15, 
                        color: 'from-indigo-500 to-blue-500',
                        description: 'Engagement depth through session completion and pinned questions'
                      },
                    ].map((metric) => (
                      <div key={metric.label} className="p-5 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{metric.label}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{metric.description}</p>
                          </div>
                          <span className="text-2xl font-bold bg-gradient-to-r {metric.color} bg-clip-text text-transparent">
                            {metric.value}/{metric.max}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${(metric.value / metric.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personalized Recommendations</h3>
                  <div className="space-y-3">
                    {readinessScore.insights.recommendations.map((rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

