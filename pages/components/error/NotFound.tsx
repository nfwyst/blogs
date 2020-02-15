import React from 'react';
import Container from '@material-ui/core/Container';

export const NotFound = (): JSX.Element => {
  return (
    <Container component="main" maxWidth="xs">
      <p
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: 24
        }}
      >404 | Not Found</p>
    </Container>
  )
}
