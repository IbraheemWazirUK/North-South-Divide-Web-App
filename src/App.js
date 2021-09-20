import './App.css';
import Canvas from './Canvas'

function App() {
  const title = "North-South Divide"
  return (
    <div className="App">
      <div className="content">
        <h1> {title} </h1>
      </div>
      <Canvas />
    </div>
  );
}

export default App;
