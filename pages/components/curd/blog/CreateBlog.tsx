import React, {
  useState, FormEvent, MouseEvent, ChangeEvent,
  useEffect,
} from 'react';
import dynamic from 'next/dynamic';
import Confirm from '../../Confirm';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Color } from '@material-ui/lab/Alert';
import Notify from '../../Notify';
import { curry } from 'ramda';
import axios, { AxiosError } from 'axios';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const CreateBlog = (): JSX.Element => {
  const theme = useTheme()
  const [categories, setCategories] = useState([])
  const [checkedCategories, setCheckedCategories] = useState([])
  const [checkedTags, setCheckedTags] = useState([])
  const [tags, setTags] = useState([])
  const [values, setValues] = useState({
    title: '',
    body: '',
    photo: null,
  })
  const { title, body } = values
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    message: ''
  })
  const { isOpen: confirmOpen, message: confirmMessage } = confirmConfig
  const handleSubmit = (e: FormEvent<HTMLElement>): void => {
    e.preventDefault()
    const formData = new FormData()
    const distValues = {
      ...values,
      categories: checkedCategories.join(','),
      tags: checkedTags.join(','),
    }
    for (let key in distValues) {
      if (!distValues[key]) continue
      formData.set(key, distValues[key])
    }
    axios
      .post('/blog', formData)
      .then(({ data }) => {
        setNotifyConfig({ ...notifyConfig, isOpen: true, type: 'success', notifyMessage: `创建博文${data.title} 成功` })
      })
      .catch(e => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, isOpen: true, type: 'error', notifyMessage: error || `创建博文 ${values.title} 失败!` })
      })
  }

  const onConfirmCancel = (e: MouseEvent<HTMLElement>): void => {
    setConfirmConfig({ ...confirmConfig, isOpen: false })
  }
  const onConfirmOk = (e: MouseEvent<HTMLElement>): void => {
    onConfirmCancel(e)
  }
  const [notifyConfig, setNotifyConfig] = useState({
    type: 'success',
    notifyMessage: '',
    isOpen: false
  })
  const { type, notifyMessage, isOpen } = notifyConfig
  const initCategories = () => {
    axios
      .get('/blog/category')
      .then(({ data }) => {
        setCategories(data)
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, isOpen: true, type: 'error', notifyMessage: error || '获取分类失败' })
      })
  }
  const initTags = () => {
    axios
      .get('/blog/tags')
      .then(({ data }) => {
        setTags(data)
      })
      .catch((e: AxiosError): void => {
        const { response: { data } } = e
        const { error } = data as { error: string }
        setNotifyConfig({ ...notifyConfig, notifyMessage: error || '获取标签失败' })
      })
  }

  const handleChange = curry(
    (name: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const target = e.target as HTMLInputElement
      if (!target) return
      const value = name === 'photo' ? target.files[0] : target.value
      setValues({
        ...values,
        [name]: value
      })
    }
  )

  const handleBody = (val: string): void => {
    if (process.browser) {
      localStorage.setItem('blog', val)
    }
    setValues({
      ...values,
      body: val
    })
  }
  useEffect(() => {
    if (process.browser) {
      setValues({
        ...values,
        body: localStorage.getItem('blog')
      })
      initCategories()
      initTags()
    }
  }, [])
  const handleToggle = (type: string, _id: string) => {
    return (): void => {
      let all = type === 'category' ? checkedCategories : checkedTags
      if (all.includes(_id)) all = all.filter(item => item !== _id)
      else all.push(_id)
      const ster = type === 'category' ? setCheckedCategories : setCheckedTags
      ster(all)
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={3} style={{ fontWeight: 'bold', fontSize: 18 }}>
        <Grid item xs={12} md={8}>
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
              id="title"
              label="标题"
              name="title"
              autoComplete="title"
              type="text"
              onChange={handleChange('title')}
              value={title}
              style={{ marginBottom: 30 }}
            />
            <ReactQuill
              value={body}
              placeholder="随便写点什么吧..."
              onChange={handleBody}
              modules={CreateBlog.modules}
              formats={CreateBlog.formats}
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
              发布
                </Button>
            <Notify
              type={type as Color}
              message={notifyMessage}
              isOpen={isOpen}
              onClose={() => setNotifyConfig({ ...notifyConfig, isOpen: false })}
            />
          </form>
        </Grid>
        <Grid item xs={12} md={4}>
          <h5>特色图片</h5>
          <Divider />
          <small>最大不超过3MB</small>
          <ListItem button={false}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
            >
              上传特色图片
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleChange('photo')}
                accept="image/*"
              />
            </Button>
          </ListItem>
          <h5>分类</h5>
          <Divider />
          <List component="nav" aria-label="main mailbox folders">
            {
              categories.map((cat: { name: string, _id: string }): JSX.Element => {
                return (
                  <ListItem key={cat._id} button={false}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={cat._id}
                          onChange={handleToggle('category', cat._id)}
                        />
                      }
                      label={cat.name}
                    />
                  </ListItem>
                )
              })
            }
          </List>
          <h5>标签</h5>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folders">
            {
              tags.map((tag: { _id: string, name: string }): JSX.Element => {
                return (
                  <ListItem key={tag._id} button={false}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={tag._id}
                          onChange={handleToggle('tag', tag._id)}
                        />
                      }
                      label={tag.name}
                    />
                  </ListItem>
                )
              })
            }
          </List>
        </Grid>
      </Grid>
      <Confirm
        isOpen={confirmOpen}
        message={confirmMessage}
        onCancel={onConfirmCancel}
        onOk={onConfirmOk}
      />
    </React.Fragment>
  )
}

CreateBlog.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
    ['code-block']
  ]
}

CreateBlog.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'video',
  'code-block'
]

export default CreateBlog;
