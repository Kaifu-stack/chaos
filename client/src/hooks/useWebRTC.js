import { useRef, useState } from "react";
import { socket } from "../socket/socket";

export default function useWebRTC(users) {
    const peers = useRef({});
    const localStream = useRef(null);

    const [inVoice, setInVoice] = useState(false);
    const [muted, setMuted] = useState(false);
    const [speaking, setSpeaking] = useState(false); //

    let audioContext;
    let analyser;
    let dataArray;

    const detectSpeaking = () => {
        if (!localStream.current) return;

        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(localStream.current);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const check = () => {
            analyser.getByteFrequencyData(dataArray);

            const volume =
                dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            if (volume > 20) {
                setSpeaking(true);
            } else {
                setSpeaking(false);
            }

            requestAnimationFrame(check);
        };

        check();
    };

    const createPeer = (userId) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("ice-candidate", {
                    candidate: e.candidate,
                    to: userId
                });
            }
        };

        pc.ontrack = (e) => {
            const audio = document.createElement("audio");
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
        };

        return pc;
    };

    const joinVoice = async () => {
        if (inVoice) return;

        localStream.current = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        detectSpeaking();

        users.forEach((user) => {
            if (user.id === socket.id) return;

            const pc = createPeer(user.id);

            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current);
            });

            pc.createOffer().then((offer) => {
                pc.setLocalDescription(offer);

                socket.emit("offer", {
                    offer,
                    to: user.id
                });
            });

            peers.current[user.id] = pc;
        });

        setInVoice(true);
    };

    const leaveVoice = () => {
        Object.values(peers.current).forEach((pc) => pc.close());
        peers.current = {};

        if (localStream.current) {
            localStream.current.getTracks().forEach((t) => t.stop());
        }

        setInVoice(false);
        setSpeaking(false);
    };

    const toggleMute = () => {
        if (!localStream.current) return;

        localStream.current.getAudioTracks().forEach((track) => {
            track.enabled = muted;
        });

        setMuted(!muted);
    };

    return {
        joinVoice,
        leaveVoice,
        toggleMute,
        inVoice,
        muted,
        speaking,
        peers
    };
}