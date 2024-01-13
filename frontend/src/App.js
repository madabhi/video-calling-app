import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://video-calling-app-beige.vercel.app/");

function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getMedia();
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setUsers(data.name);
      setCallerSignal(data.signal);
    });
    socket.on("callEnded", () => {
      setCallEnded(true);
      window.location.reload();
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream; // Corrected this line
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    socket.emit("endCall", { idToCall: caller });
    setStream(null);
    window.location.reload();
  };

  return (
    <>
      <div className="w-full flex flex-col justify-between font-bold p-32 bg-slate-900 text-white min-h-screen items-center">
        <h1 className="text-3xl">Abhinav Singh Video Calling </h1>
        <div className="container flex flex-col gap-4">
          <div className="video-container">
            <div className="video flex gap-20">
              {stream && (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  className="w-[500px]  rounded-md"
                />
              )}

              {callAccepted && !callEnded ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className="w-[500px] rounded-md"
                />
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center ">
              <input
                id="filled-basic"
                label="Name"
                variant="filled"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="w-96 rounded p-1 text-black"
              />
              <CopyToClipboard text={me}>
                <button
                  variant="contained"
                  color="primary"
                  className="bg-white w-20 text-black rounded-lg p-1"
                >
                  Copy ID
                </button>
              </CopyToClipboard>
            </div>
            <div className="flex gap-4">
              <input
                id="filled-basic"
                label="ID to call"
                variant="filled"
                value={idToCall}
                placeholder="Enter ID to call"
                onChange={(e) => setIdToCall(e.target.value)}
                className="w-96 rounded p-1 text-black"
              />
              {callAccepted && !callEnded ? (
                <button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}
                  className="bg-red-500 w-20 text-black rounded-lg p-1"
                >
                  End Call
                </button>
              ) : (
                <button
                  variant="contained"
                  color="primary"
                  onClick={() => callUser(idToCall)}
                  className="bg-white w-16 text-black rounded-lg p-1"
                >
                  Call
                </button>
              )}
            </div>
          </div>
          <div>
            {receivingCall && !callAccepted ? (
              <div className="caller">
                <h1>{users} is calling...</h1>
                <button
                  variant="contained"
                  color="primary"
                  onClick={answerCall}
                  className="bg-green-500 w-16 text-black rounded-lg p-1"
                >
                  Answer
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
