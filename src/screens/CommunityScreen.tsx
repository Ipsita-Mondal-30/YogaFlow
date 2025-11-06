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
import { supabase } from '../services/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { colors } from '../utils/colors';

// Extended message type with sender info
type MessageWithSender = {
  id: string;
  room: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    name: string;
    email: string;
  };
};

type CustomGroup = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  isCustom: boolean;
};

export default function CommunityScreen() {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [showGroupList, setShowGroupList] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [customGroups, setCustomGroups] = useState<CustomGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    fetchMessages();
    const unsubscribe = subscribeToMessages();
    return unsubscribe;
  }, [currentRoom]);

  const fetchMessages = async () => {
    console.log('Fetching messages for room:', currentRoom);
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

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', data?.length || 0);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please check your connection.');
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

    console.log('Attempting to send message:', {
      message: newMessage.trim(),
      room: currentRoom,
      userId: user.id
    });

    try {
      // First, ensure user exists in our database
      const { data: existingUser, error: userFetchError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (userFetchError && userFetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', userFetchError);
        Alert.alert('Error', 'Failed to verify user. Please try again.');
        return;
      }

      let userId = existingUser?.id;

      if (!existingUser) {
        console.log('User not found, creating new user...');
        // Create user if doesn't exist - this should happen during role selection
        // but we'll handle it here as a fallback
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

        if (userError) {
          console.error('Error creating user:', userError);
          Alert.alert('Error', 'Failed to create user profile. Please try signing out and back in.');
          return;
        }
        userId = newUser.id;
        console.log('Created new user with ID:', userId);
      }

      console.log('Sending message with userId:', userId);
      const { error } = await supabase
        .from('messages')
        .insert({
          room: currentRoom,
          sender_id: userId,
          content: newMessage.trim(),
        });

      if (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', `Failed to send message: ${error.message}`);
        return;
      }

      console.log('Message sent successfully');
      setNewMessage('');
      // Auto-scroll after sending
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const defaultGroups: CustomGroup[] = [
    { id: 'general', name: 'General', icon: 'people', description: 'Main community discussion', isCustom: false },
    { id: 'beginners', name: 'Beginners Circle', icon: 'leaf', description: 'New to yoga? Start here', isCustom: false },
    { id: 'advanced', name: 'Advanced Practice', icon: 'fitness', description: 'For experienced practitioners', isCustom: false },
    { id: 'meditation', name: 'Meditation & Mindfulness', icon: 'flower', description: 'Inner peace discussions', isCustom: false },
    { id: 'teachers', name: 'Teachers Lounge', icon: 'school', description: 'For yoga instructors', isCustom: false },
    { id: 'wellness', name: 'Wellness & Nutrition', icon: 'nutrition', description: 'Holistic health topics', isCustom: false },
  ];

  const groups = [...defaultGroups, ...customGroups];

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    const groupId = newGroupName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if group already exists
    if (groups.find(g => g.id === groupId)) {
      Alert.alert('Error', 'A group with this name already exists');
      return;
    }

    const newGroup: CustomGroup = {
      id: groupId,
      name: newGroupName.trim(),
      icon: 'chatbubbles',
      description: newGroupDescription.trim() || 'Custom community group',
      isCustom: true,
    };

    setCustomGroups([...customGroups, newGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateGroup(false);
    setCurrentRoom(groupId);
    setShowGroupList(false);
    
    Alert.alert('Success', `Group "${newGroup.name}" created successfully!`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  const currentGroup = groups.find(g => g.id === currentRoom);

  if (showCreateGroup) {
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setShowCreateGroup(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
            </TouchableOpacity>
            <Text style={styles.title}>Create New Group</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.communitySubtitle}>
            Start your own community group
          </Text>
        </LinearGradient>

        <ScrollView style={styles.createGroupContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Group Name *</Text>
            <TextInput
              style={styles.textInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g., Morning Yoga Enthusiasts"
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              placeholder="What is this group about?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.createButtonGradient}
            >
              <Ionicons name="add-circle" size={20} color={colors.textWhite} />
              <Text style={styles.createButtonText}>Create Group</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    );
  }

  if (showGroupList) {
    return (
      <View style={styles.container}>
      <View style={styles.flex}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setShowGroupList(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
            </TouchableOpacity>
            <Text style={styles.title}>Community Groups</Text>
            <TouchableOpacity onPress={() => setShowCreateGroup(true)} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
          <Text style={styles.communitySubtitle}>
            Join groups and connect with like-minded yogis
          </Text>
        </LinearGradient>

        <ScrollView 
          style={styles.groupListContainer}
          contentContainerStyle={styles.groupListContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              onPress={() => {
                setCurrentRoom(group.id);
                setShowGroupList(false);
              }}
            >
              <View style={[styles.groupIconContainer, currentRoom === group.id && styles.activeGroupIcon]}>
                <Ionicons name={group.icon as any} size={28} color={colors.primary} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>
                  {group.name}
                  {group.isCustom && <Text style={styles.customBadge}> • Custom</Text>}
                </Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
              </View>
              {currentRoom === group.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setShowGroupList(true)} style={styles.groupsButton}>
            <Ionicons name="grid" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentGroup?.name || 'Community'}</Text>
            <Text style={styles.groupSubtitle}>{currentGroup?.description}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
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
          <>
            {messages.map((message) => (
              <View key={message.id} style={styles.messageItem}>
                <View style={styles.messageHeader}>
                  <Text style={styles.senderName}>
                    {message.sender?.name || 'Anonymous'}
                  </Text>
                  <Text style={styles.messageTime}>
                    {formatTime(message.created_at || new Date().toISOString())}
                  </Text>
                </View>
                <Text style={styles.messageContent}>{message.content}</Text>
              </View>
            ))}
            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>

      {isSignedIn ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            multiline={true}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (newMessage.trim()) {
                sendMessage();
              }
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.disabledSendButton
            ]}
            onPress={() => {
              console.log('Send button pressed, message:', newMessage);
              sendMessage();
            }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  groupsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholder: {
    width: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  createGroupContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  customBadge: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
    textAlign: 'center',
  },
  groupSubtitle: {
    fontSize: 12,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
  communitySubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  groupListContainer: {
    flex: 1,
  },
  groupListContent: {
    padding: 15,
    paddingBottom: 140, // Extra padding for tab bar clearance
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeGroupIcon: {
    backgroundColor: colors.primaryLight,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 200, // Extra space for input and tab bar
    flexGrow: 1,
  },
  bottomSpacer: {
    height: 20,
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '100%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  senderName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    alignItems: 'flex-end',
    minHeight: 70,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 105,
    left: 0,
    right: 0,
    zIndex: 500,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    position: 'absolute',
    bottom: 110, // Position well above the tab navigation
    left: 0,
    right: 0,
    zIndex: 500,
  },
  signInText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});