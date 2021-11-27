import './App.css';
import DisplayPosts from './components/DisplayPosts';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <div className="App" style={{ padding: 30 }}>
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default App;
