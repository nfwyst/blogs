import * as React from 'react'
import Layout from './components/Layout'
import SignUp from './components/auth/SignUp'

const Index = (): JSX.Element => {
  return (
    <Layout>
      <SignUp />
    </Layout>
  )
}

export default Index
