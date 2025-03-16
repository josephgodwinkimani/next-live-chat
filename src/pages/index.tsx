import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ChatWidget } from '../components/ChatWidget';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

// Initialize Socket.IO on the client side
const initializeSocket = async () => {
  await fetch('/api/socket');
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useEffect(() => {
    initializeSocket();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <Head>
        <title>Next.js Chat Widget Demo</title>
        <meta name="description" content="A demo of a chat widget using Next.js and Socket.IO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem' }}>
        <h1>Welcome to Our Website</h1>
        <p>This is a demo of a chat widget using Next.js 14, TypeScript, and Socket.IO.</p>
        <p>Click the chat button in the bottom right corner to start a conversation!</p>
        
        {/* More content for your main page goes here */}
      </main>

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Chat FAB Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={toggleChat}
      >
        <ChatIcon />
      </Fab>
    </div>
  );
}