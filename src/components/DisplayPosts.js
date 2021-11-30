import React, { useEffect, useState, useRef } from 'react';
import * as queries from '../graphql/queries';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import DeletePosts from './DeletePosts';
import CreateComment from './CreateComment';
import EditPost from './EditPost';
import * as subscriptions from '../graphql/subscriptions';
import * as mutations from '../graphql/mutations';
import { FaThumbsUp } from 'react-icons/fa';

export default function DisplayPosts() {
	const [posts, setPosts] = useState([]);
	const postsRef = useRef([]);

	const [user, setUser] = useState({});

	useEffect(() => {
		if(!user.id) return null;

		const getPosts = async (userId) => {
			try {
				const result = await API.graphql({ query: queries.listPosts, variables: { filter: { postOwnerId: { eq: user.id } }, sortDirection: 'DESC' } });
				updatePosts(result.data.listPosts.items);
			} catch(e) {
				console.log({ e });
			}
		}

		getPosts();
	}, [user]);

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	function likedPost(postId) {
		const postIndex = posts.findIndex(post => post.id === postId)
		if(postIndex === -1) return false;

		const likeIndex = posts[postIndex].likes.items.findIndex(like => like.likeOwnerId === user.id);
		if(likeIndex !== -1) return true;

		return false;
	}

	useEffect(() => {

		console.log('useEffect subscribe')
		const createPostListener = API.graphql(graphqlOperation(subscriptions.onCreatePost))
			.subscribe({
				next: (postData) => {
					const newPost = postData.value.data.onCreatePost;

					const currentPosts = [...postsRef.current, newPost];
					setPosts(currentPosts);
				}
			})

		const deletePostListener = API.graphql(graphqlOperation(subscriptions.onDeletePost))
			.subscribe({
				next: (postData) => {
					const deletedPost = postData.value.data.onDeletePost;

					const currentPosts = postsRef.current.filter(post => post.id !== deletedPost.id);
					updatePosts(currentPosts);
				}
			})

		const updatePostListener = API.graphql(graphqlOperation(subscriptions.onUpdatePost))
			.subscribe({
				next: (postData) => {
					const updatedPost = postData.value.data.onUpdatePost;

					const currentPosts = postsRef.current.map(post => {
						if(post.id === updatedPost.id) return updatedPost;

						return post;
					});



					updatePosts(currentPosts);
				}
			});


		const createPostCommentListener = API.graphql(graphqlOperation(subscriptions.onCreateComment))
			.subscribe({
				next: commentData => {
					const createdComment = commentData.value.data.onCreateComment;
					const currentPosts = postsRef.current.map(post => {
						if(post.id === createdComment.post.id) post.comments.items.push(createdComment);

						return post;
					});

					updatePosts(currentPosts);
				}
			});

		const createPostLikeListener = API.graphql(graphqlOperation(subscriptions.onCreateLike))
			.subscribe({
				next: postData => {
					const createdLike = postData.value.data.onCreateLike;
					console.log({ createdLike })
					const currentPosts = postsRef.current.map(post => {
						if(post.id === createdLike.post.id) post.likes.items.push(createdLike);

						return post;
					});

					updatePosts(currentPosts);
				}
			});

		return () => {
			createPostListener.unsubscribe();
			deletePostListener.unsubscribe();
			updatePostListener.unsubscribe();

			createPostCommentListener.unsubscribe();
			createPostLikeListener.unsubscribe();
		}
	}, []);

	function updatePosts(items){
		postsRef.current = items;
		setPosts(items);
	}

	async function fetchCurrentUser() {
		const currentUser = await Auth.currentUserInfo()
		setUser(currentUser);
		return currentUser;
	}
	
	async function handleLike(postId) {
		const input = {
			numberLikes: 1,
			likeOwnerId: user.id,
			likeOwnerUsername: user.username,
			likePostId: postId,
		};

		try {
			// await API.graphql({ query: createLike, variables: { input } });
		await API.graphql(graphqlOperation(mutations.createLike, { input }));
		} catch(error) {
			console.error(error);
		}
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

							<DeletePosts postId={item.id} />
							<EditPost postId={item.id} /><br/>

							<div>
								<br />
								<button onClick={() => handleLike(item.id)}>
									{/* <FaThumbsUp /> <span>{item.likes.items.length}</span> */}
								</button>
							</div>

							<h4>Comments</h4>
							{/* {item.comments.items.map(comment => { */}
							{/* 	return ( */}
							{/* 		<div> */}
							{/* 			<p>{comment.content}</p> */}
							{/* 			<small>{comment.commentOwnerUsername}</small> */}
							{/* 		</div> */}
							{/* 	); */}
							{/* })} */}

							<CreateComment postId={item.id} />
							<hr />
						</div>
					);
				})
			}
		</div>
	);
}
