import React, { useEffect, useState } from 'react';
import { updatePost } from '../graphql/mutations';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function EditPost({ postId }) {
	const [show, setShow] = useState(false);
	const [post, setPost] = useState({
		id: postId,
		postOwnerId: '',
		postOwnerUsername: '',
		postTitle: 'Post title UPDATED',
		postBody: 'Post content UPDATED',
	});

	useEffect(() => {
		//TODO: Auth
		const getCurrentUser = async () => {
			const currentUser = await Auth.currentUserInfo()
			setPost({ ...post, postOwnerId: currentUser.id, postOwnerUsername: currentUser.username });
		}

		getCurrentUser();
	}, []);

	async function handleClick() {
		await API.graphql(graphqlOperation(updatePost, { input: post }));
		alert('Updated!');
	}

	return (
		<button onClick={handleClick}>Edit Post</button>
	);
}
