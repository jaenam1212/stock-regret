'use client';

import { Post, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모든 게시글 가져오기
  const fetchPosts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles:user_id (
            email
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 특정 사용자의 게시글 가져오기
  const fetchUserPosts = async (userId: string) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch user posts'
      );
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 작성
  const createPost = async (
    userId: string,
    title: string,
    content: string,
    symbol?: string,
    tags?: string[]
  ) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          title,
          content,
          symbol,
          tags,
        })
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      setPosts((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
      throw err;
    }
  };

  // 게시글 수정
  const updatePost = async (
    postId: string,
    updates: Partial<Pick<Post, 'title' | 'content' | 'symbol' | 'tags'>>
  ) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? data : post))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      console.error('Error updating post:', err);
      throw err;
    }
  };

  // 게시글 삭제
  const deletePost = async (postId: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) throw error;

      // 로컬 상태 업데이트
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
