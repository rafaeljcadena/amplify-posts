import React, { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

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


	return (
		<div>
			{
				posts.map(item => {
					return (
						<div key={item.id}>
							<h2>{item.postTitle}</h2>
							<p>{item.postBody}</p>
							<small>{item.postOwnerUsername}</small>
						</div>
					);
				})
			}
		</div>
	);
}
