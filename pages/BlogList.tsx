import React, { useState, useEffect } from 'react';
import Layout from './components/Layout'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

const BlogList = (): JSX.Element => {
  const [values, setValues] = useState({
    blogs: [],
    categories: [],
    tags: [],
    size: 0,
    blogLimit: 2,
    blogSkip: 0
  })

  const { blogs, categories, tags, size, blogLimit, blogSkip } = values

  const fetchPage = (skip: number, limit: number): void => {
    axios.get('/blog/categories-tags', {
      params: { limit, skip }
    })
      .then(({ data }) => {
        const { blogs, ...others } = data
        setValues({
          ...others,
          blogs: [...values.blogs, ...blogs],
          blogLimit: limit,
          blogSkip: skip
        })
      })
      .catch((e: AxiosError) => {
        const { response: { data } } = e
        console.log(data.error)
      })
  }

  useEffect((): void => {
    fetchPage(blogSkip, blogLimit)
  }, [])

  const loadMore = (): void => {
    fetchPage(blogSkip + blogLimit, blogLimit)
  }

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
      <Grid container spacing={3}>
        <Grid item md={10} xs={9}>
          {
            blogs.map(blog => {
              return (
                <Card key={blog.slug} style={{ minWidth: 275, marginBottom: 15 }}>
                  <CardContent>
                    <a
                      href={`/blog/${blog.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography variant="h5" color="textPrimary" gutterBottom>
                        {blog.title}
                      </Typography>
                    </a>
                    <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                      作者: {blog.postedBy.name}  发表于: {moment(blog.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        {showCategories(categories)}
                        {showTags(tags)}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <img style={{ width: '100%' }} src={`/blog/photo/${blog.slug}`} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                          style={{ fontSize: 15 }}
                          variant="body2"
                          component="p">
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <a
                      href={`/blog/${blog.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button size="small">阅读更多</Button>
                    </a>
                  </CardActions>
                </Card>
              )
            })
          }
          {
            size && size >= blogLimit ? (
              <Button
                variant="contained"
                color="primary"
                onClick={loadMore}
                style={{
                  position: 'relative',
                  left: '50%'
                }}
              >
                加载更多
              </Button>
            ) : null
          }
        </Grid>
        <Grid item md={2} xs={3}>
          <h5>分类</h5>
          <Divider />
          <List component="nav" aria-label="main mailbox folders">
            {
              categories.map((cat: { name: string, _id: string, slug: string }): JSX.Element => {
                return (
                  <ListItem key={cat._id} button={false}>
                    <a
                      href={`/categories/${cat.slug}`}
                      style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-block', margin: 5 }}
                    >
                      <Chip style={{ cursor: 'pointer' }} size="small" label={cat.name} color="primary" />
                    </a>
                  </ListItem>
                )
              })
            }
          </List>
          <h5>标签</h5>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folders">
            {
              tags.map((tag: { _id: string, name: string, slug: string }): JSX.Element => {
                return (
                  <ListItem key={tag._id} button={false}>
                    <a
                      href={`/tags/${tag.slug}`}
                      style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-block', margin: 5 }}>
                      <Chip size="small" style={{ cursor: 'pointer' }} label={tag.name} color="secondary" />
                    </a>
                  </ListItem>
                )
              })
            }
          </List>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default BlogList
