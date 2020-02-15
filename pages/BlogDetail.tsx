import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Container from '@material-ui/core/Container';
import axios, { AxiosError } from 'axios';

const BlogDetail = () => {
  const [body, setBody] = useState('')

  useEffect(() => {
    const query = window.location.pathname.split('/').reverse()[0]
    axios.get(`/blog/detail/${query}`)
      .then(({ data }) => {
        setBody(data.body)
        console.log(data)
      }).catch((e: AxiosError) => {
        console.log(e.response.data.error)
      })
  }, [])

  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <article
          dangerouslySetInnerHTML={{ __html: body }}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        </article>
      </Container>
    </Layout>
  )
}

export default BlogDetail
