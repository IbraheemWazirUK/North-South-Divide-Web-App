import './App.css';
import Canvas from './Canvas'

function App() {
  const title = "Southerners > Northerners"
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
