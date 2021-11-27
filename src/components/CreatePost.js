import React, { useEffect, useState } from 'react';
import { createPost } from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export default function CreatePost() {

	const [post, setPost] = useState({ postTitle: '', postBody: '' });

	async function handleSubmit(e) {
		e.preventDefault();
		await API.graphql(graphqlOperation(createPost, { input: { ...post, postOwnerId: '4534543', postOwnerUsername: 'Fulano' } }));
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
