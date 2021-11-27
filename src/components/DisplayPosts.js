import React, { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import DeletePosts from './DeletePosts';
import EditPost from './EditPost';
import { onCreatePost } from '../graphql/subscriptions';

export default function DisplayPosts() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const getPosts = async () => {
			try {
				const result = await API.graphql(graphqlOperation(listPosts));
				setPosts(result.data.listPosts.items);
			} catch(e) {
				throw new Error(e.message);
			}
		}

		getPosts();

	}, []);

	useEffect(() => {
		const createPostListener = API.graphql(graphqlOperation(onCreatePost))
			.subscribe({
				next: postData => {
					console.log({ postData });
					const newPost = postData.value.data.onCreatePost;

					updatePosts([newPost, ...posts]);
				}
			})

		return () => {
			createPostListener.unsubscribe();
		}
	}, []);

	function updatePosts(newPosts) {
		console.log({ newPosts });
		setPosts(newPosts);
	}

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
							<DeletePosts />
							<br/><br/>
							<EditPost />
						</div>
					);
				})
			}
		</div>
	);
}
