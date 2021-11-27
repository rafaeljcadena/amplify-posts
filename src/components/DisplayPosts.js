import React, { useEffect, useState, useRef } from 'react';
import { listPosts } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import DeletePosts from './DeletePosts';
import EditPost from './EditPost';
import { onCreatePost, onDeletePost } from '../graphql/subscriptions';

export default function DisplayPosts() {
	const [posts, setPosts] = useState([]);
	const postsRef = useRef([]);

	useEffect(() => {
		const getPosts = async () => {
			try {
				const result = await API.graphql(graphqlOperation(listPosts));
				setPosts(result.data.listPosts.items);
				postsRef.current = result.data.listPosts.items;
			} catch(e) {
				throw new Error(e.message);
			}
		}

		getPosts();

	}, []);

	console.log('Refresh Display')

	useEffect(() => {

		console.log('useEffect subscribe')
		const createPostListener = API.graphql(graphqlOperation(onCreatePost))
			.subscribe({
				next: (postData) => {
					const newPost = postData.value.data.onCreatePost;
					const currentPosts = [...posts];
					setPosts([newPost, ...currentPosts]);
				}
			})

		const deletePostListener = API.graphql(graphqlOperation(onDeletePost))
			.subscribe({
				next: (postData) => {
					const deletedPost = postData.value.data.onDeletePost;

					const currentPosts = posts.filter(post => post.id !== deletedPost.id);
					setPosts(currentPosts);
				}
			})

		return () => {
			createPostListener.unsubscribe();
			deletePostListener.unsubscribe();
		}
	}, []);

	useEffect(() => {
	}, [posts]);

	return (
		<div>
			{
				posts.map(item => {
					return (
						<div key={item.id}>
							<h2>{item.postTitle}</h2>
							<p>{item.postBody}</p>
							<small>Wrote By: {item.postOwnerUsername}</small>
							<br/>
							<time>{new Date(item.createdAt).toDateString()}</time>
							<br/><br/>
							<DeletePosts postId={item.id} />
							<br/><br/>
							<EditPost postId={item.id} />
						</div>
					);
				})
			}
		</div>
	);
}
