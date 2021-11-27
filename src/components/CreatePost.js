import React, { useState, useEffect } from 'react';
import { createPost } from '../graphql/mutations';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function CreatePost() {

	const [post, setPost] = useState({ postTitle: '', postBody: '' });
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
		await API.graphql(graphqlOperation(createPost, { input: { ...post, postOwnerId: user.id, postOwnerUsername: 'Fulano' } }));
		setPost({ postTitle: '', postBody: '' });
	}

	return (
		<form className="add-post" onSubmit={handleSubmit}>
			<input placeholder='Title' name='postTitle' required onChange={(e) => setPost({ ...post, [e.target.name]: e.target.value })} /><br/>
			<textarea row="3" cols="40" placeholder='Content' name='postBody' onChange={(e) => setPost({ ...post, [e.target.name]: e.target.value })} /><br/>
			<button type="submit">Create post</button>
		</form>
	);
}
