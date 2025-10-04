import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase, BlogPost } from '../services/supabase';

export default function BlogScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:users!blog_posts_author_id_fkey(name, email)
        `)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load blog posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderPostContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <Text key={index} style={styles.contentParagraph}>
          {paragraph}
        </Text>
      ));
  };

  if (selectedPost) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPost(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#065f46" />
          </TouchableOpacity>
          <Text style={styles.backText}>Back to Blog</Text>
        </View>

        {selectedPost.featured_image && (
          <Image
            source={{ uri: selectedPost.featured_image }}
            style={styles.featuredImage}
          />
        )}

        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{selectedPost.title}</Text>
          
          <View style={styles.postMeta}>
            <Text style={styles.authorName}>
              By {selectedPost.author?.name || 'Unknown Author'}
            </Text>
            <Text style={styles.publishDate}>
              {formatDate(selectedPost.published_at)}
            </Text>
          </View>

          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {selectedPost.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.contentContainer}>
            {renderPostContent(selectedPost.content)}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading blog posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Yoga Wisdom</Text>
        <Text style={styles.subtitle}>
          Insights, research, and ancient wisdom for modern practitioners
        </Text>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="library-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Posts Available</Text>
          <Text style={styles.emptyText}>
            Check back soon for new insights and wisdom
          </Text>
        </View>
      ) : (
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => setSelectedPost(post)}
            >
              {post.featured_image && (
                <Image
                  source={{ uri: post.featured_image }}
                  style={styles.postThumbnail}
                />
              )}
              
              <View style={styles.postCardContent}>
                <Text style={styles.postCardTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                
                <View style={styles.postCardMeta}>
                  <Text style={styles.postCardAuthor}>
                    {post.author?.name || 'Unknown Author'}
                  </Text>
                  <Text style={styles.postCardDate}>
                    {formatDate(post.published_at)}
                  </Text>
                </View>

                {post.tags && post.tags.length > 0 && (
                  <View style={styles.postCardTags}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.smallTag}>
                        <Text style={styles.smallTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.readMoreContainer}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <Ionicons name="arrow-forward" size={16} color="#10b981" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
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
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  postsContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  postThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postCardContent: {
    padding: 20,
  },
  postCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
    lineHeight: 28,
  },
  postCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postCardAuthor: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  postCardDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  postCardTags: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  smallTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  smallTagText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
    marginRight: 5,
  },
  // Post detail styles
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
    color: '#065f46',
    fontWeight: '600',
  },
  featuredImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 20,
  },
  postTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 15,
    lineHeight: 36,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  authorName: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  publishDate: {
    fontSize: 16,
    color: '#6b7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#065f46',
    fontWeight: '600',
  },
  contentContainer: {
    marginTop: 10,
  },
  contentParagraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 20,
  },
});