import React, { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Communication } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CommunicationFeed() {
  const [messages, setMessages] = useState<Communication[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const messagesRef = ref(database, 'communication');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageArray = Object.entries(data).map(([id, message]) => ({
          id,
          ...message as Omit<Communication, 'id'>
        }));
        // Sort by timestamp (newest first)
        messageArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setMessages(messageArray.slice(0, 20)); // Show only last 20 messages
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messagesRef = ref(database, 'communication');
    const messageData: Omit<Communication, 'id'> = {
      message: newMessage.trim(),
      unit: user.role as any,
      userId: user.id,
      userName: user.name,
      priority: 'normal',
      timestamp: new Date().toISOString()
    };

    try {
      await push(messagesRef, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getUnitColor = (unit: string) => {
    switch (unit) {
      case 'police':
        return 'bg-blue-500';
      case 'medical':
        return 'bg-red-500';
      case 'coordinator':
        return 'bg-green-500';
      case 'administrator':
        return 'bg-gray-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getUnitInitial = (unit: string) => {
    return unit.charAt(0).toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Team Communication</h3>
      
      <div className="space-y-4 h-80 overflow-y-auto mb-4" data-testid="communication-feed">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 p-3 rounded-lg ${
              message.unit === 'police' ? 'bg-blue-50' :
              message.unit === 'medical' ? 'bg-red-50' :
              message.unit === 'coordinator' ? 'bg-green-50' :
              'bg-gray-50'
            }`}
            data-testid={`message-${message.id}`}
          >
            <div className={`w-8 h-8 ${getUnitColor(message.unit)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
              {getUnitInitial(message.unit)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{message.userName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {message.unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.priority === 'urgent' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Quick Message Input */}
      {user && user.role !== 'pilgrim' && (
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type urgent message..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            data-testid="message-input"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim()}
            data-testid="send-message-button"
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
