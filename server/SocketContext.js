import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext();
 //this is the context that we will use to pass the socket and the call to the components
 
 const socket = io('http://localhost:5000') //this is the socket that we will use to connect to the server

 const ContextProvider = ({ children}) =>{
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({
            video : true,
            audio : true 
        }).then((currentStream) =>{
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
            //we need to use the useRef hook to access the video element and set the srcObject to the currentStream
            //src object is the media stream that we will be using to display the video
        })
        socket.on('me', (id) =>{
            setMe(id);
        }, [])
        socket.on('calluser', ({from, name : callerName, signal}) =>{
            setCall({isReceivedCall : true, from, name: callerName, signal})
        }) // this is the event that we will use to receive the call for the user for hanging up the call we will use the hangup event
    })

    const answerCall = () =>{
        setCallAccepted(true);
        const peer = new Peer({initiator : false, trickle : false, stream} );
        peer.on('signal', (data) =>{
            socket.emit('answercall', {signal : data, to: call.from});
        })
        //for the sake of users video we will use the useRef hook to access the video element and set the srcObject to the currentStream
        peer.on('stream', (currentStream)=>{
            userVideo.current.srcObject = currentStream;
        })

    }
    const callUser = () =>{

    }
    const leaveCall = () =>{

    }
 }