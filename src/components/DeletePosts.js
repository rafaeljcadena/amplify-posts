import React, { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default function DeletePosts() {

	return (
		<button>Delete</button>
	);
}
