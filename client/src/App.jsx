import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

import useWebRTC from "./hooks/useWebRTC";

import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [timer, setTimer] = useState(60);
  const [users, setUsers] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disconnected, setDisconnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  const {
    joinVoice,
    leaveVoice,
    toggleMute,
    inVoice,
    muted,
    speaking,
    peers
  } = useWebRTC(users);

  // 🔌 SOCKET CONNECTION
  useEffect(() => {
    const onConnect = () => {
      setSocketId(socket.id);
      setLoading(false);
      setDisconnected(false);
    };

    const onDisconnect = () => {
      setDisconnected(true);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // ❌ ERROR
  useEffect(() => {
    const handleError = (msg) => alert(msg);

    socket.on("errorMsg", handleError);

    return () => {
      socket.off("errorMsg", handleError);
    };
  }, []);

  // 🎉 EMOJI EFFECT
  const handleEmoji = (emoji) => {
    const temp = [];

    for (let i = 0; i < 6; i++) {
      const id = Date.now() + Math.random();

      temp.push({
        id,
        emoji,
        x: Math.random() * 100,
        scale: 0.8 + Math.random() * 1.5,
        rotate: Math.random() * 360,
        duration: 1500 + Math.random() * 1000
      });

      setTimeout(() => {
        setEmojis((prev) =>
          prev.filter((e) => e.id !== id)
        );
      }, 2500);
    }

    setEmojis((prev) => [...prev, ...temp]);
  };

  // 🔊 WEBRTC
  useEffect(() => {
    const handleOffer = async ({ offer, from }) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });

      peers.current[from] = pc;

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            candidate: e.candidate,
            to: from
          });
        }
      };

      pc.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
        audio.play().catch(console.log);
      };

      await pc.setRemoteDescription(offer);

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        answer,
        to: from
      });
    };

    const handleAnswer = async ({
      answer,
      from
    }) => {
      const pc = peers.current[from];
      if (pc) await pc.setRemoteDescription(answer);
    };

    const handleIce = async ({
      candidate,
      from
    }) => {
      const pc = peers.current[from];
      if (pc) await pc.addIceCandidate(candidate);
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
    };
  }, []);

  // 📡 MAIN EVENTS
  useEffect(() => {
    socket.on("roomData", (r) => {
      setRoom(r);
      setUsers(r.users || []);
    });

    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("timer", setTimer);

    socket.on("updateUsers", setUsers);

    socket.on("receiveEmoji", handleEmoji);

    socket.on("roomEnded", () => {
      alert("⏳ Room ended!");
      leaveRoom();
    });

    return () => {
      socket.off("roomData");
      socket.off("receiveMessage");
      socket.off("timer");
      socket.off("updateUsers");
      socket.off("receiveEmoji");
      socket.off("roomEnded");
    };
  }, []);

  // 🚀 ACTIONS
  const joinRoom = () =>
    socket.emit("joinRoom");

  const createRoom = (timer) =>
    socket.emit("createRoom", { timer });

  const joinByCode = (code) =>
    socket.emit("joinByCode", { code });

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", message);

    setMessage("");
  };

  const sendEmoji = (emoji) =>
    socket.emit("sendEmoji", emoji);

  const leaveRoom = () => {
    socket.emit("leaveRoom");

    leaveVoice();

    setRoom(null);
    setChat([]);
    setUsers([]);
    setTimer(60);
    setMessage("");
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold animate-pulse">
          Connecting...
        </h1>
      </div>
    );
  }

  // ❌ DISCONNECTED
  if (disconnected) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          ⚠️ Disconnected
        </h1>
      </div>
    );
  }

  // 🏠 HOME
  if (!room) {
    return (
      <Home
        joinRoom={joinRoom}
        createRoom={createRoom}
        joinByCode={joinByCode}
      />
    );
  }

  // 💬 ROOM
  return (
    <>
      <div className="emoji-container">
        {emojis.map((e) => (
          <span
            key={e.id}
            className="emoji"
            style={{
              left: `${e.x}%`,
              transform: `scale(${e.scale}) rotate(${e.rotate}deg)`,
              animationDuration: `${e.duration}ms`
            }}
          >
            {e.emoji}
          </span>
        ))}
      </div>

      <Room
        room={room}
        users={users}
        timer={timer}
        chat={chat}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        joinVoice={joinVoice}
        leaveVoice={leaveVoice}
        toggleMute={toggleMute}
        inVoice={inVoice}
        muted={muted}
        speaking={speaking}
        socketId={socketId}
        sendEmoji={sendEmoji}
        leaveRoom={leaveRoom}
      />
    </>
  );
}

export default App;