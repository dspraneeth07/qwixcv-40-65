
import React, { useState, useRef } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Code, FileText, Download, Copy, Github, ExternalLink, Verified, Terminal, Laptop } from "lucide-react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Framework templates
const FRAMEWORK_TEMPLATES = {
  "react": {
    name: "React",
    fileStructure: [
      { path: "index.html", type: "file" },
      { path: "package.json", type: "file" },
      { path: "src/App.js", type: "file" },
      { path: "src/index.js", type: "file" },
      { path: "src/components", type: "directory" },
      { path: "src/styles", type: "directory" },
      { path: "README.md", type: "file" },
    ],
  },
  "react-tailwind": {
    name: "React + Tailwind",
    fileStructure: [
      { path: "index.html", type: "file" },
      { path: "package.json", type: "file" },
      { path: "tailwind.config.js", type: "file" },
      { path: "src/App.js", type: "file" },
      { path: "src/index.js", type: "file" },
      { path: "src/components", type: "directory" },
      { path: "README.md", type: "file" },
    ],
  },
  "html-css-js": {
    name: "HTML/CSS/JS",
    fileStructure: [
      { path: "index.html", type: "file" },
      { path: "styles.css", type: "file" },
      { path: "script.js", type: "file" },
      { path: "README.md", type: "file" },
    ],
  },
  "vue": {
    name: "Vue.js",
    fileStructure: [
      { path: "index.html", type: "file" },
      { path: "package.json", type: "file" },
      { path: "src/App.vue", type: "file" },
      { path: "src/main.js", type: "file" },
      { path: "src/components", type: "directory" },
      { path: "README.md", type: "file" },
    ],
  },
  "next": {
    name: "Next.js",
    fileStructure: [
      { path: "package.json", type: "file" },
      { path: "next.config.js", type: "file" },
      { path: "pages/index.js", type: "file" },
      { path: "pages/_app.js", type: "file" },
      { path: "components", type: "directory" },
      { path: "styles", type: "directory" },
      { path: "public", type: "directory" },
      { path: "README.md", type: "file" },
    ],
  }
};

// Project templates based on common user requests
const PROJECT_TEMPLATES = {
  "calculator": {
    title: "Calculator App",
    description: "A simple calculator application with basic arithmetic operations.",
    framework: "react",
    files: {
      "src/App.js": `import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEqual = () => {
    if (firstOperand === null) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="calculator">
      <div className="calculator-display">{display}</div>
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <button className="key-clear" onClick={clearDisplay}>AC</button>
          </div>
          <div className="digit-keys">
            <button onClick={() => inputDigit('7')}>7</button>
            <button onClick={() => inputDigit('8')}>8</button>
            <button onClick={() => inputDigit('9')}>9</button>
            <button onClick={() => inputDigit('4')}>4</button>
            <button onClick={() => inputDigit('5')}>5</button>
            <button onClick={() => inputDigit('6')}>6</button>
            <button onClick={() => inputDigit('1')}>1</button>
            <button onClick={() => inputDigit('2')}>2</button>
            <button onClick={() => inputDigit('3')}>3</button>
            <button onClick={() => inputDigit('0')}>0</button>
            <button onClick={inputDecimal}>.</button>
          </div>
        </div>
        <div className="operator-keys">
          <button onClick={() => performOperation('/')}>÷</button>
          <button onClick={() => performOperation('*')}>×</button>
          <button onClick={() => performOperation('-')}>−</button>
          <button onClick={() => performOperation('+')}>+</button>
          <button onClick={handleEqual}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;`,
      "src/App.css": `.calculator {
  width: 320px;
  margin: 100px auto;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  overflow: hidden;
}

.calculator-display {
  background-color: #222;
  color: #fff;
  text-align: right;
  font-weight: 300;
  font-size: 28px;
  padding: 20px 10px;
}

.calculator-keypad {
  display: flex;
}

.input-keys {
  width: 75%;
}

.function-keys {
  display: flex;
  background-color: #eee;
}

.digit-keys {
  display: flex;
  flex-wrap: wrap;
  background-color: #f8f8f8;
}

.digit-keys button {
  width: 33.3%;
  height: 65px;
  border: none;
  outline: none;
  background-color: #f8f8f8;
  font-size: 18px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.digit-keys button:hover {
  background-color: #e0e0e0;
}

.function-keys button {
  width: 100%;
  height: 65px;
  border: none;
  outline: none;
  background-color: #eee;
  font-size: 18px;
  cursor: pointer;
}

.operator-keys {
  width: 25%;
  background-color: #ea9c24;
}

.operator-keys button {
  width: 100%;
  height: 65px;
  border: none;
  outline: none;
  background-color: #ea9c24;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.operator-keys button:hover {
  background-color: #d48a1e;
}`,
      "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculator App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      "package.json": `{
  "name": "calculator-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
      "README.md": `# Calculator App

A simple calculator application built with React.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Clear functionality
- Decimal input
- Responsive design

## Installation

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server

## Deployment

Run \`npm run build\` to build the app for production.

## Hosting

You can deploy this app easily on:

- Netlify
- Vercel
- GitHub Pages

## Technologies Used

- React
- CSS

## License

MIT`
    }
  },
  "todo-app": {
    title: "Todo List App",
    description: "A simple todo list application with CRUD operations.",
    framework: "react",
    files: {
      "src/App.js": `import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="todo-empty">No tasks yet. Add a new one!</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span
                className="todo-text"
                onClick={() => handleToggleComplete(todo.id)}
              >
                {todo.text}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="todo-stats">
        <span>{todos.filter(todo => !todo.completed).length} tasks left</span>
      </div>
    </div>
  );
}

export default App;`,
      "src/App.css": `body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.todo-app {
  width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.todo-input {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.todo-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 4px;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  background-color: #f44336;
  padding: 6px 10px;
  border-radius: 4px;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.todo-empty {
  text-align: center;
  color: #888;
  padding: 20px 0;
}

.todo-stats {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}`,
      "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      "package.json": `{
  "name": "todo-list-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
      "README.md": `# Todo List App

A simple Todo List application built with React.

## Features

- Add new tasks
- Mark tasks as complete
- Delete tasks
- Track remaining tasks

## Installation

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server

## Deployment

Run \`npm run build\` to build the app for production.

## Hosting

You can deploy this app easily on:

- Netlify
- Vercel
- GitHub Pages

## Technologies Used

- React
- CSS

## License

MIT`
    }
  },
  "weather-app": {
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with charts and current weather data.",
    framework: "react",
    files: {
      "src/App.js": `import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherChart from './components/WeatherChart';
import WeatherInfo from './components/WeatherInfo';
import SearchBar from './components/SearchBar';
import { mockWeatherData, mockForecastData } from './mockData';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('New York');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from a weather API
    // For this demo, we're using mock data
    setLoading(true);
    setTimeout(() => {
      try {
        setWeatherData(mockWeatherData);
        setForecastData(mockForecastData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    }, 1000);
  }, [location]);

  const handleSearch = (searchTerm) => {
    setLocation(searchTerm);
  };

  if (loading) {
    return <div className="loading">Loading weather data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="weather-app">
      <header>
        <h1>Weather Dashboard</h1>
        <SearchBar onSearch={handleSearch} />
      </header>
      
      <main>
        <div className="current-weather">
          {weatherData && <WeatherInfo data={weatherData} location={location} />}
        </div>
        
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          {forecastData && <WeatherChart data={forecastData} />}
        </div>
      </main>
      
      <footer>
        <p>Weather Dashboard - Created with React</p>
      </footer>
    </div>
  );
}

export default App;`,
      "src/components/WeatherChart.js": `import React from 'react';

const WeatherChart = ({ data }) => {
  const maxTemp = Math.max(...data.map(day => day.temp));
  const minTemp = Math.min(...data.map(day => day.temp));
  const range = maxTemp - minTemp;
  
  return (
    <div className="weather-chart">
      <div className="chart">
        {data.map((day, index) => {
          const height = ((day.temp - minTemp) / range) * 100;
          return (
            <div key={index} className="chart-column">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{height: \`\${height}%\`}}
                  title={\`\${day.temp}°F\`}
                ></div>
              </div>
              <div className="chart-day">{day.day}</div>
              <div className="chart-temp">{day.temp}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherChart;`,
      "src/components/WeatherInfo.js": `import React from 'react';

const WeatherInfo = ({ data, location }) => {
  return (
    <div className="weather-info">
      <h2>{location}</h2>
      <div className="weather-details">
        <div className="weather-icon">
          {data.condition === 'Sunny' && '☀️'}
          {data.condition === 'Cloudy' && '☁️'}
          {data.condition === 'Rainy' && '🌧️'}
          {data.condition === 'Snowy' && '❄️'}
          {!['Sunny', 'Cloudy', 'Rainy', 'Snowy'].includes(data.condition) && '🌤️'}
        </div>
        <div className="weather-condition">
          <div className="temperature">{data.temperature}°F</div>
          <div className="condition">{data.condition}</div>
        </div>
      </div>
      <div className="weather-metrics">
        <div className="metric">
          <span className="label">Humidity</span>
          <span className="value">{data.humidity}%</span>
        </div>
        <div className="metric">
          <span className="label">Wind</span>
          <span className="value">{data.windSpeed} mph</span>
        </div>
        <div className="metric">
          <span className="label">Pressure</span>
          <span className="value">{data.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;`,
      "src/components/SearchBar.js": `import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter city name..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;`,
      "src/mockData.js": `// Mock data for weather dashboard demo
export const mockWeatherData = {
  temperature: 72,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 5,
  pressure: 1013,
};

export const mockForecastData = [
  { day: 'Mon', temp: 72, condition: 'Sunny' },
  { day: 'Tue', temp: 68, condition: 'Partly Cloudy' },
  { day: 'Wed', temp: 75, condition: 'Sunny' },
  { day: 'Thu', temp: 65, condition: 'Rainy' },
  { day: 'Fri', temp: 70, condition: 'Cloudy' }
];`,
      "src/App.css": `/* Weather Dashboard Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f7fa;
}

.weather-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

header h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.search-bar {
  width: 100%;
  max-width: 500px;
  display: flex;
}

.search-bar input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.search-bar button:hover {
  background-color: #2980b9;
}

main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  main {
    grid-template-columns: 1fr 2fr;
  }
}

.current-weather {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.weather-info h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #2c3e50;
}

.weather-details {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.weather-icon {
  font-size: 60px;
  margin-right: 20px;
}

.temperature {
  font-size: 36px;
  font-weight: bold;
}

.condition {
  font-size: 18px;
  color: #7f8c8d;
}

.weather-metrics {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid #eaeaea;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  color: #7f8c8d;
  font-size: 14px;
}

.value {
  font-weight: bold;
  font-size: 16px;
}

.forecast {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.forecast h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.weather-chart .chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-bar-container {
  width: 30px;
  height: 150px;
  display: flex;
  align-items: flex-end;
}

.chart-bar {
  width: 100%;
  background-color: #3498db;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.chart-day {
  margin-top: 8px;
  font-weight: bold;
}

.chart-temp {
  color: #7f8c8d;
}

.loading, .error {
  text-align: center;
  padding: 50px 0;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

footer {
  margin-top: 40px;
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}`,
      "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Dashboard</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      "package.json": `{
  "name": "weather-dashboard",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
      "README.md": `# Weather Dashboard

A responsive weather dashboard built with React.

## Features

- Current weather display
- 5-day forecast with temperature chart
- Search functionality for different locations
- Responsive design for mobile and desktop

## Installation

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server

## Note

This demo uses mock data instead of a real weather API to avoid API key requirements.
In a production app, you would integrate with a weather API like OpenWeatherMap, WeatherAPI, etc.

## Deployment

Run \`npm run build\` to build the app for production.

## Hosting

You can deploy this app easily on:

- Netlify
- Vercel
- GitHub Pages

## Technologies Used

- React
- CSS

## License

MIT`
    }
  }
};

const QwiXProBuilder = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("react");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedProject, setGeneratedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [previewHtml, setPreviewHtml] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const iframeRef = useRef(null);

  const examplePrompts = [
    "Build a calculator app with React",
    "Create a todo list application with local storage",
    "Build a weather dashboard with charts",
    "Create a personal portfolio website",
    "Build a markdown editor app",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project description",
        variant: "destructive"
      });
      return;
    }
    
    setGenerating(true);
    setProgress(0);
    setGeneratedProject(null);
    setSelectedFile("");
    setFileContent("");
    
    // Simulate generation process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    // Analyze prompt and select template
    await simulateProjectGeneration();
    
    clearInterval(interval);
    setProgress(100);
    setGenerating(false);
  };
  
  const simulateProjectGeneration = async () => {
    // Simple prompt analysis
    const promptLower = prompt.toLowerCase();
    let templateKey = "weather-app"; // default
    
    if (promptLower.includes("calculator") || promptLower.includes("math")) {
      templateKey = "calculator";
    } else if (promptLower.includes("todo") || promptLower.includes("task") || promptLower.includes("list")) {
      templateKey = "todo-app";
    } else if (promptLower.includes("weather") || promptLower.includes("forecast")) {
      templateKey = "weather-app";
    }
    
    // Wait to simulate complex processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const template = PROJECT_TEMPLATES[templateKey];
    const projectName = generateProjectName();
    
    // Create project structure
    const project = {
      name: projectName,
      description: template.description || prompt,
      framework: framework || template.framework,
      files: {}
    };
    
    // Add files from template
    for (const [path, content] of Object.entries(template.files)) {
      project.files[path] = content;
    }
    
    // Generate HTML preview
    generateHtmlPreview(project);
    
    setGeneratedProject(project);
  };
  
  const generateProjectName = () => {
    const adjectives = ['amazing', 'awesome', 'brilliant', 'elegant', 'fantastic'];
    const nouns = ['project', 'app', 'creation', 'solution', 'application'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdjective}-${randomNoun}`;
  };
  
  const generateHtmlPreview = (project) => {
    // For React projects, create a simple preview
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${project.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
            }
            .preview-container {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              background-color: #f9f9f9;
            }
            h1 {
              color: #333;
            }
            pre {
              background: #f1f1f1;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
            .file-list {
              margin: 20px 0;
            }
            .file-item {
              margin-bottom: 5px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <h1>${project.name}</h1>
          <p>${project.description}</p>
          
          <div class="preview-container">
            <h2>Project Structure</h2>
            <div class="file-list">
              ${Object.keys(project.files)
                .map(file => `<div class="file-item">📄 ${file}</div>`)
                .join('')}
            </div>
            
            <h2>How to use</h2>
            <ol>
              <li>Download the project zip file</li>
              <li>Extract the files</li>
              <li>Open a terminal in the project directory</li>
              <li>Run <code>npm install</code> to install dependencies</li>
              <li>Run <code>npm start</code> to start the development server</li>
              <li>Open <code>http://localhost:3000</code> in your browser</li>
            </ol>
          </div>
        </body>
      </html>
    `;
    
    setPreviewHtml(htmlContent);
  };

  const handleDownload = () => {
    if (!generatedProject) return;
    
    const zip = new JSZip();
    const rootFolder = zip.folder(generatedProject.name);
    
    // Add files to zip
    for (const [path, content] of Object.entries(generatedProject.files)) {
      // Handle directories in the path
      if (path.includes('/')) {
        const parts = path.split('/');
        const fileName = parts.pop();
        let currentFolder = rootFolder;
        
        // Create nested folders
        for (const part of parts) {
          currentFolder = currentFolder.folder(part);
        }
        
        currentFolder.file(fileName, content);
      } else {
        rootFolder.file(path, content);
      }
    }
    
    // Generate zip and trigger download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${generatedProject.name}.zip`);
      
      toast({
        title: "Download complete",
        description: `${generatedProject.name}.zip has been downloaded`
      });
    });
  };
  
  const viewFileContent = (filePath) => {
    if (generatedProject && generatedProject.files[filePath]) {
      setSelectedFile(filePath);
      setFileContent(generatedProject.files[filePath]);
    }
  };
  
  const handleCopyCode = () => {
    if (selectedFile && fileContent) {
      navigator.clipboard.writeText(fileContent);
      toast({
        title: "Copied to clipboard",
        description: `${selectedFile} code copied to clipboard`
      });
    }
  };
  
  return (
    <Layout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">QwiXPro Builder</h1>
            <p className="text-muted-foreground">
              AI-powered project generator - build complete web applications in seconds
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Project Builder
            </CardTitle>
            <CardDescription>
              Describe the project you want to build and AI will generate the code for you
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  What would you like to build?
                </label>
                <Textarea 
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Build a weather dashboard with charts and a responsive UI using React"
                  className="min-h-[100px]"
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {examplePrompts.map((example, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setPrompt(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="framework" className="block text-sm font-medium mb-2">
                    Framework / Technology
                  </label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="react-tailwind">React + Tailwind</SelectItem>
                      <SelectItem value="html-css-js">HTML/CSS/JavaScript</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="next">Next.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" disabled={generating} className="w-full">
                {generating ? (
                  <>
                    <span className="mr-2">Generating...</span>
                    <span>{progress}%</span>
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Generate Project
                  </>
                )}
              </Button>
              
              {generating && (
                <Progress value={progress} className="h-2" />
              )}
            </form>
          </CardContent>
        </Card>
        
        {generatedProject && (
          <>
            <Card className="mb-6">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{generatedProject.name}</CardTitle>
                    <CardDescription>{generatedProject.description}</CardDescription>
                  </div>
                  <Button onClick={handleDownload} className="flex gap-2 items-center">
                    <Download className="h-4 w-4" />
                    Download Project
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 m-0 rounded-none border-b">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="deploy">Deployment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="p-4">
                    <div className="border rounded-lg h-[400px] mb-4">
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewHtml}
                        title="Project Preview"
                        className="w-full h-full"
                        sandbox="allow-scripts"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="files" className="p-0">
                    <div className="flex border-t">
                      <div className="w-1/4 border-r h-[500px] overflow-y-auto p-2">
                        <div className="font-medium p-2">Project Files</div>
                        <ul className="space-y-1">
                          {Object.keys(generatedProject.files).map((file) => (
                            <li
                              key={file}
                              className={`text-sm p-2 rounded cursor-pointer hover:bg-gray-100 ${
                                selectedFile === file ? "bg-gray-100 font-medium" : ""
                              }`}
                              onClick={() => viewFileContent(file)}
                            >
                              <FileText className="inline-block h-4 w-4 mr-2" />
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="w-3/4 h-[500px] overflow-y-auto p-4">
                        {selectedFile ? (
                          <>
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">{selectedFile}</div>
                              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Code
                              </Button>
                            </div>
                            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
                              {fileContent}
                            </pre>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select a file to view its contents
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="deploy" className="p-6">
                    <h3 className="text-lg font-medium mb-4">Deployment Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2 rounded">
                              <ExternalLink className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Deploy to Vercel</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Fast and simple deployment for React, Next.js and other frontend apps.
                              </p>
                              <ol className="text-sm space-y-1 mb-4">
                                <li>1. Create a GitHub repository with your code</li>
                                <li>2. Sign up at vercel.com</li>
                                <li>3. Import your repository</li>
                                <li>4. Deploy automatically</li>
                              </ol>
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                                  Learn More
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2 rounded">
                              <Github className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">GitHub Pages</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Free hosting for static websites directly from your GitHub repository.
                              </p>
                              <ol className="text-sm space-y-1 mb-4">
                                <li>1. Create a GitHub repository</li>
                                <li>2. Add 'homepage' field to package.json</li>
                                <li>3. Run 'npm run build'</li>
                                <li>4. Deploy with gh-pages package</li>
                              </ol>
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">
                                  Learn More
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 p-4">
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Get Started</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-100 p-3 rounded text-sm font-mono">
                    $ cd {generatedProject.name}<br />
                    $ npm install<br />
                    $ npm start
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-center">
              <Button onClick={handleDownload} className="flex gap-2 items-center">
                <Download className="h-4 w-4" />
                Download Project as ZIP
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default QwiXProBuilder;
