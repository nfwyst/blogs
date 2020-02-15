import React from 'react';
import Layout from './components/Layout'
import ProfileList from './components/ProfileList'

const AdminProfile = () => {
  return (
    <Layout>
      <h2>个人中心</h2>
      <ProfileList
        lists={[
          { title: '分类和标签管理', onClick: () => window.location.href = "/blog/management-category-tag" },
          { title: '写文章', onClick: () => window.location.href = "/blog/new" }
        ]}
      />
    </Layout>
  )
}

export default AdminProfile
