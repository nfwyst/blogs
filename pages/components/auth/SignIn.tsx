import React, { FormEvent, useState, ChangeEvent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { curry } from 'ramda';
import axios, { AxiosError } from 'axios';
import { Color } from '@material-ui/lab/Alert';
import Notify from '../Notify';
import { authenticate } from '../../utils/auth';

const useStyles = makeStyles(theme => createStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const theme = useTheme();
  const [values, setValues] = useState({
    email: '',
    password: '',
    loading: false,
  });
  const [notifyConfig, setNotifyConfig] = useState({
    isOpen: false,
    notifyMessage: '',
    type: 'success'
  })
  const { isOpen, notifyMessage, type } = notifyConfig

  const { email, password, loading } = values

  const handleSubmit = (e: FormEvent<HTMLElement>): void => {
    e.preventDefault()
    setValues({ ...values, loading: true })
    axios
      .post('/auth/user/signin', { email, password })
      .then(({ data }) => {
        const { user } = data as { user: { name: string } }
        setNotifyConfig({
          ...notifyConfig, notifyMessage: `登录成功, 欢迎 ${user.name}`, type: 'success', isOpen: true
        })
        setValues({ ...values, loading: false })
        authenticate(data, () => {
          setTimeout(() => {
            window.location.href = '/'
          }, 300)
        })
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error, type: 'error', isOpen: true })
        setValues({ ...values, loading: false })
      })
  }

  const handleChange = curry((name: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const target = e.target as HTMLInputElement
    setValues({
      ...values,
      [name]: target.value
    })
  })

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ textAlign: 'center' }}>
        <Avatar
          className={classes.avatar}
          style={{
            margin: '20px auto 5px',
            backgroundColor: theme.palette.secondary.main
          }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          登录
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱"
            name="email"
            autoComplete="email"
            type="email"
            onChange={handleChange('email')}
            value={email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange('password')}
            value={password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{
              margin: theme.spacing(3, 0, 2),
            }}
          >
            提交
          </Button>
        </form>
      </div>
      <Notify
        type={type as Color}
        message={notifyMessage}
        isOpen={isOpen}
        onClose={() => {
          setNotifyConfig({ ...notifyConfig, isOpen: false })
        }}
      />
    </Container>
  );
}
