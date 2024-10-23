'use client';

import { gql, useQuery } from '@apollo/client';
import React, {useEffect, useState} from 'react';

const GET_PAGINATED_USERS = gql`
  query GetUsers($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset) {
      users {
        id
        name
        email
      }
      totalCount
    }
  }
`;

interface User {
    id: number;
    name: string;
    email: string;
}

interface UsersData {
    users: {
        users: User[];
        totalCount: number;
    };
}

interface UsersVars {
    limit: number;
    offset: number;
}

const Home: React.FC = () => {
    const [limit] = useState<number>(5);
    const [offset, setOffset] = useState<number>(0);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        console.log(4444)
        fetch('http://localhost:3000/').then(e => console.log(e))
    }, [])

    const { data, loading, error } = useQuery<UsersData, UsersVars>(GET_PAGINATED_USERS, {
        variables: { limit, offset },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { users, totalCount } = data?.users || { users: [], totalCount: 0 };


    const nextPage = () => {
        if (offset + limit < totalCount) {
            setOffset(offset + limit);
        }
    };

    const prevPage = () => {
        if (offset > 0) {
            setOffset(offset - limit);
        }
    };



    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>

            <div>
                <button onClick={prevPage} disabled={offset === 0}>
                    Previous
                </button>
                <button onClick={nextPage} disabled={offset + limit >= totalCount}>
                    Next
                </button>
            </div>

            <p>
                Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} users
            </p>
        </div>
    );
};

export default Home;
