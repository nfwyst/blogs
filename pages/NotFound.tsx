
import * as React from 'react'
import Layout from './components/Layout'
import { NotFound as NF } from './components/error'

const NotFound = (): JSX.Element => {
  return (
    <Layout>
      <NF />
    </Layout>
  )
}

export default NotFound
