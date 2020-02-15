import React from 'react';
import Layout from './components/Layout'
import Grid from '@material-ui/core/Grid';
import Category from './components/curd/blog/Category';
import Tag from './components/curd/blog/Tag';
import Container from '@material-ui/core/Container';

const AdminProfile = () => {
  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={3} style={{ fontWeight: 'bold', fontSize: 18 }}>
            <Grid item xs={12} md={12}>
              <h3>
                管理分类和标签
              </h3>
            </Grid>
            <Grid item xs={12} md={6}>
              <div>分类</div>
              <Category />
            </Grid>
            <Grid item xs={12} md={6}>
              <div>标签</div>
              <Tag />
            </Grid>
          </Grid>
        </div>
      </Container>
    </Layout>
  )
}

export default AdminProfile
