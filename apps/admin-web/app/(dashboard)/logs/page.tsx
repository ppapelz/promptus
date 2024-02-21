import { cookies, headers } from 'next/headers';
import React from 'react';
import { getSSRSession } from 'supertokens-node/nextjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { getClient } from '../../ApolloClient';
import gql from 'graphql-tag';
import LogsChild from '../../components/logsChild';

export default async function Logs() {
  let promptsData = null;
  const prompts = gql`
    {
      getAllPrompts {
        content
        id
        name
        updatedAt
      }
    }
  `;
  let error: Error | undefined = undefined;
  let session: SessionContainer | undefined;
  let hasToken = false;
  let hasInvalidClaims = false;

  try {
    ({ session, hasToken, hasInvalidClaims } = await getSSRSession(
      cookies().getAll(),
      headers()
    ));
    const token = session?.getAccessToken();
    const { data } = await getClient().query({ query: prompts });
    promptsData = data?.getAllPrompts;
    console.log('data', data);
  } catch (err: any) {
    error = err;
  }
  return (
    <div>
      {promptsData[0]?.content}
      <LogsChild />
    </div>
  );
}
