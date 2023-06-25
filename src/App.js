import AudioComponent from "./components/AudioComponent";
import { onConnect, onDisconnect } from "./socket/SocketCallbacks";
import { socket } from "./socket/socket";
import "./App.css";

function App() {
  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return (
    <div className="App">
      <AudioComponent socket={socket} />
    </div>
  );
}

export default App;
