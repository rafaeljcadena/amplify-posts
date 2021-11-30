import './App.css';
import DisplayPosts from './components/DisplayPosts';
import CreatePost from './components/CreatePost';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


function App({ user, signOut }) {
  console.log({ user });
  return (
    <div className="App" style={{ padding: 30 }}>
      <button onClick={signOut}>SignOut</button><br/>
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
