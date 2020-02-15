import * as React from 'react'
import Layout from './components/Layout'
import Typography from '@material-ui/core/Typography';

const Index = (): JSX.Element => {
  return (
    <Layout>
      <Typography paragraph>
        欢迎来到四次元之门!
      </Typography>
    </Layout>
  )
}

export default Index
