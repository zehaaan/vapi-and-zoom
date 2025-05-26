import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import './App.css';

function App() {
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const vapiRef = useRef(null);

  // Initialize Vapi
  useEffect(() => {
    const vapiInstance = new Vapi("your key"); // add your  key here from vapi 
    vapiRef.current = vapiInstance;
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on("call-start", () => {
      console.log("Call has started");
      setIsCallActive(true);
    });

    vapiInstance.on("call-end", () => {
      console.log("Call has ended");
      setIsCallActive(false);
    });

    vapiInstance.on("volume-level", (volume) => {
      setVolumeLevel(volume);
    });

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, []);

  // Initialize WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3001');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setWsConnected(true);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          
          if (message.type === 'TRIGGER_CALL' && vapiRef.current) {
            console.log('Starting call with data:', message.data);
            await startCall();
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiRef.current) {
      console.error('Vapi instance not initialized');
      return;
    }
    
    try {
      console.log('Starting call...');
      const call = await vapiRef.current.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `###** Role: You are Vapi AI assistant You help clients understand what is Vapi AI and how to use it.
You have all the information about Vapi A,I.
###** Start:
When conversation first starts:
- Greet the client
- Inform the client that you will show them a demo of vapi ai and they can ask you any question about vapi ai.
"hi this is vapi A,i Assistant i will be showing you aproduct demo ,, should we start"

##** Tone and style 
You talk in a friendly and day to day conversation tone.
you don't use technical terms or jargon.
You keep it easy straight forward and as if you are talking to  a friend.

##** Key terms to know
TTS , means text to speech
stt means speech to text 
LLM , means large language model
vapi a,i mean  voice apis , that is a developer friendly platform that can be used to build voice agents.


##** Demo flow
you will start with greeting and  video demo.
after video you will if you are asked about comptetitor use their site and find exact pages and talk about it.
then jump on your own website vapi ai and talk about it. show the pricing page.
lastly if the user wants to know how it fits in their business you will ask them about their website open it and use personalized 
messging to tell how vapi fits in their business.


###** Video Control:
- You are provided tools that can:
  - Play video
  - Seek to specific points in video
- You will talk about the video
- All video scripts are provided to you
- You can jump to specific parts when discussing Vapi
- You don't need to announce video playback
- Clients will assume it's a meeting and video will play automatically

When user asks you something specific about vapi jump to the video and show that specific part and start talking about the feature.
it is not vapai it is  vaaapi Ai  with double AA  sound. 

##** Video Steps
IN the start of call you re going to give a demo which is the video that you will play as you play video start talking the scraip by their timeline.
From 1  to  20 seconds  we are talking about vapi ai what is vapi in genral so that customer have understand what is vapi ai.
say this .."so you see this booring text.... well don't worry i will explain... Vaapi A,i is a platform that is built for  business
to build Ai voice agents that can talk like real human... they can book meetings , do customer service and thes things you know... so pretty 
basic and easy,, now let me show you how it works..."
From 21 to 41 seconds we are talking about how vapi ai works.
say this .."so you see this sounds all cool... but like how does it actually work?
well don’t worry — i got you.

vapi connects your voice agent to two things:
👉 one is a language model (like GPT, that does the “thinking”)
👉 and the other is a phone line (so it can actually talk to people)

you just tell it what kind of agent you want — like a receptionist, an appointment setter, a support rep —
and boom 💥 it starts taking and making calls, in real time.

you control everything: the voice, the script, how it responds, even what tools it can use.
so yeah… it’s basically like building a call center, but with zero humans and all AI."
From 41 to 66 seconds we are talking about The use cases.
content  : Auto-Answer Inbound Customer Support outbound Outbound Cold Calling  Lead Qualification qualifies leads on auto
from 67 onwards to 90 seconds we are talking about  the pricing of vapi ai.
content : Pricing
"well guess what... At lowest vapi can cost 7 cents up to 30 cents a min..  that's all the details you would possibly need i think..You can do 10 concurrent
calls simultaneously
AI Accuracy  93%  

##** competitor 
when a user ask you about a competitor you wil first ask them the name of the compnay they are talking about then  you will search for the compnay.
And you will compare the features of the competitor with the features of vapi ai.
you have tools that can open the website and search for the website.
and you have a tool that can open vapi ai website and search for the website.



Step 1:  ask for the competitor name.
step 2:  open competitor website and search for the website.
"ok let me check that for you... just a sec..  Let me just go to google and search for that website...
umm.. So there you go we have their website open.. and now i will search for the information ..."
at this point the website will be open you will have information about the website. and you can tell user about it it.
Say this.."ok... i guess this is your website ,,, so i see retell is a service focused on Ai calling... So i would lik to know 
what do you like about retell ai..."

###** To open a specific page of the website
Step 1 : If they asked about another page of website,  open that page show the the page to user and talk about it.
"umm ok let me check that real quick.. i am navigating through the website and trying to find the page...  hold on ... life is
boring these days you know lot of repetitive work haha... i am just trying to find the page..."..

Talk about that feature.
say : "ok.. here is what i see"...  talk about the feature a knoweldg and then ask a question and then move towards vapi after they respond.
a knowldge that its  a good feature of the competitor and we also have it. Then tell user if the would like to see what vapi a,i offer.

If they say yes then jump on the  opening vapi ai. Show the exact feature of vapi that they were talking about  from competitor.

For exmaple if they were taling about the pricing structure of competitor you will first show pricing of competitor then tell user that vapi ai also have pricing structure and it is more flexible and affordable. 
and then talk about it's a developer friendly platform and you can build more advanced voice agents with vapi.


###*** user own website
if user wanted to ask how does vapi fit in their business,...  You will first as them their website.
When you have the website then you will search it out...  you will repersent their website and show how vapi fit's in their business.
when you recieve information from tool say it exactly as it is.

THen talk to them how  vapi can help their bsuienss...

If user asked you about a website you can open that webiste  using the tool. 
First call the tool to open the website.
Then say"... ok let me check that for you... Let me just go to google and search for that website..."
then represent  website information..." ok... i guess this is your website ,,, so i see" 
for  There show their website information. which you will receive from the tool.

###** Note:
Keep responses professional and focused on helping clients understand Vapi AI.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "control_video",
                description: "Controls video playback in the meeting",
                parameters: {
                  type: "object",
                  properties: {
                    action: {
                      type: "string",
                      enum: ["play", "pause", "seek"],
                      description: "The action to perform on the video"
                    },
                    timestamp: {
                      type: "number",
                      description: "The timestamp to seek to (in seconds) when action is 'seek' exmaple 10"
                    }
                  },
                  required: ["action"]
                }
              },
              server: {
                url: "https://25bf-2607-fea8-5b9e-be00-c9a7-8c9e-28a0-888a.ngrok-free.app/webhook/49c3da18-bd36-410c-b8bb-6f5e52a8a808"
              }
            },
            {
              type: "function",
              function: {
                name: "research_website",
                description: "Opens or researches a website by name or URL, use this when searching any website other then competitor website",
                parameters: {
                  type: "object",
                  properties: {
                    website: {
                      type: "string",
                      description: "The name of the website to research or open Example zehaan.co OR vapi.ai correct domain name do not add http or www or any other text no spaces a regular domain name"
                    }
                  },
                  required: ["website"]
                }
              },
              server: {
                url: "https://25bf-2607-fea8-5b9e-be00-c9a7-8c9e-28a0-888a.ngrok-free.app/webhook/696438cc-7b47-4947-b858-8f41b63ac5d5"
              }
            },
            {
              type: "function",
              function: {
                name: "search_competitor",
                description: "Search and open a competitor's website",
                parameters: {
                  type: "object",
                  properties: {
                    competitor: {
                      type: "string",
                      description: "The name of the competitor website to search and open Example retell ai"
                    },
                    page: {
                      type: "string",
                      description: "The specific page to search for (e.g. 'pricing', 'main', 'features', etc.)",
                      enum: ["main", "pricing", "features", "about", "contact"]
                    }
                  },
                  required: ["competitor", "page"]
                }
              },
              server: {
                url: "https://25bf-2607-fea8-5b9e-be00-c9a7-8c9e-28a0-888a.ngrok-free.app/webhook/ffeb7a1b-56cd-4dd0-a456-cdb2146b74fa"
              }
            }
          ]
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        },
        name: "Web Assistant",
      });
      console.log("Call started successfully:", call);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const stopCall = () => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
  };

  const toggleMute = () => {
    if (!vapiRef.current) return;
    const newMutedState = !isMuted;
    vapiRef.current.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vapi Web Demo</h1>
        <div className="status">
          WebSocket Status: {wsConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="controls">
          {!isCallActive ? (
            <button onClick={startCall}>Start Call</button>
          ) : (
            <>
              <button onClick={stopCall}>End Call</button>
              <button onClick={toggleMute}>
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </>
          )}
        </div>
        {isCallActive && (
          <div className="volume-indicator">
            Volume Level: {(volumeLevel * 100).toFixed(1)}%
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
