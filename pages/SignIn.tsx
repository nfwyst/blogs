import * as React from 'react'
import Layout from './components/Layout'
import SignIn from './components/auth/SignIn'

const Index = (): JSX.Element => {
  return (
    <Layout>
      <SignIn />
    </Layout>
  )
}

export default Index
