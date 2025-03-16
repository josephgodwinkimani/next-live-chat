import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { initSocket, sendMessage } from '../lib/socket';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  List, 
  ListItem, 
  Zoom
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      socket.current = initSocket();
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: 'Hello! How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      // Listen for incoming messages
      socket.current.on('receive-message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off('receive-message');
      }
    };
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    sendMessage(userMessage);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <Zoom in={isOpen}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: 320,
          height: 450,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1300,
          borderRadius: 2
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">Chat Support</Typography>
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Chat Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'grey.100'
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: message.sender === 'user' ? 'primary.light' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    maxWidth: '80%',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Chat Input */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'grey.300',
            display: 'flex'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{ mr: 1 }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={input.trim() === ''}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Zoom>
  );
};