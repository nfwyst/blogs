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

const Category = () => {
  const theme = useTheme()
  const [values, setValues] = useState({
    name: '',
    categories: [],
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
  const getCategory = (): void => {
    axios
      .get('/blog/category')
      .then(({ data }) => {
        setValues({ ...values, categories: data })
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error || '获取分类失败' })
        setValues({ ...values, loading: false })
      })
  }
  useEffect(getCategory, [])
  const { type, notifyMessage, isOpen } = notifyConfig
  const { name, categories, removed, loading } = values
  const handleSubmit = (e: FormEvent<HTMLElement>): void => {
    e.preventDefault()
    axios
      .post('/blog/category', { name })
      .then(({ data }) => {
        setNotifyConfig({
          ...notifyConfig, notifyMessage: `新建分类 ${data.name} 成功`, type: 'success', isOpen: true
        })
        setValues({ ...values, loading: false, categories: [...categories, data], name: '' })
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error || '创建分类失败', type: 'error', isOpen: true })
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

  const newCategoryForm = () => {
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
          label="分类名"
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
  const deleteCategory = (slug: string) => () => {
    axios.delete(`/blog/category/${slug}`)
      .then(() => {
        setNotifyConfig({
          ...notifyConfig,
          notifyMessage: `删除分类 ${slug.split('-').join(' ')} 成功`,
          type: 'success',
          isOpen: true
        })
        setValues({
          ...values,
          categories: categories.filter(({
            slug: s, name
          }) => (slug ? slug : name) !== s)
        })
      }).catch((e: AxiosError) => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({
          ...notifyConfig,
          notifyMessage: error || `删除分类 ${slug.split('-').join(' ')} 失败`,
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
    deleteCategory(removed.slug || removed.name)()
    onConfirmCancel(e)
  }
  return (
    <React.Fragment>
      <div>{newCategoryForm()}</div>
      <div>{categories.map((cat: { name: string, slug: string }) => {
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

export default Category;
