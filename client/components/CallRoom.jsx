"use client";
import socketInitialize from "@/utils/socketInitialize";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useRouter } from "next/navigation";

const CallRoom = ({ roomid }) => {
  const [socket, setSocket] = useState(socketInitialize());
  const myVideoRef = useRef(null);
  const [otherusers, setOtherUsers] = useState({});
  const [play, setPlay] = useState(true);
  const peerRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      const peer = new Peer(socket.id);
      // peer.on("open", () => {
      //   console.log("peer.id", peer.id);
      // });
      // peer.on("error", () => {
      //   console.log("error");
      //   peer.on("open", () => {
      //     console.log("peer.id", peer.id);
      //     socket.emit("join_room", roomid, peer.id);
      //   });
      // });
      socket.on("user_left", (pid) => {
        if (otherusers[pid]) {
          otherusers[pid].close();
          delete otherusers[pid];
        }
      });
      peerRef.current = peer;
      playVideo();
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  function addPeerVideoStream(newDiv, newVideo, stream, Newimg) {
    newVideo.srcObject = stream;
    document.querySelector("#videoContainer").appendChild(newDiv);
    socket.on("togglevideo", (sid, toggle) => {
      console.log(toggle);
      if (toggle == "pause") {
        newVideo.style.display = "none";
        newVideo.srcObject = null;
        Newimg.style.display = "block";
      } else {
        newVideo.style.display = "block";
        Newimg.style.display = "none";
        newVideo.srcObject = stream;
      }
    });
  }

  function connectToNewUser(pid, stream) {
    const call = peerRef.current.call(pid, stream);
    const newDiv = document.createElement("div");
    const newVideo = document.createElement("video");
    const Newimg = document.createElement("img");
    Newimg.src =
      "data:image/png;base64,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";

    newVideo.setAttribute("autoplay", "true");
    newVideo.setAttribute("class", `rmVideo`);
    // newVideo.srcObject = stream;
    Newimg.style.display = "none";
    newDiv.append(newVideo);
    newDiv.append(Newimg);

    call.on("stream", (userVideoStream) => {
      addPeerVideoStream(newDiv, newVideo, userVideoStream, Newimg);
    });
    call.on("close", () => {
      newDiv.remove();
    });
    otherusers[pid] = call;
  }

  const errorCallback = function (e) {
    console.log("Reeeejected!", e);
  };

  function startVideo() {
    const video = myVideoRef.current;
    if (video.srcObject) {
      video.play();
      video.style.display = "block";
      document.querySelector(".MyvideoOff").style.display = "none";

      socket.emit("togglevideo", roomid, "play");
    }
  }

  function stopVideo() {
    const video = myVideoRef.current;
    socket.emit("togglevideo", roomid, "pause");

    video.pause();
    video.style.display = "none";
    document.querySelector(".MyvideoOff").style.display = "block";
  }

  function playVideo() {
    if (navigator && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: { echoCancellation: true } })
        .then(function (mediaStream) {
          const video = myVideoRef.current;
          video.srcObject = mediaStream;
          // console.log(peerRef.current);
          // peerRef.current.on("open", () => {
          console.log("peer.id", peerRef.current.id);
          socket.emit("join_room", roomid, peerRef.current.id);
          // });
          peerRef.current.on("error", () => {
            console.log("some error");
            // peerRef.current.on("open", () => {
            console.log("peer.id", peerRef.current.id);
            socket.emit("join_room", roomid, peerRef.current.id);
            // });
          });
          peerRef.current.on("call", (call) => {
            call.answer(mediaStream);
            const newVideo = document.createElement("video");
            const newDiv = document.createElement("div");
            const Newimg = document.createElement("img");
            Newimg.src =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8jHyAAAADq6ekVDxANBQeAfn+fnp7V1NTAv78JAADExMQFAABsamoKAABxb2/y8vJvbW0eGRq6ubkZFBVlY2N1c3M3NDU/PD3Pzs5hX18RCgw8OTpGRETs7Oyop6cxLS5MSUqxsLB+fHwqJife3t5aWFmSkZFUUVKLiYqjoqJ9v0gjAAAIYklEQVR4nO2d6VbiMBSAaWgFodQSiiAdFsUFfP8HHBRBstz2pkma2JPv35xTx35muTdpll4vEAgEAoFAIBAIBAKBQCAQCAQCgUDgz/AyWf5bTmauX8MaW0IKSmlB0q3rV7HDlEQXyMT1y9hgOop+SVauX8c8WxJF3VZkBU+K767fyDAvvGHnSnFS8IZRMnf9UkZZUsGwY6X4T2LYLUVZGZ4UOxQXJe2wY4ozoS89M+pORU3lhtGoMz3qFijEDlXUSQYoZp1RnCedr6hzqBTTqetXM8VqBChmD8xzeb8xuSO1C2BbHDFtcbMjzYnXdy99V4K93iMUNFJGMV/HwHMIaJyS5cebK8UpGBeZipr/k+dAaMsyfR/7rqhRit8U5HnoRvER6m5SJmhoVdQzlOzddDyPUHbDBg0DilGycFOME2RFXegr0rSt6ef+0+2/HqCKygaNfKmvGJHPdgR3hFGE26K5oHFVHLQgmO8KGrOlCMZFtqIu9YLGWfHFvuHzqShowTT6CdTdZMbbYkSsdzf771yNsr+ovaAR0Z3loHH/U1w0YRVbSOB+KNnE3jT562WajUaMIja7Wei3RbafM83xd+BLKZMPw4ps6NdO4CL6alGwf9ul0BGj2F5btNmf7pm3oxGriEzgtEM/XVoT3HCNiL4yimACxweNLMZRSOfWT4VobSy15SsiV4rYBO4Ox36+S6TlXVRP6OVP97Nxs0HzQfibUsrMMSATODzDfSkrR7qBf+K4+JkBOQyU5z/6peTP+coEYDCBGzWNYsOdJL6Qe+Dp8YFc/yQ0ix8VS1L2uYL/XcgEToE8EkuxPMqfnRL2zxGPgAcB7sRGIXbcyKChwJtYdeiz9MFX8cnsn0pVFZthIfnYhEzgFBiI8+uJ5LGhpLBPr7hTUBR/XJpAIUf9eDaSXyx2NU/SPulLEf2LcqGJ0bX0QThoNJzwnwudjTiGuh8BwTMq0XXnTTCMH+VPmm6LYjUVYr64AObmYajn5RkK/0n5ATz6ACZwjSrqvfDfEW5O6rNCEOiXUIYJOGtiNmiM6wwHVYL48ZaKIVxRRw161DrDY7VgFO8tGBoNGjWG4KDmAt3ZMMSO+vUNwRZx8zhubkfRsGIwpRo0Kg3foe/tt4/jJuhUDc0FjQrDfC0ZDoiGuAGlsiF21K9hiJyCRUZEdUNTCRxo2EdO3dkzxI76Gxq+Rci5SYuGZtoiYAjl2u0aYj/bNDAcg7l2u4YmEjip4SxDC1o2NDA9JRqm9/BggoqN07KhfgInGtJ3ULBY7sXhpGVD7QRONJROWJwFF5tPcThp2xBWxCVwEkOIeJnLBszWDTWDBt7we/OOE0O9BA5teM4j3BhqBQ2sITnPGzky1EngkIbkrufUUCMu4gyva22cGTZP4FCG5Lpb151h47aIMbwZ9Ts0bBo06g1peTOKd2lYkcBVBY1aQ0pvZ0SdGjYb9dcZFuzCF7eGFV+J4VKsMeQ/oDk2bNIWqw3jNfepzbVhg882lYblgZ/udW6oHjSqDEfiRnn3hsqfbSoMZX2wB4aqo37YkMjWWvhgqDjqBw2J9BOtF4bYNXDVhsC6dj8MlYIGYJgCqzA9MVQZ9UsNKfjavhgqJHByQ/CLmTeG+HU3MsMEXijsjyG6LYqrTU5QcIGFR4b43TaS76A09b4dfqG128b3vvSM1rYwv+PhVVFnt43POc0vWtul/c1LcYqI3Ta+ji1YtHbb+Dk+FBR1tkv7OMYX0dou7d88jQyt7dK+zbXJ0YqLfs2XQmhtl/ZpzhtGK4Hz57tFFXr7+j359lSjqLVd2ovvh3Wgg4Z0SaIH34DrwSZw8o22zr/jY9DbLu14LQZSEffZBihFp+tpsOidseFwTRQevfNunK1rU0EvaDham6gGcrs0cEhasXxsf32pKuijC6Sl6GCNsDqmz9jwz9D0IWkeGmomcH/B0OwhaV4aGm2Lfhpi191gStFTQ4OHpFnbf6gLct1NfUVFbuZu39DYIWmW9gGbwMwpt5b2cpsBudum+pA0O/vxTWEiaDQ/U6Fs46xNOIHDtkX0uRiSs03uLBgJ6I00IoWzTSTn0xwsCIloJnAlfsexuLc/aecocTguItpioXAcqHi9DLaT0gUe9XOlKAaN4lWhFMTZAcsnbf4CJnDslSFiW0xUDsLqfUquCiAtHXkPV1TmuDGuosapWiUTO9OvL3fYjkoTMIHLuLaYXs/cS7KJ4qHDuewmK5pO2qmpYNDgKurH8+XcxA/1eyOO0pNSitFutUceZ6nEnl3xBCZw/J1v+XA8Gzc7MvoNaAy0QB5Iqgh3OybYFjNz90wdDJw5rgK34gkc9WfGru9R2BhvBu5yJWRb1KHtQuRLB0zgjJWiOL6wDXcBqP22eIR+gzW4exXRPWpjTFxwoEbJliLcFg0p9tFHFxmjZEewYEU1daPtU+tNkV9gCSZwpi4Khe53tAinaL2iwse9WiNeM4pTsKIaKsWnovXu5msFwg1gXDTVFvvwMU224FYCw0HDVFwckJaLsfhdmffN3Hpc7K8yA/fiYInTFT/YAy8nNHcN+vAhUTgUTgOaJLJRNtzdmLvpvT84jaftZgBf9x+ugUsO5rZ71G82s+OBalxSWUPxfHyBb3qAFc2V4g/5pvllozCb2qncCXTCbtLObHwLTNorRVeswB61M3eEg1cvG4uLzgHbIpci/GHAUiSu38wY70BbbOOuxJYASrHoTEuEFC3eXtY+K5kiXbh+LZPIFDtVhtKKWnM9259DLMUO9aVnhIsuuhMPL3Cl2J2c5hdGscmVPf5zsyiFdFKw19sSUlBKC9LFKvrDy3y5WE661osGAoFAIBAIBAKBQCAQCAQCgUAgEOg0/wG7RaMEzrDCnQAAAABJRU5ErkJggg==";

            newVideo.setAttribute("autoplay", "true");
            newVideo.setAttribute("class", `rmVideo`);
            Newimg.style.display = "none";
            newDiv.append(newVideo);
            newDiv.append(Newimg);
            call.on("stream", (stream) => {
              console.log("stream came");
              addPeerVideoStream(newDiv, newVideo, stream, Newimg);
            });
            call.on("close", () => {
              newDiv.remove();
            });
            console.log("call.id", call.peer);
            otherusers[call.peer] = call;
          });
          socket.on("new_user", (pid) => {
            console.log(pid);
            connectToNewUser(pid, mediaStream);
          });
        })
        .catch(errorCallback);
    } else {
      console.log("getUserMedia is not supported in this browser.");
    }
  }

  return (
    <>
      <div className="flex flex-col items-center w-full h-[100vh]">
        <center>
          <h1 className="text font-bold text-lg">In Room {roomid}</h1>
        </center>
        <div
          className="flex flex-1 justify-center sm:justify-start flex-wrap p-3 w-full"
          id="videoContainer"
        >
          <div>
            <video autoPlay ref={myVideoRef} className="Myvideo" muted></video>
            <img
              src="data:image/png;base64,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"
              alt=""
              className="hidden MyvideoOff"
            />
          </div>
        </div>
        <div className="flex justify-center w-full bg-slate-700">
          {play ? (
            <button
              className="p-2 text-white bg-lime-700 rounded text-lg border-2 border-solid border-black"
              onClick={() => {
                setPlay(!play);
                stopVideo();
              }}
            >
              stop video{" "}
            </button>
          ) : (
            <button
              className="p-2 text-white bg-lime-700 rounded text-lg border-2 border-solid border-black"
              onClick={() => {
                setPlay(!play);
                startVideo();
              }}
            >
              play video{" "}
            </button>
          )}

          <button
            className="p-2 text-white bg-red-800 rounded text-lg border-2 border-solid border-black"
            onClick={() => router.push("/")}
          >
            leave room
          </button>
        </div>
      </div>
    </>
  );
};

export default CallRoom;
