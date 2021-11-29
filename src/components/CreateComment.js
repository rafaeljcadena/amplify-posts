import React, { useState, useEffect } from 'react';
import { createComment } from '../graphql/mutations';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function CreateComment({ postId }) {

	const [comment, setComment] = useState({ content: '' })
	const [user, setUser] = useState({});
	 
	useEffect(() => {
		//TODO: Auth
		const getCurrentUser = async () => {
			const currentUser = await Auth.currentUserInfo()
			setUser(currentUser);
		}

		getCurrentUser();
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		await API.graphql(graphqlOperation(createComment, { input: { ...comment, commentOwnerId: user.id, commentOwnerUsername: user.username, commentPostId: postId } }));
		setComment({ content: '' });
	}

	return (
		<form className="add-post" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
			<textarea row="3" cols="40" placeholder='Content' name='content' onChange={(e) => setComment({ ...comment, [e.target.name]: e.target.value })} /><br/>
			<button type="submit">Create comment</button>
		</form>
	);
}
