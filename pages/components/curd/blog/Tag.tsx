import React, {
  useState, useEffect, ChangeEvent, FormEvent, MouseEvent,
} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import { curry } from 'ramda';
import axios, { AxiosError } from 'axios';
import Notify from '../../Notify';
import { Color } from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import Confirm from '../../Confirm';

const Tag = () => {
  const theme = useTheme()
  const [values, setValues] = useState({
    name: '',
    tags: [],
    removed: { slug: null, name: null },
    loading: false,
  })
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    message: ''
  })
  const { isOpen: confirmOpen, message: confirmMessage } = confirmConfig
  const [notifyConfig, setNotifyConfig] = useState({
    type: 'success',
    notifyMessage: '',
    isOpen: false
  })
  const getTags = (): void => {
    axios
      .get('/blog/tags')
      .then(({ data }) => {
        setValues({ ...values, tags: data })
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error || '获取标签失败' })
        setValues({ ...values, loading: false })
      })
  }
  useEffect(getTags, [])
  const { type, notifyMessage, isOpen } = notifyConfig
  const { name, tags, removed, loading } = values
  const handleSubmit = (e: FormEvent<HTMLElement>): void => {
    e.preventDefault()
    axios
      .post('/blog/tags', { name })
      .then(({ data }) => {
        setNotifyConfig({
          ...notifyConfig, notifyMessage: `新建标签 ${data.name} 成功`, type: 'success', isOpen: true
        })
        setValues({ ...values, loading: false, tags: [...tags, data], name: '' })
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error || '创建标签失败', type: 'error', isOpen: true })
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

  const newTagsForm = () => {
    return (
      <form
        style={{
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        }}
        noValidate
        onSubmit={handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="标签名"
          name="name"
          autoComplete="name"
          type="text"
          onChange={handleChange('name')}
          value={name}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{
            margin: theme.spacing(3, 0, 2),
          }}
        >
          提交
          </Button>
        <Notify
          type={type as Color}
          message={notifyMessage}
          isOpen={isOpen}
          onClose={() => setNotifyConfig({ ...notifyConfig, isOpen: false })}
        />
      </form>
    )
  }
  const deleteTags = (slug: string) => () => {
    axios.delete(`/blog/tags/${slug}`)
      .then(() => {
        setNotifyConfig({
          ...notifyConfig,
          notifyMessage: `删除标签 ${slug.split('-').join(' ')} 成功`,
          type: 'success',
          isOpen: true
        })
        setValues({
          ...values,
          tags: tags.filter(({
            slug: s, name
          }) => (slug ? slug : name) !== s)
        })
      }).catch((e: AxiosError) => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({
          ...notifyConfig,
          notifyMessage: error || `删除标签 ${slug.split('-').join(' ')} 失败`,
          type: 'error',
          isOpen: true
        })
      })
  }
  const onConfirmCancel = (e: MouseEvent<HTMLElement>): void => {
    setConfirmConfig({ ...confirmConfig, isOpen: false })
    setValues({ ...values, loading: false, removed: { slug: null, name: null } })
  }
  const onConfirmOk = (e: MouseEvent<HTMLElement>): void => {
    deleteTags(removed.slug || removed.name)()
    onConfirmCancel(e)
  }
  return (
    <React.Fragment>
      <div>{newTagsForm()}</div>
      <div>{tags.map((cat: { name: string, slug: string }) => {
        return (
          <Chip
            key={cat.name}
            size="small"
            label={cat.name}
            color="primary"
            style={{ margin: '0 5px' }}
            onDelete={() => {
              setValues({ ...values, removed: cat })
              setConfirmConfig({
                ...confirmConfig, isOpen: true, message: `确定删除${cat.name}?`
              })
            }}
          />
        )
      })}</div>
      <Confirm
        isOpen={confirmOpen}
        message={confirmMessage}
        onCancel={onConfirmCancel}
        onOk={onConfirmOk}
      />
    </React.Fragment>
  )
}

export default Tag;
