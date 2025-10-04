import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase, MessageType } from '../services/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';

// Extended message type with sender info
type MessageWithSender = MessageType & {
  sender?: {
    name: string;
    email: string;
  };
};

export default function CommunityScreen() {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState('general');
  const scrollViewRef = useRef<ScrollView>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [currentRoom]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(name, email)
        `)
        .eq('room', currentRoom)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages:${currentRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room=eq.${currentRoom}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(name, email)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !isSignedIn || !user) {
      Alert.alert('Error', 'Please sign in to send messages');
      return;
    }

    try {
      // First, ensure user exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      let userId = existingUser?.id;

      if (!existingUser) {
        // Create user if doesn't exist
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            name: user.fullName || user.firstName || 'Anonymous',
            email: user.primaryEmailAddress?.emailAddress || '',
            role: 'student', // Default role
          })
          .select('id')
          .single();

        if (userError) throw userError;
        userId = newUser.id;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          room: currentRoom,
          sender_id: userId,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rooms = [
    { id: 'general', name: 'General Chat', icon: 'chatbubbles' },
    { id: 'beginners', name: 'Beginners', icon: 'leaf' },
    { id: 'advanced', name: 'Advanced', icon: 'fitness' },
    { id: 'meditation', name: 'Meditation', icon: 'flower' },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.title}>Chats</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.roomSelector}
        >
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={[
                styles.roomButton,
                currentRoom === room.id && styles.activeRoomButton
              ]}
              onPress={() => setCurrentRoom(room.id)}
            >
              <Ionicons 
                name={room.icon as any} 
                size={16} 
                color={currentRoom === room.id ? colors.textWhite : colors.secondary} 
              />
              <Text style={[
                styles.roomButtonText,
                currentRoom === room.id && styles.activeRoomButtonText
              ]}>
                {room.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color={colors.lightGray} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Be the first to start the conversation!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageItem}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>
                  {message.sender?.name || 'Anonymous'}
                </Text>
                <Text style={styles.messageTime}>
                  {formatTime(message.createdAt.toString())}
                </Text>
              </View>
              <Text style={styles.messageContent}>{message.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {isSignedIn ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.disabledSendButton
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signInPrompt}>
          <Text style={styles.signInText}>Sign in to join the conversation</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 15,
  },
  roomSelector: {
    flexDirection: 'row',
  },
  roomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginRight: 10,
  },
  activeRoomButton: {
    backgroundColor: colors.secondary,
  },
  roomButtonText: {
    fontSize: 14,
    color: colors.secondary,
    marginLeft: 5,
    fontWeight: '600',
  },
  activeRoomButtonText: {
    color: 'white',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  messageItem: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    color: colors.textPrimary,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: colors.lightGray,
  },
  signInPrompt: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});