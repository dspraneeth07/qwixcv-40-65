import React, { useState, useRef } from 'react';
import Layout from "@/components/layout/Layout";
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
