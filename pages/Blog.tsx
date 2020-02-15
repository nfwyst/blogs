import React from 'react';
import Layout from './components/Layout'
import Grid from '@material-ui/core/Grid';
import CreateBlog from './components/curd/blog/CreateBlog';
import Container from '@material-ui/core/Container';

const Blog = (): JSX.Element => {
  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={3} style={{ fontWeight: 'bold', fontSize: 18 }}>
            <Grid item xs={12} md={12}>
              <h3>
                写文章
              </h3>
            </Grid>
            <Grid item xs={12} md={12}>
              <CreateBlog />
            </Grid>
          </Grid>
        </div>
      </Container>
    </Layout>
  )
}

export default Blog
