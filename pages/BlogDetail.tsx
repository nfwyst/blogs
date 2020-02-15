import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Container from '@material-ui/core/Container';
import axios, { AxiosError } from 'axios';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';

const BlogDetail = () => {
  const [blog, setBlog] = useState({
    slug: '',
    title: '',
    body: '',
    categories: [],
    tags: [],
    postedBy: { name: '' },
    updatedAt: ''
  })

  useEffect(() => {
    const query = window.location.pathname.split('/').reverse()[0]
    axios.get(`/blog/detail/${query}`)
      .then(({ data }) => {
        setBlog(data)
      }).catch((e: AxiosError) => {
        console.log(e.response.data.error)
      })
  }, [])

  const showCategories = (cts: { name: string, slug: string }[]): JSX.Element[] => {
    return cts.map(item => {
      return (
        <a
          key={item.name}
          href={`/categories/${item.slug}`}
          style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-block', margin: 5 }}
        >
          <Chip size="small" style={{ cursor: 'pointer' }} label={item.name} color="primary" />
        </a>
      )
    })
  }
  const showTags = (tags: { name: string, slug: string }[]): JSX.Element[] => {
    return tags.map(item => {
      return (
        <a
          key={item.name}
          href={`/tags/${item.slug}`}
          style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-block', margin: 5 }}>
          <Chip size="small" style={{ cursor: 'pointer' }} label={item.name} color="secondary" />
        </a>
      )
    })
  }

  return (
    <Layout>
      <img
        src={`/blog/photo/${blog.slug}`}
        alt={blog.title}
        style={{ width: '102%', maxHeight: '500px', objectFit: 'cover', marginTop: 30, marginLeft: '-1%' }}
      />
      <Container component="main" maxWidth="lg">
        <a
          href={`/blog/${blog.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography variant="h3" color="textPrimary" gutterBottom style={{ marginTop: 30 }}>
            {blog.title}
          </Typography>
        </a>
        <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
          作者: {blog.postedBy.name}  发表于: {moment(blog.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </Typography>
        <Grid item md={12}>
          {showCategories(blog.categories)}
          {showTags(blog.tags)}
        </Grid>
        <article
          dangerouslySetInnerHTML={{ __html: blog.body }}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        </article>
      </Container>
    </Layout>
  )
}

export default BlogDetail
