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
  }
];

export default defaultSessions;
