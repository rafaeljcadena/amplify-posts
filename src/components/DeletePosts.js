import React, { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { deletePost } from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export default function DeletePosts({ postId }) {

	async function handleClick() {
		console.log({ postId });
		const input = {
			id: postId,
		};

		await API.graphql(graphqlOperation(deletePost, { input }));
	}

	return (
		<button onClick={handleClick}>Delete</button>
	);
}
